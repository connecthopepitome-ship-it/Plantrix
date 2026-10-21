'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Product, ProductStatus } from '@/types/product';
import { useSearchParams } from 'next/navigation';
import { getAdminProducts, deleteAdminProduct, saveAdminProduct } from '@/data/adminStore';

function AdminCatalogueContent() {
  const searchParams = useSearchParams();
  const urlDept = searchParams?.get('dept');

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>(urlDept || 'ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadCatalogue = () => {
    setProducts(getAdminProducts());
  };

  useEffect(() => {
    if (urlDept) {
      setDepartmentFilter(urlDept);
    }
  }, [urlDept]);

  useEffect(() => {
    loadCatalogue();
  }, []);

  const handleDelete = (id: string) => {
    deleteAdminProduct(id);
    setConfirmDeleteId(null);
    loadCatalogue();
  };

  const handleToggleStatus = (product: Product) => {
    const nextStatus: ProductStatus = product.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    saveAdminProduct({ ...product, status: nextStatus });
    loadCatalogue();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === 'ALL' ||
      p.department === departmentFilter ||
      (departmentFilter === 'GARDEN_OUTDOOR' && p.department === 'PLANTS_BOTANICS') ||
      (departmentFilter === 'PLANTS_BOTANICS' && p.department === 'GARDEN_OUTDOOR');

    const matchesStatus =
      statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc') return a.sellingPricePaise - b.sellingPricePaise;
    if (sortBy === 'price-desc') return b.sellingPricePaise - a.sellingPricePaise;
    if (sortBy === 'stock') return a.stock - b.stock;
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
            Catalogue Management
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface mt-0.5">
            Products &amp; Inventory Archive
          </h1>
          <p className="font-sans text-xs text-outline">
            Manage product metadata, private supplier costs, stock levels, and publication states.
          </p>
        </div>

        <Link
          href="/admin/catalogue/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, or brand..."
            className="w-full bg-surface-container border border-outline-variant/30 rounded-full pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="ALL">All Departments</option>
            <option value="GARDEN_OUTDOOR">Garden &amp; Outdoor</option>
            <option value="KITCHEN_TOOLS">Kitchen Tools &amp; Utilities</option>
            <option value="HOME_ESSENTIALS">Home &amp; Everyday Essentials</option>
            <option value="CLEANING_IMPROVEMENT">Cleaning &amp; Improvement</option>
            <option value="STORAGE_ORGANIZATION">Storage &amp; Organization</option>
            <option value="TOOLS_HARDWARE">Tools &amp; Hardware</option>
            <option value="PLANTS_BOTANICS">Plants &amp; Botanics (Legacy)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="stock">Sort: Stock Level</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/80 text-outline font-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Artifact</th>
                <th className="py-3.5 px-4 font-semibold">Department &amp; SKU</th>
                <th className="py-3.5 px-4 font-semibold">Selling Price</th>
                <th className="py-3.5 px-4 font-semibold text-secondary">
                  Private Cost (Margin)
                </th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-outline">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                sorted.map((product) => {
                  const marginPercent = product.sourceCostPaise
                    ? Math.round(
                        ((product.sellingPricePaise - product.sourceCostPaise) /
                          product.sellingPricePaise) *
                          100
                      )
                    : 0;

                  return (
                    <tr
                      key={product.productId}
                      className="hover:bg-surface-container/60 transition-colors"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container-lowest shrink-0 border border-outline-variant/30">
                            <Image
                              src={product.imageKeys?.[0]?.startsWith('http') ? product.imageKeys[0] : 'https://lh3.googleusercontent.com/aida-public/AB6AXuChZEoXATYlvmGWZelVPp1BnGn2Kn0uXCb_4z0RZJ7UNgfEC5HA3Mw0QyqXAloqIvG3BTw1vw_gKL6mGvS47C79fqIUWdjJxB3PAKnzDvSSzI1RptTaRDvpfOrhk7wQQjmq1X3DbkUkfIPtuXurRODwYZsQxszHjLf0Gg6NebTdxL8mj3tHuRlN2NZpqIkkuthFvnx5jgMTAJZ-tjqb2dUUL-Rjqkh1ODNTBVyYgRp4nUOltgbA5KtG'}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="truncate max-w-xs">
                            <Link
                              href={`/admin/catalogue/${product.productId}`}
                              className="font-display font-semibold text-sm text-on-surface hover:text-primary transition-colors truncate block"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-outline truncate block">
                              {product.brand}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department & SKU */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-on-surface block">
                          {product.department === 'PLANTS_BOTANICS'
                            ? 'Plants & Botanics'
                            : 'Home Essentials'}
                        </span>
                        <span className="text-[11px] text-outline font-label-sm">
                          SKU: {product.sku}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 font-display font-bold text-sm text-on-surface">
                        ₹{(product.sellingPricePaise / 100).toLocaleString('en-IN')}
                      </td>

                      {/* Private Supplier Cost & Gross Margin */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-xs text-outline font-semibold">
                            ₹{((product.sourceCostPaise || 0) / 100).toLocaleString('en-IN')}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary font-label-sm text-[10px] font-bold">
                            {marginPercent}% margin
                          </span>
                        </div>
                        <span className="text-[10px] text-outline/80 block mt-0.5">
                          Private Supplier Field
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-display font-bold text-sm ${
                              product.stock <= 5 ? 'text-secondary' : 'text-on-surface'
                            }`}
                          >
                            {product.stock}
                          </span>
                          {product.stock <= 5 && (
                            <span className="text-[10px] text-tertiary font-label-sm uppercase">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          className={`px-2.5 py-1 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wider transition-colors ${
                            product.status === 'ACTIVE'
                              ? 'bg-secondary-container/30 text-secondary hover:bg-secondary-container/50'
                              : 'bg-surface-container-high text-outline hover:text-on-surface'
                          }`}
                        >
                          {product.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                            title="Preview on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/catalogue/${product.productId}`}
                            className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(product.productId)}
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-surface-container transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Destructive Delete */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container-low border border-outline-variant/40 p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-on-surface">Confirm Product Deletion</h3>
            <p className="text-xs text-outline leading-relaxed">
              Are you sure you want to delete this catalogue artifact? If this product is referenced by historical orders, consider setting its status to &quot;HIDDEN&quot; or &quot;DISCONTINUED&quot; instead.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-full font-label-sm text-xs uppercase font-semibold text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-full bg-error-container text-on-error-container font-label-sm text-xs uppercase font-bold hover:bg-error hover:text-on-error transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-outline">
          Loading catalogue archive...
        </div>
      }
    >
      <AdminCatalogueContent />
    </Suspense>
  );
}
