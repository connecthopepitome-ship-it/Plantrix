import React from 'react';
import Link from 'next/link';
import { Sprout, Filter, ArrowUpDown } from 'lucide-react';
import { DEPARTMENTS } from '@/types/category';

const BOTANICS_CATEGORIES = [
  { name: 'All Botanics', slug: 'all', count: 24 },
  { name: 'Indoor Live Plants', slug: 'indoor-plants', count: 8 },
  { name: 'Ceramic Pots & Planters', slug: 'pots-planters', count: 12 },
  { name: 'Metal Plant Stands', slug: 'plant-stands', count: 6 },
  { name: 'Hanging Planters', slug: 'hanging-planters', count: 4 },
  { name: 'Watering & Pruning Tools', slug: 'gardening-tools', count: 5 },
  { name: 'Balcony Décor', slug: 'balcony-decor', count: 7 },
];

export default function PlantsBotanicsPage() {
  const dept = DEPARTMENTS.PLANTS_BOTANICS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-brand-muted flex items-center gap-1.5">
        <Link href="/" className="hover:text-brand-forest transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-brand-forest font-semibold">{dept.title}</span>
      </nav>

      {/* Department Header */}
      <div className="bg-brand-sage-light rounded-3xl p-6 sm:p-10 border border-brand-sage-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest text-brand-sage text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Greenery & Plant Craft</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-brand-forest">
            {dept.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
            {dept.description}
          </p>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {BOTANICS_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.slug}
            type="button"
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              idx === 0
                ? 'bg-brand-forest text-white shadow-sm'
                : 'bg-white border border-brand-sage-border/80 text-brand-charcoal hover:border-brand-botanical hover:bg-brand-sage-light'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar (Baseline) */}
      <div className="flex items-center justify-between py-3 border-y border-brand-sage-border/60 text-xs text-brand-muted">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-forest" />
          <span className="font-semibold text-brand-forest">Filters</span>
          <span className="hidden sm:inline text-brand-muted">• 24 Products</span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-brand-forest" />
          <span className="font-medium">Sort by: Featured</span>
        </div>
      </div>

      {/* Product Grid Placeholder (Phase 1 Baseline) */}
      <div className="rounded-2xl border border-dashed border-brand-sage-border p-12 text-center bg-white space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-sage-light mx-auto flex items-center justify-center text-brand-botanical">
          <Sprout className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-brand-forest">
          Botanics Catalogue Ready for Data Integration
        </h3>
        <p className="text-xs text-brand-muted max-w-md mx-auto">
          Phase 1 scaffolding complete. In Phase 2 & 3, real-time products will stream directly from Cloud Firestore with Cloudflare R2 imagery.
        </p>
      </div>
    </div>
  );
}
