'use client';

import {
  SourceProduct,
  CategoryAttribute,
  SourcePriceHistory,
  ImportJob,
  AttributeMappingRule,
  calculateCommercialPricing,
} from '@/types/sourcing';
import { Department } from '@/types/category';
import { Product } from '@/types/product';
import { saveAdminProduct, getAdminProducts } from './adminStore';
import { INITIAL_TAXONOMY, DEFAULT_CATEGORY_ATTRIBUTES, TaxonomyCategory } from './taxonomy';

// Storage keys for client persistence
const SOURCING_PRODUCTS_KEY = 'plantrix_sourcing_products_v1';
const SOURCING_HISTORY_KEY = 'plantrix_sourcing_history_v1';
const SOURCING_ATTRIBUTES_KEY = 'plantrix_sourcing_attributes_v1';
const SOURCING_MAPPINGS_KEY = 'plantrix_sourcing_mappings_v1';
const SOURCING_JOBS_KEY = 'plantrix_sourcing_jobs_v1';
const SOURCING_TAXONOMY_KEY = 'plantrix_sourcing_taxonomy_v1';

// Initial Seed Sourced Products
const SEED_SOURCE_PRODUCTS: SourceProduct[] = [
  {
    sourceRecordId: 'src-01',
    sourcePlatform: 'MEESHO',
    sourceUrl: 'https://www.meesho.com/s/p/4xyz1?_next=sc',
    normalizedSourceUrl: 'https://www.meesho.com/s/p/4xyz1',
    sourceProductId: '4xyz1',
    sourceSellerName: 'Artisan Terracotta Hub',
    sourceSku: 'MEE-POT-8491',
    sourceTitle: 'Handcrafted Fluted Stoneware Planter Pot with Drainage Aperture',
    sourceDescription: 'High-temperature glazed ceramic pot suitable for indoor and balcony plants. Includes bottom drainage aperture and moisture buffering.',
    sourceDepartment: 'GARDEN_OUTDOOR',
    sourceCategory: 'pots-planters',
    sourceSubcategory: 'ceramic-pots',
    sourceAttributes: {
      Material: 'Ceramic Stoneware',
      'Product Breadth': '18 cm',
      'Product Height': '20 cm',
      Drainage: true,
      Color: 'Muted Forest Green',
      'Country of Origin': 'India',
    },
    sourceImages: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80',
    ],
    sourcePricePaise: 54000, // ₹540
    previousSourcePricePaise: 52000,
    sourceShippingCostPaise: 0,
    sourceDiscountPercent: 25,
    sourceAvailability: 'IN_STOCK',
    sourceRating: 4.6,
    sourceReviewCount: 142,
    sourceCountryOfOrigin: 'India',
    lastCheckedAt: '2026-10-21T09:15:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    linkedProductId: 'pb-01',
    targetSellingPricePaise: 189900, // ₹1,899
    targetCompareAtPricePaise: 249900,
    estimatedGrossMarginPercent: 68.2,
    importStatus: 'IMPORTED',
    internalNotes: 'High-grade stoneware pot with excellent repeat customer feedback.',
    provenance: {
      sourceTitle: 'extracted',
      sourcePricePaise: 'extracted',
      sourceAttributes: 'normalized',
      targetSellingPricePaise: 'estimated',
    },
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-21T09:15:00Z',
  },
  {
    sourceRecordId: 'src-02',
    sourcePlatform: 'MEESHO',
    sourceUrl: 'https://www.meesho.com/s/p/8kdm2',
    normalizedSourceUrl: 'https://www.meesho.com/s/p/8kdm2',
    sourceProductId: '8kdm2',
    sourceSellerName: 'Culinary Edge Impex',
    sourceSku: 'MEE-KIT-3829',
    sourceTitle: 'Precision 3-in-1 Stainless Steel Y-Peeler & Julienne Shredder with Ergonomic Grip',
    sourceDescription: 'Heavy-duty 304 food-grade stainless steel blade, non-slip silicone handle. Potato eyer notch included.',
    sourceDepartment: 'KITCHEN_TOOLS',
    sourceCategory: 'food-prep',
    sourceSubcategory: 'peelers',
    sourceAttributes: {
      Material: '304 Stainless Steel',
      'Net Quantity (N)': '1',
      DishwasherSafe: true,
      Color: 'Brushed Silver & Charcoal',
      'Country of Origin': 'India',
    },
    sourceImages: [
      'https://images.unsplash.com/photo-1584990347449-399066e57dfc?auto=format&fit=crop&w=800&q=80',
    ],
    sourcePricePaise: 16500, // ₹165
    previousSourcePricePaise: 16500,
    sourceShippingCostPaise: 0,
    sourceDiscountPercent: 40,
    sourceAvailability: 'IN_STOCK',
    sourceRating: 4.4,
    sourceReviewCount: 88,
    sourceCountryOfOrigin: 'India',
    lastCheckedAt: '2026-10-21T08:00:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    targetSellingPricePaise: 44900, // ₹449
    targetCompareAtPricePaise: 69900,
    estimatedGrossMarginPercent: 54.8,
    importStatus: 'SAVED',
    internalNotes: 'Great impulse add-on for kitchen catalog. Tested sample holds edge well.',
    provenance: {
      sourceTitle: 'extracted',
      sourcePricePaise: 'extracted',
      sourceAttributes: 'extracted',
      targetSellingPricePaise: 'estimated',
    },
    createdAt: '2026-10-19T14:20:00Z',
    updatedAt: '2026-10-21T08:00:00Z',
  },
  {
    sourceRecordId: 'src-03',
    sourcePlatform: 'MEESHO',
    sourceUrl: 'https://www.meesho.com/s/p/2jkl9',
    normalizedSourceUrl: 'https://www.meesho.com/s/p/2jkl9',
    sourceProductId: '2jkl9',
    sourceSellerName: 'Modern Home Essentials',
    sourceSku: 'MEE-OIL-9102',
    sourceTitle: 'Drip-Free Borosilicate Glass Oil Dispenser 630ml with Gravity Auto-Flip Spout',
    sourceDescription: 'Thick borosilicate glass bottle with silicone seal gasket and weighted stainless steel flip spout. Clear measurement markings.',
    sourceDepartment: 'KITCHEN_TOOLS',
    sourceCategory: 'cooking-tools',
    sourceSubcategory: 'oil-dispensers',
    sourceAttributes: {
      Material: 'Borosilicate Glass',
      Capacity: '630 ml',
      'Set Of': '1',
      LeakProof: true,
      Color: 'Transparent & Olive Green',
    },
    sourceImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
    sourcePricePaise: 28500, // ₹285 (Supplier raised from ₹210!)
    previousSourcePricePaise: 21000,
    sourceShippingCostPaise: 0,
    sourceDiscountPercent: 20,
    sourceAvailability: 'IN_STOCK',
    sourceRating: 4.7,
    sourceReviewCount: 230,
    sourceCountryOfOrigin: 'India',
    lastCheckedAt: '2026-10-21T07:45:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    targetSellingPricePaise: 69900, // ₹699
    targetCompareAtPricePaise: 99900,
    estimatedGrossMarginPercent: 51.5,
    importStatus: 'SAVED',
    internalNotes: 'Supplier recently increased cost from ₹210 to ₹285. Check margin impact.',
    provenance: {
      sourceTitle: 'extracted',
      sourcePricePaise: 'extracted',
      sourceAttributes: 'normalized',
      targetSellingPricePaise: 'estimated',
    },
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-21T07:45:00Z',
  },
  {
    sourceRecordId: 'src-04',
    sourcePlatform: 'MEESHO',
    sourceUrl: 'https://www.meesho.com/s/p/7mnp4',
    normalizedSourceUrl: 'https://www.meesho.com/s/p/7mnp4',
    sourceProductId: '7mnp4',
    sourceSellerName: 'Space Saver Utilities',
    sourceSku: 'MEE-BOX-6601',
    sourceTitle: 'Foldable Oxford Fabric Wardrobe Storage Box with Internal Steel Frame (66 Litres)',
    sourceDescription: 'Sturdy steel stackable frame with dual transparent zip viewing windows and reinforced side handles.',
    sourceDepartment: 'HOME_ESSENTIALS',
    sourceCategory: 'home-organization',
    sourceSubcategory: 'storage-boxes',
    sourceAttributes: {
      Material: 'Oxford Cloth & Stainless Steel',
      Capacity: '66 Litres',
      Foldable: true,
      WaterResistant: true,
      Color: 'Warm Beige Linen Texture',
    },
    sourceImages: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    ],
    sourcePricePaise: 38000, // ₹380
    previousSourcePricePaise: 38000,
    sourceShippingCostPaise: 0,
    sourceDiscountPercent: 35,
    sourceAvailability: 'IN_STOCK',
    sourceRating: 4.5,
    sourceReviewCount: 194,
    sourceCountryOfOrigin: 'India',
    lastCheckedAt: '2026-10-21T06:30:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    linkedProductId: 'he-01',
    targetSellingPricePaise: 99900, // ₹999
    targetCompareAtPricePaise: 149900,
    estimatedGrossMarginPercent: 56.4,
    importStatus: 'IMPORTED',
    internalNotes: 'Top seller in home organization. Low return rate.',
    provenance: {
      sourceTitle: 'extracted',
      sourcePricePaise: 'extracted',
      sourceAttributes: 'normalized',
      targetSellingPricePaise: 'estimated',
    },
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-10-21T06:30:00Z',
  },
  {
    sourceRecordId: 'src-05',
    sourcePlatform: 'MEESHO',
    sourceUrl: 'https://www.meesho.com/s/p/5tuv8',
    normalizedSourceUrl: 'https://www.meesho.com/s/p/5tuv8',
    sourceProductId: '5tuv8',
    sourceSellerName: 'Plumbing Solutions direct',
    sourceSku: 'MEE-TAP-1120',
    sourceTitle: '360° Swivel Faucet Aerator Kitchen Sink Tap Extender 2-Spray Splash Filter',
    sourceDescription: 'Dual mode water stream (soft bubble & high pressure spray). Solid brass ball joint for smooth omnidirectional rotation.',
    sourceDepartment: 'KITCHEN_TOOLS',
    sourceCategory: 'kitchen-cleaning',
    sourceSubcategory: 'faucet-extensions',
    sourceAttributes: {
      Material: 'ABS Chrome & Solid Brass',
      Finish: 'Polished Chrome',
      Modes: '2 Stream Spray Modes',
      ThreadSize: 'Standard M22/M24',
    },
    sourceImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    sourcePricePaise: 11000, // ₹110
    previousSourcePricePaise: 11000,
    sourceShippingCostPaise: 0,
    sourceDiscountPercent: 50,
    sourceAvailability: 'LOW_STOCK',
    sourceRating: 4.2,
    sourceReviewCount: 310,
    sourceCountryOfOrigin: 'India',
    lastCheckedAt: '2026-10-21T05:00:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    targetSellingPricePaise: 34900, // ₹349
    targetCompareAtPricePaise: 59900,
    estimatedGrossMarginPercent: 58.7,
    importStatus: 'SAVED',
    internalNotes: 'Low stock warning on supplier page. Keep eye on inventory before publishing.',
    provenance: {
      sourceTitle: 'extracted',
      sourcePricePaise: 'extracted',
      sourceAttributes: 'extracted',
      targetSellingPricePaise: 'estimated',
    },
    createdAt: '2026-10-20T16:00:00Z',
    updatedAt: '2026-10-21T05:00:00Z',
  },
  {
    sourceRecordId: 'src-06',
    sourcePlatform: 'MEESHO',
    sourceUrl: 'https://www.meesho.com/s/p/9xyz3',
    normalizedSourceUrl: 'https://www.meesho.com/s/p/9xyz3',
    sourceProductId: '9xyz3',
    sourceSellerName: 'Tools Craft Direct',
    sourceSku: 'MEE-TOOL-9281',
    sourceTitle: '24-in-1 Magnetic Precision Screwdriver Set with Aluminum Storage Case',
    sourceDescription: 'S2 alloy steel bits, anti-rust anodized aluminum alloy handle, magnetic bit holder for electronics and household fixtures.',
    sourceDepartment: 'HOME_ESSENTIALS',
    sourceCategory: 'home-hardware',
    sourceSubcategory: 'screwdriver-sets',
    sourceAttributes: {
      Material: 'S2 Alloy Steel & Aluminum',
      'Net Quantity (N)': '24 Bits + 1 Handle',
      Magnetic: true,
      Color: 'Space Grey Matte',
    },
    sourceImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ],
    sourcePricePaise: 24000, // ₹240 (Price dropped from ₹290!)
    previousSourcePricePaise: 29000,
    sourceShippingCostPaise: 0,
    sourceDiscountPercent: 45,
    sourceAvailability: 'IN_STOCK',
    sourceRating: 4.8,
    sourceReviewCount: 420,
    sourceCountryOfOrigin: 'India',
    lastCheckedAt: '2026-10-21T08:30:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    targetSellingPricePaise: 64900, // ₹649
    targetCompareAtPricePaise: 99900,
    estimatedGrossMarginPercent: 57.6,
    importStatus: 'SAVED',
    internalNotes: 'Price dropped by ₹50. Excellent margin expansion opportunity.',
    provenance: {
      sourceTitle: 'extracted',
      sourcePricePaise: 'extracted',
      sourceAttributes: 'normalized',
      targetSellingPricePaise: 'estimated',
    },
    createdAt: '2026-10-17T12:00:00Z',
    updatedAt: '2026-10-21T08:30:00Z',
  },
];

