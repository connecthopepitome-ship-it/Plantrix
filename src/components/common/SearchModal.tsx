'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { CATALOG_PRODUCTS, CatalogItem } from '@/data/products';

export function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsSearchOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? CATALOG_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel?.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(query.toLowerCase()) ||
          p.specsSummary?.toLowerCase().includes(query.toLowerCase())
      )
    : CATALOG_PRODUCTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 bg-surface-container-lowest/85 backdrop-blur-2xl transition-all">
      {/* Backdrop click area */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setIsSearchOpen(false)} 
        aria-hidden="true"
      />

      <div className="w-full max-w-2xl rounded-2xl bg-surface-container-low/95 border border-outline-variant/40 shadow-glass overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search architectural pots, hydration vessels, pantry canisters..."
            className="flex-1 bg-transparent text-sm sm:text-base text-on-surface placeholder:text-outline focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-outline hover:text-on-surface transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full bg-surface-container-high/80 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
            aria-label="Close search overlay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-outline px-2 pb-1 font-label-sm uppercase tracking-wider">
            <span>{query.trim() ? `Search Results (${filtered.length})` : 'Curated Suggestions'}</span>
            <span className="flex items-center gap-1 text-secondary">
              <Sparkles className="w-3 h-3" /> Quick Discovery
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant space-y-2">
              <p className="font-semibold text-sm">No botanical artifacts found matching &quot;{query}&quot;</p>
              <p className="text-xs text-outline">Try searching for &quot;planter&quot;, &quot;brass&quot;, &quot;pantry&quot;, or &quot;canister&quot;</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.productId}
                className="group flex items-center justify-between p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container-high/80 border border-outline-variant/20 hover:border-outline-variant/40 transition-all gap-4"
              >
                <Link
                  href={`/products/${item.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3.5 flex-1 min-w-0"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container-lowest shrink-0 border border-outline-variant/30">
                    <Image
                      src={item.imageUrls[0]}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-label-sm uppercase text-secondary tracking-wider">
                      {item.categoryLabel || item.department}
                    </p>
                    <h4 className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs font-display font-bold text-secondary">
                      ₹{(item.sellingPricePaise / 100).toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      productId: item.productId,
                      sku: item.sku,
                      name: item.name,
                      slug: item.slug,
                      pricePaise: item.sellingPricePaise,
                      imageUrl: item.imageUrls[0],
                    })
                  }
                  className="px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-outline-variant/20 bg-surface-container-lowest/60 flex items-center justify-between text-xs text-outline font-label-sm">
          <span>Press ESC to exit</span>
          <span className="text-secondary font-medium">Plantrix Curated Catalog</span>
        </div>
      </div>
    </div>
  );
}
