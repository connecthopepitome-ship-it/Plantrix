/**
 * Plantrix Botanics — Bulk Product Import Service
 * Handles CSV parsing, price INR-to-paise conversion, category validation,
 * image ZIP matching, duplicate policies, dry-runs, and Firestore/R2 execution.
 */

import Papa from 'papaparse';
import { Department } from '@/types/category';
import { Product, ProductStatus } from '@/types/product';
import {
  DuplicatePolicy,
  ImportJobRecord,
  ImportValidationSummary,
  RowAction,
  RowValidationStatus,
  ValidatedImportRow,
} from '@/types/import';
import { INITIAL_TAXONOMY } from '@/data/taxonomy';
import {
  createProduct,
  updateProduct,
  getProductBySku,
} from './productService';
import { uploadToR2, ALLOWED_IMAGE_MIME_TYPES } from '../r2/client';
import {
  getFirestoreDoc,
  setFirestoreDoc,
  queryFirestoreCollection,
} from '../firebase/firestore-rest';

const IMPORT_JOBS_COLLECTION = 'importJobs';

// In-memory store for import jobs (resilient when Firestore cloud credentials in dev/test)
const localImportJobsStore: Map<string, ImportJobRecord> = new Map();

export const BULK_IMPORT_COLUMNS = [
  'sku',
  'name',
  'slug',
  'department',
  'categoryId',
  'subcategoryId',
  'sellingPrice',
  'compareAtPrice',
  'stock',
  'status',
  'brand',
  'description',
  'shortDescription',
  'image1',
  'image2',
  'image3',
  'image4',
  'highlights',
  'specifications',
  'careInstructions',
  'shippingInfo',
  'sourceCost',
  'supplierSku',
  'sourceProductUrl',
  'internalNotes',
] as const;

/**
 * Generates official blank CSV template
 */
export function generateImportTemplateCsv(): string {
  const headers = BULK_IMPORT_COLUMNS.join(',');
  const exampleRow = [
    'PLX-POT-101',
    'Minimalist Terracotta Cylinder Pot',
    'minimalist-terracotta-cylinder-pot',
    'GARDEN_OUTDOOR',
    'pots-planters',
    'pp-terracotta',
    '1499',
    '1899',
    '25',
    'DRAFT',
    'Plantrix Studio',
    'Handcrafted porous terracotta pot with base drainage aperture.',
    'Porous natural clay planter for optimal root breathability.',
    'pot-101-hero.webp',
    'pot-101-angle.webp',
    'pot-101-lifestyle.webp',
    'pot-101-detail.webp',
    'Hand-thrown natural clay; Breathable walls prevent root rot; Included saucer',
    'Material:Terracotta; Dimensions:16cm DIA x 18cm H; Drainage:Integrated',
    'Wipe with clean damp cloth. Protect from extreme winter frost.',
    'Packed in shock-absorbing moulded pulp protective casing.',
    '650',
    'SUP-TC-101',
    'https://supplier.internal/pot-101',
    'Verified kiln temperature 1100C',
  ].map((val) => (val.includes(',') || val.includes(';') ? `"${val}"` : val)).join(',');

  return `${headers}\n${exampleRow}\n`;
}

/**
 * Generates sample CSV with 5 real products across departments
 */