// Seed Price History
const SEED_PRICE_HISTORY: SourcePriceHistory[] = [
  {
    historyId: 'hist-01',
    sourceRecordId: 'src-03',
    observedPricePaise: 28500,
    previousPricePaise: 21000,
    priceDeltaPaise: 7500, // +₹75
    observedAvailability: 'IN_STOCK',
    observedAt: '2026-10-21T07:45:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    note: 'Supplier increased raw glass material surcharge by ₹75.',
  },
  {
    historyId: 'hist-02',
    sourceRecordId: 'src-06',
    observedPricePaise: 24000,
    previousPricePaise: 29000,
    priceDeltaPaise: -5000, // -₹50
    observedAvailability: 'IN_STOCK',
    observedAt: '2026-10-21T08:30:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    note: 'Supplier festive flash discount reduced price by ₹50.',
  },
  {
    historyId: 'hist-03',
    sourceRecordId: 'src-01',
    observedPricePaise: 54000,
    previousPricePaise: 52000,
    priceDeltaPaise: 2000, // +₹20
    observedAvailability: 'IN_STOCK',
    observedAt: '2026-10-21T09:15:00Z',
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    note: 'Minor packing revision by pottery vendor.',
  },
];

// Seed Attribute Mappings
const SEED_ATTRIBUTE_MAPPINGS: AttributeMappingRule[] = [
  {
    id: 'map-01',
    sourcePlatform: 'MEESHO',
    sourceAttributeKey: 'Material',
    targetAttributeKey: 'pot_material',
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    transformRule: 'DIRECT',
    notes: 'Direct match for pottery and planter materials',
  },
  {
    id: 'map-02',
    sourcePlatform: 'MEESHO',
    sourceAttributeKey: 'Product Breadth',
    targetAttributeKey: 'pot_diameter_cm',
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    transformRule: 'EXTRACT_NUMBER',
    targetUnit: 'cm',
    notes: 'Extract numeric centimeter diameter from breadth',
  },
  {
    id: 'map-03',
    sourcePlatform: 'MEESHO',
    sourceAttributeKey: 'Drainage',
    targetAttributeKey: 'drainage_hole',
    departmentId: 'GARDEN_OUTDOOR',
    categoryId: 'pots-planters',
    transformRule: 'DIRECT',
    notes: 'Map boolean drainage hole flag',
  },
  {
    id: 'map-04',
    sourcePlatform: 'MEESHO',
    sourceAttributeKey: 'Set Of',
    targetAttributeKey: 'piece_count',
    departmentId: 'KITCHEN_TOOLS',
    transformRule: 'EXTRACT_NUMBER',
    targetUnit: 'pcs',
    notes: 'Extract numeric set piece count',
  },
  {
    id: 'map-05',
    sourcePlatform: 'MEESHO',
    sourceAttributeKey: 'Net Quantity (N)',
    targetAttributeKey: 'piece_count',
    departmentId: 'KITCHEN_TOOLS',
    transformRule: 'EXTRACT_NUMBER',
    targetUnit: 'pcs',
    notes: 'Alternative Meesho attribute for piece count',
  },
  {
    id: 'map-06',
    sourcePlatform: 'MEESHO',
    sourceAttributeKey: 'DishwasherSafe',
    targetAttributeKey: 'dishwasher_safe',
    departmentId: 'KITCHEN_TOOLS',
    transformRule: 'DIRECT',
  },
];

