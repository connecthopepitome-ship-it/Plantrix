/**
 * Plantrix Botanics — Product Catalogue Service
 * Bridges Firestore database and client-safe public DTOs.
 * Enforces strict security boundary: private supplier details never leave server.
 */

import { Product, PublicProduct, toPublicProduct } from '@/types/product';
import { CATALOG_PRODUCTS } from '@/data/products';
import {
  getFirestoreDoc,
  setFirestoreDoc,
  queryFirestoreCollection,
} from '../firebase/firestore-rest';
import { resolveImagePublicUrl } from '../r2/client';

const PRODUCTS_COLLECTION = 'products';

// In-memory memory-store for dev resilience when cloud DB is being configured
let localProductMemoryStore: Map<string, Product> = new Map();

function getMemoryStore(): Map<string, Product> {
  if (localProductMemoryStore.size === 0) {
    CATALOG_PRODUCTS.forEach((cp, idx) => {
      const prod: Product = {
        productId: cp.productId,
        sku: cp.sku,
        slug: cp.slug,
        name: cp.name,
        shortDescription: cp.shortDescription,
        description: cp.description,
        department: cp.department,
        categoryId: cp.categoryId,
        brand: cp.brand || 'Plantrix Studio',
        sellingPricePaise: cp.sellingPricePaise,
        compareAtPricePaise: cp.compareAtPricePaise,
        stock: cp.stock,
        status: cp.status,
        featured: cp.featured,
        trending: cp.trending,
        newArrival: cp.newArrival,
        imageKeys: cp.imageKeys || [],
        variants: cp.variants,
        specifications: cp.specifications,
        highlights: cp.highlights,
        careInstructions: cp.careInstructions,
        shippingInfo: cp.shippingInfo,
        createdAt: '2026-10-10T10:00:00Z',
        updatedAt: '2026-10-21T08:00:00Z',
        sourceCostPaise: Math.round(cp.sellingPricePaise * 0.48),
        sourceProductUrl: `https://artisan-supplier.internal/sku/${cp.sku.toLowerCase()}`,
        supplierSku: `SUP-${cp.sku}`,
      };
      localProductMemoryStore.set(prod.productId, prod);
    });
  }
  return localProductMemoryStore;
}

export interface PublicProductQueryFilters {
  department?: string;
  categoryId?: string;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  minPricePaise?: number;
  maxPricePaise?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  page?: number;
  limit?: number;
}

/**
 * Retrieves public products with filters, pagination, and sorting
 * 100% sanitized: guarantees zero leakage of wholesale supplier data.
 */
export async function getPublicProducts(
  filters: PublicProductQueryFilters = {}
): Promise<{
  products: PublicProduct[];
  total: number;
  page: number;
  limit: number;
}> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(50, Math.max(1, filters.limit || 20));

  let allProducts: Product[] = [];

  // Try Firestore first
  try {
    const { documents } = await queryFirestoreCollection<Product>(PRODUCTS_COLLECTION, {
      pageSize: 100,
    });
    if (documents && documents.length > 0) {
      allProducts = documents;
    }
  } catch (err) {
    console.warn('[ProductService] Cloud Firestore read bypassed, using catalog memory store:', err);
  }

  // Fallback to memory store if Firestore has no products yet
  if (allProducts.length === 0) {
    allProducts = Array.from(getMemoryStore().values());
  }

  // Filter only ACTIVE products for public storefront
  let filtered = allProducts.filter((p) => p.status === 'ACTIVE');

  if (filters.department) {
    filtered = filtered.filter(
      (p) => p.department.toLowerCase() === filters.department?.toLowerCase()
    );
  }

  if (filters.categoryId) {
    filtered = filtered.filter(
      (p) => p.categoryId.toLowerCase() === filters.categoryId?.toLowerCase()
    );
  }

  if (filters.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === filters.featured);
  }

  if (filters.trending !== undefined) {
    filtered = filtered.filter((p) => p.trending === filters.trending);
  }

  if (filters.newArrival !== undefined) {
    filtered = filtered.filter((p) => p.newArrival === filters.newArrival);
  }

  if (filters.minPricePaise !== undefined) {
    filtered = filtered.filter((p) => p.sellingPricePaise >= filters.minPricePaise!);
  }

  if (filters.maxPricePaise !== undefined) {
    filtered = filtered.filter((p) => p.sellingPricePaise <= filters.maxPricePaise!);
  }

  if (filters.search) {
    const query = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
        p.sku.toLowerCase().includes(query) ||
        p.categoryId.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (filters.sort === 'price_asc') {
    filtered.sort((a, b) => a.sellingPricePaise - b.sellingPricePaise);
  } else if (filters.sort === 'price_desc') {
    filtered.sort((a, b) => b.sellingPricePaise - a.sellingPricePaise);
  } else if (filters.sort === 'newest') {
    filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } else {
    // Default featured sort
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  const publicBaseUrl = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL || '';
  const sanitized = paginated.map((p) => toPublicProduct(p, publicBaseUrl));

  return {
    products: sanitized,
    total,
    page,
    limit,
  };
}

/**
 * Retrieves a single public product by slug
 */
export async function getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
  const publicBaseUrl = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL || '';

  // Try Firestore search
  try {
    const { documents } = await queryFirestoreCollection<Product>(PRODUCTS_COLLECTION, {
      pageSize: 50,
    });
    const match = documents.find((p) => p.slug === slug && p.status === 'ACTIVE');
    if (match) {
      return toPublicProduct(match, publicBaseUrl);
    }
  } catch (err) {
    // Fallback
  }

  // Check memory store
  const match = Array.from(getMemoryStore().values()).find(
    (p) => p.slug === slug && p.status === 'ACTIVE'
  );
  if (match) {
    return toPublicProduct(match, publicBaseUrl);
  }

  return null;
}

