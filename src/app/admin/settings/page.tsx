'use client';

import React, { useState } from 'react';
import {
  Settings,
  Truck,
  Database,
  ShieldCheck,
  CreditCard,
  Save,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  // Form State
  const [storeName, setStoreName] = useState('Plantrix Botanics');
  const [supportEmail, setSupportEmail] = useState('care@plantrixbotanics.com');
  const [originHub, setOriginHub] = useState('Bengaluru Central Nursery Fulfillment Terminal (IN-BLR-01)');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [shiprocketEmail, setShiprocketEmail] = useState('logistics@plantrixbotanics.com');
  const [r2BucketName, setR2BucketName] = useState('plantrix-media-prod');
  const [r2PublicDomain, setR2PublicDomain] = useState('https://images.plantrixbotanics.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
            System Configuration
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface mt-0.5">
            Operational &amp; Integration Settings
          </h1>
          <p className="font-sans text-xs text-outline">
            Manage logistics provider connectors, Cloudflare R2 image domains, and pricing thresholds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved Settings</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Business Identity & Fulfillment Hub */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
            <Settings className="w-4 h-4 text-secondary" />
            <span>Storefront &amp; Dispatch Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Patron Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Primary Registered Dispatch Origin (Fulfillment Node)
              </label>
              <input
                type="text"
                value={originHub}
                onChange={(e) => setOriginHub(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logistics & Shiprocket Integration */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
              <Truck className="w-4 h-4 text-secondary" />
              <span>Logistics Connector (Shiprocket / Aggregator)</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-sm text-[10px] font-bold">
              Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                API Account Email
              </label>
              <input
                type="email"
                value={shiprocketEmail}
                onChange={(e) => setShiprocketEmail(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Active Shipping Carriers
              </label>
              <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>Blue Dart Express Air, Delhivery Surface, Xpressbees Priority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Cloudflare R2 Media Storage */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
              <Database className="w-4 h-4 text-secondary" />
              <span>Cloudflare R2 Media Storage</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-sm text-[10px] font-bold">
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Target R2 Bucket Name
              </label>
              <input
                type="text"
                value={r2BucketName}
                onChange={(e) => setR2BucketName(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs font-mono text-secondary focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Public Image CDN Delivery Base URL
              </label>
              <input
                type="url"
                value={r2PublicDomain}
                onChange={(e) => setR2PublicDomain(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Monetary Model & Free Shipping */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
            <CreditCard className="w-4 h-4 text-secondary" />
            <span>Monetary Standard &amp; Transit Threshold</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Base Storefront Currency
              </label>
              <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface font-semibold flex items-center justify-between">
                <span>Indian Rupee (INR) — ₹</span>
                <span className="font-mono text-secondary">Paise (Integer 1/100)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1.5">
                Free Shipping Threshold (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display font-bold text-secondary text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl pl-8 pr-4 py-2.5 font-display font-bold text-sm text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Security & Audit Boundary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-secondary font-label-sm text-xs uppercase tracking-wider font-bold">
            <Lock className="w-4 h-4" />
            <span>Operational Security &amp; Supplier Privacy Rules</span>
          </div>

          <div className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
            <p>
              • <strong>Zero Cost Leakage:</strong> All supplier source costs, wholesale margins, and internal vendor links are sanitized via <code className="text-secondary font-mono">toPublicProduct()</code> before transmission to customer bundles.
            </p>
            <p>
              • <strong>Role Verification:</strong> Administrative APIs enforce verified session identity and privileged role claims.
            </p>
            <p>
              • <strong>Integer Monetary Representation:</strong> All calculations operate strictly in integer paise to eliminate floating-point rounding errors.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