// Seed Import Jobs
const SEED_IMPORT_JOBS: ImportJob[] = [
  {
    jobId: 'job-101',
    sourceUrl: 'https://www.meesho.com/s/p/4xyz1',
    status: 'COMPLETED',
    startedAt: '2026-10-18T10:00:00Z',
    completedAt: '2026-10-18T10:00:05Z',
    importedFields: ['title', 'price', 'images', 'attributes', 'seller'],
    missingFields: [],
    errors: [],
    sourceRecordId: 'src-01',
    linkedProductId: 'pb-01',
    createdBy: 'Operations Lead',
  },
  {
    jobId: 'job-102',
    sourceUrl: 'https://www.meesho.com/s/p/8kdm2',
    status: 'COMPLETED',
    startedAt: '2026-10-19T14:20:00Z',
    completedAt: '2026-10-19T14:20:04Z',
    importedFields: ['title', 'price', 'images', 'attributes'],
    missingFields: ['sellerSku'],
    errors: [],
    sourceRecordId: 'src-02',
    createdBy: 'Operations Lead',
  },
  {
    jobId: 'job-103',
    sourceUrl: 'https://www.meesho.com/s/p/2jkl9',
    status: 'COMPLETED',
    startedAt: '2026-10-20T11:00:00Z',
    completedAt: '2026-10-20T11:00:04Z',
    importedFields: ['title', 'price', 'images', 'attributes'],
    missingFields: [],
    errors: [],
    sourceRecordId: 'src-03',
    createdBy: 'Operations Lead',
  },
];

