/**
 * Plantrix Botanics — Zod Validation Schemas
 * Comprehensive validation across Catalogue, Orders, Checkout, Addresses, and Media Uploads.
 */

import { z } from 'zod';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from '../r2/client';

export const DepartmentEnum = z.enum([
  'GARDEN_OUTDOOR',
  'KITCHEN_TOOLS',
  'HOME_ESSENTIALS',
  'CLEANING_IMPROVEMENT',
  'STORAGE_ORGANIZATION',
  'TOOLS_HARDWARE',
  'PLANTS_BOTANICS',
]);

export const ProductStatusEnum = z.enum([
  'DRAFT',
  'ACTIVE',
  'OUT_OF_STOCK',
  'HIDDEN',
  'DISCONTINUED',
]);

export const ProductVariantSchema = z.object({
  variantId: z.string().min(1),
  sku: z.string().min(2),
  label: z.string().min(1),
  attributes: z.record(z.string(), z.string()),
  priceAdjustmentPaise: z.number().int().optional(),
  stock: z.number().int().min(0),
  imageKey: z.string().optional(),
  active: z.boolean().default(true),
});

export const ProductCreateSchema = z.object({
  name: z.string().min(2, 'Product title must be at least 2 characters').max(200),
  slug: z.string().min(2).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
  department: DepartmentEnum,
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional(),
  brand: z.string().max(100).optional().default('Plantrix Studio'),
  sku: z.string().min(3, 'SKU must be at least 3 characters').max(50),
  sellingPricePaise: z.number().int().positive('Selling price must be a positive integer in paise'),
  compareAtPricePaise: z.number().int().positive().optional(),
  stock: z.number().int().min(0).default(0),
  status: ProductStatusEnum.default('ACTIVE'),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  imageKeys: z.array(z.string()).default([]),
  variants: z.array(ProductVariantSchema).optional(),
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  highlights: z.array(z.string()).optional(),
  careInstructions: z.string().max(2000).optional(),
  shippingInfo: z.string().max(2000).optional(),
  returnPolicy: z.string().max(2000).optional(),

  // Private Supplier Sourcing Fields (Internal Only)
  sourceCostPaise: z.number().int().positive().optional(),
  sourceProductUrl: z.string().url().optional().or(z.literal('')),
  supplierSku: z.string().optional(),
  internalNotes: z.string().max(2000).optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const ShippingAddressSchema = z.object({
  line1: z.string().min(3, 'Address line 1 must be at least 3 characters'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Indian PIN code'),
  country: z.literal('IN').default('IN'),
});

export const CheckoutItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(99),
});

export const CheckoutRequestSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  }),
  shippingAddress: ShippingAddressSchema,
  items: z.array(CheckoutItemSchema).min(1, 'Cart cannot be empty'),
  paymentMethod: z.enum(['COD', 'ONLINE']).default('COD'),
  customerNotes: z.string().max(500).optional(),
  idempotencyKey: z.string().optional(),
});

export const ServiceabilityRequestSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
});

export const ImageUploadSignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum(ALLOWED_IMAGE_MIME_TYPES as [string, ...string[]]),
  fileSize: z.number().int().max(MAX_IMAGE_SIZE_BYTES, 'Image exceeds maximum 5MB size limit'),
  productId: z.string().min(1),
});
