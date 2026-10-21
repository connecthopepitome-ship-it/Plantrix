'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  DownloadCloud,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Calculator,
  Eye,
  Trash2,
  Star,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Department, DEPARTMENTS } from '@/types/category';
import {
  SourceProduct,
  calculateCommercialPricing,
  PricingCalculatorInputs,
} from '@/types/sourcing';
import {
  findDuplicateSourceProduct,
  saveSourceProductDraft,
  approveAndImportToCatalogue,
  createImportJob,
  getTaxonomy,
} from '@/data/sourcingStore';
import { formatPaiseToINR } from '@/types/product';

interface MeeshoImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedRecord: SourceProduct) => void;
  initialUrl?: string;
}

export default function MeeshoImportModal({
  isOpen,
  onClose,
  onSuccess,
  initialUrl = '',
}: MeeshoImportModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [department, setDepartment] = useState<Department>('GARDEN_OUTDOOR');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [targetMargin, setTargetMargin] = useState(48); // 48% target gross margin
  const [internalNotes, setInternalNotes] = useState('');

  // Sourcing & Extraction State
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [existingRecord, setExistingRecord] = useState<SourceProduct | null>(null);

  // Review & Editable Fields
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourcePriceRupees, setSourcePriceRupees] = useState<number>(0);
  const [sellingPriceRupees, setSellingPriceRupees] = useState<number>(0);
  const [compareAtPriceRupees, setCompareAtPriceRupees] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [primaryImageIdx, setPrimaryImageIdx] = useState(0);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'MEDIA' | 'PRICING' | 'ATTRIBUTES'>('DETAILS');

  const taxonomy = getTaxonomy();
  const departmentCategories = taxonomy.filter((t) => t.departmentId === department);

  useEffect(() => {
    if (departmentCategories.length > 0 && !categoryId) {
      setCategoryId(departmentCategories[0].id);
      if (departmentCategories[0].subcategories?.length > 0) {
        setSubcategoryId(departmentCategories[0].subcategories[0].id);
      }
    }
  }, [department, departmentCategories, categoryId]);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      checkDuplicate(initialUrl);
    }
  }, [initialUrl]);

  const checkDuplicate = (checkUrl: string) => {
    if (!checkUrl) {
      setDuplicateWarning(null);
      setExistingRecord(null);
      return;
    }
    const dup = findDuplicateSourceProduct(checkUrl);
    if (dup.isDuplicate && dup.existingProduct) {
      setDuplicateWarning(`Potential Duplicate Detected: ${dup.matchReason}`);
      setExistingRecord(dup.existingProduct);
    } else {
      setDuplicateWarning(null);
      setExistingRecord(null);
    }
  };

  const handleUrlChange = (val: string) => {
    setUrl(val);
    checkDuplicate(val);
  };

  // Perform Fetch & Parse
  const handleFetch = async () => {
    if (!url.trim()) {
      setFetchError('Please enter a valid Meesho product URL');
      return;
    }
    setIsFetching(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/admin/sourcing/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          targetDepartment: department,
          targetCategory: categoryId,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to extract product details from URL');
      }

      const d = json.data;
      setExtractedData(d);
      setTitle(d.sourceTitle || '');
      setDescription(d.sourceDescription || '');
      const costRupees = (d.sourcePricePaise || 29900) / 100;
      setSourcePriceRupees(costRupees);

      const spRupees = (d.suggestedSellingPricePaise || 69900) / 100;
      setSellingPriceRupees(spRupees);
      setCompareAtPriceRupees((d.suggestedCompareAtPricePaise || 99900) / 100);

      setImages(d.sourceImages || []);
      setAttributes(d.sourceAttributes || {});
    } catch (err: any) {
      setFetchError(err.message || 'Error occurred while contacting extraction service');
    } finally {
      setIsFetching(false);
    }
  };

  // Live Margin Calculation
  const costPaise = Math.round(sourcePriceRupees * 100);
  const spPaise = Math.round(sellingPriceRupees * 100);
  const commercialResult = calculateCommercialPricing({
    sourceCostPaise: costPaise,
    packagingCostPaise: 3000,
    sellingPricePaise: spPaise,
    targetGrossMarginPercent: targetMargin,
  });

  const handleApplySuggestedPrice = () => {
    const sug = commercialResult.suggestedSellingPricePaise / 100;
    setSellingPriceRupees(sug);
    setCompareAtPriceRupees(Math.round(sug * 1.3));
  };

  // Actions
  const handleSaveDraft = (approveNow = false) => {
    if (!title.trim()) {
      alert('Product title is required');
      return;
    }

    const reorderedImages = [...images];
    if (primaryImageIdx > 0 && primaryImageIdx < reorderedImages.length) {
      const prim = reorderedImages.splice(primaryImageIdx, 1)[0];
      reorderedImages.unshift(prim);
    }

    const record = saveSourceProductDraft({
      sourceRecordId: existingRecord?.sourceRecordId,
      sourcePlatform: 'MEESHO',
      sourceUrl: url.trim(),
      sourceProductId: extractedData?.sourceProductId || `msh-${Date.now().toString().slice(-6)}`,
      sourceTitle: title.trim(),
      sourceDescription: description.trim(),
      sourceDepartment: department,
      sourceCategory: categoryId,
      sourceSubcategory: subcategoryId,
      sourceImages: reorderedImages,
      sourcePricePaise: costPaise,
      sourceAvailability: 'IN_STOCK',
      sourceAttributes: attributes,
      targetSellingPricePaise: spPaise,
      targetCompareAtPricePaise: Math.round(compareAtPriceRupees * 100),
      importStatus: approveNow ? 'IMPORTED' : 'SAVED',
      internalNotes: internalNotes.trim(),
      provenance: extractedData?.provenance || {
        sourceTitle: 'extracted',
        sourcePricePaise: 'extracted',
        targetSellingPricePaise: 'estimated',
      },
    });

    createImportJob({
      sourceUrl: url.trim(),
      status: 'COMPLETED',
      importedFields: ['title', 'price', 'images', 'attributes'],
      missingFields: extractedData?.missingFields || [],
      errors: [],
      sourceRecordId: record.sourceRecordId,
      createdBy: 'Operations Lead',
    });

    if (approveNow) {
      approveAndImportToCatalogue(record.sourceRecordId, {
        name: title.trim(),
        sellingPricePaise: spPaise,
        compareAtPricePaise: Math.round(compareAtPriceRupees * 100),
      });
    }

    onSuccess(record);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-container-low border border-outline-variant/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container/40 border border-secondary/30 flex items-center justify-center text-secondary">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-on-surface">
                Import Product from Meesho URL
              </h2>
              <p className="font-label-sm text-xs text-outline">
                Workflow B — Multi-field metadata extraction, commercial pricing & canonical mapping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Step 1: Input URL and Canonical Target */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/30">
            <div className="md:col-span-12">
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1.5 font-bold">
                Meesho Product URL <span className="text-secondary">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.meesho.com/s/p/4xyz1 or product URL..."
                  className="flex-1 bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-all"
                />
                <button
                  type="button"
                  onClick={handleFetch}
                  disabled={isFetching || !url.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold hover:shadow-lime-glow disabled:opacity-50 transition-all shrink-0"
                >
                  {isFetching ? (
                    <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{isFetching ? 'Parsing...' : 'Fetch & Parse'}</span>
                </button>
              </div>
            </div>

            {/* Target Department */}
            <div className="md:col-span-4">
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1.5 font-bold">
                Target Department <span className="text-secondary">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                <option value="GARDEN_OUTDOOR">Garden & Outdoor</option>
                <option value="KITCHEN_TOOLS">Kitchen Tools & Utilities</option>
                <option value="HOME_ESSENTIALS">Home & Everyday Essentials</option>
                <option value="CLEANING_IMPROVEMENT">Cleaning & Improvement</option>
                <option value="STORAGE_ORGANIZATION">Storage & Organization</option>
                <option value="TOOLS_HARDWARE">Tools & Hardware</option>
              </select>
            </div>

            {/* Target Category */}
            <div className="md:col-span-4">
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1.5 font-bold">
                Target Category <span className="text-secondary">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  const cat = departmentCategories.find((c) => c.id === e.target.value);
                  if (cat?.subcategories?.[0]) setSubcategoryId(cat.subcategories[0].id);
                }}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                {departmentCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Subcategory */}
            <div className="md:col-span-4">
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1.5 font-bold">
                Target Subcategory
              </label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                {departmentCategories
                  .find((c) => c.id === categoryId)
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Duplicate Detection Alert Banner */}
          {duplicateWarning && (
            <div className="p-3.5 rounded-xl bg-error/15 border border-error/40 flex items-start justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div>
                  <span className="font-display font-bold text-xs text-error block">
                    {duplicateWarning}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {existingRecord?.sourceTitle} — Status: {existingRecord?.importStatus}
                  </span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-error/20 text-error font-bold">
                Duplicate Guard
              </span>
            </div>
          )}

          {fetchError && (
            <div className="p-3.5 rounded-xl bg-error/15 border border-error/40 text-xs text-error flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {/* Step 2: Review Workspace (Shown when data extracted or manual fallback) */}
          {(extractedData || title) && (
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex border-b border-outline-variant/30 gap-2">
                {[
                  { id: 'DETAILS', label: '1. Basic Info' },
                  { id: 'MEDIA', label: `2. Media (${images.length})` },
                  { id: 'PRICING', label: '3. Margin & Pricing' },
                  { id: 'ATTRIBUTES', label: '4. Attributes' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 text-xs font-label-md uppercase tracking-wider font-semibold border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-secondary text-secondary font-bold'
                        : 'border-transparent text-outline hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content: Details */}
              {activeTab === 'DETAILS' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1 font-bold">
                      Extracted / Sanitized Product Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1 font-bold">
                      Source Product Description
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-secondary custom-scrollbar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1 font-bold">
                      Internal Administrator Notes (Private)
                    </label>
                    <input
                      type="text"
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="e.g. Verified supplier return rate < 2%, packaging requires secondary bubble wrap"
                      className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              )}

              {/* Tab Content: Media Gallery */}
              {activeTab === 'MEDIA' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-xs text-outline font-label-sm">
                    Select primary image, reorder, or remove non-compliant supplier assets before saving.
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border p-1 group ${
                          primaryImageIdx === idx
                            ? 'border-secondary ring-2 ring-secondary/30 bg-secondary/10'
                            : 'border-outline-variant/40 bg-surface-container'
                        }`}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-surface-container-high">
                          <Image
                            src={imgUrl}
                            alt={`Preview ${idx}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIdx(idx)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded font-label-sm ${
                              primaryImageIdx === idx
                                ? 'bg-secondary text-on-secondary font-bold'
                                : 'text-outline hover:text-secondary'
                            }`}
                          >
                            <Star className="w-3 h-3" />
                            <span>{primaryImageIdx === idx ? 'Primary' : 'Set Main'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="text-error/80 hover:text-error p-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Pricing & Commercial Calculator */}
              {activeTab === 'PRICING' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container/40 p-4 rounded-xl border border-outline-variant/30">
                    <div>
                      <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                        Source Cost (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={sourcePriceRupees}
                        onChange={(e) => setSourcePriceRupees(parseFloat(e.target.value) || 0)}
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                        Plantrix Selling Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={sellingPriceRupees}
                        onChange={(e) => setSellingPriceRupees(parseFloat(e.target.value) || 0)}
                        className="w-full bg-surface-container border border-secondary/40 rounded-xl px-3 py-2 text-xs font-mono font-bold text-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                        Compare-At MRP (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={compareAtPriceRupees}
                        onChange={(e) => setCompareAtPriceRupees(parseFloat(e.target.value) || 0)}
                        className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-mono text-on-surface"
                      />
                    </div>
                  </div>

                  {/* Calculator Ledger */}
                  <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-secondary" />
                        <span className="font-display font-bold text-xs uppercase tracking-wider text-on-surface">
                          Commercial Margin Ledger (Complies with Section 8)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplySuggestedPrice}
                        className="text-[11px] font-label-sm text-secondary hover:underline font-bold"
                      >
                        Auto-Apply Target Margin ({targetMargin}%)
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-outline text-[10px] uppercase block">Total Direct Cost</span>
                        <span className="font-mono font-semibold text-on-surface">
                          {formatPaiseToINR(commercialResult.totalKnownCostPaise)}
                        </span>
                        <span className="text-[10px] text-outline block">(Cost + ₹30 Box + 2% GW)</span>
                      </div>
                      <div>
                        <span className="text-outline text-[10px] uppercase block">Suggested Price</span>
                        <span className="font-mono font-bold text-secondary">
                          {formatPaiseToINR(commercialResult.suggestedSellingPricePaise)}
                        </span>
                      </div>
                      <div>
                        <span className="text-outline text-[10px] uppercase block">Gross Profit</span>
                        <span className="font-mono font-bold text-primary">
                          {formatPaiseToINR(commercialResult.estimatedGrossProfitPaise)}
                        </span>
                      </div>
                      <div>
                        <span className="text-outline text-[10px] uppercase block">Gross Margin %</span>
                        <span
                          className={`font-mono font-bold text-sm ${
                            commercialResult.grossMarginPercent < 25
                              ? 'text-error'
                              : 'text-secondary'
                          }`}
                        >
                          {commercialResult.grossMarginPercent}%
                        </span>
                      </div>
                    </div>

                    {commercialResult.hasWarning && (
                      <div className="p-2.5 rounded-lg bg-error/15 text-error text-[11px] flex items-center gap-2 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{commercialResult.warningMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Content: Attributes */}
              {activeTab === 'ATTRIBUTES' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-xs text-outline font-label-sm">
                    Extracted source attributes mapped to Plantrix metadata schema.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(attributes).map(([key, val]) => (
                      <div key={key} className="bg-surface-container p-3 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-outline block font-mono">
                            {key}
                          </span>
                          <span className="text-xs font-semibold text-on-surface">
                            {String(val)}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary-container/40 text-secondary">
                          Extracted
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-outline-variant/30 bg-surface-container/60 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveDraft(false)}
              disabled={!title.trim()}
              className="px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface hover:border-secondary text-xs font-label-md uppercase tracking-wider font-semibold disabled:opacity-50 transition-all"
            >
              Save as Draft Record
            </button>
            <button
              type="button"
              onClick={() => handleSaveDraft(true)}
              disabled={!title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-label-md uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg disabled:opacity-50 transition-all"
            >
              <span>Approve & Publish to Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
