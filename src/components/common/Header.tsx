'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Sprout,
  Home,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { DEPARTMENTS } from '@/types/category';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen, setIsSearchOpen } = useShop();

  const isBotanicsActive = pathname.startsWith('/plants-botanics');
  const isHomeActive = pathname.startsWith('/home-essentials');

  return (
    <>
      <header className="sticky top-0 z-40 w-full flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2">
          <div className="h-16 sm:h-20 bg-surface/80 backdrop-blur-2xl rounded-full shadow-glass px-4 sm:px-6 flex items-center justify-between border border-outline-variant/30">
            {/* Left: Logo & Brand Indicator */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -ml-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 rounded-full transition-colors"
                aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link
                href="/"
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full py-1"
                aria-label="Plantrix Botanics Homepage"
              >
                <div className="relative h-8 sm:h-9 w-auto flex items-center">
                  <Image
                    src="/images/plantrix-logo.png"
                    alt="Plantrix Botanics"
                    width={140}
                    height={40}
                    priority
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>
                <span className="font-display font-semibold text-lg sm:text-xl tracking-tight text-on-surface hidden sm:inline-block">
                  Plantrix
                </span>
              </Link>

              <span className="hidden xl:inline-block font-label-sm text-[11px] uppercase tracking-wider text-secondary px-3 py-0.5 rounded-full bg-secondary-container/20 border border-secondary/20">
                Botanical Futurism
              </span>
            </div>

            {/* Center: Department Navigation (Desktop) */}
            <nav
              aria-label="Primary Departments"
              className="hidden lg:flex items-center gap-1 p-1 bg-surface-container-lowest/60 rounded-full border border-outline-variant/30"
            >
              <Link
                href="/plants-botanics"
                className={`font-label-md text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                  isBotanicsActive
                    ? 'bg-primary-container text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-secondary" />
                <span>Plants &amp; Botanics</span>
              </Link>

              <Link
                href="/home-essentials"
                className={`font-label-md text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                  isHomeActive
                    ? 'bg-primary-container text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-tertiary" />
                <span>Home &amp; Everyday Essentials</span>
              </Link>

              <Link
                href="/#curated-collections"
                className="font-label-md text-xs px-4 py-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-all"
              >
                Curated Collections
              </Link>

              <Link
                href="/#editorial-story"
                className="font-label-md text-xs px-4 py-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 transition-all"
              >
                Editorial Story
              </Link>
            </nav>

            {/* Right: Actions (Search, Wishlist, Bag, Account) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search catalog"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Wishlist Link/Button */}
              <Link
                href="/wishlist"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlistCount > 0 ? 'text-secondary fill-secondary/20' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-on-secondary font-label-sm text-[9px] leading-none font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping bag (${cartCount} items)`}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors group"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-on-secondary font-label-sm text-[9px] leading-none font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                aria-label="Customer Account"
                className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center ml-1 hover:bg-secondary hover:text-on-secondary transition-colors"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-surface-container-low/95 border-r border-outline-variant/40 shadow-glass p-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/plantrix-logo.png"
                    alt="Plantrix Botanics"
                    width={120}
                    height={34}
                    className="h-7 w-auto object-contain"
                  />
                  <span className="font-display font-bold text-on-surface">Plantrix</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Department Navigation Links */}
              <div className="space-y-3">
                <p className="text-[10px] font-label-sm uppercase tracking-widest text-outline">
                  Primary Departments
                </p>

                <Link
                  href="/plants-botanics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isBotanicsActive
                      ? 'bg-primary-container/60 border-primary text-primary'
                      : 'bg-surface-container border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sprout className="w-4 h-4 text-secondary" />
                    <div>
                      <h4 className="text-sm font-semibold">Plants &amp; Botanics</h4>
                      <p className="text-[11px] text-outline">Living flora &amp; planters</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-outline" />
                </Link>

                <Link
                  href="/home-essentials"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isHomeActive
                      ? 'bg-primary-container/60 border-primary text-primary'
                      : 'bg-surface-container border-outline-variant/30 text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-tertiary" />
                    <div>
                      <h4 className="text-sm font-semibold">Home &amp; Everyday Essentials</h4>
                      <p className="text-[11px] text-outline">Pantry &amp; kitchen utilities</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-outline" />
                </Link>
              </div>

              {/* Quick Links */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-label-sm uppercase tracking-widest text-outline">
                  Curated Archives
                </p>
                <Link
                  href="/#curated-collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Curated Collections
                </Link>
                <Link
                  href="/#editorial-story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Editorial Story &amp; Philosophy
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Customer Account &amp; Orders
                </Link>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="pt-6 border-t border-outline-variant/20 text-xs text-outline space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span>Pan-India Safe Transit Hub Active</span>
              </div>
              <p className="text-[11px]">Direct Support: care@plantrixbotanics.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