export function generateImportSampleCsv(): string {
  const headers = BULK_IMPORT_COLUMNS.join(',');
  const rows = [
    [
      'PLX-POT-201',
      'Fluted Stoneware Planter in Matte Moss',
      'fluted-stoneware-planter-matte-moss',
      'GARDEN_OUTDOOR',
      'pots-planters',
      'pp-ceramic',
      '1899',
      '2499',
      '15',
      'ACTIVE',
      'Plantrix Studio',
      'Heavyweight stoneware planter featuring vertical tactile fluting and porous interior clay lining.',
      'Tactile fluted ceramic planter with discrete internal reservoir plate.',
      'fluted-moss-hero.webp',
      'fluted-moss-angle.webp',
      'fluted-moss-lifestyle.webp',
      'fluted-moss-detail.webp',
      'Tactile ribbed fluting; Internal catch reservoir; Thermal buffer for roots',
      'Material:Stoneware Ceramic; Finish:Matte Moss Glaze; Dimensions:18cm DIA x 20cm H; Weight:1.8kg',
      'Wipe with damp microfiber cloth.',
      'Dispatches within 24 hours in multi-layer corrugated box.',
      '850',
      'SUP-CER-201',
      'https://supplier.internal/stoneware-fluted',
      'Lead-free ceramic glazes certified.',
    ],
    [
      'PLX-MIS-202',
      'Solid Spun Brass Botanical Foliage Mister',
      'solid-spun-brass-botanical-foliage-mister',
      'GARDEN_OUTDOOR',
      'garden-tools',
      'gt-sprayers',
      '1299',
      '1699',
      '30',
      'ACTIVE',
      'Plantrix Metalworks',
      'Solid spun brass mister with pneumatic micro-mist pump producing 50-micron droplets for broadleaf tropicals.',
      'Spun brass foliage mister with vintage plunger pump.',
      'brass-mister-hero.webp',
      'brass-mister-pump.webp',
      'brass-mister-lifestyle.webp',
      'brass-mister-nozzle.webp',
      'Solid rust-resistant brass; 50μm micro-droplet mist plume; Weighted anti-tip base',
      'Material:Spun Brass; Fluid Capacity:350ml; Dimensions:8.5cm DIA x 15cm H; Weight:420g',
      'Rinse reservoir monthly with filtered water.',
      'Air courier delivery in protective custom foam insert.',
      '550',
      'SUP-BRS-202',
      'https://supplier.internal/brass-mister',
      'Includes spare silicone o-ring seal.',
    ],
    [
      'PLX-PAN-203',
      'Airtight Smoked Borosilicate Stack Canister',
      'airtight-smoked-borosilicate-stack-canister',
      'KITCHEN_TOOLS',
      'kitchen-storage',
      'ks-containers',
      '1499',
      '1999',
      '40',
      'ACTIVE',
      'Plantrix Living',
      'Smoked borosilicate glass pantry jar with hermetic food-grade silicone seal and ash wood lid.',
      'Modular pantry storage cube with airtight moisture seal.',
      'smoked-canister-hero.webp',
      'smoked-canister-lid.webp',
      'smoked-canister-stack.webp',
      'smoked-canister-pantry.webp',
      'Food-grade borosilicate glass; Multi-ridge silicone gasket; Interlocking vertical stack rim',
      'Material:Borosilicate Glass & Ash Wood; Capacity:1200ml; Thermal Tolerance:-20C to 150C',
      'Glass vessel dishwasher safe. Wipe wooden lid with dry towel.',
      'Double bubble wrapped with edge corner protectors.',
      '620',
      'SUP-GLS-203',
      'https://supplier.internal/borosilicate-jar',
      'FDA compliant food-grade silicone.',
    ],
    [
      'PLX-DIV-204',
      'Expandable Brushed Brass Drawer Divider Pair',
      'expandable-brushed-brass-drawer-divider-pair',
      'HOME_ESSENTIALS',
      'home-organization',
      'ho-drawers',
      '1799',
      '2299',
      '20',
      'ACTIVE',
      'Plantrix Metalworks',
      'Spring-tensioned brass kitchen drawer organizers that adjust continuously between 38cm and 54cm.',
      'Tool-free tension fit brass culinary drawer dividers.',
      'brass-divider-hero.webp',
      'brass-divider-spring.webp',
      'brass-divider-installed.webp',
      'brass-divider-detail.webp',
      'Heavy-gauge brushed brass; Internal steel tension spring; Non-scratch silicone end caps',
      'Material:Solid Brass & Spring Steel; Extension:38cm to 54cm; Height:6.5cm',
      'Buff with dry cloth.',
      'Includes 2 dividers per gift box.',
      '790',
      'SUP-DIV-204',
      'https://supplier.internal/drawer-dividers',
      'Lifetime spring tension warranty.',
    ],
    [
      'PLX-CLN-205',
      'Telescopic Electrostatic Microfiber Duster',
      'telescopic-electrostatic-microfiber-duster',
      'CLEANING_IMPROVEMENT',
      'cleaning-maintenance',
      'cm-dusters',
      '899',
      '1199',
      '50',
      'DRAFT',
      'Plantrix Utility',
      'Bendable electrostatic microfiber head mounted on stainless steel telescopic wand extending up to 2.5 meters.',
      'High-reach bendable microfiber duster for ceiling corners and fans.',
      'duster-hero.webp',
      'duster-extended.webp',
      'duster-bend.webp',
      'duster-wash.webp',
      'Extends up to 2.5m; Bendable 360-degree head; Machine washable microfiber sleeve',
      'Material:Stainless Steel & Microfiber; Extension Length:75cm to 250cm; Weight:310g',
      'Unscrew head and rinse in warm soapy water.',
      'Individually sleeved in biodegradable shipping tube.',
      '340',
      'SUP-CLN-205',
      'https://supplier.internal/microfiber-duster',
      'Includes bonus spare microfiber sleeve.',
    ],
  ];

  const formattedRows = rows.map((r) =>
    r.map((val) => (val.includes(',') || val.includes(';') ? `"${val}"` : val)).join(',')
  );

  return `${headers}\n${formattedRows.join('\n')}\n`;
}

