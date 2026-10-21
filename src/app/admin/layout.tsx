'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  User,
  ShieldCheck,
  ChevronRight,
  Plus,
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Catalogue', href: '/admin/catalogue', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Shipments', href: '/admin/shipments', icon: Truck },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Generate dynamic breadcrumb segments
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col lg:flex-row font-sans">
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Desktop Fixed, Mobile Drawer)               */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-container-low/95 border-r border-outline-variant/30 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand & Console Title */}
          <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-8 w-auto flex items-center">
                <Image
                  src="/images/plantrix-logo.png"
                  alt="Plantrix Botanics"
                  width={130}
                  height={36}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-on-surface block leading-tight">
                  Plantrix
                </span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary">
                  Control Center
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

          {/* Operational Node Status */}
          <div className="px-5 py-2.5 bg-surface-container-lowest/80 border-b border-outline-variant/20 flex items-center justify-between text-[11px] font-label-sm">
            <span className="text-outline uppercase tracking-wider">Fulfillment Hub</span>
            <span className="flex items-center gap-1.5 text-secondary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              IN-BLR-01 Active
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5" aria-label="Admin Navigation">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-label-md text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-primary-container/60 text-secondary border border-secondary/30 font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-secondary' : 'text-outline'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-secondary" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-4 border-t border-outline-variant/30 space-y-3 bg-surface-container-lowest/50">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-primary" />
              <span className="font-label-sm text-[11px] uppercase tracking-wider">View Storefront</span>
            </div>
            <span className="text-[10px] text-outline">Live</span>
          </Link>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-full bg-secondary-container/40 text-secondary border border-secondary/30 flex items-center justify-center font-display font-bold text-xs">
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
      {/* MAIN ADMIN WORKSPACE (With Header and Dynamic Content)     */}
      {/* ========================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
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

          {/* Quick Actions (Search, Notifications, Add Product Shortcut) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, SKUs..."
                className="w-full bg-surface-container border border-outline-variant/30 rounded-full pl-8 pr-3 py-1.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-all"
              />
            </div>

            <button
              type="button"
              className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Admin notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </button>

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
