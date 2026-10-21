'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sprout, Filter, ArrowUpDown, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '@/types/category';
import { getProductsByDepartment, CatalogItem } from '@/data/products';
import { useShop } from '@/context/ShopContext';

const BOTANICS_CATEGORIES = [
  'All Botanics',
  'Architectural Pots',
  'Hydration Vessels',
  'Living Flora',
];

export default function PlantsBotanicsPage() {
  const dept = DEPARTMENTS.PLANTS_BOTANICS;
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [selectedCategory, setSelectedCategory] = useState('All Botanics');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const allProducts = getProductsByDepartment('PLANTS_BOTANICS');

  const filtered = allProducts.filter((p) => {
    if (selectedCategory === 'All Botanics') return true;
    if (selectedCategory === 'Architectural Pots') return p.categoryId === 'pots-planters' || p.categoryId === 'plant-stands';
    if (selectedCategory === 'Hydration Vessels') return p.categoryId === 'gardening-tools';
    if (selectedCategory === 'Living Flora') return p.categoryId === 'indoor-plants';
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.sellingPricePaise - b.sellingPricePaise;
    if (sortBy === 'price-high') return b.sellingPricePaise - a.sellingPricePaise;
    return 0;
  });

  const handleQuickAdd = (product: CatalogItem) => {
    addToCart({
      productId: product.productId,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      pricePaise: product.sellingPricePaise,
      imageUrl: product.imageUrls[0],
    });
    setAddedItems((prev) => ({ ...prev, [product.productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.productId]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="font-label-sm text-xs text-outline flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-secondary font-semibold">{dept.title}</span>
      </nav>

      {/* Department Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-outline-variant/30 bg-surface-container-low shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10" />
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnUCVkYOWo8oYN5VxT3PfqVAbo4PwT5iFJfKgWKCXxfBxzOsONGl7x_lVQT4YlL9nc1o7UrPMmLYcJ3_6XAsnp9ARrznSbNKF73Vo1K7iWIfc2v4UK-eHHFHD3x9xJT8WNENP6pCL5K775yh5_PtAPGt7_n42Os6Ra8Ut0t9Ibjaa0re4T4JJ-Mmkq6GcHTvEHx2DoDHOK20cReFBfqIUgP0MfvVQ9lxK3wAlDX7MaQJ8D0SVUmGzi"
          alt="Plants and Botanics department banner"
          fill
          className="object-cover opacity-50"
        />

        <div className="relative z-20 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-primary font-label-sm text-xs font-semibold border border-primary/20">
            <Sprout className="w-3.5 h-3.5 text-secondary" />
            <span>Department 01 • Living Flora &amp; Planters</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-on-surface">
            {dept.title}
          </h1>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            {dept.description}
          </p>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          {BOTANICS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-label-sm text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-secondary text-on-secondary shadow-lime-glow'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ArrowUpDown className="w-4 h-4 text-secondary" />
          <span className="font-label-sm text-xs text-outline uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-container border border-outline-variant/40 rounded-full px-3 py-1 text-xs text-on-surface focus:outline-none focus:border-secondary"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map((product) => {
          const isWish = isWishlisted(product.productId);
          const isJustAdded = addedItems[product.productId];

          return (
            <div
              key={product.productId}
              className="group flex flex-col rounded-2xl bg-surface-container-low p-3.5 shadow-md hover:shadow-2xl border border-outline-variant/30 hover:border-outline-variant/60 transition-all duration-300"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20">
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 z-10">
                  {product.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] uppercase font-bold shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.productId)}
                  aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm z-10 ${
                    isWish
                      ? 'bg-secondary text-on-secondary shadow-lime-glow'
                      : 'bg-surface/80 text-on-surface-variant hover:text-error hover:bg-surface'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWish ? 'fill-on-secondary' : ''}`} />
                </button>
              </div>

              <div className="flex flex-col pt-3 px-1 gap-1 flex-grow">
                <div className="flex items-center justify-between text-outline font-label-sm text-[11px] uppercase tracking-wider">
                  <span>{product.specsSummary || product.categoryLabel}</span>
                  <span>{product.dimensionsSummary || 'Ready'}</span>
                </div>

                <Link href={`/products/${product.slug}`}>
                  <h4 className="font-display font-semibold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                    {product.name}
                  </h4>
                </Link>

                <div className="flex items-center gap-2 mt-1">
                  <span className="font-display text-lg text-secondary font-bold">
                    ₹{(product.sellingPricePaise / 100).toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPricePaise && (
                    <span className="font-sans text-xs text-outline line-through">
                      ₹{(product.compareAtPricePaise / 100).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickAdd(product)}
                className={`mt-3 w-full py-2.5 rounded-full font-label-sm text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  isJustAdded
                    ? 'bg-secondary text-on-secondary shadow-lime-glow'
                    : 'bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface border border-outline-variant/30'
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