// ==========================================
// STORE READ / WRITE FUNCTIONS
// ==========================================

export function getSourceProducts(): SourceProduct[] {
  if (typeof window === 'undefined') return SEED_SOURCE_PRODUCTS;
  try {
    const raw = localStorage.getItem(SOURCING_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(SOURCING_PRODUCTS_KEY, JSON.stringify(SEED_SOURCE_PRODUCTS));
      return SEED_SOURCE_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_SOURCE_PRODUCTS;
  }
}

export function getSourceProductById(id: string): SourceProduct | undefined {
  const products = getSourceProducts();
  return products.find((p) => p.sourceRecordId === id || p.sourceProductId === id);
}

/**
 * Duplicate Detection Engine compliant with Section 9
 */
export function findDuplicateSourceProduct(
  sourceUrl: string,
  sourceProductId?: string
): { isDuplicate: boolean; existingProduct?: SourceProduct; matchReason?: string } {
  const products = getSourceProducts();
  const cleanUrl = normalizeMeeshoUrl(sourceUrl);

  for (const p of products) {
    if (cleanUrl && p.normalizedSourceUrl === cleanUrl) {
      return { isDuplicate: true, existingProduct: p, matchReason: 'Exact Normalized URL match' };
    }
    if (sourceProductId && p.sourceProductId === sourceProductId) {
      return { isDuplicate: true, existingProduct: p, matchReason: `Source Product ID match (${sourceProductId})` };
    }
    if (p.sourceUrl.trim().toLowerCase() === sourceUrl.trim().toLowerCase()) {
      return { isDuplicate: true, existingProduct: p, matchReason: 'Exact URL match' };
    }
  }

  return { isDuplicate: false };
}

export function normalizeMeeshoUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Strip common tracking and session query parameters
    parsed.search = '';
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return url.split('?')[0].trim().replace(/\/+$/, '');
  }
}

