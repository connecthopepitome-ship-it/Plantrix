import React from 'react';
import Link from 'next/link';
import { Home, Filter, ArrowUpDown } from 'lucide-react';
import { DEPARTMENTS } from '@/types/category';

const HOME_CATEGORIES = [
  { name: 'All Essentials', slug: 'all', count: 32 },
  { name: 'Kitchen Utilities', slug: 'kitchen-utilities', count: 14 },
  { name: 'Pantry Organizers', slug: 'pantry-storage', count: 8 },
  { name: 'Bathroom Organization', slug: 'bathroom-accessories', count: 6 },
  { name: 'Space-Saving Hacks', slug: 'space-saving', count: 9 },
  { name: 'Cleaning Accessories', slug: 'cleaning-tools', count: 5 },
];

export default function HomeEssentialsPage() {
  const dept = DEPARTMENTS.HOME_ESSENTIALS;

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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sage-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-subtle">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-terracotta-light text-brand-terracotta text-xs font-semibold">
            <Home className="w-3.5 h-3.5" />
            <span>Functional Home Living</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-brand-forest">
            {dept.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            {dept.description}
          </p>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {HOME_CATEGORIES.map((cat, idx) => (
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
          <span className="hidden sm:inline text-brand-muted">• 32 Products</span>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-brand-forest" />
          <span className="font-medium">Sort by: Featured</span>
        </div>
      </div>

      {/* Product Grid Placeholder (Phase 1 Baseline) */}
      <div className="rounded-2xl border border-dashed border-brand-sage-border p-12 text-center bg-white space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-terracotta-light mx-auto flex items-center justify-center text-brand-terracotta">
          <Home className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-brand-forest">
          Home Essentials Ready for Data Integration
        </h3>
        <p className="text-xs text-brand-muted max-w-md mx-auto">
          Phase 1 scaffolding complete. In Phase 2 & 3, real-time products will stream directly from Cloud Firestore with Cloudflare R2 imagery.
        </p>
      </div>
    </div>
  );
}
