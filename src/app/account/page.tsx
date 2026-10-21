'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, Heart, ShieldCheck, ArrowRight, LogOut } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div>
        <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
          Patron Concierge
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface mt-1">
          Customer Account &amp; Specimen History
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Navigation Sidebar */}
        <aside className="lg:col-span-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/20">
            <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center font-display font-bold text-lg">
              BP
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-on-surface">Botanical Patron</h3>
              <p className="text-xs text-outline">patron@plantrixbotanics.com</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3 rounded-xl font-label-md text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-secondary text-on-secondary shadow-lime-glow'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Order History</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between p-3 rounded-xl font-label-md text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-secondary text-on-secondary shadow-lime-glow'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profile Details</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between p-3 rounded-xl font-label-md text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-secondary text-on-secondary shadow-lime-glow'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>

          <div className="pt-4 border-t border-outline-variant/20">
            <Link
              href="/wishlist"
              className="w-full flex items-center justify-between p-3 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-semibold transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-secondary" />
                <span>View Curated Wishlist</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* Right: Content Panel */}
        <div className="lg:col-span-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 sm:p-8 space-y-6 shadow-xl">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-on-surface">Recent Dispatch Orders</h3>
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-secondary">#PLX-849201</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-primary text-[10px] uppercase font-bold font-label-sm">
                      Delivered
                    </span>
                  </div>
                  <p className="text-xs text-outline mt-1">Dispatched on Oct 14, 2026 • 2 items</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-base text-on-surface">₹3,198.00</span>
                  <span className="text-[11px] text-outline block">Prepaid via UPI</span>
                </div>
              </div>

              <div className="p-8 text-center text-outline text-xs rounded-2xl border border-dashed border-outline-variant/30">
                End of recent order history. All historical transits are securely archived.
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4 max-w-md">
              <h3 className="font-display font-bold text-lg text-on-surface">Patron Account Details</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-outline uppercase font-label-sm block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Ananya Rao"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-outline uppercase font-label-sm block mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="patron@plantrixbotanics.com"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-outline uppercase font-label-sm block mb-1">Contact Mobile</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-on-surface">Saved Dispatch Addresses</h3>
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-1 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-[10px] uppercase font-bold font-label-sm">
                  Primary Residence
                </span>
                <p className="font-semibold text-on-surface text-sm pt-1">Ananya Rao</p>
                <p className="text-on-surface-variant">Apartment 4B, Greenwood Sanctuary, Indiranagar</p>
                <p className="text-on-surface-variant">Bengaluru, Karnataka - 560038</p>
                <p className="text-outline pt-1">+91 98765 43210</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