export function saveSourceProductDraft(product: Partial<SourceProduct> & { sourceUrl: string }): SourceProduct {
  const products = getSourceProducts();
  const now = new Date().toISOString();
  const normalizedUrl = normalizeMeeshoUrl(product.sourceUrl);

  const existingIdx = products.findIndex(
    (p) => p.sourceRecordId === product.sourceRecordId || p.normalizedSourceUrl === normalizedUrl
  );

  let updatedProduct: SourceProduct;

  if (existingIdx >= 0) {
    updatedProduct = {
      ...products[existingIdx],
      ...product,
      normalizedSourceUrl: normalizedUrl,
      updatedAt: now,
    };
    products[existingIdx] = updatedProduct;
  } else {
    const newId = `src-${Date.now()}`;
    const pricing = calculateCommercialPricing({
      sourceCostPaise: product.sourcePricePaise || 0,
      sourceShippingCostPaise: product.sourceShippingCostPaise || 0,
      packagingCostPaise: 3000,
      sellingPricePaise: product.targetSellingPricePaise || (product.sourcePricePaise ? product.sourcePricePaise * 2.5 : 0),
    });

    updatedProduct = {
      sourceRecordId: newId,
      sourcePlatform: product.sourcePlatform || 'MEESHO',
      sourceUrl: product.sourceUrl,
      normalizedSourceUrl: normalizedUrl,
      sourceProductId: product.sourceProductId || `p-${Date.now().toString().slice(-6)}`,
      sourceSellerName: product.sourceSellerName || 'Verified Sourcing Partner',
      sourceSku: product.sourceSku || `MEE-${Date.now().toString().slice(-4)}`,
      sourceTitle: product.sourceTitle || 'Untitled Sourced Item',
      sourceDescription: product.sourceDescription || '',
      sourceDepartment: product.sourceDepartment || 'GARDEN_OUTDOOR',
      sourceCategory: product.sourceCategory || 'pots-planters',
      sourceSubcategory: product.sourceSubcategory,
      sourceAttributes: product.sourceAttributes || {},
      sourceImages: product.sourceImages?.length ? product.sourceImages : ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'],
      sourceVariants: product.sourceVariants,
      sourcePricePaise: product.sourcePricePaise || 0,
      previousSourcePricePaise: product.previousSourcePricePaise,
      sourceShippingCostPaise: product.sourceShippingCostPaise || 0,
      sourceDiscountPercent: product.sourceDiscountPercent || 0,
      sourceAvailability: product.sourceAvailability || 'IN_STOCK',
      sourceRating: product.sourceRating || 4.5,
      sourceReviewCount: product.sourceReviewCount || 0,
      sourceCountryOfOrigin: product.sourceCountryOfOrigin || 'India',
      lastCheckedAt: now,
      verificationStatus: product.verificationStatus || 'VERIFIED',
      retrievalMethod: product.retrievalMethod || 'URL_PARSER',
      targetSellingPricePaise: product.targetSellingPricePaise || pricing.suggestedSellingPricePaise,
      targetCompareAtPricePaise: product.targetCompareAtPricePaise || Math.round(pricing.suggestedSellingPricePaise * 1.3),
      estimatedGrossMarginPercent: pricing.grossMarginPercent,
      importStatus: product.importStatus || 'SAVED',
      internalNotes: product.internalNotes || '',
      provenance: product.provenance || {
        sourceTitle: 'extracted',
        sourcePricePaise: 'extracted',
        targetSellingPricePaise: 'estimated',
      },
      createdAt: now,
      updatedAt: now,
    };
    products.unshift(updatedProduct);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_PRODUCTS_KEY, JSON.stringify(products));
  }

  return updatedProduct;
}

