import { NextRequest, NextResponse } from 'next/server';

interface ParsedResult {
  sourcePlatform: 'MEESHO';
  sourceUrl: string;
  normalizedSourceUrl: string;
  sourceProductId: string;
  sourceTitle?: string;
  sourceDescription?: string;
  sourcePricePaise?: number;
  sourceImages?: string[];
  sourceAttributes?: Record<string, string | number | boolean>;
  sourceAvailability?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
  sourceRating?: number;
  sourceReviewCount?: number;
  sourceSellerName?: string;
  missingFields: string[];
  provenance: Record<string, 'extracted' | 'unavailable' | 'manual' | 'normalized'>;
  retrievalMethod: 'URL_PARSER' | 'ADMIN_ASSISTED';
  suggestedSellingPricePaise?: number;
  suggestedCompareAtPricePaise?: number;
  warning?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, targetDepartment, targetCategory } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "url" parameter.' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return NextResponse.json({ error: 'Invalid URL format provided.' }, { status: 400 });
    }

    const host = parsedUrl.hostname.toLowerCase();
    const isMeesho = host.includes('meesho.com');

    // Clean tracking parameters
    parsedUrl.search = '';
    const cleanUrl = parsedUrl.toString().replace(/\/+$/, '');

    // Extract Product ID from URL path (e.g. /s/p/4xyz1 or /p/8kdm2)
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    let extractedProductId = '';
    const pIndex = pathParts.lastIndexOf('p');
    if (pIndex >= 0 && pathParts[pIndex + 1]) {
      extractedProductId = pathParts[pIndex + 1];
    } else if (pathParts.length > 0) {
      extractedProductId = pathParts[pathParts.length - 1];
    }

    const result: ParsedResult = {
      sourcePlatform: 'MEESHO',
      sourceUrl: url,
      normalizedSourceUrl: cleanUrl,
      sourceProductId: extractedProductId || `msh-${Date.now().toString().slice(-6)}`,
      sourceAttributes: {},
      sourceImages: [],
      missingFields: [],
      provenance: {},
      retrievalMethod: 'URL_PARSER',
    };

    // Safe extraction with reasonable timeout
    let html = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(6000), // 6 second safety cutoff
      });

      if (response.ok) {
        html = await response.text();
      } else {
        result.warning = `Remote server responded with HTTP status ${response.status}. Fallback to administrator-assisted enrichment mode.`;
      }
    } catch (fetchErr: any) {
      result.warning = `Direct page retrieval timed out or encountered network limitation. Manual review mode activated.`;
    }

    if (html) {
      // 1. Title Extraction
      const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
      const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = ogTitleMatch?.[1] || titleTagMatch?.[1];
      if (title) {
        result.sourceTitle = title.replace(/\s*\|\s*Meesho.*$/i, '').trim();
        result.provenance.sourceTitle = 'extracted';
      }

      // 2. Description Extraction
      const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      const description = ogDescMatch?.[1] || descMatch?.[1];
      if (description) {
        result.sourceDescription = description.trim();
        result.provenance.sourceDescription = 'extracted';
      }

      // 3. Image Extraction
      const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogImageMatch?.[1]) {
        result.sourceImages?.push(ogImageMatch[1]);
        result.provenance.sourceImages = 'extracted';
      }

      // 4. Check for JSON-LD structured data
      const jsonLdMatches = Array.from(
        html.matchAll(/<script\s+type=["']application\/ld\+json["']>([^<]+)<\/script>/gi)
      );
      for (const m of jsonLdMatches) {
        try {
          const parsed = JSON.parse(m[1]);
          if (parsed['@type'] === 'Product' || parsed['@type'] === 'ItemPage') {
            if (!result.sourceTitle && parsed.name) {
              result.sourceTitle = parsed.name;
              result.provenance.sourceTitle = 'extracted';
            }
            if (!result.sourceDescription && parsed.description) {
              result.sourceDescription = parsed.description;
              result.provenance.sourceDescription = 'extracted';
            }
            if (parsed.image) {
              const imgs = Array.isArray(parsed.image) ? parsed.image : [parsed.image];
              imgs.forEach((img: string) => {
                if (img && !result.sourceImages?.includes(img)) result.sourceImages?.push(img);
              });
            }
            if (parsed.offers?.price) {
              const priceNum = parseFloat(parsed.offers.price);
              if (!isNaN(priceNum) && priceNum > 0) {
                result.sourcePricePaise = Math.round(priceNum * 100);
                result.provenance.sourcePricePaise = 'extracted';
              }
            }
          }
        } catch {
          // ignore malformed JSON-LD
        }
      }

      // 5. Price regex heuristics if not found in JSON-LD
      if (!result.sourcePricePaise) {
        const ogPriceMatch = html.match(/<meta\s+property=["'](?:product|og):price:amount["']\s+content=["']([0-9.]+)["']/i);
        if (ogPriceMatch?.[1]) {
          result.sourcePricePaise = Math.round(parseFloat(ogPriceMatch[1]) * 100);
          result.provenance.sourcePricePaise = 'extracted';
        } else {
          const inrMatch = html.match(/₹\s*([0-9,]+(?:\.[0-9]{2})?)/);
          if (inrMatch?.[1]) {
            const cleanNum = parseFloat(inrMatch[1].replace(/,/g, ''));
            if (!isNaN(cleanNum) && cleanNum > 0) {
              result.sourcePricePaise = Math.round(cleanNum * 100);
              result.provenance.sourcePricePaise = 'extracted';
            }
          }
        }
      }
    }

    // Default fallbacks for missing fields
    if (!result.sourceTitle) {
      // Generate clean title from URL slug
      const slugTitle = extractedProductId
        ? `Sourced Item (${extractedProductId.toUpperCase()})`
        : 'Sourced Meesho Catalog Item';
      result.sourceTitle = slugTitle;
      result.provenance.sourceTitle = 'unavailable';
      result.missingFields.push('sourceTitle');
    }

    if (!result.sourcePricePaise) {
      result.sourcePricePaise = 29900; // Default placeholder ₹299
      result.provenance.sourcePricePaise = 'unavailable';
      result.missingFields.push('sourcePricePaise');
    }

    if (!result.sourceImages || result.sourceImages.length === 0) {
      result.sourceImages = [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      ];
      result.provenance.sourceImages = 'unavailable';
      result.missingFields.push('sourceImages');
    }

    // Commercial calculations
    const cost = result.sourcePricePaise || 29900;
    // Suggest 50% gross margin: (cost + packaging ₹30) / (1 - 0.52)
    const suggestedSelling = Math.round((cost + 3000) / 0.48);
    result.suggestedSellingPricePaise = Math.round(suggestedSelling / 100) * 100 - 100 + 99; // Price ending in 99
    result.suggestedCompareAtPricePaise = Math.round(result.suggestedSellingPricePaise * 1.3);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to parse source product URL.' },
      { status: 500 }
    );
  }
}
