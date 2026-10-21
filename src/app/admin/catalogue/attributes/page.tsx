'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ListFilter,
  Plus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { getCategoryAttributes, saveCategoryAttribute } from '@/data/sourcingStore';
import { CategoryAttribute } from '@/types/sourcing';
import { Department } from '@/types/category';

export default function ProductAttributesPage() {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>(getCategoryAttributes());
  const [isAdding, setIsAdding] = useState(false);

  // New attribute state
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [dataType, setDataType] = useState<'text' | 'number' | 'boolean' | 'select'>('text');
  const [unit, setUnit] = useState('');
  const [department, setDepartment] = useState<Department>('GARDEN_OUTDOOR');
  const [isFilterable, setIsFilterable] = useState(true);
  const [isStorefrontVisible, setIsStorefrontVisible] = useState(true);
  const [isSeoMetadata, setIsSeoMetadata] = useState(false);

  const loadData = () => {
    setAttributes(getCategoryAttributes());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !name.trim()) return;

    const newAttr: CategoryAttribute = {
      attributeKey: key.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_'),
      displayName: name.trim(),
      dataType,
      unit: unit.trim() || undefined,
      departmentId: department,
      categoryId: 'all',
      isRequired: false,
      isFilterable,
      isStorefrontVisible,
      isSearchable: true,
      isSeoMetadata,
    };

    saveCategoryAttribute(newAttr);
    setKey('');
    setName('');
    setUnit('');
    setIsAdding(false);
    loadData();
  };

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
              Schema Definitions
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Dynamic Product Attributes Engine
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Complies with Section 5E. Manage typed canonical attributes, unit definitions, and storefront filter eligibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'New Attribute'}</span>
        </button>
      </div>

      {/* New Attribute Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-surface-container-low border border-secondary/40 space-y-4 animate-fade-in"
        >
          <h2 className="font-display font-bold text-sm text-secondary">Register New Product Attribute</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Display Name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!key) {
                    setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_'));
                  }
                }}
                placeholder="e.g. Water Tank Capacity"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Internal Schema Key <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. water_capacity_ml"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-mono text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Data Type
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as any)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                <option value="text">Text / String</option>
                <option value="number">Numeric Range</option>
                <option value="boolean">Boolean Flag (Yes/No)</option>
                <option value="select">Categorical (Select)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Standard Unit (Optional)
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. cm, ml, kg, pcs"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFilterable}
                onChange={(e) => setIsFilterable(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span className="text-on-surface font-medium">Filterable in Sourcing &amp; Catalogue</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isStorefrontVisible}
                onChange={(e) => setIsStorefrontVisible(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span className="text-on-surface font-medium">Visible to Storefront Customers</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSeoMetadata}
                onChange={(e) => setIsSeoMetadata(e.target.checked)}
                className="accent-secondary w-4 h-4 rounded"
              />
              <span className="text-on-surface font-medium">Include in SEO Meta tags</span>
            </label>
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
              Save Attribute
            </button>
          </div>
        </form>
      )}

      {/* Attributes Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Display Name</th>
                <th className="py-3 px-4">Internal Schema Key</th>
                <th className="py-3 px-4">Data Type &amp; Unit</th>
                <th className="py-3 px-4">Department Scope</th>
                <th className="py-3 px-4 text-center">Filterable</th>
                <th className="py-3 px-4 text-center">Storefront Visible</th>
                <th className="py-3 px-4 text-center">SEO Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {attributes.map((attr) => (
                <tr key={attr.attributeKey} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {attr.displayName}
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-secondary">
                    {attr.attributeKey}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">
                      {attr.dataType.toUpperCase()} {attr.unit ? `(${attr.unit})` : ''}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-label-sm text-[11px] text-outline font-medium">
                    {attr.departmentId.replace('_', ' ')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {attr.isFilterable ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-outline/40 mx-auto" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {attr.isStorefrontVisible ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-outline/40 mx-auto" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {attr.isSeoMetadata ? (
                      <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-outline/40 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
