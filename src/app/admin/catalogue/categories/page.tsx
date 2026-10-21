'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tags,
  Plus,
  ChevronRight,
  FolderTree,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { getTaxonomy, saveTaxonomyCategory } from '@/data/sourcingStore';
import { TaxonomyCategory } from '@/data/taxonomy';
import { Department } from '@/types/category';

export default function CategoriesPage() {
  const [taxonomy, setTaxonomy] = useState<TaxonomyCategory[]>(getTaxonomy());
  const [selectedDept, setSelectedDept] = useState<Department | 'ALL'>('ALL');
  const [isAdding, setIsAdding] = useState(false);

  // New Category state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>('GARDEN_OUTDOOR');
  const [description, setDescription] = useState('');

  const loadData = () => {
    setTaxonomy(getTaxonomy());
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat: TaxonomyCategory = {
      id: `cat-${Date.now()}`,
      departmentId: department,
      name: name.trim(),
      slug,
      description: description.trim(),
      active: true,
      subcategories: [],
    };

    saveTaxonomyCategory(newCat);
    setName('');
    setDescription('');
    setIsAdding(false);
    loadData();
  };

  const filteredCategories = taxonomy.filter((c) => {
    if (selectedDept !== 'ALL' && c.departmentId !== selectedDept) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/catalogue" className="text-xs text-outline hover:text-secondary">
              Catalogue
            </Link>
            <span className="text-outline text-xs">/</span>
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
              Taxonomy Architecture
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Category Taxonomy Engine
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Complies with Section 4. Configurable hierarchical taxonomy across all 6 lifestyle and botanical departments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Add Category'}</span>
        </button>
      </div>

      {/* Department Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'All Departments' },
          { id: 'GARDEN_OUTDOOR', label: 'Garden & Outdoor' },
          { id: 'KITCHEN_TOOLS', label: 'Kitchen Tools' },
          { id: 'HOME_ESSENTIALS', label: 'Home Essentials' },
          { id: 'CLEANING_IMPROVEMENT', label: 'Cleaning & Care' },
          { id: 'STORAGE_ORGANIZATION', label: 'Storage & Order' },
          { id: 'TOOLS_HARDWARE', label: 'Tools & Hardware' },
        ].map((dept) => (
          <button
            key={dept.id}
            onClick={() => setSelectedDept(dept.id as any)}
            className={`px-3 py-1.5 rounded-xl font-label-sm uppercase tracking-wider text-[11px] whitespace-nowrap transition-all ${
              selectedDept === dept.id
                ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                : 'bg-surface-container-low border border-outline-variant/30 text-outline hover:text-on-surface'
            }`}
          >
            {dept.label}
          </button>
        ))}
      </div>

      {/* New Category Form */}
      {isAdding && (
        <form
          onSubmit={handleAddCategory}
          className="p-5 rounded-2xl bg-surface-container-low border border-secondary/40 space-y-4 animate-fade-in"
        >
          <h2 className="font-display font-bold text-sm text-secondary">Create New Taxonomy Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Category Name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Garden Decor & Sculptures"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Department Assignment
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                <option value="GARDEN_OUTDOOR">Garden &amp; Outdoor</option>
                <option value="KITCHEN_TOOLS">Kitchen Tools &amp; Utilities</option>
                <option value="HOME_ESSENTIALS">Home &amp; Everyday Essentials</option>
                <option value="CLEANING_IMPROVEMENT">Cleaning &amp; Improvement</option>
                <option value="STORAGE_ORGANIZATION">Storage &amp; Organization</option>
                <option value="TOOLS_HARDWARE">Tools &amp; Hardware</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category operational description..."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs text-outline hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Category Tree Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4 hover:border-secondary/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-label-sm font-bold text-secondary">
                  {cat.departmentId.replace('_', ' ')}
                </span>
                <h3 className="font-display font-bold text-base text-on-surface mt-0.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-outline mt-0.5">{cat.description}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-bold">
                {cat.subcategories.length} Subcategories
              </span>
            </div>

            {/* Subcategories Chip Grid */}
            <div className="space-y-1.5 pt-2 border-t border-outline-variant/20">
              <span className="text-[10px] font-label-sm uppercase tracking-wider text-outline block">
                Configured Subcategories:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>{sub.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
