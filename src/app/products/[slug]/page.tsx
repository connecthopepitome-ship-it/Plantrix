'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import {
  Sprout,
  Home,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  ArrowRight,
  Droplets,
  RotateCcw,
} from 'lucide-react';
import { CATALOG_PRODUCTS, getProductBySlug } from '@/data/products';
import { useShop } from '@/context/ShopContext';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);

  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-on-surface">Product Not Found</h1>
        <p className="text-sm text-outline">The requested botanical artifact does not exist in our archives.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const isWish = isWishlisted(product.productId);
  const relatedProducts = CATALOG_PRODUCTS.filter(
    (p) => p.department === product.department && p.productId !== product.productId
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.productId,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        pricePaise: product.sellingPricePaise,
        imageUrl: product.imageUrls[0],
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="font-label-sm text-xs text-outline flex items-center gap-2">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={product.department === 'PLANTS_BOTANICS' ? '/plants-botanics' : '/home-essentials'}
          className="hover:text-primary transition-colors"
        >
          {product.department === 'PLANTS_BOTANICS' ? 'Plants & Botanics' : 'Home Essentials'}
        </Link>
        <span>/</span>
        <span className="text-secondary truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shadow-2xl">
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-xs font-bold uppercase shadow-lime-glow">
                  {product.badge}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Purchasing Controls & Specs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-label-sm uppercase tracking-wider text-secondary">
              <span>{product.brand}</span>
              <span>•</span>
              <span className="text-outline">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-on-surface leading-tight">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="font-display text-3xl font-bold text-secondary">
                ₹{(product.sellingPricePaise / 100).toLocaleString('en-IN')}
              </span>
              {product.compareAtPricePaise && (
                <span className="font-sans text-sm text-outline line-through">
                  ₹{(product.compareAtPricePaise / 100).toLocaleString('en-IN')}
                </span>
              )}
              <span className="font-label-sm text-xs text-primary font-semibold uppercase tracking-wider">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            {product.description || product.shortDescription}
          </p>

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="p-4 rounded-xl bg-surface-container/60 border border-outline-variant/20 space-y-2">
              <h4 className="font-label-sm text-xs uppercase text-primary tracking-wider font-semibold">
                Curated Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-on-surface-variant">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Row: Quantity + Add to Bag + Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-outline-variant/40 rounded-full bg-surface-container px-2 py-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-display font-bold text-sm text-on-surface">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-full font-label-md text-xs uppercase tracking-widest font-bold transition-all shadow-lime-glow flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-secondary text-on-secondary shadow-lime-glow-lg'
                    : 'bg-secondary text-on-secondary hover:shadow-lime-glow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {/* Wishlist Toggle Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.productId)}
                aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-12 h-12 rounded-full border border-outline-variant/40 flex items-center justify-center transition-colors shrink-0 ${
                  isWish
                    ? 'bg-secondary text-on-secondary shadow-lime-glow'
                    : 'bg-surface-container text-on-surface-variant hover:text-error hover:bg-surface-container-high'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-on-secondary' : ''}`} />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant/20 text-xs text-outline">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-secondary shrink-0" />
              <span>Pan-India Safe Dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-tertiary shrink-0" />
              <span>7-Day Transit Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-outline-variant/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
                Complementary Selections
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-on-surface mt-0.5">
                More from {product.department === 'PLANTS_BOTANICS' ? 'Plants & Botanics' : 'Home Essentials'}
              </h3>
            </div>
            <Link
              href={product.department === 'PLANTS_BOTANICS' ? '/plants-botanics' : '/home-essentials'}
              className="font-label-sm text-xs text-primary hover:text-secondary flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.productId}
                href={`/products/${rel.slug}`}
                className="group rounded-2xl bg-surface-container-low p-3.5 border border-outline-variant/30 hover:border-outline-variant/60 shadow-md hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-lowest">
                  <Image
                    src={rel.imageUrls[0]}
                    alt={rel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="pt-3 px-1 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">
                      {rel.categoryLabel}
                    </span>
                    <h4 className="font-display font-semibold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                      {rel.name}
                    </h4>
                  </div>
                  <span className="font-display text-base font-bold text-secondary mt-2">
                    ₹{(rel.sellingPricePaise / 100).toLocaleString('en-IN')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
