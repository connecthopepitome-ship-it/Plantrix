'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Printer,
  ShieldCheck,
  Package,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '@/types/shipment';
import { getAdminShipmentById, updateAdminShipmentStatus } from '@/data/adminStore';

const ADVANCEABLE_STATES: ShipmentStatus[] = [
  'READY_TO_DISPATCH',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [newEventDesc, setNewEventDesc] = useState('');
  const [showLabelModal, setShowLabelModal] = useState(false);

  const loadData = () => {
    if (id) {
      const s = getAdminShipmentById(id);
      if (s) setShipment(s);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!shipment) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display font-bold text-xl text-on-surface">Shipment Record Not Found</h2>
        <p className="text-xs text-outline">The requested AWB or shipment ID does not exist.</p>
        <Link
          href="/admin/shipments"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Shipments</span>
        </Link>
      </div>
    );
  }

  const handleAdvanceStatus = (nextStatus: ShipmentStatus) => {
    updateAdminShipmentStatus(shipment.shipmentId, nextStatus, `Logistics scan: status transitioned to ${nextStatus.replace(/_/g, ' ')}`);
    loadData();
  };

  const handleAppendEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventDesc.trim()) {
      updateAdminShipmentStatus(shipment.shipmentId, shipment.status, newEventDesc.trim());
      setNewEventDesc('');
      loadData();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/shipments"
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Back to shipments"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl text-on-surface">
                {shipment.shipmentId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold uppercase">
                {shipment.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-outline font-sans">
              AWB: <span className="font-mono text-secondary">{shipment.awbCode}</span> • Allocated for Order{' '}
              <Link
                href={`/admin/orders/${shipment.orderId}`}
                className="text-primary hover:underline font-semibold"
              >
                {shipment.orderNumber}
              </Link>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLabelModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            <span>Shipping Label</span>
          </button>
        </div>
      </div>

      {/* Status Stepper Progression */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
            Carrier Transition Pipeline
          </span>
          <span className="text-xs text-secondary font-label-sm font-bold">
            Carrier: {shipment.carrierName} ({shipment.serviceType.replace(/_/g, ' ')})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ADVANCEABLE_STATES.map((state, idx) => {
            const isCurrent = shipment.status === state;
            const isPast =
              ADVANCEABLE_STATES.indexOf(shipment.status) > idx ||
              shipment.status === 'DELIVERED';

            return (
              <button
                key={state}
                type="button"
                onClick={() => handleAdvanceStatus(state)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-secondary text-on-secondary border-secondary shadow-lime-glow font-bold'
                    : isPast
                    ? 'bg-primary-container/40 border-primary text-primary font-medium'
                    : 'bg-surface-container border-outline-variant/20 text-outline hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="font-label-sm text-[10px] uppercase tracking-wider">
                  Checkpoint 0{idx + 1}
                </span>
                <span className="font-sans text-xs font-semibold leading-tight">
                  {state.replace(/_/g, ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Tracking Events Audit */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-6 shadow-xl">
            <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span>Carrier Tracking Events Timeline</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-outline-variant/30">
              {shipment.trackingEvents.map((evt, idx) => (
                <div key={evt.eventId || idx} className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-low shadow-sm" />
                  <div className="flex-1 p-3.5 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-label-sm uppercase tracking-wider text-secondary font-bold">
                        {evt.statusLabel || evt.status}
                      </span>
                      <span className="text-[11px] text-outline font-mono">
                        {new Date(evt.timestamp).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    {evt.location && (
                      <p className="text-[11px] text-primary flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>{evt.location}</span>
                      </p>
                    )}
                    <p className="text-xs text-on-surface-variant pt-0.5">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Append Tracking Event Form */}
            <form onSubmit={handleAppendEvent} className="pt-4 border-t border-outline-variant/20 flex gap-2">
              <input
                type="text"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Append carrier scan (e.g. Scanned into line-haul)..."
                className="flex-1 bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-sm text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log Scan</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Destination & Parcel Specifications */}
        <div className="lg:col-span-5 space-y-6">
          {/* Destination Address Card */}
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>Consignee Destination</span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-display font-bold text-base text-on-surface">
                {shipment.customerName}
              </h4>
              <p className="text-on-surface-variant font-mono">{shipment.customerPhone}</p>
              <div className="pt-2 text-on-surface leading-relaxed">
                <p>{shipment.shippingAddress.line1}</p>
                {shipment.shippingAddress.line2 && <p>{shipment.shippingAddress.line2}</p>}
                <p className="text-secondary font-semibold">
                  {shipment.shippingAddress.city}, {shipment.shippingAddress.state} -{' '}
                  {shipment.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Parcel Specifications Card */}
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
              <Package className="w-4 h-4 text-secondary" />
              <span>Parcel Specifications</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                <span className="font-label-sm text-[10px] uppercase text-outline block">Gross Weight</span>
                <span className="font-display font-bold text-sm text-on-surface">
                  {(shipment.weightGrams / 1000).toFixed(2)} kg
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20">
                <span className="font-label-sm text-[10px] uppercase text-outline block">Box Geometry</span>
                <span className="font-display font-bold text-sm text-on-surface">
                  {shipment.dimensionsCm.length}×{shipment.dimensionsCm.width}×{shipment.dimensionsCm.height} cm
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-outline-variant/20">
              <span className="font-label-sm text-[10px] uppercase text-outline tracking-wider block">
                Manifest Enclosure Items ({shipment.items.reduce((s, i) => s + i.quantity, 0)})
              </span>
              {shipment.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-on-surface truncate">{i.name}</span>
                  <span className="font-mono text-secondary font-bold">×{i.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Label Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-surface-container-low border border-outline-variant/40 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <span className="font-label-sm text-xs uppercase text-secondary font-bold">
                  Carrier Logistics Manifest
                </span>
                <h3 className="font-display font-bold text-lg text-on-surface">
                  Air Waybill #{shipment.awbCode}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold">
                PRINTABLE
              </span>
            </div>

            {/* Thermal Label Simulation */}
            <div className="p-5 rounded-2xl bg-white text-zinc-950 font-sans space-y-4 border border-zinc-300">
              <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-base tracking-tight">PLANTRIX BOTANICS DISPATCH</h4>
                  <p className="text-[10px] text-zinc-600">Bengaluru Fulfillment Nursery Hub #01</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">{shipment.carrierName}</span>
                  <p className="text-[10px] text-zinc-600">{shipment.serviceType}</p>
                </div>
              </div>

              <div className="border-b border-zinc-800 pb-3">
                <span className="text-[9px] uppercase font-bold text-zinc-500 block">Deliver To:</span>
                <p className="font-bold text-sm">{shipment.customerName}</p>
                <p className="text-xs">{shipment.shippingAddress.line1}, {shipment.shippingAddress.line2}</p>
                <p className="font-bold text-xs">
                  {shipment.shippingAddress.city}, {shipment.shippingAddress.state} - {shipment.shippingAddress.postalCode}
                </p>
                <p className="text-xs">Phone: {shipment.customerPhone}</p>
              </div>

              <div className="flex justify-between text-xs pt-1">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Order Ref:</span>
                  <span className="font-bold">{shipment.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Gross Weight:</span>
                  <span className="font-bold">{(shipment.weightGrams / 1000).toFixed(2)} KG</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block">Package:</span>
                  <span className="font-bold">Fragile Flora</span>
                </div>
              </div>

              {/* Simulated Barcode */}
              <div className="pt-3 text-center border-t border-zinc-300">
                <div className="h-10 bg-zinc-950 mx-auto rounded flex items-center justify-center text-white font-mono tracking-widest text-xs">
                  ||||| | |||| ||| |||||| |||| | ||| |||||
                </div>
                <span className="font-mono text-xs font-bold text-zinc-700 tracking-wider">
                  {shipment.awbCode}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLabelModal(false)}
                className="px-4 py-2 rounded-full font-label-sm text-xs uppercase font-semibold text-on-surface-variant hover:text-on-surface"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Thermal label dispatched to printer for AWB ${shipment.awbCode}`);
                  setShowLabelModal(false);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary text-on-secondary font-label-sm text-xs uppercase font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Thermal Label</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
