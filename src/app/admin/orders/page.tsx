'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { getAdminOrders } from '@/data/adminStore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-dev-admin': 'true' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setOrders(data.data);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setOrders(getAdminOrders());
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.phone.includes(query) ||
      order.shippingAddress.city.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
            Order Fulfillment
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface mt-0.5">
            Purchase Orders Ledger
          </h1>
          <p className="font-sans text-xs text-outline">
            Audit customer orders, track payments, update lifecycle states, and initiate courier bookings.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-xs text-on-surface hover:border-secondary transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-secondary" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, patron, phone, city..."
            className="w-full bg-surface-container border border-outline-variant/30 rounded-full pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="ALL">All Order States</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/80 text-outline font-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Order #</th>
                <th className="py-3.5 px-4 font-semibold">Date &amp; Time</th>
                <th className="py-3.5 px-4 font-semibold">Patron Details</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment State</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-outline">
                    No purchase orders found matching the filter query.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-surface-container/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-display font-bold text-secondary text-sm">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 text-outline font-sans">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-on-surface block truncate max-w-[150px]">
                          {order.customer.name}
                        </span>
                        <span className="text-[11px] text-outline block">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-on-surface">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} items
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-display font-bold text-sm text-on-surface">
                        ₹{(order.totalPaise / 100).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-secondary-container/30 text-secondary'
                              : 'bg-tertiary-container/30 text-tertiary'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-outline block mt-0.5">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wider inline-block ${
                            order.status === 'DELIVERED'
                              ? 'bg-secondary-container/40 text-secondary'
                              : order.status === 'SHIPPED'
                              ? 'bg-primary-container text-primary'
                              : order.status === 'PROCESSING'
                              ? 'bg-surface-container-high text-secondary'
                              : order.status === 'CANCELLED'
                              ? 'bg-error-container/60 text-on-error-container'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.orderId}`}
                          className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary font-label-sm text-[10px] uppercase font-bold tracking-wider transition-colors inline-block shadow-sm"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