/**
 * Converts input INR to integer paise (exact conversion without floating-point errors)
 */
export function parseInrToPaise(val: any): { paise: number; error?: string } {
  if (val === undefined || val === null || val === '') {
    return { paise: 0 };
  }
  const clean = String(val).replace(/[₹,\s]/g, '').trim();
  const num = Number(clean);
  if (isNaN(num) || num < 0) {
    return { paise: 0, error: `Invalid price "${val}". Must be a positive number.` };
  }
  return { paise: Math.round(num * 100) };
}

/**
 * Validates department against supported list
 */
const VALID_DEPARTMENTS: Set<Department> = new Set<Department>([
  'GARDEN_OUTDOOR',
  'KITCHEN_TOOLS',
  'HOME_ESSENTIALS',
  'CLEANING_IMPROVEMENT',
  'STORAGE_ORGANIZATION',
  'TOOLS_HARDWARE',
  'PLANTS_BOTANICS',
]);

/**
 * Map of known category IDs to their parent department
 */
const CATEGORY_MAP: Map<string, Department> = new Map();
INITIAL_TAXONOMY.forEach((cat) => {
  CATEGORY_MAP.set(cat.id.toLowerCase(), cat.departmentId);
});

/**
 * Extracts and parses key:value pairs (e.g. "Material:Ceramic; Dimensions:18cm DIA")
 */
export function parseAttributesString(str?: string): Record<string, string> {
  if (!str) return {};
  const result: Record<string, string> = {};
  str.split(';').forEach((part) => {
    const colonIdx = part.indexOf(':');
    if (colonIdx > 0) {
      const key = part.slice(0, colonIdx).trim();
      const val = part.slice(colonIdx + 1).trim();
      if (key && val) {
        result[key] = val;
      }
    }
  });
  return result;
}

/**
 * Splits semicolon-delimited lists (e.g. "Feature 1; Feature 2; Feature 3")
 */
