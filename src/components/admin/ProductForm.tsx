'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { Product, ProductStatus } from '@/types/product';
import { saveAdminProduct } from '@/data/adminStore';

interface ProductFormProps {
  initialProduct?: Product;
  isEditMode?: boolean;
}

export function ProductForm({ initialProduct, isEditMode = false }: ProductFormProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'pricing' | 'inventory' | 'specs' | 'seo'>('basic');

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [brand, setBrand] = useState(initialProduct?.brand || 'Plantrix Studio');
  const [department, setDepartment] = useState<'PLANTS_BOTANICS' | 'HOME_ESSENTIALS'>(
    initialProduct?.department || 'PLANTS_BOTANICS'
  );
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || 'pots-planters');
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || '');
  const [description, setDescription] = useState(initialProduct?.description || '');

  // Media
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialProduct?.imageKeys && initialProduct.imageKeys.length > 0
      ? initialProduct.imageKeys
      : ['https://lh3.googleusercontent.com/aida-public/AB6AXuChZEoXATYlvmGWZelVPp1BnGn2Kn0uXCb_4z0RZJ7UNgfEC5HA3Mw0QyqXAloqIvG3BTw1vw_gKL6mGvS47C79fqIUWdjJxB3PAKnzDvSSzI1RptTaRDvpfOrhk7wQQjmq1X3DbkUkfIPtuXurRODwYZsQxszHjLf0Gg6NebTdxL8mj3tHuRlN2NZpqIkkuthFvnx5jgMTAJZ-tjqb2dUUL-Rjqkh1ODNTBVyYgRp4nUOltgbA5KtG']
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Pricing (in Rupees for UI, converted to Paise on save)
  const [sellingPriceINR, setSellingPriceINR] = useState<number>(
    initialProduct ? initialProduct.sellingPricePaise / 100 : 1899
  );
  const [compareAtPriceINR, setCompareAtPriceINR] = useState<number>(
    initialProduct?.compareAtPricePaise ? initialProduct.compareAtPricePaise / 100 : 2499
  );
  const [sourceCostINR, setSourceCostINR] = useState<number>(
    initialProduct?.sourceCostPaise ? initialProduct.sourceCostPaise / 100 : 900
  );
  const [sourceProductUrl, setSourceProductUrl] = useState(initialProduct?.sourceProductUrl || '');
  const [internalNotes, setInternalNotes] = useState(initialProduct?.internalNotes || '');

  // Inventory
  const [sku, setSku] = useState(initialProduct?.sku || `PLX-${Math.floor(100 + Math.random() * 900)}`);
  const [stock, setStock] = useState<number>(initialProduct?.stock ?? 12);
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'ACTIVE');

  // Specs
  const [lengthCm, setLengthCm] = useState(initialProduct?.dimensions?.length || 20);
  const [widthCm, setWidthCm] = useState(initialProduct?.dimensions?.width || 20);
  const [heightCm, setHeightCm] = useState(initialProduct?.dimensions?.height || 22);
  const [weightGrams, setWeightGrams] = useState(initialProduct?.weightGrams || 1400);
  const [careInstructions, setCareInstructions] = useState(initialProduct?.careInstructions || '');
  const [shippingInfo, setShippingInfo] = useState(initialProduct?.shippingInfo || 'Transit-safe packaging');

  // Merchandising
  const [featured, setFeatured] = useState(initialProduct?.featured ?? true);
  const [trending, setTrending] = useState(initialProduct?.trending ?? false);
  const [newArrival, setNewArrival] = useState(initialProduct?.newArrival ?? false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Live profit margin calculation
  const grossProfitINR = sellingPriceINR - sourceCostINR;
  const marginPercent = sellingPriceINR > 0 ? Math.round((grossProfitINR / sellingPriceINR) * 100) : 0;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditMode) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && newImageUrl.startsWith('http')) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    saveAdminProduct({
      productId: initialProduct?.productId,
      name,
      slug,
      brand,
      department,
      categoryId,
      shortDescription,
      description,
      imageKeys: imageUrls,
      sellingPricePaise: Math.round(sellingPriceINR * 100),
      compareAtPricePaise: compareAtPriceINR > 0 ? Math.round(compareAtPriceINR * 100) : undefined,
      sourceCostPaise: Math.round(sourceCostINR * 100),
      sourceProductUrl,
      internalNotes,
      sku,
      stock,
      status,
      dimensions: {
        length: lengthCm,
        width: widthCm,
        height: heightCm,
        unit: 'cm',
      },
      weightGrams,
      careInstructions,
      shippingInfo,
      featured,
      trending,
      newArrival,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/admin/catalogue');
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/catalogue"
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Back to catalogue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
              {isEditMode ? 'Catalogue Editor' : 'New Product Registration'}
            </span>
            <h1 className="font-display font-bold text-2xl text-on-surface mt-0.5">
              {name || 'Untitled Artifact'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/catalogue"
            className="px-4 py-2 rounded-full border border-outline-variant/40 text-xs font-label-sm uppercase font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'Update Product' : 'Save & Publish'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-outline-variant/20 pb-2 scrollbar-none text-xs font-label-sm uppercase tracking-wider">
        {[
          { id: 'basic', label: '1. Basic Info' },
          { id: 'media', label: '2. Media & Preview' },
          { id: 'pricing', label: '3. Pricing & Private Margin' },
          { id: 'inventory', label: '4. Inventory & SKU' },
          { id: 'specs', label: '5. Specifications' },
          { id: 'seo', label: '6. Merchandising' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap font-semibold ${
              activeTab === tab.id
                ? 'bg-secondary text-on-secondary shadow-lime-glow'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Basic Info */}
      {activeTab === 'basic' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Sculptural Ribbed Fluted Planter"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs font-mono text-secondary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Primary Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
              >
                <option value="PLANTS_BOTANICS">Department 01: Plants &amp; Botanics</option>
                <option value="HOME_ESSENTIALS">Department 02: Home &amp; Everyday Essentials</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Category Identifier
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
              >
                <option value="pots-planters">Ceramic Pots &amp; Planters</option>
                <option value="indoor-plants">Indoor Live Plants</option>
                <option value="plant-stands">Plant Stands &amp; Wall Sconces</option>
                <option value="gardening-tools">Watering &amp; Mist Vessels</option>
                <option value="pantry-storage">Pantry Modular Storage</option>
                <option value="kitchen-utilities">Kitchen Utilities &amp; Dividers</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Short Catchphrase / Summary
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief single-line summary for cards and search indexes"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Full Description &amp; Architectural Craft
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed copy regarding clay formulations, drainage reservoirs, or domestic pantry organization..."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-4 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Media */}
      {activeTab === 'media' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-base text-on-surface">Cloudflare R2 Product Imagery</h3>
            <p className="text-xs text-outline">
              Store image object keys or verified delivery URLs. Image binaries are delivered via the configured edge CDN.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="flex-1 bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-5 py-2 rounded-xl bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface font-label-sm text-xs font-bold uppercase transition-colors"
            >
              Add URL
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 group"
              >
                <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                <div className="absolute top-2 left-2 z-10">
                  {idx === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[9px] font-bold uppercase">
                      Primary
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-error-container/80 text-on-error-container hover:bg-error hover:text-on-error transition-colors z-10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Pricing & Private Margins */}
      {activeTab === 'pricing' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="p-4 rounded-2xl bg-secondary-container/20 border border-secondary/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-secondary uppercase font-label-sm block">
                Strict Security Boundary Enforced
              </span>
              <p className="text-on-surface-variant mt-0.5">
                Source cost, supplier SKU, and supplier URL are strictly server-side private attributes.
                They are scrubbed before any public client response.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Selling Price (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display font-bold text-secondary text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={1}
                  value={sellingPriceINR}
                  onChange={(e) => setSellingPriceINR(Number(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl pl-8 pr-4 py-2.5 font-display font-bold text-base text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Compare-At Price / MRP (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-outline text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  value={compareAtPriceINR}
                  onChange={(e) => setCompareAtPriceINR(Number(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl pl-8 pr-4 py-2.5 font-display text-sm text-outline focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-secondary mb-1.5 font-bold">
                Private Source Cost (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-secondary text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={0}
                  value={sourceCostINR}
                  onChange={(e) => setSourceCostINR(Number(e.target.value))}
                  className="w-full bg-surface-container border border-secondary/40 rounded-xl pl-8 pr-4 py-2.5 font-display text-sm text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          {/* Live Profit & Margin Indicator */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="font-label-sm text-[10px] text-outline uppercase block">Selling Value</span>
              <span className="font-display font-bold text-base text-on-surface">
                ₹{sellingPriceINR.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-outline uppercase block">Wholesale Sourcing</span>
              <span className="font-display font-bold text-base text-outline">
                ₹{sourceCostINR.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-outline uppercase block">Gross Margin Spread</span>
              <span className="font-display font-bold text-base text-secondary">
                ₹{grossProfitINR.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-outline uppercase block">Profit Percentage</span>
              <span className="font-display font-bold text-base text-secondary">
                {marginPercent}% Gross
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Private Supplier Sourcing URL (Internal Only)
              </label>
              <input
                type="url"
                value={sourceProductUrl}
                onChange={(e) => setSourceProductUrl(e.target.value)}
                placeholder="https://artisan-ceramic-foundry.com/sku/409"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs font-mono text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Internal Operational Notes
              </label>
              <input
                type="text"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="e.g. Lead time 4 days from Mysore pottery cluster."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Inventory & SKU */}
      {activeTab === 'inventory' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Internal SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs font-mono text-secondary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Available Stock Count *
              </label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-sm font-display font-bold text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Publication Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
              >
                <option value="ACTIVE">ACTIVE (Published on Storefront)</option>
                <option value="DRAFT">DRAFT (Internal Review)</option>
                <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                <option value="HIDDEN">HIDDEN</option>
                <option value="DISCONTINUED">DISCONTINUED</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Specifications & Shipping */}
      {activeTab === 'specs' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <h3 className="font-display font-bold text-base text-on-surface">Dimensions &amp; Transit Weights</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-label-sm uppercase text-outline mb-1">Length (cm)</label>
              <input
                type="number"
                value={lengthCm}
                onChange={(e) => setLengthCm(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block text-[11px] font-label-sm uppercase text-outline mb-1">Width (cm)</label>
              <input
                type="number"
                value={widthCm}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block text-[11px] font-label-sm uppercase text-outline mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block text-[11px] font-label-sm uppercase text-outline mb-1">Weight (Grams)</label>
              <input
                type="number"
                value={weightGrams}
                onChange={(e) => setWeightGrams(Number(e.target.value))}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Care / Cleaning Instructions
              </label>
              <textarea
                rows={3}
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                placeholder="e.g. Wipe exterior ceramic with lukewarm cloth. Water live roots twice weekly."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Packaging &amp; Safe Transit Guidelines
              </label>
              <textarea
                rows={3}
                value={shippingInfo}
                onChange={(e) => setShippingInfo(e.target.value)}
                placeholder="e.g. Transit-safe double corrugated wall with biodegradable pulp insert."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs text-on-surface"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Merchandising & SEO */}
      {activeTab === 'seo' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <h3 className="font-display font-bold text-base text-on-surface">Storefront Promotion Toggles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-secondary rounded"
              />
              <div>
                <span className="font-display font-semibold text-xs text-on-surface block">Featured Product</span>
                <span className="text-[10px] text-outline">Showcase on homepage spotlight</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 cursor-pointer">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                className="w-4 h-4 accent-secondary rounded"
              />
              <div>
                <span className="font-display font-semibold text-xs text-on-surface block">Trending Specimen</span>
                <span className="text-[10px] text-outline">High-velocity customer demand</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/30 cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="w-4 h-4 accent-secondary rounded"
              />
              <div>
                <span className="font-display font-semibold text-xs text-on-surface block">New Seasonal Arrival</span>
                <span className="text-[10px] text-outline">Badge as new batch arrival</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </form>
  );
}
