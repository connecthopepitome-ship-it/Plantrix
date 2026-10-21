'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingDown,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  History,
  ShieldAlert,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import {
  getSourceProducts,
  getSourcePriceHistory,
  checkSourcePriceNow,
} from '@/data/sourcingStore';
import { SourceProduct, SourcePriceHistory } from '@/types/sourcing';
import { formatPaiseToINR } from '@/types/product';

export default function SourcePriceChangesPage() {
  const [products, setProducts] = useState<SourceProduct[]>(getSourceProducts());
  const [history, setHistory] = useState<SourcePriceHistory[]>(getSourcePriceHistory());
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'HISTORY'>('MONITOR');

  const loadData = () => {
    setProducts(getSourceProducts());
    setHistory(getSourcePriceHistory());
  };

  const handleRefresh = (id: string, simulatePriceBump = false) => {
    setRefreshingId(id);
    setTimeout(() => {
      const prod = products.find((p) => p.sourceRecordId === id);
      const newPrice = simulatePriceBump && prod 
        ? prod.sourcePricePaise + 4000 // bump by ₹40
        : undefined;
      checkSourcePriceNow(id, newPrice);
      loadData();
      setRefreshingId(null);
    }, 600);
  };

  const handleRefreshAll = () => {
    setRefreshingId('ALL');
    setTimeout(() => {
      products.forEach((p) => checkSourcePriceNow(p.sourceRecordId));
      loadData();
      setRefreshingId(null);
    }, 1000);
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
              Price Intelligence
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Supplier Price &amp; Margin Volatility
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Complies with Section 11. Monitor supplier cost fluctuations, identify margin erosion, and verify stock availability in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefreshAll}
          disabled={refreshingId === 'ALL'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg disabled:opacity-50 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshingId === 'ALL' ? 'animate-spin' : ''}`} />
          <span>{refreshingId === 'ALL' ? 'Checking...' : 'Check All Prices'}</span>
        </button>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30">
        <button
          onClick={() => setActiveTab('MONITOR')}
          className={`px-4 py-2 text-xs font-label-md uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'MONITOR'
              ? 'border-secondary text-secondary font-bold'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Active Price Ledger ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 text-xs font-label-md uppercase tracking-wider font-semibold border-b-2 transition-all ${
            activeTab === 'HISTORY'
              ? 'border-secondary text-secondary font-bold'
              : 'border-transparent text-outline hover:text-on-surface'
          }`}
        >
          Audit History ({history.length})
        </button>
      </div>

      {activeTab === 'MONITOR' ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Sourced Product</th>
                  <th className="py-3 px-4">Last Observed</th>
                  <th className="py-3 px-4">Previous Cost</th>
                  <th className="py-3 px-4">Price Delta</th>
                  <th className="py-3 px-4">Margin Impact</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Last Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {products.map((p) => {
                  const isUp =
                    p.previousSourcePricePaise && p.sourcePricePaise > p.previousSourcePricePaise;
                  const isDown =
                    p.previousSourcePricePaise && p.sourcePricePaise < p.previousSourcePricePaise;
                  const delta = p.previousSourcePricePaise
                    ? p.sourcePricePaise - p.previousSourcePricePaise
                    : 0;

                  return (
                    <tr
                      key={p.sourceRecordId}
                      className={`hover:bg-surface-container/30 transition-colors ${
                        isUp ? 'bg-error/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30">
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
                            <a
                              href={p.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-secondary hover:underline flex items-center gap-0.5"
                            >
                              <span>Meesho Listing</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-on-surface">
                        {formatPaiseToINR(p.sourcePricePaise)}
                      </td>

                      <td className="py-3 px-4 font-mono text-outline">
                        {p.previousSourcePricePaise
                          ? formatPaiseToINR(p.previousSourcePricePaise)
                          : '—'}
                      </td>

                      <td className="py-3 px-4">
                        {isUp && (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-error">
                            <TrendingUp className="w-3 h-3 text-error" />
                            +₹{(delta / 100).toFixed(0)}
                          </span>
                        )}
                        {isDown && (
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-secondary">
                            <TrendingDown className="w-3 h-3 text-secondary" />
                            -₹{(Math.abs(delta) / 100).toFixed(0)}
                          </span>
                        )}
                        {!isUp && !isDown && (
                          <span className="text-[10px] text-outline font-mono">Stable (₹0)</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold text-xs ${
                            (p.estimatedGrossMarginPercent || 0) < 30
                              ? 'text-error'
                              : 'text-secondary'
                          }`}
                        >
                          {p.estimatedGrossMarginPercent || 50}%
                        </span>
                        {isUp && (
                          <span className="text-[9px] text-error block">Margin eroded</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.sourceAvailability === 'IN_STOCK' ? (
                          <span className="text-[10px] font-label-sm px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/30 font-bold">
                            In Stock
                          </span>
                        ) : p.sourceAvailability === 'LOW_STOCK' ? (
                          <span className="text-[10px] font-label-sm px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-label-sm px-2 py-0.5 rounded bg-error/20 text-error border border-error/30 font-bold">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-outline font-mono text-[10px]">
                        {new Date(p.lastCheckedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleRefresh(p.sourceRecordId, true)}
                            disabled={refreshingId === p.sourceRecordId}
                            className="p-1.5 rounded-lg text-outline hover:text-secondary hover:bg-surface-container transition-colors disabled:opacity-50"
                            title="Simulate supplier cost check"
                          >
                            <RefreshCw
                              className={`w-3.5 h-3.5 ${
                                refreshingId === p.sourceRecordId ? 'animate-spin text-secondary' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Audit Timestamp</th>
                  <th className="py-3 px-4">Record ID</th>
                  <th className="py-3 px-4">Observed Price</th>
                  <th className="py-3 px-4">Price Shift</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Verification Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono text-xs">
                {history.map((h) => (
                  <tr key={h.historyId} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-3 px-4 text-outline">
                      {new Date(h.observedAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-secondary font-bold">{h.sourceRecordId}</td>
                    <td className="py-3 px-4 font-bold text-on-surface">
                      {formatPaiseToINR(h.observedPricePaise)}
                    </td>
                    <td className="py-3 px-4">
                      {h.priceDeltaPaise && h.priceDeltaPaise > 0 ? (
                        <span className="text-error font-bold">+₹{(h.priceDeltaPaise / 100).toFixed(0)}</span>
                      ) : h.priceDeltaPaise && h.priceDeltaPaise < 0 ? (
                        <span className="text-secondary font-bold">-₹{(Math.abs(h.priceDeltaPaise) / 100).toFixed(0)}</span>
                      ) : (
                        <span className="text-outline">₹0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-on-surface">{h.observedAvailability}</td>
                    <td className="py-3 px-4 text-on-surface-variant font-sans">{h.note || 'Regular scheduled check'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
