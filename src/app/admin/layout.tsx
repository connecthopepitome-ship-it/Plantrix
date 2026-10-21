'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Truck,
  Settings,
  ExternalLink,
  Menu,
  X,
  Search,
  Bell,
  ShieldCheck,
  ChevronRight,
  Plus,
  Compass,
  Bookmark,
  PackageCheck,
  TrendingDown,
  History,
  SlidersHorizontal,
  Tags,
  ListFilter,
  Flower2,
  UtensilsCrossed,
  Home,
  Sparkles,
  Boxes,
  Wrench,
  DownloadCloud,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  deptQuery?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ADMIN_NAVIGATION: NavSection[] = [
  {
    title: 'Sourcing (Meesho)',
    items: [
      { label: 'Sourcing Dashboard', href: '/admin/sourcing', icon: Compass },
      { label: 'Find Products', href: '/admin/sourcing/find', icon: Search },
      { label: 'Saved Products', href: '/admin/sourcing/saved', icon: Bookmark, badge: '5' },
      { label: 'Imported Catalogue', href: '/admin/sourcing/imported', icon: PackageCheck },
      { label: 'Source Price Changes', href: '/admin/sourcing/price-changes', icon: TrendingDown, badge: 'Alert' },
      { label: 'Import History', href: '/admin/sourcing/history', icon: History },
      { label: 'Category & Filter Mapping', href: '/admin/sourcing/mapping', icon: SlidersHorizontal },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { label: 'All Products', href: '/admin/catalogue', icon: Layers },
      { label: 'Garden & Outdoor', href: '/admin/catalogue?dept=GARDEN_OUTDOOR', icon: Flower2, deptQuery: 'GARDEN_OUTDOOR' },
      { label: 'Kitchen Tools & Utilities', href: '/admin/catalogue?dept=KITCHEN_TOOLS', icon: UtensilsCrossed, deptQuery: 'KITCHEN_TOOLS' },
      { label: 'Home & Everyday Essentials', href: '/admin/catalogue?dept=HOME_ESSENTIALS', icon: Home, deptQuery: 'HOME_ESSENTIALS' },
      { label: 'Cleaning & Improvement', href: '/admin/catalogue?dept=CLEANING_IMPROVEMENT', icon: Sparkles, deptQuery: 'CLEANING_IMPROVEMENT' },
      { label: 'Storage & Organization', href: '/admin/catalogue?dept=STORAGE_ORGANIZATION', icon: Boxes, deptQuery: 'STORAGE_ORGANIZATION' },
      { label: 'Tools & Hardware', href: '/admin/catalogue?dept=TOOLS_HARDWARE', icon: Wrench, deptQuery: 'TOOLS_HARDWARE' },
      { label: 'Categories', href: '/admin/catalogue/categories', icon: Tags },
      { label: 'Product Attributes', href: '/admin/catalogue/attributes', icon: ListFilter },
      { label: 'Bulk Import', href: '/admin/catalogue/bulk-import', icon: DownloadCloud, badge: 'New' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Shipments', href: '/admin/shipments', icon: Truck },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic breadcrumb segments
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));

  const isLinkActive = (item: NavItem) => {
    if (item.href === '/admin') return pathname === '/admin';
    if (item.deptQuery) {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return pathname === '/admin/catalogue' && params.get('dept') === item.deptQuery;
      }
      return false;
    }
    if (item.href === '/admin/catalogue') {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return pathname === '/admin/catalogue' && !params.get('dept');
      }
      return pathname === '/admin/catalogue';
    }
    return pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col lg:flex-row font-sans">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Desktop Fixed, Mobile Drawer)               */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-container-low/95 border-r border-outline-variant/30 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand & Console Title */}
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-8 w-auto flex items-center">
                <Image
                  src="/images/plantrix-logo.png"
                  alt="Plantrix Botanics"
                  width={120}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold text-xs tracking-tight text-on-surface block leading-tight">
                  Control Center
                </span>
                <span className="font-label-sm text-[9px] uppercase tracking-wider text-secondary">
                  v2.4 Enterprise
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-outline hover:text-on-surface"
              aria-label="Close sidebar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Operational Hub Status */}
          <div className="px-4 py-2 bg-surface-container-lowest/80 border-b border-outline-variant/20 flex items-center justify-between text-[11px] font-label-sm">
            <span className="text-outline uppercase tracking-wider">Node Status</span>
            <span className="flex items-center gap-1.5 text-secondary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              IN-BLR-01 Live
            </span>
          </div>

          {/* Top Quick Link: Overview */}
          <div className="p-3 pb-1 border-b border-outline-variant/20">
            <Link
              href="/admin"
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all ${
                pathname === '/admin'
                  ? 'bg-primary-container/70 text-secondary border border-secondary/30 font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`w-4 h-4 ${pathname === '/admin' ? 'text-secondary' : 'text-outline'}`} />
                <span>Overview Dashboard</span>
              </div>
              {pathname === '/admin' && <ChevronRight className="w-3.5 h-3.5 text-secondary" />}
            </Link>
          </div>

          {/* Scrollable Navigation Groups */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
            {ADMIN_NAVIGATION.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-label-sm uppercase tracking-widest text-outline/80 font-bold">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item);

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                          active
                            ? 'bg-primary-container/80 text-secondary border border-secondary/30 font-semibold shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-secondary' : 'text-outline'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                              item.badge === 'Alert'
                                ? 'bg-error/20 text-error border border-error/30'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Settings link */}
            <div className="pt-2 border-t border-outline-variant/20">
              <Link
                href="/admin/settings"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                  pathname.startsWith('/admin/settings')
                    ? 'bg-primary-container/80 text-secondary border border-secondary/30 font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className={`w-4 h-4 ${pathname.startsWith('/admin/settings') ? 'text-secondary' : 'text-outline'}`} />
                  <span>Business Settings</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-3 border-t border-outline-variant/30 space-y-2.5 bg-surface-container-lowest/50">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span className="font-label-sm text-[11px] uppercase tracking-wider">Live Storefront</span>
            </div>
            <span className="text-[10px] text-outline">Open ↗</span>
          </Link>

          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="w-8 h-8 rounded-full bg-secondary-container/40 text-secondary border border-secondary/30 flex items-center justify-center font-display font-bold text-xs">
              AD
            </div>
            <div className="truncate flex-1">
              <span className="font-display font-semibold text-xs text-on-surface block truncate">
                Operations Lead
              </span>
              <span className="text-[10px] text-outline flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Root Administrator
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface-container-lowest/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ========================================================= */}
      {/* MAIN ADMIN WORKSPACE                                      */}
      {/* ========================================================= */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-container-low/90 backdrop-blur-xl border-b border-outline-variant/30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <nav aria-label="Admin Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-outline font-label-sm">
              <Link href="/admin" className="hover:text-primary transition-colors">
                Admin
              </Link>
              {segments.slice(1).map((seg, i) => (
                <React.Fragment key={seg}>
                  <span>/</span>
                  <span className={i === segments.length - 2 ? 'text-secondary font-bold' : ''}>
                    {seg}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Quick Actions (URL Import Shortcut, Add Product Shortcut) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products, orders, SKUs..."
                className="w-full bg-surface-container border border-outline-variant/30 rounded-full pl-8 pr-3 py-1.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-all"
              />
            </div>

            <Link
              href="/admin/sourcing/find"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface hover:border-secondary font-label-md text-xs uppercase tracking-wider font-semibold transition-all"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-secondary" />
              <span className="hidden sm:inline">Import URL</span>
            </Link>

            <Link
              href="/admin/catalogue/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
