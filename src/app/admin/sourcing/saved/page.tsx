'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bookmark,
  CheckCircle2,
  Trash2,
  ExternalLink,
  DownloadCloud,
  Edit,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';
import { getSourceProducts, approveAndImportToCatalogue, saveSourceProductDraft } from '@/data/sourcingStore';
import { SourceProduct } from '@/types/sourcing';
import { formatPaiseToINR } from '@/types/product';
import MeeshoImportModal from '@/components/admin/MeeshoImportModal';

export default function SavedProductsPage() {
  const [products, setProducts] = useState<SourceProduct[]>(
    getSourceProducts().filter((p) => p.importStatus === 'SAVED')
  );
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [activeModalProduct, setActiveModalProduct] = useState<SourceProduct | null>(null);

  const loadData = () => {
    setProducts(getSourceProducts().filter((p) => p.importStatus === 'SAVED'));
  };

  const handleApprove = (id: string) => {
    approveAndImportToCatalogue(id);
    loadData();
  };

  const handleRemove = (product: SourceProduct) => {
    if (confirm(`Remove "${product.sourceTitle}" from saved shortlist?`)) {
      product.importStatus = 'ARCHIVED';
      saveSourceProductDraft(product);
      loadData();
    }
  };

  const handleApproveAll = () => {
    if (confirm(`Approve and publish all ${filteredProducts.length} saved products to the catalogue?`)) {
      filteredProducts.forEach((p) => approveAndImportToCatalogue(p.sourceRecordId));
      loadData();
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedDept !== 'ALL' && p.sourceDepartment !== selectedDept) return false;
    return true;
  });

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
              Review Queue
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Saved Products Shortlist ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Shortlisted Meesho candidate products awaiting final commercial margin approval and catalogue publishing.
          </p>
        </div>

        {filteredProducts.length > 0 && (
          <button
            type="button"
            onClick={handleApproveAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all self-start sm:self-auto"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve All ({filteredProducts.length})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
          {['ALL', 'GARDEN_OUTDOOR', 'KITCHEN_TOOLS', 'HOME_ESSENTIALS'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-label-sm uppercase tracking-wider text-[11px] transition-all ${
                selectedDept === dept
                  ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {dept === 'ALL' ? 'All Saved' : dept.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* List / Cards */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-low border border-outline-variant/30 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-on-surface">No Products in Saved Review Queue</h3>
          <p className="text-xs text-outline max-w-sm mx-auto">
            You can discover products using the Find Products module or import directly from a Meesho URL.
          </p>
          <Link
            href="/admin/sourcing/find"
            className="inline-block px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
          >
            Go to Find Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.sourceRecordId}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex flex-col justify-between hover:border-secondary/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
                    {p.sourceImages[0] && (
                      <Image
                        src={p.sourceImages[0]}
                        alt={p.sourceTitle}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-label-sm font-bold text-secondary">
                      {p.sourceDepartment.replace('_', ' ')}
                    </span>
                    <h3 className="font-display font-semibold text-xs text-on-surface truncate">
                      {p.sourceTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-outline mt-0.5">
                      <span className="font-mono">ID: {p.sourceProductId}</span>
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:underline flex items-center gap-0.5"
                      >
                        <span>Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Commercial Ledger */}
                <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 grid grid-cols-3 gap-2 text-center text-xs">
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
                      {p.estimatedGrossMarginPercent || 50}%
                    </span>
                  </div>
                </div>

                {p.internalNotes && (
                  <div className="text-[11px] text-outline italic bg-surface-container-high/40 p-2 rounded-lg">
                    &ldquo;{p.internalNotes}&rdquo;
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleRemove(p)}
                  className="p-1.5 rounded-lg text-error/80 hover:text-error hover:bg-surface-container"
                  title="Remove from shortlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalProduct(p)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-outline hover:text-on-surface text-xs font-label-md"
                  >
                    Review / Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(p.sourceRecordId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold hover:shadow-lime-glow transition-all"
                  >
                    <span>Approve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {activeModalProduct && (
        <MeeshoImportModal
          isOpen={true}
          onClose={() => setActiveModalProduct(null)}
          initialUrl={activeModalProduct.sourceUrl}
          onSuccess={() => {
            setActiveModalProduct(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
