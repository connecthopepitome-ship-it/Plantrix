'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ShoppingBag,
  Truck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  getAdminDashboardMetrics,
  getAdminOrders,
  getAdminShipments,
  getAdminProducts,
  DashboardMetrics,
} from '@/data/adminStore';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activeShipments, setActiveShipments] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    const m = getAdminDashboardMetrics();
    const orders = getAdminOrders().slice(0, 5);
    const shipments = getAdminShipments().filter((s) => s.status !== 'DELIVERED').slice(0, 4);
    const lowStock = getAdminProducts().filter((p) => p.stock <= 5);

    setMetrics(m);
    setRecentOrders(orders);
    setActiveShipments(shipments);
    setLowStockItems(lowStock);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!metrics) {
    return (
      <div className="p-8 text-center text-outline">
        Loading operational metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
            Console Live Feed
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface mt-1">
            Plantrix Operations Dashboard
          </h1>
          <p className="font-sans text-xs text-outline mt-0.5">
            Real-time telemetry across product catalogue, patron purchases, and courier dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface hover:border-secondary transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-secondary' : 'text-outline'}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Summary Operational Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Catalogue Products */}
        <Link
          href="/admin/catalogue"
          className="group p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary/40 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Total Catalogue
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-container/40 text-primary flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-on-surface">
              {metrics.totalProducts}
            </span>
            <div className="flex items-center gap-2 text-xs text-outline mt-1 font-sans">
              <span className="text-secondary font-semibold">{metrics.activeProducts} Active</span>
              <span>•</span>
              <span className="text-tertiary">{metrics.lowStockProducts} Low Stock</span>
            </div>
          </div>
        </Link>

        {/* Card 2: Orders Awaiting Processing */}
        <Link
          href="/admin/orders"
          className="group p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary/40 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Pending Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-secondary">
              {metrics.ordersAwaitingProcessing}
            </span>
            <div className="flex items-center gap-2 text-xs text-outline mt-1 font-sans">
              <span>{metrics.totalOrders} Lifetime Orders</span>
            </div>
          </div>
        </Link>

        {/* Card 3: Active Dispatches */}
        <Link
          href="/admin/shipments"
          className="group p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary/40 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Shipments in Transit
            </span>
            <div className="w-9 h-9 rounded-xl bg-tertiary-container/40 text-tertiary flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-on-surface">
              {metrics.shipmentsInTransit}
            </span>
            <div className="flex items-center gap-2 text-xs text-outline mt-1 font-sans">
              <span className="text-primary font-semibold">{metrics.shipmentsAwaitingDispatch} Ready to Dispatch</span>
            </div>
          </div>
        </Link>

        {/* Card 4: Gross Settled Revenue */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
              Settled Volume
            </span>
            <div className="w-9 h-9 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-secondary">
              ₹{(metrics.totalRevenuePaise / 100).toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-outline mt-1 font-sans">
              All prices stored strictly in INR paise
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Operational Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Recent Orders Table */}
        <section className="lg:col-span-8 rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
                Live Ledger
              </span>
              <h3 className="font-display font-bold text-lg text-on-surface">
                Recent Purchase Orders
              </h3>
            </div>
            <Link
              href="/admin/orders"
              className="font-label-sm text-xs text-primary hover:text-secondary flex items-center gap-1 transition-colors"
            >
              <span>View All ({metrics.totalOrders})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/20 text-outline font-label-sm uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Order</th>
                  <th className="pb-3 font-semibold">Patron</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-3.5 font-display font-bold text-secondary">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5">
                      <span className="font-medium text-on-surface block">{order.customer.name}</span>
                      <span className="text-[11px] text-outline">{order.shippingAddress.city}</span>
                    </td>
                    <td className="py-3.5 font-display font-semibold text-on-surface">
                      ₹{(order.totalPaise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-secondary-container/30 text-secondary'
                            : 'bg-tertiary-container/30 text-tertiary'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-[10px] font-medium uppercase">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${order.orderId}`}
                        className="px-3 py-1 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary font-label-sm text-[10px] font-bold uppercase tracking-wider transition-colors inline-block"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column (4 cols): Dispatches & Catalogue Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Dispatches */}
          <section className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                <Truck className="w-4 h-4 text-tertiary" />
                <span>Active Shipments</span>
              </h3>
              <Link
                href="/admin/shipments"
                className="font-label-sm text-xs text-primary hover:text-secondary"
              >
                All
              </Link>
            </div>

            <div className="space-y-3">
              {activeShipments.map((shipment) => (
                <Link
                  key={shipment.shipmentId}
                  href={`/admin/shipments/${shipment.shipmentId}`}
                  className="block p-3 rounded-xl bg-surface-container/60 hover:bg-surface-container border border-outline-variant/20 hover:border-outline-variant/40 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-secondary">
                      {shipment.awbCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-primary text-[9px] font-bold font-label-sm">
                      {shipment.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant flex items-center justify-between">
                    <span>{shipment.carrierName}</span>
                    <span className="text-outline">{shipment.customerName}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Low Stock Alerts */}
          <section className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-secondary" />
                <span>Inventory Alerts</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[10px] font-bold font-label-sm">
                {lowStockItems.length} Low
              </span>
            </div>

            <div className="space-y-2.5">
              {lowStockItems.map((prod) => (
                <div
                  key={prod.productId}
                  className="p-3 rounded-xl bg-surface-container/40 border border-outline-variant/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate">
                    <h4 className="font-semibold text-on-surface truncate">{prod.name}</h4>
                    <span className="text-[11px] text-outline">SKU: {prod.sku}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display font-bold text-secondary text-sm block">
                      {prod.stock} left
                    </span>
                    <Link
                      href={`/admin/catalogue/${prod.productId}`}
                      className="text-[10px] text-primary hover:underline font-label-sm uppercase"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
