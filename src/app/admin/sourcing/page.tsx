'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  DownloadCloud,
  Search,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  Bookmark,
  ExternalLink,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import {
  getSourceProducts,
  getSourcePriceHistory,
  checkSourcePriceNow,
  approveAndImportToCatalogue,
} from '@/data/sourcingStore';
import { SourceProduct } from '@/types/sourcing';
import { formatPaiseToINR } from '@/types/product';
import MeeshoImportModal from '@/components/admin/MeeshoImportModal';

export default function SourcingDashboardPage() {
  const [products, setProducts] = useState<SourceProduct[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  const loadData = () => {
    setProducts(getSourceProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalSourced = products.length;
  const savedInReview = products.filter((p) => p.importStatus === 'SAVED').length;
  const importedCount = products.filter((p) => p.importStatus === 'IMPORTED').length;
  const priceAlerts = products.filter(
    (p) => p.previousSourcePricePaise && p.sourcePricePaise > p.previousSourcePricePaise
  ).length;

  const avgMargin = totalSourced > 0
    ? Math.round(
        products.reduce((acc, p) => acc + (p.estimatedGrossMarginPercent || 50), 0) / totalSourced
      )
    : 0;

  const handleRefreshPrice = (id: string) => {
    setRefreshingId(id);
    setTimeout(() => {
      checkSourcePriceNow(id);
      loadData();
      setRefreshingId(null);
    }, 600);
  };

  const handleQuickApprove = (id: string) => {
    approveAndImportToCatalogue(id);
    loadData();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
              Procurement & Vendor Intelligence
            </span>
            <span className="text-outline text-xs">/</span>
            <span className="text-xs text-outline font-mono">Meesho v1.4</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Sourcing Control Center
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Discover, evaluate, map and monitor supplier cost trends across all 6 lifestyle and botanical departments.
          </p>
        </div>

        {/* Global Sourcing Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/sourcing/find"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface hover:border-secondary font-label-md text-xs uppercase tracking-wider font-semibold transition-all"
          >
            <Search className="w-3.5 h-3.5 text-secondary" />
            <span>Discover Products</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Import from Meesho URL</span>
          </button>
        </div>
      </div>

      {/* Sourcing Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Sourced */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-[11px] font-label-sm uppercase tracking-wider mb-1">
            <span>Total Sourced</span>
            <Compass className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-display font-bold text-2xl text-on-surface">{totalSourced}</div>
          <div className="text-[10px] text-outline mt-1">Across 6 departments</div>
        </div>

        {/* In Review / Saved */}
        <Link
          href="/admin/sourcing/saved"
          className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary transition-all"
        >
          <div className="flex items-center justify-between text-outline text-[11px] font-label-sm uppercase tracking-wider mb-1">
            <span>In Review / Saved</span>
            <Bookmark className="w-4 h-4 text-primary" />
          </div>
          <div className="font-display font-bold text-2xl text-primary">{savedInReview}</div>
          <div className="text-[10px] text-outline mt-1">Pending catalogue approval ↗</div>
        </Link>

        {/* Live in Catalogue */}
        <Link
          href="/admin/sourcing/imported"
          className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary transition-all"
        >
          <div className="flex items-center justify-between text-outline text-[11px] font-label-sm uppercase tracking-wider mb-1">
            <span>Live in Catalogue</span>
            <PackageCheck className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-display font-bold text-2xl text-secondary">{importedCount}</div>
          <div className="text-[10px] text-outline mt-1">Published to storefront ↗</div>
        </Link>

        {/* Cost Increase Alerts */}
        <Link
          href="/admin/sourcing/price-changes"
          className={`p-4 rounded-2xl border transition-all ${
            priceAlerts > 0
              ? 'bg-error/10 border-error/40 hover:border-error'
              : 'bg-surface-container-low border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between text-outline text-[11px] font-label-sm uppercase tracking-wider mb-1">
            <span>Cost Shifts</span>
            <TrendingDown className={`w-4 h-4 ${priceAlerts > 0 ? 'text-error' : 'text-outline'}`} />
          </div>
          <div className={`font-display font-bold text-2xl ${priceAlerts > 0 ? 'text-error' : 'text-on-surface'}`}>
            {priceAlerts} {priceAlerts > 0 ? 'Alert' : 'Stable'}
          </div>
          <div className="text-[10px] text-outline mt-1">Supplier price shifts ↗</div>
        </Link>

        {/* Average Margin */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-outline text-[11px] font-label-sm uppercase tracking-wider mb-1">
            <span>Avg Gross Margin</span>
            <ShieldCheck className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-display font-bold text-2xl text-secondary font-mono">{avgMargin}%</div>
          <div className="text-[10px] text-outline mt-1">Healthy profitability (&gt;45%)</div>
        </div>
      </div>

      {/* Main Sourcing Records Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container/40">
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-on-surface">
              Sourced Products Ledger
            </h2>
            <p className="font-label-sm text-xs text-outline">
              Comprehensive registry of evaluated products, supplier costs, and catalogue linkage.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/sourcing/saved"
              className="text-xs font-label-sm text-secondary hover:underline font-bold px-3 py-1.5"
            >
              View Shortlist ({savedInReview})
            </Link>
            <Link
              href="/admin/sourcing/mapping"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface hover:border-secondary transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-secondary" />
              <span>Attribute Mappings</span>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Department &amp; Cat</th>
                <th className="py-3 px-4">Source Cost</th>
                <th className="py-3 px-4">Plantrix Selling</th>
                <th className="py-3 px-4">Gross Margin</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {products.map((product) => {
                const isPriceUp =
                  product.previousSourcePricePaise &&
                  product.sourcePricePaise > product.previousSourcePricePaise;
                const isPriceDown =
                  product.previousSourcePricePaise &&
                  product.sourcePricePaise < product.previousSourcePricePaise;

                return (
                  <tr key={product.sourceRecordId} className="hover:bg-surface-container/30 transition-colors">
                    {/* Product Details */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
                          {product.sourceImages[0] ? (
                            <Image
                              src={product.sourceImages[0]}
                              alt={product.sourceTitle}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-outline">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="max-w-xs truncate">
                          <span className="font-display font-semibold text-on-surface block truncate hover:text-secondary">
                            {product.sourceTitle}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-outline">
                              ID: {product.sourceProductId}
                            </span>
                            <a
                              href={product.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-secondary hover:underline flex items-center gap-0.5"
                            >
                              <span>Meesho</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Cat */}
                    <td className="py-3 px-4">
                      <span className="font-label-sm text-[11px] text-on-surface block font-medium">
                        {product.sourceDepartment.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-outline block">
                        {product.sourceCategory}
                      </span>
                    </td>

                    {/* Source Cost (Private) */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-on-surface">
                        {formatPaiseToINR(product.sourcePricePaise)}
                      </div>
                      {isPriceUp && (
                        <span className="text-[10px] text-error font-mono flex items-center gap-0.5 font-bold">
                          <TrendingUp className="w-2.5 h-2.5" />
                          +₹{((product.sourcePricePaise - product.previousSourcePricePaise!) / 100).toFixed(0)}
                        </span>
                      )}
                      {isPriceDown && (
                        <span className="text-[10px] text-secondary font-mono flex items-center gap-0.5 font-bold">
                          <TrendingDown className="w-2.5 h-2.5" />
                          -₹{((product.previousSourcePricePaise! - product.sourcePricePaise) / 100).toFixed(0)}
                        </span>
                      )}
                    </td>

                    {/* Plantrix Selling Price */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-secondary">
                        {formatPaiseToINR(product.targetSellingPricePaise || 0)}
                      </span>
                      {product.targetCompareAtPricePaise && (
                        <span className="text-[10px] text-outline line-through block font-mono">
                          {formatPaiseToINR(product.targetCompareAtPricePaise)}
                        </span>
                      )}
                    </td>

                    {/* Gross Margin % */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-xs ${
                            (product.estimatedGrossMarginPercent || 0) < 30
                              ? 'text-error'
                              : 'text-secondary'
                          }`}
                        >
                          {product.estimatedGrossMarginPercent || 50}%
                        </span>
                      </div>
                      <span className="text-[10px] text-outline block">
                        Profit: {formatPaiseToINR((product.targetSellingPricePaise || 0) - product.sourcePricePaise - 3000)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {product.importStatus === 'IMPORTED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-label-sm font-bold bg-secondary/15 text-secondary border border-secondary/30">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Catalogue Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-label-sm font-bold bg-primary-container/40 text-primary border border-primary/30">
                          <Bookmark className="w-2.5 h-2.5" />
                          Saved Review
                        </span>
                      )}
                    </td>

                    {/* Row Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRefreshPrice(product.sourceRecordId)}
                          disabled={refreshingId === product.sourceRecordId}
                          title="Refresh supplier price check"
                          className="p-1.5 rounded-lg text-outline hover:text-secondary hover:bg-surface-container transition-colors disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              refreshingId === product.sourceRecordId ? 'animate-spin text-secondary' : ''
                            }`}
                          />
                        </button>

                        {product.importStatus === 'SAVED' ? (
                          <button
                            type="button"
                            onClick={() => handleQuickApprove(product.sourceRecordId)}
                            className="px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-[10px] uppercase font-bold hover:shadow-lime-glow transition-all"
                          >
                            Approve
                          </button>
                        ) : (
                          <Link
                            href={`/admin/catalogue/${product.linkedProductId || 'pb-01'}`}
                            className="px-2 py-1 rounded-lg bg-surface-container border border-outline-variant/30 text-outline hover:text-on-surface text-[10px] font-label-sm"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sourcing Modal */}
      <MeeshoImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
