'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  MapPin,
  Package,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types/shipment';
import { getAdminShipments } from '@/data/adminStore';

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [carrierFilter, setCarrierFilter] = useState<string>('ALL');

  const loadShipments = () => {
    setShipments(getAdminShipments());
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filtered = shipments.filter((ship) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ship.shipmentId.toLowerCase().includes(q) ||
      ship.orderNumber.toLowerCase().includes(q) ||
      ship.customerName.toLowerCase().includes(q) ||
      ship.awbCode.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || ship.status === statusFilter;
    const matchesCarrier = carrierFilter === 'ALL' || ship.carrierName.toLowerCase().includes(carrierFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesCarrier;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
            Logistics &amp; Fulfillment
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface mt-0.5">
            Courier Shipments &amp; AWBs
          </h1>
          <p className="font-sans text-xs text-outline">
            Monitor carrier assignments, airway bills, real-time dispatch progress, and delivery verification.
          </p>
        </div>

        <button
          onClick={loadShipments}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-xs text-on-surface hover:border-secondary transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-secondary" />
          <span>Refresh Dispatches</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AWB, Shipment ID, Order #..."
            className="w-full bg-surface-container border border-outline-variant/30 rounded-full pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="ALL">All Shipment States</option>
            <option value="READY_TO_DISPATCH">Ready to Dispatch</option>
            <option value="BOOKED">Booked</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="DELAYED">Delayed</option>
            <option value="EXCEPTION">Exception</option>
          </select>

          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant/30 rounded-full px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary font-label-sm"
          >
            <option value="ALL">All Carriers</option>
            <option value="Blue Dart">Blue Dart</option>
            <option value="Delhivery">Delhivery</option>
            <option value="Xpressbees">Xpressbees</option>
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-lowest/80 text-outline font-label-sm uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Shipment ID</th>
                <th className="py-3.5 px-4 font-semibold">Order Reference</th>
                <th className="py-3.5 px-4 font-semibold">Carrier &amp; AWB</th>
                <th className="py-3.5 px-4 font-semibold">Patron Destination</th>
                <th className="py-3.5 px-4 font-semibold">Parcel Metrics</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-outline">
                    No shipments found matching the filters.
                  </td>
                </tr>
              ) : (
                filtered.map((shipment) => (
                  <tr
                    key={shipment.shipmentId}
                    className="hover:bg-surface-container/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-display font-bold text-secondary">
                      <Link
                        href={`/admin/shipments/${shipment.shipmentId}`}
                        className="hover:underline"
                      >
                        {shipment.shipmentId}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/orders/${shipment.orderId}`}
                        className="font-medium text-on-surface hover:text-primary transition-colors block"
                      >
                        {shipment.orderNumber}
                      </Link>
                      <span className="text-[10px] text-outline">
                        {shipment.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-on-surface block truncate max-w-[150px]">
                        {shipment.carrierName}
                      </span>
                      <span className="font-mono text-secondary text-[11px] block">
                        {shipment.awbCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-on-surface block truncate max-w-[140px]">
                        {shipment.customerName}
                      </span>
                      <span className="text-[11px] text-outline block">
                        {shipment.shippingAddress.city}, {shipment.shippingAddress.state}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-sans text-outline">
                      <span>{(shipment.weightGrams / 1000).toFixed(1)} kg</span>
                      <span className="text-[10px] block text-outline/80">
                        {shipment.dimensionsCm.length}×{shipment.dimensionsCm.width}×{shipment.dimensionsCm.height} cm
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wider inline-block ${
                          shipment.status === 'DELIVERED'
                            ? 'bg-secondary-container/40 text-secondary'
                            : shipment.status === 'IN_TRANSIT'
                            ? 'bg-primary-container text-primary'
                            : shipment.status === 'READY_TO_DISPATCH'
                            ? 'bg-surface-container-high text-secondary'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        {shipment.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/shipments/${shipment.shipmentId}`}
                        className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary hover:text-on-secondary font-label-sm text-[10px] uppercase font-bold tracking-wider transition-colors inline-block shadow-sm"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
