'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ImageIcon, RotateCcw, ArrowLeft, ZoomIn } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  badge?: string;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

export default function ProductImageGallery({
  images,
  productName,
  badge,
  isWishlisted = false,
  onToggleWishlist,
}: ProductImageGalleryProps) {
  // Ensure exactly 4 images are resolved:
  // Image 1: Hero image
  // Images 2, 3, 4: Three thumbnails
  const resolvedImages = React.useMemo(() => {
    const rawList = images && images.length > 0 ? images.filter(Boolean) : [];
    if (rawList.length === 0) {
      return [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=85',
      ];
    }
    const selected = rawList.slice(0, 4);
    while (selected.length < 4) {
      selected.push(''); // designed placeholder for missing slot
    }
    return selected;
  }, [images]);

  // selectedIndex: 0 = Image 1 (Hero), 1 = Image 2 (Thumb 1), 2 = Image 3 (Thumb 2), 3 = Image 4 (Thumb 3)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If active image becomes invalid, fallback to hero (0)
  useEffect(() => {
    if (selectedIndex > 0 && !resolvedImages[selectedIndex]) {
      setSelectedIndex(0);
    }
  }, [resolvedImages, selectedIndex]);

  const currentHeroImage = resolvedImages[selectedIndex] || resolvedImages[0];

  // The three thumbnails strictly correspond to Images 2, 3, and 4
  const thumbnails = [
    { index: 1, url: resolvedImages[1], label: 'View product image 2' },
    { index: 2, url: resolvedImages[2], label: 'View product image 3' },
    { index: 3, url: resolvedImages[3], label: 'View product image 4' },
  ];

  const handleThumbnailClick = (targetIndex: number) => {
    if (!resolvedImages[targetIndex]) return;
    if (selectedIndex === targetIndex) {
      // Clicking the already-selected thumbnail toggles back to Hero Image 1
      setSelectedIndex(0);
    } else {
      setSelectedIndex(targetIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, targetIndex: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThumbnailClick(targetIndex);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 font-sans select-none">
      {/* ========================================================= */}
      {/* IMAGE 1 — HERO IMAGE CONTAINER                             */}
      {/* ========================================================= */}
      <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0c120d] border border-outline-variant/30 shadow-2xl group flex items-center justify-center p-4 sm:p-8 transition-all duration-300">
        {/* Subtle Ambient Radial Lighting */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(185,244,108,0.08)_0%,transparent_75%)]"
          aria-hidden="true"
        />

        {/* Large Hero Main Product Image (contain, sharp, no crop) */}
        {currentHeroImage ? (
          <div className="relative w-full h-full">
            <Image
              src={currentHeroImage}
              alt={`${productName} — ${selectedIndex === 0 ? 'Main hero photograph' : `Detail photograph ${selectedIndex + 1}`}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-outline gap-2">
            <ImageIcon className="w-10 h-10 stroke-[1.5]" />
            <span className="text-xs font-label-sm uppercase tracking-wider">
              No Product Photograph
            </span>
          </div>
        )}

        {/* Top Left: Verified Sale / Quality Badge & Quick Return to Hero Image 1 */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-wrap items-center gap-2">
          {badge ? (
            <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-[11px] font-bold uppercase tracking-wider shadow-lime-glow">
              {badge}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-surface-container-lowest/85 backdrop-blur-md border border-secondary/30 text-secondary font-label-sm text-[10px] uppercase tracking-wider font-semibold">
              Verified Collection
            </span>
          )}
          {selectedIndex > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIndex(0)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-secondary/50 text-secondary hover:bg-secondary hover:text-on-secondary font-label-sm text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              title="Return to primary hero image"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hero View</span>
            </button>
          )}
        </div>

        {/* Top Right: Unobtrusive Wishlist Toggle */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-3 sm:top-4 right-3 sm:right-4 z-10 w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all ${
              isWishlisted
                ? 'bg-secondary text-on-secondary border-secondary shadow-lime-glow scale-105'
                : 'bg-surface-container-lowest/80 text-on-surface-variant border-outline-variant/30 hover:text-error hover:border-error/40 hover:scale-105'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isWishlisted ? 'fill-on-secondary scale-110' : ''
              }`}
            />
          </button>
        )}

        {/* Bottom Left: Image Counter (e.g., "1 of 4") */}
        <button
          type="button"
          onClick={() => selectedIndex !== 0 && setSelectedIndex(0)}
          className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 px-2.5 py-1 rounded-full backdrop-blur-md border text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
            selectedIndex === 0
              ? 'bg-surface-container-lowest/85 border-outline-variant/30 text-outline'
              : 'bg-surface-container-lowest/95 border-secondary/50 text-secondary hover:border-secondary cursor-pointer'
          }`}
          title={selectedIndex !== 0 ? 'Click to return to image 1' : undefined}
        >
          <span className="text-secondary font-bold">{selectedIndex + 1}</span>
          <span>of</span>
          <span>4</span>
          {selectedIndex !== 0 && (
            <span className="text-[9px] uppercase font-sans text-outline ml-0.5">
              (Reset)
            </span>
          )}
        </button>

        {/* Bottom Right: Zoom Affordance Hint (Desktop only) */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/70 backdrop-blur-md border border-outline-variant/20 text-[10px] font-label-sm uppercase text-outline pointer-events-none">
          <ZoomIn className="w-3 h-3 text-secondary" />
          <span>Hover to Inspect</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* IMAGES 2, 3, AND 4 — EXACTLY THREE THUMBNAILS             */}
      {/* One horizontal row beneath hero on Desktop, Tablet, Mobile*/}
      {/* ========================================================= */}
      <div
        className="grid grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4"
        role="region"
        aria-label="Product Image Thumbnails"
      >
        {thumbnails.map((thumb) => {
          const isSelected = selectedIndex === thumb.index;
          const isAvailable = Boolean(thumb.url);

          return (
            <button
              key={thumb.index}
              type="button"
              disabled={!isAvailable}
              onClick={() => handleThumbnailClick(thumb.index)}
              onKeyDown={(e) => isAvailable && handleKeyDown(e, thumb.index)}
              aria-label={`${thumb.label}${isSelected ? ' (Currently displayed in hero)' : ''}`}
              className={`relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border p-1.5 sm:p-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-secondary cursor-pointer ${
                isSelected
                  ? 'border-secondary ring-2 ring-secondary/50 bg-[#162118] shadow-lime-glow/20 scale-[1.02]'
                  : isAvailable
                  ? 'border-outline-variant/30 bg-[#0d130e] hover:border-secondary/40 hover:bg-[#111912]'
                  : 'border-outline-variant/20 bg-surface-container/20 opacity-40 cursor-not-allowed'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-[#0a0f0b] flex items-center justify-center p-1">
                {isAvailable ? (
                  <Image
                    src={thumb.url}
                    alt={`${productName} thumbnail ${thumb.index}`}
                    fill
                    sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 14vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-outline/50 gap-0.5">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-[9px] font-mono uppercase">Slot {thumb.index}</span>
                  </div>
                )}
              </div>

              {/* Active Botanical Mint / Electric Lime Indicator Dot */}
              {isSelected && (
                <div className="absolute bottom-2 right-2 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-secondary shadow-lime-glow animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