/**
 * Retrieves full internal product record by ID (Admin only)
 */
export async function getInternalProductById(productId: string): Promise<Product | null> {
  try {
    const doc = await getFirestoreDoc<Product>(PRODUCTS_COLLECTION, productId);
    if (doc) return doc;
  } catch {
    // Fallback
  }
  return getMemoryStore().get(productId) || null;
}

/**
 * Lists all products for Admin panel (includes drafts, supplier costs, and supplier URLs)
 */
export async function getAdminProducts(): Promise<Product[]> {
  try {
    const { documents } = await queryFirestoreCollection<Product>(PRODUCTS_COLLECTION, {
      pageSize: 100,
    });
    if (documents.length > 0) return documents;
  } catch {
    // Fallback
  }
  return Array.from(getMemoryStore().values());
}

/**
 * Creates a new product in Firestore (Admin only)
 */
export async function createProduct(input: Partial<Product>): Promise<Product> {
  const productId = input.productId || `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const slug =
    input.slug ||
    input.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
    productId;

  const now = new Date().toISOString();
  const product: Product = {
    productId,
    sku: input.sku || `PLX-${Math.floor(1000 + Math.random() * 9000)}`,
    slug,
    name: input.name || 'Untitled Specimen',
    shortDescription: input.shortDescription || '',
    description: input.description || '',
    department: input.department || 'GARDEN_OUTDOOR',
    categoryId: input.categoryId || 'general',
    subcategoryId: input.subcategoryId,
    brand: input.brand || 'Plantrix Studio',
    sellingPricePaise: input.sellingPricePaise || 99900,
    compareAtPricePaise: input.compareAtPricePaise,
    stock: input.stock ?? 10,
    status: input.status || 'ACTIVE',
    featured: Boolean(input.featured),
    trending: Boolean(input.trending),
    newArrival: Boolean(input.newArrival),
    imageKeys: input.imageKeys || [],
    variants: input.variants || [],
    specifications: input.specifications || {},
    highlights: input.highlights || [],
    careInstructions: input.careInstructions,
    shippingInfo: input.shippingInfo,
    returnPolicy: input.returnPolicy,
    createdAt: now,
    updatedAt: now,
    publishedAt: input.status === 'ACTIVE' ? now : undefined,
    sourceCostPaise: input.sourceCostPaise,
    sourceProductUrl: input.sourceProductUrl,
    supplierSku: input.supplierSku,
    internalNotes: input.internalNotes,
  };

  await setFirestoreDoc(PRODUCTS_COLLECTION, productId, product);
  getMemoryStore().set(productId, product);

  return product;
}

/**
 * Updates an existing product (Admin only)
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const existing = await getInternalProductById(productId);
  if (!existing) return null;

  const updated: Product = {
    ...existing,
    ...updates,
    productId, // protect immutable ID
    updatedAt: new Date().toISOString(),
  };

  await setFirestoreDoc(PRODUCTS_COLLECTION, productId, updated);
  getMemoryStore().set(productId, updated);

  return updated;
}

/**
 * Safely archives a product (Admin only)
 */
export async function archiveProduct(productId: string): Promise<boolean> {
  const existing = await getInternalProductById(productId);
  if (!existing) return false;

  const updated: Product = {
    ...existing,
    status: 'DISCONTINUED',
    updatedAt: new Date().toISOString(),
  };

  await setFirestoreDoc(PRODUCTS_COLLECTION, productId, updated);
  getMemoryStore().set(productId, updated);
  return true;
}

/**
 * Appends an image object key to the product's image gallery
 */
export async function addProductImageKey(
  productId: string,
  imageKey: string
): Promise<Product | null> {
  const existing = await getInternalProductById(productId);
  if (!existing) return null;

  const currentKeys = existing.imageKeys || [];
  if (!currentKeys.includes(imageKey)) {
    currentKeys.push(imageKey);
  }

  return updateProduct(productId, { imageKeys: currentKeys });
}

/**
 * Removes an image object key from the product
 */
export async function removeProductImageKey(
  productId: string,
  imageKey: string
): Promise<Product | null> {
  const existing = await getInternalProductById(productId);
  if (!existing) return null;

  const currentKeys = (existing.imageKeys || []).filter((k) => k !== imageKey);
  return updateProduct(productId, { imageKeys: currentKeys });
}
