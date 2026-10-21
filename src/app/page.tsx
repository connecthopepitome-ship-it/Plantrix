'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sprout,
  Home,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Headphones,
  Check,
  Heart,
  ShoppingBag,
  Sparkles,
  Droplets,
  Sun,
  Activity,
  Layers,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { CATALOG_PRODUCTS, CatalogItem } from '@/data/products';

const FILTER_TABS = [
  'All Artifacts',
  'Architectural Pots',
  'Hydration Vessels',
  'Pantry Modular',
  'Kitchen Utilities',
];

export default function HomePage() {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [activeTab, setActiveTab] = useState('All Artifacts');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleQuickAdd = (item: CatalogItem) => {
    addToCart({
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      slug: item.slug,
      pricePaise: item.sellingPricePaise,
      imageUrl: item.imageUrls[0],
    });

    setAddedItems((prev) => ({ ...prev, [item.productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.productId]: false }));
    }, 2000);
  };

  const filteredProducts =
    activeTab === 'All Artifacts'
      ? CATALOG_PRODUCTS
      : CATALOG_PRODUCTS.filter((p) => p.categoryLabel === activeTab);

  return (
    <div className="flex flex-col w-full pb-16 space-y-16 sm:space-y-24">
      {/* ============================================================== */}
      {/* SECTION 2: HERO EXPERIENCE                                    */}
      {/* ============================================================== */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-8 overflow-hidden">
        {/* Atmospheric Ambient Spotlights */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary-container/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic Hook & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6 z-10">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high/80 border border-outline-variant/30 backdrop-blur-md w-max shadow-sm">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-semibold">
                Microclimate Release 2025
              </span>
              <span className="text-outline text-xs">•</span>
              <span className="font-label-sm text-xs text-on-surface-variant">
                Archival Edition
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-on-surface tracking-tight font-bold leading-[1.08]">
              A little more nature.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-primary-fixed">
                A lot more living.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Thoughtful botanical finds and everyday essentials engineered for a home that feels
              naturally expansive, scrupulously organised, and vibrantly alive.
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#product-discovery"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Sprout className="w-4 h-4" />
                <span>Explore Botanics</span>
              </a>

              <a
                href="#dual-gateway"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface font-label-md text-xs uppercase tracking-wider backdrop-blur-xl border border-outline-variant/40 transition-all shadow-md"
              >
                <span>Discover Home Essentials</span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </a>
            </div>

            {/* Telemetry Micro-Pill Shelf */}
            <div className="grid grid-cols-3 gap-3 pt-6 max-w-md">
              <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 backdrop-blur-md flex flex-col gap-0.5">
                <span className="font-label-sm text-[10px] uppercase text-outline">Specimen Purity</span>
                <span className="font-display text-lg sm:text-xl text-secondary font-bold">99.4%</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 backdrop-blur-md flex flex-col gap-0.5">
                <span className="font-label-sm text-[10px] uppercase text-outline">Equilibrium</span>
                <span className="font-display text-lg sm:text-xl text-on-surface font-bold">Calibrated</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/20 backdrop-blur-md flex flex-col gap-0.5">
                <span className="font-label-sm text-[10px] uppercase text-outline">Safe Dispatch</span>
                <span className="font-display text-lg sm:text-xl text-primary font-bold">100% Transit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Asymmetric Editorial Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest border border-outline-variant/30">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuATkqoBSmB5eEarq9c5B8Jh0Cw6pA8qte-jsmfekdo_qt2V2R5fAIOWBd-4uiv6rCi6gzl6-vN44Zh_AnNS9Nv2w76x-gLjxFhzqktmwEaVDxiXDEyqzoAIGziodgjyoVwuAubm9Da-Gibnv9-iRykgFRjtYHMi7pB31-1g2vszumZ1N3KyiRz2ZK6A4ZkHJRz_L64wwx_AgE6WxCXtYROnn9dSXW8qCsWM7ByZs3HYQzU36Ui6Hnxd"
                alt="Editorial architectural indoor Monstera Deliciosa in ribbed ceramic planter"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />

              {/* Floating Frosted Glass HUD Overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-surface/85 border border-outline-variant/40 backdrop-blur-2xl shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-secondary">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary">
                      Specimen Series 04
                    </span>
                    <span className="font-display text-sm font-semibold text-on-surface">
                      Architectural Planters
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="font-label-sm text-[10px] uppercase text-outline">
                    Photosynthetic Hub
                  </span>
                  <span className="font-label-md text-xs text-primary font-bold">
                    94.8 lx • Optimal
                  </span>
                </div>
              </div>
            </div>

            {/* Ambient Floating Mini-Card */}
            <div className="hidden sm:flex absolute -top-4 -left-6 p-3 rounded-xl bg-surface-container-high/90 border border-outline-variant/40 backdrop-blur-xl shadow-2xl items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-label-sm text-xs text-on-surface font-bold uppercase tracking-wider">
                  Acclimatised Vessel
                </div>
                <div className="font-sans text-[11px] text-outline">Ready for indoor placement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 7: BRAND TRUST BAR                                     */}
      {/* ============================================================== */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-surface-container-lowest/80 border-y border-outline-variant/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container/40 border border-outline-variant/20">
            <Truck className="w-4 h-4 text-secondary ml-2 shrink-0" />
            <span className="font-label-sm text-xs text-on-surface truncate">
              Carbon-Neutral Logistics
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container/40 border border-outline-variant/20">
            <HeartHandshake className="w-4 h-4 text-primary ml-2 shrink-0" />
            <span className="font-label-sm text-xs text-on-surface truncate">
              Curated Artisan Sourcing
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container/40 border border-outline-variant/20">
            <ShieldCheck className="w-4 h-4 text-tertiary ml-2 shrink-0" />
            <span className="font-label-sm text-xs text-on-surface truncate">
              7-Day Transit Guarantee
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-full bg-surface-container/40 border border-outline-variant/20">
            <Headphones className="w-4 h-4 text-secondary-fixed ml-2 shrink-0" />
            <span className="font-label-sm text-xs text-on-surface truncate">
              Botanical Care Advisory
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: TWO WORLDS, ONE BRAND (SPLIT GATEWAY)              */}
      {/* ============================================================== */}
      <section className="w-full px-4 sm:px-6 lg:px-8" id="dual-gateway">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
                The Synthesis
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-on-surface font-bold tracking-tight mt-1">
                Two Worlds, One Singular Living Standard
              </h2>
            </div>
            <p className="font-sans text-sm text-on-surface-variant max-w-md">
              Harmonizing pure botanical life with precise domestic organization. Select an environment
              to explore curated artifacts.
            </p>
          </div>

          {/* Split Gateway Interactive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Gateway 01: Plants & Botanics */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[16/11] flex flex-col justify-end p-6 sm:p-8 bg-surface-container-low shadow-xl border border-outline-variant/30">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnUCVkYOWo8oYN5VxT3PfqVAbo4PwT5iFJfKgWKCXxfBxzOsONGl7x_lVQT4YlL9nc1o7UrPMmLYcJ3_6XAsnp9ARrznSbNKF73Vo1K7iWIfc2v4UK-eHHFHD3x9xJT8WNENP6pCL5K775yh5_PtAPGt7_n42Os6Ra8Ut0t9Ibjaa0re4T4JJ-Mmkq6GcHTvEHx2DoDHOK20cReFBfqIUgP0MfvVQ9lxK3wAlDX7MaQJ8D0SVUmGzi"
                alt="Deep nocturnal greenhouse atmosphere, lush tropical philodendron and exotic foliage"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />

              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[11px] uppercase tracking-widest text-secondary px-3 py-0.5 rounded-full bg-secondary-container/40 border border-secondary/30 w-max">
                    Department 01
                  </span>
                  <span className="font-label-sm text-[11px] text-primary-fixed-dim uppercase tracking-wider">
                    • Living Flora
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-on-surface font-bold">
                  Plants &amp; Botanics
                </h3>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-lg leading-relaxed">
                  Sculptural terracotta planters, air-purifying broadleaf specimens, hydro-propagation
                  stations, and calibrated watering vessels engineered to sustain vitality.
                </p>
                <div className="pt-2">
                  <Link
                    href="/plants-botanics"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-high/90 group-hover:bg-secondary group-hover:text-on-secondary text-on-surface font-label-md text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
                  >
                    <span>Enter Department 01</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Gateway 02: Home & Everyday Essentials */}
            <div className="group relative rounded-2xl overflow-hidden aspect-[16/11] flex flex-col justify-end p-6 sm:p-8 bg-surface-container-low shadow-xl border border-outline-variant/30">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj1TwmUb91XqgSYQ7GyaDj7eTr0rw8Ksn7mAo3YVAc_jYtrTkxfsG3SE4yJhHiV9KHj0BjhsdQigE_fWOIzvYlh78JhMUJxuk8hU3PCPFPKkM3BjG12OmeK696I4AMqfrDHbnGxYUKxTgBvhEcnvohDdU6I7vU404oBY_IdsX7f12_0hSpkzsFuJPx2rmrFj9cc6itlQjxLqKfW0oVnFy_mdGAcRozhkVFfoCeGSTCvRnUOV9O3Dc_"
                alt="Minimalist warm Japanese-Scandinavian interior sanctuary with timber shelving and canisters"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/60 to-transparent" />

              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-[11px] uppercase tracking-widest text-tertiary px-3 py-0.5 rounded-full bg-tertiary-container/40 border border-tertiary/30 w-max">
                    Department 02
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                    • Domestic Order
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-on-surface font-bold">
                  Home &amp; Everyday Essentials
                </h3>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-lg leading-relaxed">
                  Minimalist Japandi pantries, airtight borosilicate vessels, solid brass drawer
                  dividers, and modular culinary organizers designed to quiet the mind.
                </p>
                <div className="pt-2">
                  <Link
                    href="/home-essentials"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-high/90 group-hover:bg-tertiary group-hover:text-on-tertiary text-on-surface font-label-md text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
                  >
                    <span>Enter Department 02</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: CURATED LIVING COLLECTIONS                          */}
      {/* ============================================================== */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-surface-container-lowest/50 border-y border-outline-variant/20" id="curated-collections">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                Curated Archives
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-on-surface font-bold tracking-tight mt-1">
                Curated Living Collections
              </h2>
            </div>
            <div className="font-label-sm text-xs text-outline uppercase tracking-wider">
              Batch Index • 04 / 2025
            </div>
          </div>

          {/* 4-Column Editorial Mosaic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Collection 1: Botanical Living */}
            <Link
              href="/plants-botanics"
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-surface-container p-5 flex flex-col justify-between shadow-lg border border-outline-variant/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW_sMvAQq1GYEJ8zGLxgOVeggaeUUFCxD8HD8sxALZcS7LbKPb_VlhSGoXF-bAJfrzw5J2jLeSpsStxaPcbfx7fwzh_WzE6fe4-EdKVE0b7UHMhVTu_jFHyank4yDy5iDeG1PggHEaAMj1103eUe6wGmvqMulGWtkgIB_GHnBHvmr4pIto8vzQLKccy2_qv3GjFyhL4Gwnt8pIsp833zqm9Gh48ZTtAHcJccgQ3Gidq1fyqQyrjurm"
                alt="Botanical living statement indoor trees"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="relative z-10 flex justify-between items-center">
                <span className="w-8 h-8 rounded-full bg-surface-container-high/80 backdrop-blur-md flex items-center justify-center font-label-sm text-xs text-secondary font-bold">
                  01
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </div>
              <div className="relative z-10 flex flex-col">
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary font-semibold">
                  Flora Systems
                </span>
                <h4 className="font-display text-lg text-on-surface font-bold">Botanical Living</h4>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2 mt-1">
                  Statement specimen trees and rare acclimatized tropical indoor foliage.
                </p>
              </div>
            </Link>

            {/* Collection 2: Small-Space Solutions */}
            <Link
              href="/home-essentials"
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-surface-container p-5 flex flex-col justify-between shadow-lg border border-outline-variant/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvfrcQXCgw2DjFk7lumpovjti2KfcqvlZ2aJpw11hwtfQ4W6kRJG5b7Hpbuu24JxGbJ-ejDOXVFK4p5XHoaVudF9bVaH2YitQ2extRjm4FKPCFXJfedtRly_1t5yJigTRBYe-_geMuUI3OMT_MLKUOovvvTv8Jdj_TPyDxhJ7YCEJDpKFvPVefEAHp25RVwfhKBSCNwXYNCLn1A1iw48CsZHSEGdZkwO5JHhwTgyBLHJk9pkvFaTCw"
                alt="Small space plant suspension racks and shelves"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="relative z-10 flex justify-between items-center">
                <span className="w-8 h-8 rounded-full bg-surface-container-high/80 backdrop-blur-md flex items-center justify-center font-label-sm text-xs text-secondary font-bold">
                  02
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </div>
              <div className="relative z-10 flex flex-col">
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-semibold">
                  Micro-Footprint
                </span>
                <h4 className="font-display text-lg text-on-surface font-bold">Small-Space Solutions</h4>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2 mt-1">
                  Ceiling suspensions, multi-tier vertical pedestals, and windowsill arrays.
                </p>
              </div>
            </Link>

            {/* Collection 3: Pots & Planters */}
            <Link
              href="/plants-botanics"
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-surface-container p-5 flex flex-col justify-between shadow-lg border border-outline-variant/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdhCDFDQJ3gWD7NHXE3vW3dHpm-8vfSPAeXW-N5vD3hTjI3suVeKabqKjG6-OeZi5fo-sVLkCt5ytr0aawAiRZZeWJd5lIi7dLWnMcNQJfW3cQLtQ6JPWVzZRNRxcDEwVl1FIge9_Lb6jXkArjDIr6ciRBL1ajIchJM5zWKkCBw2X0aJFqRo2iMw2wyhnMNxQYObkWZm-OCnwR3KY4wLFw4BX0SoroRuodSpCRcgxurn_mqRECH7bw"
                alt="Tactile ceramic and terracotta planters"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="relative z-10 flex justify-between items-center">
                <span className="w-8 h-8 rounded-full bg-surface-container-high/80 backdrop-blur-md flex items-center justify-center font-label-sm text-xs text-secondary font-bold">
                  03
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </div>
              <div className="relative z-10 flex flex-col">
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-tertiary font-semibold">
                  Material Craft
                </span>
                <h4 className="font-display text-lg text-on-surface font-bold">Pots &amp; Planters</h4>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2 mt-1">
                  Ribbed ceramics, porous terracotta bodies, and internal moisture reservoirs.
                </p>
              </div>
            </Link>

            {/* Collection 4: Everyday Organisers */}
            <Link
              href="/home-essentials"
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-surface-container p-5 flex flex-col justify-between shadow-lg border border-outline-variant/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhpoN8HoX8_03xi9qNn7j-Vf20GkoFmSHbdgs8uFV1yrBIB8QgOp6sIHRyCiRDY4ah4if1LwnhUYR6DGI1bohw1Hmm52u5bxkrUbT3Nf3qPY3B18nxBojwI31G91Xvu8hRCm4ygs8AWgjpTURzEfGmmLEJYItTCHhWBQwbLXyHM5GvYFHxIcIh1rMsp541QVqZvLzDOFe3wtfdv485lvXtMaLVrQAAZBTJDHpc51wk87ndBTjfzapg"
                alt="Flawless organized luxury kitchen pantry"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
              <div className="relative z-10 flex justify-between items-center">
                <span className="w-8 h-8 rounded-full bg-surface-container-high/80 backdrop-blur-md flex items-center justify-center font-label-sm text-xs text-secondary font-bold">
                  04
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </div>
              <div className="relative z-10 flex flex-col">
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary-fixed font-semibold">
                  Pantry &amp; Hearth
                </span>
                <h4 className="font-display text-lg text-on-surface font-bold">Everyday Organisers</h4>
                <p className="font-sans text-xs text-on-surface-variant line-clamp-2 mt-1">
                  Aesthetic borosilicate glass canisters, brass dividers, and modular containers.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: CURATED PRODUCT DISCOVERY (WITH REAL INR SHOPPING)   */}
      {/* ============================================================== */}
      <section className="w-full px-4 sm:px-6 lg:px-8" id="product-discovery">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Section Header with Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
                Seasonal Allocation
              </span>
              <h2 className="font-display text-2xl sm:text-4xl text-on-surface font-bold tracking-tight mt-1">
                Curated Product Discovery
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full font-label-sm text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-secondary text-on-secondary shadow-lime-glow'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWish = isWishlisted(product.productId);
              const isJustAdded = addedItems[product.productId];

              return (
                <div
                  key={product.productId}
                  className="group flex flex-col rounded-2xl bg-surface-container-low p-3.5 shadow-md hover:shadow-2xl border border-outline-variant/30 hover:border-outline-variant/60 transition-all duration-300"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/20">
                    <Image
                      src={product.imageUrls[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                      {product.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] uppercase font-bold shadow-sm">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
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

                  {/* Product Details */}
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

                    {/* Price in INR */}
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

                  {/* Quick-Add Button */}
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
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: BOTANICAL EDITORIAL STORY                           */}
      {/* ============================================================== */}
      <section className="w-full px-4 sm:px-6 lg:px-8" id="editorial-story">
        <div className="max-w-7xl mx-auto relative rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest min-h-[460px] flex items-center border border-outline-variant/30">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZGa0WKQsRNty2oI1iqZ04KtBPeeP0C6RPqNNl4ytEfi_4OpYM_dMxm7jrgtC-Cw-gXZ8ORQrJRf_PHojL8YgRHvSREHc6bsdNBpCnuGMRRFcBEvUR6Oe1fx9RrClRYPQMVx7ye25Vr1BIZbqEdnV4PmXDhg82-ky2LCOQLVtWeJDb5mY8-korD3iTQQKGDk3AtKH8FD32LhW4HCWyTJSXXd0l1WN_SckngC7J8DvJsCtwoVWBYQnB"
            alt="Wide cinematic architectural interior of greenhouse sanctuary"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/85 to-surface-container-lowest/40" />

          <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-2xl flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">
                Editorial Vol. 14 • Biophilic Architecture
              </span>
            </div>

            <blockquote className="font-display text-3xl sm:text-5xl text-on-surface font-semibold tracking-tight leading-tight">
              “Living spaces breathe differently when curated with intention.”
            </blockquote>

            <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
              We treat the modern interior not as a static enclosure, but as an active photosynthetic
              ecosystem. Our craft balances biological requirements with pure visual composure.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="#dual-gateway"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider font-bold hover:bg-secondary hover:text-on-secondary transition-all shadow-lg"
              >
                <span>Explore The Two Worlds</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <span className="font-label-sm text-xs text-outline uppercase tracking-wider hidden sm:inline-block">
                Curated by Plantrix Botanical Team
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 8: ACCLIMATIZATION TELEMETRY MODULE                    */}
      {/* ============================================================== */}
      <section className="w-full px-4 sm:px-6 lg:px-8" id="acclimatization">
        <div className="max-w-7xl mx-auto rounded-2xl bg-surface-container-low p-6 sm:p-8 border border-outline-variant/30 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col gap-2">
            <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
              Telemetry Live Feed
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-on-surface font-semibold">
              Flagship Microclimate Acclimatization Status
            </h3>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Every specimen leaves our nursery only after achieving stable transpiration equilibrium
              within synthetic domestic conditions.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Metric 1 */}
            <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase text-outline">Transpiration</span>
                <Droplets className="w-4 h-4 text-secondary" />
              </div>
              <span className="font-display text-2xl text-on-surface font-bold">68%</span>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '68%' }} />
              </div>
              <span className="font-sans text-[11px] text-on-surface-variant">
                Calibrated Room Equilibrium
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase text-outline">Photoperiod</span>
                <Sun className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-2xl text-on-surface font-bold">14.2h</span>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '82%' }} />
              </div>
              <span className="font-sans text-[11px] text-on-surface-variant">
                Full-Spectrum Simulated Day
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-xl bg-surface/70 backdrop-blur-md border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-[11px] uppercase text-outline">Substrate pH</span>
                <Activity className="w-4 h-4 text-tertiary" />
              </div>
              <span className="font-display text-2xl text-on-surface font-bold">6.4</span>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '64%' }} />
              </div>
              <span className="font-sans text-[11px] text-on-surface-variant">
                Bio-Mineral Buffer Optimal
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
