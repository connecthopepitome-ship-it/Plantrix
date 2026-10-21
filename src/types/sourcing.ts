/**
 * Plantrix Botanics — Sourcing Data Definitions & Commercial Boundary
 * Complies with Section 7, 8, and 12 of MEESHO PRODUCT SOURCING SPECIFICATION
 */

import { Department } from './category';

export type SourcePlatform = 'MEESHO' | 'OTHER';

export type SourceAvailability = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';

export type VerificationStatus = 'VERIFIED' | 'STALE' | 'UNVERIFIED' | 'FAILED';

export type RetrievalMethod = 'API' | 'URL_PARSER' | 'MANUAL_ENTRY' | 'ADMIN_ASSISTED';

export type ImportStatus = 'SAVED' | 'IMPORTED' | 'REJECTED' | 'ARCHIVED';

export type DataProvenance = 'extracted' | 'manual' | 'normalized' | 'estimated' | 'unavailable';

export interface SourceVariant {
  variantId: string;
  name: string;
  pricePaise: number;
  attributes: Record<string, string>;
  inStock: boolean;
  sourceSku?: string;
}

/**
 * FULL INTERNAL SOURCE PRODUCT RECORD
 * Strictly private: Never exposed to customer storefront bundles.
 */
export interface SourceProduct {
  sourceRecordId: string;
  sourcePlatform: SourcePlatform;
  sourceUrl: string;
  normalizedSourceUrl: string;
  sourceProductId: string;
  sourceSellerName?: string;
  sourceSku?: string;
  sourceTitle: string;
  sourceDescription?: string;
  sourceDepartment: Department;
  sourceCategory: string;
  sourceSubcategory?: string;
  sourceAttributes: Record<string, string | number | boolean>;
  sourceImages: string[];
  sourceVariants?: SourceVariant[];
  
  // Pricing & Commercials
  sourcePricePaise: number; // Integer paise
  previousSourcePricePaise?: number; // Previous observation
  sourceShippingCostPaise?: number;
  sourceDiscountPercent?: number;
  sourceAvailability: SourceAvailability;
  
  // Ratings & Provenance
  sourceRating?: number;
  sourceReviewCount?: number;
  sourceCountryOfOrigin?: string;
  sourceWarranty?: string;
  
  lastCheckedAt: string;
  verificationStatus: VerificationStatus;
  retrievalMethod: RetrievalMethod;
  retrievalError?: string;
  
  // Plantrix Commercials & Link
  linkedProductId?: string;
  targetSellingPricePaise?: number;
  targetCompareAtPricePaise?: number;
  estimatedGrossMarginPercent?: number;
  importStatus: ImportStatus;
  internalNotes?: string;
  
