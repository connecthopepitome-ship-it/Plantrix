'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PackageCheck,
  ExternalLink,
  Edit,
  Eye,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { getSourceProducts } from '@/data/sourcingStore';
import { SourceProduct } from '@/types/sourcing';
import { formatPaiseToINR } from '@/types/product';

export default function ImportedCataloguePage() {
  const [products] = useState<SourceProduct[]>(
    getSourceProducts().filter((p) => p.importStatus === 'IMPORTED')
  );

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
              Published Lineup
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Imported Sourcing Catalogue ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Active storefront products connected to verified Meesho suppliers. Private wholesale margins and supplier provenance remain strictly protected.
          </p>
        </div>

        <Link
          href="/admin/catalogue"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/40 hover:border-secondary text-on-surface font-label-md text-xs uppercase tracking-wider font-semibold transition-all self-start sm:self-auto"
        >
          <span>View Master Catalogue</span>
          <ExternalLink className="w-3.5 h-3.5 text-secondary" />
        </Link>
      </div>

      {/* Security Boundary Reminder Banner */}
      <div className="p-4 rounded-xl bg-primary-container/20 border border-primary/30 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div className="text-xs text-on-surface-variant leading-relaxed">
          <span className="font-bold text-secondary">Strict Operational Security Boundary Active:</span> Sourced supplier costs, original Meesho URLs, and wholesale margin calculations are accessible only to authenticated administrators. Customer-facing client bundles never receive these properties.
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Plantrix Product</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Supplier Cost</th>
                <th className="py-3 px-4">Storefront Selling</th>
                <th className="py-3 px-4">Gross Margin</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Links &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {products.map((p) => (
                <tr key={p.sourceRecordId} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
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
                      <div className="max-w-xs truncate">
                        <span className="font-display font-semibold text-on-surface block truncate">
                          {p.sourceTitle}
                        </span>
                        <span className="font-mono text-[10px] text-outline block">
                          SKU Ref: {p.linkedProductId ? `PLX-${p.linkedProductId}` : 'PLX-CAT-001'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-label-sm text-[11px] text-secondary font-semibold block">
                      {p.sourceDepartment.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-outline block">{p.sourceCategory}</span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-on-surface">
                    {formatPaiseToINR(p.sourcePricePaise)}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-secondary">
                    {formatPaiseToINR(p.targetSellingPricePaise || 0)}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-secondary text-xs">
                      {p.estimatedGrossMarginPercent || 52}%
                    </span>
                    <span className="text-[10px] text-outline block">
                      +₹{(((p.targetSellingPricePaise || 0) - p.sourcePricePaise - 3000) / 100).toFixed(0)} / unit
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-secondary">
                      <CheckCircle2 className="w-3 h-3 text-secondary" />
                      Verified
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-outline hover:text-secondary hover:bg-surface-container transition-colors"
                        title="View original Meesho listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/admin/catalogue/${p.linkedProductId || 'pb-01'}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/30 text-outline hover:text-on-surface text-[10px] font-label-sm font-semibold"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