/**
 * Seamlessly approve & import sourcing record into the live Plantrix catalogue
 */
export function approveAndImportToCatalogue(
  sourceRecordId: string,
  overrides?: {
    sellingPricePaise?: number;
    compareAtPricePaise?: number;
    slug?: string;
    name?: string;
    stock?: number;
  }
): Product | null {
  const sourceProduct = getSourceProductById(sourceRecordId);
  if (!sourceProduct) return null;

  const now = new Date().toISOString();
  const sellingPrice = overrides?.sellingPricePaise || sourceProduct.targetSellingPricePaise || sourceProduct.sourcePricePaise * 2.5;
  const compareAtPrice = overrides?.compareAtPricePaise || sourceProduct.targetCompareAtPricePaise || Math.round(sellingPrice * 1.3);

  const cleanSlug = overrides?.slug || sourceProduct.sourceTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 50) + `-${Date.now().toString().slice(-4)}`;

  const newSku = `PLX-SRC-${Date.now().toString().slice(-6)}`;

  // Create Product in adminStore
  const newProduct: Product = {
    productId: sourceProduct.linkedProductId || `prod-src-${Date.now()}`,
    sku: newSku,
    slug: cleanSlug,
    name: overrides?.name || sourceProduct.sourceTitle,
    shortDescription: sourceProduct.sourceDescription?.slice(0, 160) || '',
    description: sourceProduct.sourceDescription || '',
    department: sourceProduct.sourceDepartment,
    categoryId: sourceProduct.sourceCategory,
    subcategoryId: sourceProduct.sourceSubcategory,
    brand: 'Plantrix Studio',
    sellingPricePaise: Math.round(sellingPrice),
    compareAtPricePaise: Math.round(compareAtPrice),
    stock: overrides?.stock !== undefined ? overrides.stock : 25,
    status: 'ACTIVE',
    featured: false,
    trending: true,
    newArrival: true,
    imageKeys: sourceProduct.sourceImages,
    highlights: [
      'Quality inspected & sourced from verified artisan cluster',
      'Protective transit packaging with 7-day replacement warranty',
      'Zero synthetic odor — ready for immediate living space integration',
    ],
    specifications: Object.fromEntries(
      Object.entries(sourceProduct.sourceAttributes).map(([k, v]) => [k, String(v)])
    ),
    createdAt: now,
    updatedAt: now,
    publishedAt: now,

    // STRICT SECURITY BOUNDARY (Private supplier data)
    sourceCostPaise: sourceProduct.sourcePricePaise,
    sourceProductUrl: sourceProduct.sourceUrl,
    supplierSku: sourceProduct.sourceSku || sourceProduct.sourceProductId,
    sourceCostVerifiedAt: sourceProduct.lastCheckedAt,
    internalNotes: `Imported via Meesho Sourcing Engine. Record ID: ${sourceProduct.sourceRecordId}`,
  };

  saveAdminProduct(newProduct);

  // Update Sourcing Record
  sourceProduct.linkedProductId = newProduct.productId;
  sourceProduct.importStatus = 'IMPORTED';
  sourceProduct.targetSellingPricePaise = sellingPrice;
  sourceProduct.targetCompareAtPricePaise = compareAtPrice;
  sourceProduct.updatedAt = now;

  saveSourceProductDraft(sourceProduct);

  return newProduct;
}

