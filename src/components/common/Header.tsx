'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  Home, 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { DEPARTMENTS, Department } from '@/types/category';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isBotanicsActive = pathname.startsWith('/plants-botanics') || pathname === '/';
  const isHomeActive = pathname.startsWith('/home-essentials');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-sage-border/60 transition-all shadow-subtle">
      {/* Top Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-brand-charcoal hover:text-brand-botanical focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-botanical rounded-lg"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Editorial Wordmark */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-botanical rounded-lg py-1 px-1"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-forest flex items-center justify-center text-brand-ivory shadow-sm group-hover:bg-brand-botanical transition-colors">
                <Sprout className="w-5 h-5 text-brand-sage" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-brand-forest leading-none">
                  Plantrix
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-brand-muted mt-0.5">
                  Botanics & Home
                </span>
              </div>
            </Link>
          </div>

          {/* Department Tabs (Desktop Center) */}
          <nav 
            aria-label="Department Navigation"
            className="hidden lg:flex items-center gap-2 bg-brand-sage-light p-1 rounded-full border border-brand-sage-border/60"
          >
            <Link
              href="/plants-botanics"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isBotanicsActive
                  ? 'bg-brand-forest text-brand-ivory shadow-sm'
                  : 'text-brand-charcoal hover:text-brand-forest hover:bg-white/60'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{DEPARTMENTS.PLANTS_BOTANICS.title}</span>
            </Link>

            <Link
              href="/home-essentials"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isHomeActive
                  ? 'bg-brand-forest text-brand-ivory shadow-sm'
                  : 'text-brand-charcoal hover:text-brand-forest hover:bg-white/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{DEPARTMENTS.HOME_ESSENTIALS.title}</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              className="p-2 text-brand-charcoal hover:text-brand-botanical hover:bg-brand-sage-light/60 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-botanical"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/account"
              className="hidden sm:flex p-2 text-brand-charcoal hover:text-brand-botanical hover:bg-brand-sage-light/60 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-botanical"
              aria-label="Customer account"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 text-brand-charcoal hover:text-brand-botanical hover:bg-brand-sage-light/60 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-botanical group"
              aria-label="Shopping Cart (0 items)"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand-terracotta text-white font-bold text-[10px] rounded-full flex items-center justify-center leading-none">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-Header Department Bar for Tablet/Mobile quick switch */}
      <div className="lg:hidden border-t border-brand-sage-border/40 bg-brand-ivory px-4 py-2 flex items-center justify-center gap-2">
        <Link
          href="/plants-botanics"
          className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            isBotanicsActive
              ? 'bg-brand-forest text-white'
              : 'text-brand-charcoal bg-white/70 border border-brand-sage-border/40'
          }`}
        >
          Plants & Botanics
        </Link>
        <Link
          href="/home-essentials"
          className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            isHomeActive
              ? 'bg-brand-forest text-white'
              : 'text-brand-charcoal bg-white/70 border border-brand-sage-border/40'
          }`}
        >
          Home Essentials
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="p-4 border-b border-brand-sage-border flex items-center justify-between bg-brand-ivory">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-forest flex items-center justify-center text-brand-sage">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-lg text-brand-forest">Plantrix</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-brand-muted hover:text-brand-charcoal rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 space-y-6">
              {/* Department Section 1 */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Department
                </p>
                <div className="space-y-1">
                  <Link
                    href="/plants-botanics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-sage-light text-brand-forest font-semibold text-sm hover:bg-brand-sage transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-brand-botanical" />
                      Plants & Botanics
                    </span>
                    <ChevronRight className="w-4 h-4 text-brand-muted" />
                  </Link>

                  <Link
                    href="/home-essentials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-sage-light text-brand-forest font-semibold text-sm hover:bg-brand-sage transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-brand-botanical" />
                      Home & Everyday Essentials
                    </span>
                    <ChevronRight className="w-4 h-4 text-brand-muted" />
                  </Link>
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-2">
                  Explore
                </p>
                <nav className="space-y-1 text-sm font-medium text-brand-charcoal">
                  <Link
                    href="/collections/best-sellers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-brand-sage-light transition-colors"
                  >
                    Best Sellers
                  </Link>
                  <Link
                    href="/collections/new-arrivals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-brand-sage-light transition-colors"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/collections/under-499"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-brand-sage-light transition-colors"
                  >
                    Under ₹499 Finds
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-brand-sage-light transition-colors"
                  >
                    Track Your Order
                  </Link>
                </nav>
              </div>

              {/* Trust Callouts */}
              <div className="pt-4 border-t border-brand-sage-border/60 space-y-2 text-xs text-brand-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-botanical shrink-0" />
                  <span>Curated Quality & Botanical Health</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-botanical shrink-0" />
                  <span>Safe Packaging & Pan-India Dispatch</span>
                </div>
              </div>
            </div>

            {/* Bottom Account Action */}
            <div className="p-4 border-t border-brand-sage-border bg-brand-ivory">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-forest text-white font-medium text-sm hover:bg-brand-botanical transition-colors"
              >
                <User className="w-4 h-4" />
                <span>My Account / Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
