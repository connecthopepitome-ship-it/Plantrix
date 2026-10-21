'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { CATALOG_PRODUCTS } from '@/data/products';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const wishlistedItems = CATALOG_PRODUCTS.filter((p) => wishlist.includes(p.productId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div>
        <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
          Saved Artifacts
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface mt-1">
          Curated Wishlist
        </h1>
      </div>

      {wishlistedItems.length === 0 ? (
        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-secondary border border-outline-variant/30">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-xl text-on-surface">No Items in Wishlist</h2>
          <p className="text-sm text-outline">
            Save botanical flora, sculptural vessels, or domestic organizers to your personal curation.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
            >
              <span>Explore Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedItems.map((product) => (
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

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.productId)}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary text-on-secondary backdrop-blur-md flex items-center justify-center transition-all shadow-lime-glow z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col pt-3 px-1 gap-1 flex-grow">
                <span className="text-outline font-label-sm text-[11px] uppercase tracking-wider">
                  {product.categoryLabel}
                </span>

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
                onClick={() =>
                  addToCart({
                    productId: product.productId,
                    sku: product.sku,
                    name: product.name,
                    slug: product.slug,
                    pricePaise: product.sellingPricePaise,
                    imageUrl: product.imageUrls[0],
                  })
                }
                className="mt-3 w-full py-2.5 rounded-full bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface font-label-sm text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 border border-outline-variant/30 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Bag</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