export function parseSemicolonList(str?: string): string[] {
  if (!str) return [];
  return str
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Sanitizes and generates valid URL slug
 */
export function generateSlug(name: string, sku?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  if (base) return base;
  return (sku || `specimen-${Date.now()}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

/**
 * Matches images from an archive file list to a product row
 * Supports:
 * 1. SKU folder (`POT-001/01.webp`)
 * 2. Explicit CSV filename columns (`image1`, `image2`...)
 * 3. SKU prefix (`TOOL-002-01.jpg`)
 * Enforces path traversal prevention and deterministic sorting.
 */
export function matchImagesForSku(
  sku: string,
  explicitFilenames: string[],
  availableArchiveFiles: string[]
): string[] {
  const cleanSku = sku.trim().toLowerCase();
  const matchedFiles: string[] = [];

  // Filter archive files for safe paths only
  const safeArchiveFiles = availableArchiveFiles.filter((path) => {
    if (!path) return false;
    // Reject path traversal and hidden system files
    if (path.includes('..') || path.startsWith('/') || path.startsWith('\\')) return false;
    if (path.includes('__MACOSX') || path.includes('.DS_Store') || path.includes('Thumbs.db')) return false;
    // Check valid image extension
    const ext = path.split('.').pop()?.toLowerCase();
    return ext && ['webp', 'jpg', 'jpeg', 'png', 'avif'].includes(ext);
  });

  // Strategy 1: Explicit CSV filenames (image1..image4)
  for (const fn of explicitFilenames) {
    if (!fn) continue;
    const cleanFn = fn.trim().toLowerCase();
    const found = safeArchiveFiles.find((p) => {
      const base = p.split('/').pop()?.toLowerCase();
      return base === cleanFn || p.toLowerCase() === cleanFn;
    });
    if (found && !matchedFiles.includes(found)) {
      matchedFiles.push(found);
    }
  }

  // Strategy 2: SKU Folder match (e.g. "POT-001/01.webp" or "pot-001/hero.jpg")
  const folderMatches = safeArchiveFiles
    .filter((p) => {
      const parts = p.toLowerCase().split('/');
      return parts.length > 1 && parts[0] === cleanSku;
    })
    .sort(); // Deterministic ordering
  for (const f of folderMatches) {
    if (!matchedFiles.includes(f) && matchedFiles.length < 4) {
      matchedFiles.push(f);
    }
  }

  // Strategy 3: SKU Prefix match (e.g. "POT-001-01.webp" or "pot-001_hero.jpg")
  const prefixMatches = safeArchiveFiles
    .filter((p) => {
      const base = p.split('/').pop()?.toLowerCase() || '';
      return (
        base.startsWith(`${cleanSku}-`) ||
        base.startsWith(`${cleanSku}_`) ||
        base.startsWith(`${cleanSku}.`)
      );
    })
    .sort();
  for (const f of prefixMatches) {
    if (!matchedFiles.includes(f) && matchedFiles.length < 4) {
      matchedFiles.push(f);
    }
  }

  // Cap at 4 images (1 hero + 3 thumbnails) as per existing product detail gallery specification
  return matchedFiles.slice(0, 4);
}

/**
 * Validates raw CSV string against existing Firestore database and schema
 */
export async function validateImportCsv(
  csvContent: string,
  options: {
    duplicatePolicy?: DuplicatePolicy;
    importAsDraftDefault?: boolean;
    availableArchiveFiles?: string[];
  } = {}
): Promise<ImportValidationSummary> {
  const policy: DuplicatePolicy = options.duplicatePolicy || 'CREATE_NEW';
  const asDraft = Boolean(options.importAsDraftDefault);
  const archiveFiles = options.availableArchiveFiles || [];

  const parsed = Papa.parse<Record<string, string>>(csvContent.trim(), {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error(`CSV Parsing failed: ${parsed.errors[0]?.message || 'Invalid format'}`);
  }

  const rawRows = parsed.data;
  const seenSkusInFile = new Set<string>();
  const duplicateSkusInFile = new Set<string>();

  // First pass: identify duplicates inside the uploaded file itself
  rawRows.forEach((r) => {
    const sku = (r.sku || '').trim().toUpperCase();
    if (sku) {
      if (seenSkusInFile.has(sku)) {
        duplicateSkusInFile.add(sku);
      } else {
        seenSkusInFile.add(sku);
      }
    }
  });

  const validatedRows: ValidatedImportRow[] = [];
  const detectedDepartments = new Set<string>();
  const detectedCategories = new Set<string>();
  const missingImages = new Set<string>();

  let createCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  let flagReviewCount = 0;
  let errorRows = 0;
  let warningRows = 0;

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i];
    const rowNum = i + 2; // 1-based, accounting for header row
    const errors: string[] = [];
    const warnings: string[] = [];

    const rawSku = (raw.sku || '').trim();
    const sku = rawSku.toUpperCase();
    const name = (raw.name || '').trim();

    // Required fields check
    if (!sku) {
      errors.push('SKU is required.');
    }
    if (!name) {
      errors.push('Product name is required.');
    }

    // Duplicate SKU in same file
    if (sku && duplicateSkusInFile.has(sku)) {
      errors.push(`Duplicate SKU "${sku}" appears multiple times in uploaded file.`);
    }

    // Price validation
    const { paise: sellingPricePaise, error: priceErr } = parseInrToPaise(raw.sellingPrice);
    if (priceErr || sellingPricePaise <= 0) {
      errors.push(priceErr || 'Selling price must be greater than ₹0.');
    }

    let compareAtPricePaise: number | undefined;
    if (raw.compareAtPrice) {
      const { paise: cmpPaise, error: cmpErr } = parseInrToPaise(raw.compareAtPrice);
      if (cmpErr) {
        warnings.push(cmpErr);
      } else if (cmpPaise > 0) {
        if (cmpPaise <= sellingPricePaise) {
          warnings.push('Compare-at price is lower than or equal to selling price.');
        }
        compareAtPricePaise = cmpPaise;
      }
    }

    // Stock validation
    const rawStock = raw.stock !== undefined && raw.stock !== '' ? Number(raw.stock) : 10;
    if (isNaN(rawStock) || rawStock < 0 || !Number.isInteger(rawStock)) {
      errors.push(`Stock quantity must be a non-negative integer (received "${raw.stock}").`);
    }

    // Category and Department validation
    const categoryId = (raw.categoryId || '').trim().toLowerCase();
    let department = (raw.department || '').trim().toUpperCase() as Department;

    if (!categoryId) {
      errors.push('categoryId is required.');
    } else if (!CATEGORY_MAP.has(categoryId)) {
      warnings.push(`Category "${categoryId}" not in standard taxonomy; assigning to general.`);
    } else if (!department) {
      department = CATEGORY_MAP.get(categoryId)!;
    }

    if (department && !VALID_DEPARTMENTS.has(department)) {
      warnings.push(`Department "${department}" unrecognized; defaulted based on category.`);
      department = CATEGORY_MAP.get(categoryId) || 'GARDEN_OUTDOOR';
    } else if (!department) {
      department = 'GARDEN_OUTDOOR';
    }

    if (department) detectedDepartments.add(department);
    if (categoryId) detectedCategories.add(categoryId);

    // Status
    let status: ProductStatus = asDraft ? 'DRAFT' : 'ACTIVE';
    if (raw.status) {
      const s = raw.status.trim().toUpperCase() as ProductStatus;
      if (['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'HIDDEN', 'DISCONTINUED'].includes(s)) {
        status = asDraft ? 'DRAFT' : s;
      }
    }

    // Images
    const explicitImgs = [raw.image1, raw.image2, raw.image3, raw.image4]
      .map((s) => (s || '').trim())
      .filter(Boolean);

    let matchedImageFiles: string[] = [];
    if (archiveFiles.length > 0) {
      matchedImageFiles = matchImagesForSku(sku, explicitImgs, archiveFiles);
    } else {
      matchedImageFiles = explicitImgs;
    }

    if (explicitImgs.length > 0 && archiveFiles.length > 0) {
      for (const fn of explicitImgs) {
        const found = archiveFiles.some((af) => af.toLowerCase().endsWith(fn.toLowerCase()));
        if (!found) {
          warnings.push(`Image file "${fn}" referenced in CSV was not found in image ZIP.`);
          missingImages.add(fn);
        }
      }
    }

    // Sourcing / Private Fields
    let sourceCostPaise: number | undefined;
    if (raw.sourceCost) {
      const { paise: scPaise } = parseInrToPaise(raw.sourceCost);
      if (scPaise > 0) sourceCostPaise = scPaise;
    }

    // Check existing SKU in database
    let existingProduct: Product | null = null;
    if (sku && errors.length === 0) {
      try {
        existingProduct = await getProductBySku(sku);
      } catch {
        // Fallback
      }
    }

    // Action determination based on Duplicate Policy
    let action: RowAction = 'CREATE';
    let valStatus: RowValidationStatus = 'VALID';

    if (errors.length > 0) {
      action = 'ERROR';
      valStatus = 'INVALID_DATA';
      errorRows++;
    } else if (existingProduct) {
      switch (policy) {
        case 'CREATE_NEW':
          // Conflict: SKU already exists in database
          action = 'ERROR';
          valStatus = 'EXISTING_SKU';
          errors.push(`SKU "${sku}" already exists in catalogue (ID: ${existingProduct.productId}).`);
          errorRows++;
          break;
        case 'UPDATE_EXISTING':
          action = 'UPDATE';
          valStatus = warnings.length > 0 ? 'WARNING' : 'VALID';
          updateCount++;
          break;
        case 'SKIP_EXISTING':
          action = 'SKIP';
          valStatus = 'EXISTING_SKU';
          warnings.push(`SKU "${sku}" exists; row will be skipped as requested.`);
          skipCount++;
          break;
        case 'FLAG_REVIEW':
          action = 'SKIP';
          valStatus = 'EXISTING_SKU';
          warnings.push(`SKU "${sku}" flagged for manual review.`);
          flagReviewCount++;
          break;
      }
    } else {
      action = 'CREATE';
      valStatus = warnings.length > 0 ? 'WARNING' : 'VALID';
      createCount++;
    }

    if (warnings.length > 0 && action !== 'ERROR') {
      warningRows++;
    }

    const row: ValidatedImportRow = {
      rowNumber: rowNum,
      sku,
      name,
      slug: (raw.slug || '').trim() || generateSlug(name, sku),
      department,
      categoryId,
      subcategoryId: (raw.subcategoryId || '').trim() || undefined,
      description: (raw.description || '').trim() || undefined,
      shortDescription: (raw.shortDescription || '').trim() || undefined,
      brand: (raw.brand || '').trim() || 'Plantrix Studio',
      sellingPriceINR: sellingPricePaise / 100,
      sellingPricePaise,
      compareAtPriceINR: compareAtPricePaise ? compareAtPricePaise / 100 : undefined,
      compareAtPricePaise,
      stock: rawStock,
      status,
      featured: raw.featured === 'true' || raw.featured === '1',
      trending: raw.trending === 'true' || raw.trending === '1',
      newArrival: raw.newArrival === 'true' || raw.newArrival === '1',
      imageKeys: existingProduct ? existingProduct.imageKeys : [],
      imageFilenames: matchedImageFiles,
      highlights: parseSemicolonList(raw.highlights),
      specifications: parseAttributesString(raw.specifications),
      careInstructions: (raw.careInstructions || '').trim() || undefined,
      shippingInfo: (raw.shippingInfo || '').trim() || undefined,
      sourceCostINR: sourceCostPaise ? sourceCostPaise / 100 : undefined,
      sourceCostPaise,
      sourceProductUrl: (raw.sourceProductUrl || '').trim() || undefined,
      supplierSku: (raw.supplierSku || '').trim() || undefined,
      internalNotes: (raw.internalNotes || '').trim() || undefined,
      action,
      validationStatus: valStatus,
      errors,
      warnings,
      existingProductId: existingProduct?.productId,
    };

    validatedRows.push(row);
  }

  return {
    totalRows: rawRows.length,
    validRows: rawRows.length - errorRows,
    errorRows,
    warningRows,
    createCount,
    updateCount,
    skipCount,
    flagReviewCount,
    rows: validatedRows,
    detectedDepartments: Array.from(detectedDepartments),
    detectedCategories: Array.from(detectedCategories),
    missingImages: Array.from(missingImages),
    duplicatePolicy: policy,
    isDryRun: false,
  };
}

/**
 * Executes confirmed bulk import in bounded chunks
 * Supports dry-run and permanent updates
 */
export async function executeImportJob(params: {
  rows: ValidatedImportRow[];
  duplicatePolicy: DuplicatePolicy;
  isDryRun: boolean;
  importAsDraftDefault: boolean;
  initiatingAdminId: string;
  fileName: string;
  fileSizeBytes?: number;
  imageBinaries?: Record<string, { buffer: Uint8Array; contentType: string }>;
}): Promise<ImportJobRecord> {
  const jobId = `job-imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const record: ImportJobRecord = {
    jobId,
    initiatingAdminId: params.initiatingAdminId || 'admin-system',
    fileName: params.fileName || 'import.csv',
    fileSizeBytes: params.fileSizeBytes || 0,
    totalRows: params.rows.length,
    processedRows: 0,
    successCount: 0,
    updatedCount: 0,
    skippedCount: 0,
    failedCount: 0,
    imageUploadCount: 0,
    status: 'PROCESSING',
    duplicatePolicy: params.duplicatePolicy,
    isDryRun: Boolean(params.isDryRun),
    importAsDraftDefault: Boolean(params.importAsDraftDefault),
    startedAt: now,
    errors: [],
    createdProductIds: [],
    updatedProductIds: [],
    uploadedR2Keys: [],
  };

  localImportJobsStore.set(jobId, record);

  // If dry-run, simulate without making database or storage writes
  if (params.isDryRun) {
    for (const row of params.rows) {
      record.processedRows++;
      if (row.action === 'CREATE') {
        record.successCount++;
        record.imageUploadCount += row.imageFilenames.length;
      } else if (row.action === 'UPDATE') {
        record.updatedCount++;
      } else if (row.action === 'SKIP') {
        record.skippedCount++;
      } else {
        record.failedCount++;
        record.errors.push({
          rowNumber: row.rowNumber,
          sku: row.sku,
          error: row.errors.join('; ') || 'Validation error',
        });
      }
    }
    record.status = 'COMPLETED';
    record.completedAt = new Date().toISOString();
    return record;
  }

  // Real execution in bounded chunks (25 rows per batch)
  const BATCH_SIZE = 25;
  for (let i = 0; i < params.rows.length; i += BATCH_SIZE) {
    const batch = params.rows.slice(i, i + BATCH_SIZE);

    for (const row of batch) {
      record.processedRows++;

      if (row.action === 'ERROR') {
        record.failedCount++;
        record.errors.push({
          rowNumber: row.rowNumber,
          sku: row.sku,
          error: row.errors.join('; ') || 'Row marked with errors',
        });
        continue;
      }

      if (row.action === 'SKIP') {
        record.skippedCount++;
        continue;
      }

      try {
        // Upload matched images to R2 if provided
        const uploadedKeys: string[] = [...row.imageKeys];
        if (params.imageBinaries && row.imageFilenames.length > 0) {
          for (const fn of row.imageFilenames) {
            const fileData = params.imageBinaries[fn];
            if (fileData) {
              const cleanFn = fn.split('/').pop() || fn;
              const r2Key = `products/${row.sku.toLowerCase()}/${Date.now()}-${cleanFn}`;
              const upResult = await uploadToR2({
                key: r2Key,
                body: fileData.buffer,
                contentType: fileData.contentType || 'image/webp',
              });
              if (upResult) {
                uploadedKeys.push(upResult.key);
                record.uploadedR2Keys.push(upResult.key);
                record.imageUploadCount++;
              }
            }
          }
        }

        const productPayload: Partial<Product> = {
          sku: row.sku,
          name: row.name,
          slug: row.slug,
          department: row.department,
          categoryId: row.categoryId,
          subcategoryId: row.subcategoryId,
          description: row.description,
          shortDescription: row.shortDescription,
          brand: row.brand,
          sellingPricePaise: row.sellingPricePaise,
          compareAtPricePaise: row.compareAtPricePaise,
          stock: row.stock,
          status: row.status,
          featured: row.featured,
          trending: row.trending,
          newArrival: row.newArrival,
          imageKeys: uploadedKeys.slice(0, 4), // Exactly up to 4 images
          highlights: row.highlights,
          specifications: row.specifications,
          careInstructions: row.careInstructions,
          shippingInfo: row.shippingInfo,
          sourceCostPaise: row.sourceCostPaise,
          sourceProductUrl: row.sourceProductUrl,
          supplierSku: row.supplierSku,
          internalNotes: row.internalNotes,
        };

        if (row.action === 'CREATE') {
          const created = await createProduct(productPayload);
          record.successCount++;
          record.createdProductIds.push(created.productId);
        } else if (row.action === 'UPDATE' && row.existingProductId) {
          const updated = await updateProduct(row.existingProductId, productPayload);
          if (updated) {
            record.updatedCount++;
            record.updatedProductIds.push(updated.productId);
          } else {
            record.failedCount++;
            record.errors.push({
              rowNumber: row.rowNumber,
              sku: row.sku,
              error: `Failed to update product ${row.existingProductId}`,
            });
          }
        }
      } catch (err: any) {
        record.failedCount++;
        record.errors.push({
          rowNumber: row.rowNumber,
          sku: row.sku,
          error: err?.message || 'Database write error',
        });
      }
    }
  }

  record.status = record.failedCount === params.rows.length ? 'FAILED' : 'COMPLETED';
  record.completedAt = new Date().toISOString();

  try {
    await setFirestoreDoc(IMPORT_JOBS_COLLECTION, jobId, record);
  } catch {
    // Keep local memory store
  }

  return record;
}

/**
 * Returns recent import jobs history
 */
export async function getImportJobs(limit: number = 20): Promise<ImportJobRecord[]> {
  try {
    const { documents } = await queryFirestoreCollection<ImportJobRecord>(
      IMPORT_JOBS_COLLECTION,
      { pageSize: limit }
    );
    if (documents.length > 0) return documents;
  } catch {
    // Fallback
  }
  return Array.from(localImportJobsStore.values())
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
}

/**
 * Returns a specific import job by ID
 */
export async function getImportJobById(jobId: string): Promise<ImportJobRecord | null> {
  try {
    const doc = await getFirestoreDoc<ImportJobRecord>(IMPORT_JOBS_COLLECTION, jobId);
    if (doc) return doc;
  } catch {
    // Fallback
  }
  return localImportJobsStore.get(jobId) || null;
}