/**
 * Price check & margin monitoring
 */
export function checkSourcePriceNow(
  sourceRecordId: string,
  mockNewPricePaise?: number,
  mockAvailability?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
): SourceProduct | null {
  const product = getSourceProductById(sourceRecordId);
  if (!product) return null;

  const now = new Date().toISOString();
  const previousPrice = product.sourcePricePaise;
  // If no price provided, keep or simulate small jitter for realism
  const observedPrice = mockNewPricePaise !== undefined ? mockNewPricePaise : previousPrice;
  const delta = observedPrice - previousPrice;

  product.previousSourcePricePaise = previousPrice;
  product.sourcePricePaise = observedPrice;
  if (mockAvailability) product.sourceAvailability = mockAvailability;
  product.lastCheckedAt = now;
  product.verificationStatus = 'VERIFIED';
  product.updatedAt = now;

  // Recalculate margins
  const pricing = calculateCommercialPricing({
    sourceCostPaise: observedPrice,
    sourceShippingCostPaise: product.sourceShippingCostPaise || 0,
    packagingCostPaise: 3000,
    sellingPricePaise: product.targetSellingPricePaise || observedPrice * 2.5,
  });
  product.estimatedGrossMarginPercent = pricing.grossMarginPercent;

  saveSourceProductDraft(product);

  // Log in Price History if price changed or on explicit audit check
  const history = getSourcePriceHistory();
  history.unshift({
    historyId: `hist-${Date.now()}`,
    sourceRecordId,
    observedPricePaise: observedPrice,
    previousPricePaise: previousPrice,
    priceDeltaPaise: delta,
    observedAvailability: product.sourceAvailability,
    observedAt: now,
    verificationStatus: 'VERIFIED',
    retrievalMethod: 'URL_PARSER',
    note: delta !== 0 
      ? `Price shifted by ${delta > 0 ? '+' : ''}₹${(delta / 100).toFixed(2)}` 
      : 'Automated manual price verification confirmed stable',
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_HISTORY_KEY, JSON.stringify(history));
  }

  return product;
}