  // Provenance metadata tracking per field
  provenance: Record<string, DataProvenance>;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Category-aware dynamic attribute configuration
 */
export interface CategoryAttribute {
  attributeKey: string;
  displayName: string;
  dataType: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect';
  unit?: string;
  options?: string[];
  departmentId: Department;
  categoryId: string;
  isRequired: boolean;
  isFilterable: boolean;
  isStorefrontVisible: boolean;
  isSearchable: boolean;
  isSeoMetadata: boolean;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  sourceMappings?: Array<{
    sourcePlatform: SourcePlatform;
    sourceAttributeKey: string;
    transformRule?: string;
  }>;
}

/**
 * Historical record of price and availability observations
 */
export interface SourcePriceHistory {
  historyId: string;
  sourceRecordId: string;
  observedPricePaise: number;
  previousPricePaise?: number;
  observedAvailability: SourceAvailability;
  observedAt: string;
  verificationStatus: VerificationStatus;
  retrievalMethod: RetrievalMethod;
  priceDeltaPaise?: number;
  note?: string;
}

/**
 * Audit ledger for batch / URL imports
 */
export interface ImportJob {
  jobId: string;
  sourceUrl: string;
  status: 'PENDING' | 'PARSED' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  completedAt?: string;
  importedFields: string[];
  missingFields: string[];
  errors: string[];
  linkedProductId?: string;
  sourceRecordId?: string;
  createdBy: string;
}

/**
 * Attribute Mapping Rule (Source -> Canonical Plantrix)
 */
export interface AttributeMappingRule {
  id: string;
  sourcePlatform: SourcePlatform;
  sourceAttributeKey: string;
  targetAttributeKey: string;
  departmentId: Department;
  categoryId?: string;
  transformRule?: 'DIRECT' | 'EXTRACT_NUMBER' | 'APPEND_UNIT' | 'LOWERCASE';
  targetUnit?: string;
  notes?: string;
}

/**
 * Pricing & Margin Calculator Inputs
 */
export interface PricingCalculatorInputs {
  sourceCostPaise: number;
  sourceShippingCostPaise?: number;
  otherSourcingCostPaise?: number;
  packagingCostPaise?: number;
  paymentGatewayPercent?: number; // e.g. 2%
  sellingPricePaise: number;
  targetGrossMarginPercent?: number;
}

export interface PricingCalculationResult {
  totalKnownCostPaise: number;
  suggestedSellingPricePaise: number;
  estimatedGrossProfitPaise: number;
  grossMarginPercent: number;
  markupPercent: number;
  differenceFromSourcePaise: number;
  hasWarning: boolean;
  warningMessage?: string;
}

/**
 * Pure function: Calculate commercial margins compliant with Section 8
 * Gross margin % = (Selling price − total included cost) / Selling price × 100
 */
export function calculateCommercialPricing(inputs: PricingCalculatorInputs): PricingCalculationResult {
  const {
    sourceCostPaise = 0,
    sourceShippingCostPaise = 0,
    otherSourcingCostPaise = 0,
    packagingCostPaise = 3000, // Default ₹30 for transit box
    paymentGatewayPercent = 2.0, // Razorpay standard
    sellingPricePaise = 0,
    targetGrossMarginPercent = 45, // Target 45% gross margin
  } = inputs;

  const paymentFeePaise = sellingPricePaise > 0 
    ? Math.round((sellingPricePaise * paymentGatewayPercent) / 100) 
    : 0;

  const directCostPaise = sourceCostPaise + sourceShippingCostPaise + otherSourcingCostPaise + packagingCostPaise;
  const totalKnownCostPaise = directCostPaise + paymentFeePaise;

  // Formula for target selling price with margin M%: SP = directCost / (1 - (M + gateway)/100)
  const marginDenominator = 1 - (targetGrossMarginPercent + paymentGatewayPercent) / 100;
  const suggestedSellingPricePaise = marginDenominator > 0
    ? Math.round(directCostPaise / marginDenominator)
    : Math.round(directCostPaise * 1.8);

  const estimatedGrossProfitPaise = sellingPricePaise - totalKnownCostPaise;
  const grossMarginPercent = sellingPricePaise > 0
    ? Math.round(((sellingPricePaise - totalKnownCostPaise) / sellingPricePaise) * 1000) / 10
    : 0;

  const markupPercent = totalKnownCostPaise > 0
    ? Math.round(((sellingPricePaise - totalKnownCostPaise) / totalKnownCostPaise) * 1000) / 10
    : 0;

  const differenceFromSourcePaise = sellingPricePaise - sourceCostPaise;

  let hasWarning = false;
  let warningMessage: string | undefined;

  if (sellingPricePaise <= 0) {
    hasWarning = true;
    warningMessage = 'Enter a valid selling price in INR';
  } else if (grossMarginPercent < 0) {
    hasWarning = true;
    warningMessage = 'CRITICAL: Selling price is below total fulfillment cost (Negative Margin)';
  } else if (grossMarginPercent < 25) {
    hasWarning = true;
    warningMessage = 'Low Margin Warning: Gross margin is below 25% threshold';
  }

  return {
    totalKnownCostPaise,
    suggestedSellingPricePaise,
    estimatedGrossProfitPaise,
    grossMarginPercent,
    markupPercent,
    differenceFromSourcePaise,
    hasWarning,
    warningMessage,
  };
}
