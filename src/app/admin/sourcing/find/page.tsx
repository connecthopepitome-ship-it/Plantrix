'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  DownloadCloud,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronDown,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Department } from '@/types/category';
import { SourceProduct } from '@/types/sourcing';
import { getSourceProducts, saveSourceProductDraft, approveAndImportToCatalogue } from '@/data/sourcingStore';
import { formatPaiseToINR } from '@/types/product';
import { getTaxonomy } from '@/data/sourcingStore';
import MeeshoImportModal from '@/components/admin/MeeshoImportModal';

export default function FindProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'margin'>('relevance');

  // Dynamic Category-Specific Filter Attributes
  const [selectedMaterial, setSelectedMaterial] = useState<string>('ALL');
  const [selectedFeature, setSelectedFeature] = useState<string>('ALL'); // Drainage, Dishwasher, Foldable

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [modalInitialUrl, setModalInitialUrl] = useState('');

  const [products, setProducts] = useState<SourceProduct[]>(getSourceProducts());
  const taxonomy = getTaxonomy();

  const handleOpenImportWithUrl = (url: string) => {
    setModalInitialUrl(url);
    setIsImportModalOpen(true);
  };

  const handleSaveShortlist = (product: SourceProduct) => {
    product.importStatus = 'SAVED';
    saveSourceProductDraft(product);
    setProducts(getSourceProducts());
  };

  const handleApproveImport = (id: string) => {
    approveAndImportToCatalogue(id);
    setProducts(getSourceProducts());
  };

  // Filtered & Sorted Records
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.sourceTitle.toLowerCase().includes(q);
        const matchesSku = p.sourceProductId.toLowerCase().includes(q);
        const matchesCat = p.sourceCategory.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSku && !matchesCat) return false;
      }

      // Department
      if (selectedDepartment !== 'ALL' && p.sourceDepartment !== selectedDepartment) {
        return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && p.sourceCategory !== selectedCategory) {
        return false;
      }

      // Price Range (Rupees)
      const costRupees = p.sourcePricePaise / 100;
      if (costRupees < minPrice || costRupees > maxPrice) return false;

      // Rating
      if ((p.sourceRating || 0) < minRating) return false;

      // In stock
      if (inStockOnly && p.sourceAvailability === 'OUT_OF_STOCK') return false;

      // Dynamic Material Filter
      if (selectedMaterial !== 'ALL') {
        const mat = String(p.sourceAttributes?.Material || '').toLowerCase();
        if (!mat.includes(selectedMaterial.toLowerCase())) return false;
      }

      // Dynamic Feature Filter
      if (selectedFeature !== 'ALL') {
        if (selectedFeature === 'drainage' && !p.sourceAttributes?.Drainage) return false;
        if (selectedFeature === 'dishwasher' && !p.sourceAttributes?.DishwasherSafe) return false;
        if (selectedFeature === 'foldable' && !p.sourceAttributes?.Foldable) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.sourcePricePaise - b.sourcePricePaise;
      if (sortBy === 'price_desc') return b.sourcePricePaise - a.sourcePricePaise;
      if (sortBy === 'rating') return (b.sourceRating || 0) - (a.sourceRating || 0);
      if (sortBy === 'margin') return (b.estimatedGrossMarginPercent || 0) - (a.estimatedGrossMarginPercent || 0);
      return 0; // relevance
    });
  }, [
    products,
    searchQuery,
    selectedDepartment,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    selectedMaterial,
    selectedFeature,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedDepartment !== 'ALL' ? 1 : 0) +
    (selectedCategory !== 'ALL' ? 1 : 0) +
    (minRating > 4.0 ? 1 : 0) +
    (selectedMaterial !== 'ALL' ? 1 : 0) +
    (selectedFeature !== 'ALL' ? 1 : 0) +
    (minPrice > 0 || maxPrice < 2000 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedDepartment('ALL');
    setSelectedCategory('ALL');
    setMinPrice(0);
    setMaxPrice(2000);
    setMinRating(4.0);
    setSelectedMaterial('ALL');
    setSelectedFeature('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/sourcing" className="text-xs text-outline hover:text-secondary">
              Sourcing
            </Link>
            <span className="text-outline text-xs">/</span>
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
              Workflow A
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Find &amp; Evaluate Meesho Products
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Dynamic category-aware filter engine. Evaluate supplier wholesale costs, gross margins, and customer ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalInitialUrl('');
            setIsImportModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all self-start sm:self-auto"
        >
          <DownloadCloud className="w-4 h-4" />
          <span>Import by URL</span>
        </button>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* ========================================================= */}
        {/* DYNAMIC CATEGORY-AWARE FILTER PANEL (Desktop / Drawer)    */}
        {/* ========================================================= */}
        <aside className="lg:col-span-1 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 sm:p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-secondary" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-on-surface">
                Filter Engine
              </span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] font-label-sm text-secondary hover:underline font-bold"
              >
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-label-sm uppercase tracking-wider text-outline font-bold">
              Target Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value as any);
                setSelectedCategory('ALL');
              }}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="ALL">All 6 Departments</option>
              <option value="GARDEN_OUTDOOR">Garden &amp; Outdoor</option>
              <option value="KITCHEN_TOOLS">Kitchen Tools &amp; Utilities</option>
              <option value="HOME_ESSENTIALS">Home &amp; Everyday Essentials</option>
              <option value="CLEANING_IMPROVEMENT">Cleaning &amp; Improvement</option>
              <option value="STORAGE_ORGANIZATION">Storage &amp; Organization</option>
              <option value="TOOLS_HARDWARE">Tools &amp; Hardware</option>
            </select>
          </div>

          {/* Category Filter */}
          {selectedDepartment !== 'ALL' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-[11px] font-label-sm uppercase tracking-wider text-outline font-bold">
                Taxonomy Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                <option value="ALL">All Categories in Dept</option>
                {taxonomy
                  .filter((t) => t.departmentId === selectedDepartment)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Price Range Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-label-sm">
              <span className="uppercase text-outline font-bold">Source Price</span>
              <span className="font-mono text-secondary font-bold">
                ₹{minPrice} — ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-label-sm">
              <span className="uppercase text-outline font-bold">Min Supplier Rating</span>
              <span className="font-mono text-primary font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-primary" />
                {minRating}★
              </span>
            </div>
            <input
              type="range"
              min="3.5"
              max="4.8"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Dynamic Facet: Material Filter */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-label-sm uppercase tracking-wider text-outline font-bold">
              Material Specification
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="ALL">All Materials</option>
              <option value="Ceramic">Ceramic Stoneware</option>
              <option value="Stainless Steel">Stainless Steel (304)</option>
              <option value="Glass">Borosilicate Glass</option>
              <option value="Oxford">Oxford Fabric</option>
              <option value="Brass">Solid Brass</option>
              <option value="Alloy">S2 Alloy Steel</option>
            </select>
          </div>

          {/* Dynamic Facet: Key Feature Flag */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-label-sm uppercase tracking-wider text-outline font-bold">
              Category Feature Flag
            </label>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            >
              <option value="ALL">Any Feature</option>
              <option value="drainage">Drainage Hole (Garden)</option>
              <option value="dishwasher">Dishwasher Safe (Kitchen)</option>
              <option value="foldable">Foldable / Collapsible (Home)</option>
            </select>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-label-sm uppercase text-[11px]">In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-secondary w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </aside>

        {/* ========================================================= */}
        {/* PRODUCT CARDS GRID & SEARCH BAR                           */}
        {/* ========================================================= */}
        <main className="lg:col-span-3 space-y-4">
          {/* Search Bar & Sorter */}
          <div className="p-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phrase, title, or ID..."
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-8 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-label-sm">
              <span className="text-outline uppercase text-[10px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-container border border-outline-variant/30 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-medium"
              >
                <option value="relevance">Relevance</option>
                <option value="margin">Highest Margin %</option>
                <option value="rating">Top Rated (4.5★+)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-label-sm">
              <span className="text-outline uppercase text-[10px]">Active Filters:</span>
              {selectedDepartment !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container border border-secondary/30 text-secondary font-medium">
                  Dept: {selectedDepartment.replace('_', ' ')}
                  <button onClick={() => setSelectedDepartment('ALL')}>
                    <X className="w-3 h-3 ml-1 hover:text-on-surface" />
                  </button>
                </span>
              )}
              {selectedMaterial !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container border border-secondary/30 text-secondary font-medium">
                  Material: {selectedMaterial}
                  <button onClick={() => setSelectedMaterial('ALL')}>
                    <X className="w-3 h-3 ml-1 hover:text-on-surface" />
                  </button>
                </span>
              )}
              {selectedFeature !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container border border-secondary/30 text-secondary font-medium">
                  Feature: {selectedFeature}
                  <button onClick={() => setSelectedFeature('ALL')}>
                    <X className="w-3 h-3 ml-1 hover:text-on-surface" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="text-xs text-outline font-label-sm">
            Showing <span className="text-secondary font-bold font-mono">{filteredProducts.length}</span> matching products
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-low border border-outline-variant/30 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-on-surface">No Products Match Current Filters</h3>
              <p className="text-xs text-outline max-w-sm mx-auto">
                Try widening your price range, clearing specific attribute filters, or search for a different phrase.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const costRupees = p.sourcePricePaise / 100;
                const sellingRupees = (p.targetSellingPricePaise || 0) / 100;

                return (
                  <div
                    key={p.sourceRecordId}
                    className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex flex-col justify-between hover:border-secondary/40 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Thumbnail & Badges */}
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
                        {p.sourceImages[0] ? (
                          <Image
                            src={p.sourceImages[0]}
                            alt={p.sourceTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : null}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-[10px] font-label-sm font-bold text-secondary border border-secondary/30">
                            {p.sourceDepartment.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-mono font-bold text-primary flex items-center gap-1 border border-primary/20">
                          <Star className="w-3 h-3 fill-primary" />
                          <span>{p.sourceRating || 4.5}</span>
                          <span className="text-outline text-[9px]">({p.sourceReviewCount || 40})</span>
                        </div>
                      </div>

                      {/* Title & Metadata */}
                      <div>
                        <h3 className="font-display font-semibold text-xs text-on-surface line-clamp-2 leading-tight group-hover:text-secondary transition-colors">
                          {p.sourceTitle}
                        </h3>
                        <div className="flex items-center justify-between text-[11px] text-outline mt-1 font-mono">
                          <span>ID: {p.sourceProductId}</span>
                          <span>Seller: {p.sourceSellerName || 'Artisan Hub'}</span>
                        </div>
                      </div>

                      {/* Commercial Breakdown */}
                      <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/20 grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-outline block">Source Cost</span>
                          <span className="font-mono font-bold text-on-surface">
                            {formatPaiseToINR(p.sourcePricePaise)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-outline block">Selling Price</span>
                          <span className="font-mono font-bold text-secondary">
                            {formatPaiseToINR(p.targetSellingPricePaise || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-outline block">Gross Margin</span>
                          <span className="font-mono font-bold text-secondary">
                            {p.estimatedGrossMarginPercent || 52}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenImportWithUrl(p.sourceUrl)}
                        className="text-xs font-label-sm text-outline hover:text-secondary flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {p.importStatus === 'SAVED' ? (
                          <button
                            type="button"
                            onClick={() => handleApproveImport(p.sourceRecordId)}
                            className="px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold hover:shadow-lime-glow transition-all"
                          >
                            Approve Now
                          </button>
                        ) : p.importStatus === 'IMPORTED' ? (
                          <span className="px-2.5 py-1 rounded-xl bg-secondary/15 text-secondary border border-secondary/30 text-[10px] font-bold font-mono">
                            In Storefront
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSaveShortlist(p)}
                            className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/40 hover:border-secondary text-on-surface text-xs font-label-md uppercase font-semibold transition-all flex items-center gap-1"
                          >
                            <Bookmark className="w-3 h-3 text-primary" />
                            <span>Shortlist</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Import Modal */}
      <MeeshoImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        initialUrl={modalInitialUrl}
        onSuccess={() => setProducts(getSourceProducts())}
      />
    </div>
  );
}
