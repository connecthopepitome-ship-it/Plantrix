/**
 * Plantrix Botanics — Product Data Definitions & Security Boundary
 * Complies strictly with docs/DATA_MODEL.md & docs/SECURITY.md
 */

import { Department } from './category';

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'HIDDEN' | 'DISCONTINUED';

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: 'cm' | 'inch' | 'mm';
}

export interface ProductVariant {
  variantId: string;
  sku: string;
  label: string;
  attributes: Record<string, string>; // e.g., { size: 'Medium (6")', color: 'Terracotta' }
  priceAdjustmentPaise?: number; // Integer paise delta (positive or negative)
  stock: number;
  imageKey?: string;
  active: boolean;
}

/**
 * FULL INTERNAL PRODUCT SCHEMA (Stored in Firestore / Handled by Server)
 * STRICT SECURITY BOUNDARY:
 * Contains supplier sourcing URL, wholesale source cost, supplier SKU, and internal audit notes.
 * NEVER expose this interface or its private properties to customer client bundles or public APIs.
 */
export interface Product {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  department: Department;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  sellingPricePaise: number; // Integer paise (e.g. ₹599.00 = 59900)
  compareAtPricePaise?: number; // Legitimate reference MRP in paise
  stock: number;
  status: ProductStatus;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  imageKeys: string[]; // R2 object keys
  variants?: ProductVariant[];
  specifications?: Record<string, string | number | boolean>;
  highlights?: string[];
  dimensions?: ProductDimensions;
  weightGrams?: number;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // ==========================================
  // PRIVATE SUPPLIER FIELDS (INTERNAL USE ONLY)
  // ==========================================
  sourceCostPaise?: number;
  sourceProductUrl?: string;
  supplierSku?: string;
  sourceCostVerifiedAt?: string;
  internalNotes?: string;
}

/**
 * PUBLIC PRODUCT DTO (Safe for Customer Browsers & Public API Responses)
 * Strictly stripped of all supplier sourcing, margins, and internal operational data.
 */
export interface PublicProduct {
  productId: string;
  sku: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  department: Department;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  sellingPricePaise: number;
  compareAtPricePaise?: number;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  imageKeys: string[];
  imageUrls: string[]; // Resolved URLs (Cloudflare R2 or CDN)
  variants?: ProductVariant[];
  specifications?: Record<string, string | number | boolean>;
  highlights?: string[];
  dimensions?: ProductDimensions;
  weightGrams?: number;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
  createdAt: string;
  publishedAt?: string;
}

/**
 * Format integer paise into standard Indian Rupee string (e.g. 59900 -> "₹599")
 */
export function formatPaiseToINR(paise: number, includeDecimals = false): string {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0';
  const rupees = paise / 100;
  if (includeDecimals || rupees % 1 !== 0) {
    return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * Calculate legitimate discount percentage based on selling price and compare-at price
 */
export function calculateDiscountPercentage(sellingPaise: number, comparePaise?: number): number {
  if (!comparePaise || comparePaise <= sellingPaise) return 0;
  return Math.round(((comparePaise - sellingPaise) / comparePaise) * 100);
}

/**
 * Pure sanitizer: transforms internal Product to client-safe PublicProduct
 * Guarantees zero leakage of supplier costs, supplier links, or admin notes.
 */
export function toPublicProduct(product: Product, r2PublicBaseUrl = ''): PublicProduct {
  const base = r2PublicBaseUrl.replace(/\/+$/, '');
  const imageUrls = (product.imageKeys || []).map((key) => {
    if (key.startsWith('http://') || key.startsWith('https://')) return key;
    return base ? `${base}/${key.replace(/^\/+/, '')}` : key;
  });

  return {
    productId: product.productId,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    department: product.department,
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId,
    brand: product.brand,
    sellingPricePaise: product.sellingPricePaise,
    compareAtPricePaise: product.compareAtPricePaise,
    stock: product.stock,
    status: product.status,
    featured: Boolean(product.featured),
    trending: Boolean(product.trending),
    newArrival: Boolean(product.newArrival),
    imageKeys: product.imageKeys || [],
    imageUrls,
    variants: product.variants,
    specifications: product.specifications,
    highlights: product.highlights,
    dimensions: product.dimensions,
    weightGrams: product.weightGrams,
    careInstructions: product.careInstructions,
    shippingInfo: product.shippingInfo,
    returnPolicy: product.returnPolicy,
    createdAt: product.createdAt,
    publishedAt: product.publishedAt,
  };
}