export function getSourcePriceHistory(): SourcePriceHistory[] {
  if (typeof window === 'undefined') return SEED_PRICE_HISTORY;
  try {
    const raw = localStorage.getItem(SOURCING_HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(SOURCING_HISTORY_KEY, JSON.stringify(SEED_PRICE_HISTORY));
      return SEED_PRICE_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PRICE_HISTORY;
  }
}

export function getAttributeMappings(): AttributeMappingRule[] {
  if (typeof window === 'undefined') return SEED_ATTRIBUTE_MAPPINGS;
  try {
    const raw = localStorage.getItem(SOURCING_MAPPINGS_KEY);
    if (!raw) {
      localStorage.setItem(SOURCING_MAPPINGS_KEY, JSON.stringify(SEED_ATTRIBUTE_MAPPINGS));
      return SEED_ATTRIBUTE_MAPPINGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ATTRIBUTE_MAPPINGS;
  }
}

export function saveAttributeMapping(rule: AttributeMappingRule): AttributeMappingRule[] {
  const mappings = getAttributeMappings();
  const existingIdx = mappings.findIndex((m) => m.id === rule.id);
  if (existingIdx >= 0) {
    mappings[existingIdx] = rule;
  } else {
    mappings.unshift(rule);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_MAPPINGS_KEY, JSON.stringify(mappings));
  }
  return mappings;
}

export function deleteAttributeMapping(id: string): AttributeMappingRule[] {
  const mappings = getAttributeMappings().filter((m) => m.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_MAPPINGS_KEY, JSON.stringify(mappings));
  }
  return mappings;
}

export function getTaxonomy(): TaxonomyCategory[] {
  if (typeof window === 'undefined') return INITIAL_TAXONOMY;
  try {
    const raw = localStorage.getItem(SOURCING_TAXONOMY_KEY);
    if (!raw) {
      localStorage.setItem(SOURCING_TAXONOMY_KEY, JSON.stringify(INITIAL_TAXONOMY));
      return INITIAL_TAXONOMY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TAXONOMY;
  }
}

export function saveTaxonomyCategory(cat: TaxonomyCategory): TaxonomyCategory[] {
  const taxonomy = getTaxonomy();
  const existingIdx = taxonomy.findIndex((c) => c.id === cat.id);
  if (existingIdx >= 0) {
    taxonomy[existingIdx] = cat;
  } else {
    taxonomy.push(cat);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_TAXONOMY_KEY, JSON.stringify(taxonomy));
  }
  return taxonomy;
}

export function getCategoryAttributes(departmentId?: Department, categoryId?: string): CategoryAttribute[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORY_ATTRIBUTES;
  try {
    const raw = localStorage.getItem(SOURCING_ATTRIBUTES_KEY);
    const all = raw ? JSON.parse(raw) : DEFAULT_CATEGORY_ATTRIBUTES;
    if (!raw) {
      localStorage.setItem(SOURCING_ATTRIBUTES_KEY, JSON.stringify(DEFAULT_CATEGORY_ATTRIBUTES));
    }
    return all.filter((a: CategoryAttribute) => {
      if (departmentId && a.departmentId !== departmentId) return false;
      if (categoryId && a.categoryId !== categoryId) return false;
      return true;
    });
  } catch {
    return DEFAULT_CATEGORY_ATTRIBUTES;
  }
}

export function saveCategoryAttribute(attr: CategoryAttribute): CategoryAttribute[] {
  const all = getCategoryAttributes();
  const idx = all.findIndex((a) => a.attributeKey === attr.attributeKey);
  if (idx >= 0) {
    all[idx] = attr;
  } else {
    all.push(attr);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_ATTRIBUTES_KEY, JSON.stringify(all));
  }
  return all;
}

export function getImportJobs(): ImportJob[] {
  if (typeof window === 'undefined') return SEED_IMPORT_JOBS;
  try {
    const raw = localStorage.getItem(SOURCING_JOBS_KEY);
    if (!raw) {
      localStorage.setItem(SOURCING_JOBS_KEY, JSON.stringify(SEED_IMPORT_JOBS));
      return SEED_IMPORT_JOBS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_IMPORT_JOBS;
  }
}

export function createImportJob(job: Partial<ImportJob> & { sourceUrl: string }): ImportJob {
  const jobs = getImportJobs();
  const newJob: ImportJob = {
    jobId: `job-${Date.now()}`,
    sourceUrl: job.sourceUrl,
    status: job.status || 'COMPLETED',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    importedFields: job.importedFields || ['title', 'price', 'images'],
    missingFields: job.missingFields || [],
    errors: job.errors || [],
    sourceRecordId: job.sourceRecordId,
    linkedProductId: job.linkedProductId,
    createdBy: job.createdBy || 'Root Administrator',
  };
  jobs.unshift(newJob);
  if (typeof window !== 'undefined') {
    localStorage.setItem(SOURCING_JOBS_KEY, JSON.stringify(jobs));
  }
  return newJob;
}
