'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import {
  getAttributeMappings,
  saveAttributeMapping,
  deleteAttributeMapping,
  getCategoryAttributes,
} from '@/data/sourcingStore';
import { AttributeMappingRule } from '@/types/sourcing';
import { Department } from '@/types/category';

export default function CategoryMappingPage() {
  const [mappings, setMappings] = useState<AttributeMappingRule[]>(getAttributeMappings());
  const [isAdding, setIsAdding] = useState(false);

  // New Rule Form
  const [sourceKey, setSourceKey] = useState('');
  const [targetKey, setTargetKey] = useState('');
  const [department, setDepartment] = useState<Department>('GARDEN_OUTDOOR');
  const [transformRule, setTransformRule] = useState<'DIRECT' | 'EXTRACT_NUMBER' | 'APPEND_UNIT' | 'LOWERCASE'>('DIRECT');
  const [targetUnit, setTargetUnit] = useState('cm');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setMappings(getAttributeMappings());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceKey.trim() || !targetKey.trim()) return;

    const newRule: AttributeMappingRule = {
      id: `map-${Date.now()}`,
      sourcePlatform: 'MEESHO',
      sourceAttributeKey: sourceKey.trim(),
      targetAttributeKey: targetKey.trim(),
      departmentId: department,
      transformRule,
      targetUnit: transformRule === 'APPEND_UNIT' ? targetUnit : undefined,
      notes: notes.trim(),
    };

    saveAttributeMapping(newRule);
    setSourceKey('');
    setTargetKey('');
    setNotes('');
    setIsAdding(false);
    loadData();
  };

  const handleDelete = (id: string) => {
    deleteAttributeMapping(id);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/sourcing" className="text-xs text-outline hover:text-secondary">
              Sourcing
            </Link>
            <span className="text-outline text-xs">/</span>
            <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
              Metadata Normalization
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-on-surface mt-1">
            Category &amp; Attribute Mapping Engine
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1">
            Complies with Section 6. Map heterogeneous supplier facets from Meesho into canonical Plantrix schema with unit safety guarantees.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'New Mapping Rule'}</span>
        </button>
      </div>

      {/* 3-Tier Layer Architecture Explainer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
            Layer 1
          </span>
          <h3 className="font-display font-bold text-xs text-on-surface">Meesho Source Facets</h3>
          <p className="text-[11px] text-outline">
            Raw supplier keys (e.g. <code>Product Breadth</code>, <code>Net Quantity (N)</code>, <code>Set Of</code>).
          </p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-secondary/30 space-y-1">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
            Layer 2 (Mapping Engine)
          </span>
          <h3 className="font-display font-bold text-xs text-secondary">Canonical Attribute Schema</h3>
          <p className="text-[11px] text-outline">
            Normalized data types, unit validation (e.g. <code>pot_diameter_cm</code>, <code>piece_count</code>).
          </p>
        </div>
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
          <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
            Layer 3
          </span>
          <h3 className="font-display font-bold text-xs text-on-surface">Customer Storefront Filters</h3>
          <p className="text-[11px] text-outline">
            Vetted customer facets displayed only when supported by verified catalogue records.
          </p>
        </div>
      </div>

      {/* New Rule Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-2xl bg-surface-container-low border border-secondary/40 space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <span className="font-display font-bold text-sm text-secondary">
              Create New Attribute Mapping Rule
            </span>
            <span className="text-[10px] font-mono text-outline">Source: Meesho</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Source Attribute Key <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={sourceKey}
                onChange={(e) => setSourceKey(e.target.value)}
                placeholder="e.g. Product Breadth, Set Of..."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Target Canonical Key <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={targetKey}
                onChange={(e) => setTargetKey(e.target.value)}
                placeholder="e.g. pot_diameter_cm, piece_count..."
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Department Scope
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
                Transform Rule
              </label>
              <select
                value={transformRule}
                onChange={(e) => setTransformRule(e.target.value as any)}
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              >
                <option value="DIRECT">DIRECT (Exact Value)</option>
                <option value="EXTRACT_NUMBER">EXTRACT_NUMBER (Regex digits)</option>
                <option value="APPEND_UNIT">APPEND_UNIT (Add verified unit)</option>
                <option value="LOWERCASE">LOWERCASE (Sanitize casing)</option>
              </select>
            </div>

            {transformRule === 'APPEND_UNIT' && (
              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                  Verified Target Unit
                </label>
                <input
                  type="text"
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value)}
                  placeholder="e.g. cm, pcs, ml..."
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
                />
              </div>
            )}

            <div className={transformRule === 'APPEND_UNIT' ? 'sm:col-span-1' : 'sm:col-span-2'}>
              <label className="block text-xs font-label-md uppercase tracking-wider text-outline mb-1 font-bold">
                Operational Notes / Constraints
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Do not convert if unit is ambiguous"
                className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Existing Rules Table */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/60 text-outline font-label-sm uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Rule ID</th>
                <th className="py-3 px-4">Source Facet (Meesho)</th>
                <th className="py-3 px-4"></th>
                <th className="py-3 px-4">Canonical Attribute (Plantrix)</th>
                <th className="py-3 px-4">Department Scope</th>
                <th className="py-3 px-4">Transform Logic</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {mappings.map((m) => (
                <tr key={m.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-[10px] text-outline font-bold">{m.id}</td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30">
                      {m.sourceAttributeKey}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-secondary">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-secondary bg-primary-container/40 px-2 py-0.5 rounded border border-secondary/30">
                      {m.targetAttributeKey}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-label-sm text-[10px] text-outline font-medium">
                      {m.departmentId.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                      {m.transformRule}
                      {m.targetUnit ? ` (${m.targetUnit})` : ''}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-outline max-w-xs truncate text-[11px]">
                    {m.notes || 'Direct canonical match'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="p-1 rounded text-error/70 hover:text-error hover:bg-surface-container"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
