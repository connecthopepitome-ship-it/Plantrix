/**
 * Plantrix Botanics — Bulk Product Import Module Types
 * Defines data structures for CSV parsing, validation, duplicate policies,
 * image archive matching, and import job tracking.
 */

import { Department } from './category';
import { ProductStatus } from './product';

export type DuplicatePolicy =
  | 'CREATE_NEW'
  | 'UPDATE_EXISTING'
  | 'SKIP_EXISTING'
  | 'FLAG_REVIEW';

export type RowAction = 'CREATE' | 'UPDATE' | 'SKIP' | 'ERROR';

export type RowValidationStatus =
  | 'VALID'
  | 'WARNING'
  | 'DUPLICATE_SKU_IN_FILE'
  | 'EXISTING_SKU'
  | 'INVALID_CATEGORY'
  | 'INVALID_DEPARTMENT'
  | 'INVALID_PRICE'
  | 'INVALID_STOCK'
  | 'MISSING_IMAGE'
  | 'MISSING_REQUIRED_FIELD'
  | 'INVALID_DATA';

export interface ValidatedImportRow {
  rowNumber: number;
  sku: string;
  name: string;
  slug: string;
  department: Department;
  categoryId: string;
  subcategoryId?: string;
  description?: string;
  shortDescription?: string;
  brand?: string;
  sellingPriceINR: number;
  sellingPricePaise: number;
  compareAtPriceINR?: number;
  compareAtPricePaise?: number;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  imageKeys: string[];
  imageFilenames: string[]; // From image1..image4 or matched ZIP
  highlights?: string[];
  specifications?: Record<string, string | number | boolean>;
  variants?: any[];
  tags?: string[];
  careInstructions?: string;
  shippingInfo?: string;

  // Private Sourcing Fields (Server Only)
  sourceCostINR?: number;
  sourceCostPaise?: number;
  sourceProductUrl?: string;
  supplierSku?: string;
  internalNotes?: string;

  // Evaluation & Action
  action: RowAction;
  validationStatus: RowValidationStatus;
  errors: string[];
  warnings: string[];
  existingProductId?: string;
}

export interface ImportValidationSummary {
  totalRows: number;
  validRows: number;
  errorRows: number;
  warningRows: number;
  createCount: number;
  updateCount: number;
  skipCount: number;
  flagReviewCount: number;
  rows: ValidatedImportRow[];
  detectedDepartments: string[];
  detectedCategories: string[];
  missingImages: string[];
  duplicatePolicy: DuplicatePolicy;
  isDryRun: boolean;
}

export type ImportJobStatus =
  | 'PENDING'
  | 'VALIDATING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ImportJobRecord {
  jobId: string;
  initiatingAdminId: string;
  fileName: string;
  fileSizeBytes: number;
  totalRows: number;
  processedRows: number;
  successCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  imageUploadCount: number;
  status: ImportJobStatus;
  duplicatePolicy: DuplicatePolicy;
  isDryRun: boolean;
  importAsDraftDefault: boolean;
  startedAt: string;
  completedAt?: string;
  errors: Array<{
    rowNumber: number;
    sku?: string;
    error: string;
  }>;
  createdProductIds: string[];
  updatedProductIds: string[];
  uploadedR2Keys: string[];
}
