'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  CreditCard,
  FileText,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';
import {
  getAdminOrderById,
  updateAdminOrderStatus,
  getAdminShipments,
  createAdminShipmentForOrder,
} from '@/data/adminStore';
import { Shipment } from '@/types/shipment';

const ORDER_LIFECYCLE_STEPS: OrderStatus[] = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
];

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [linkedShipment, setLinkedShipment] = useState<Shipment | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [carrierChoice, setCarrierChoice] = useState('Blue Dart Express Air');
  const [serviceChoice, setServiceChoice] = useState<'AIR_EXPRESS' | 'SURFACE_STANDARD'>('AIR_EXPRESS');

  const loadData = () => {
    if (id) {
      const o = getAdminOrderById(id);
      if (o) {
        setOrder(o);
        const shipments = getAdminShipments();
        const ship = shipments.find((s) => s.orderId === o.orderId || s.orderNumber === o.orderNumber);
        if (ship) setLinkedShipment(ship);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!order) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display font-bold text-xl text-on-surface">Order Not Found</h2>
        <p className="text-xs text-outline">The requested purchase order record does not exist.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Orders</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: OrderStatus) => {
    updateAdminOrderStatus(order.orderId, status);
    loadData();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      updateAdminOrderStatus(order.orderId, order.status, newNote.trim());
      setNewNote('');
      loadData();
    }
  };

  const handleBookShipment = () => {
    createAdminShipmentForOrder(order, carrierChoice, serviceChoice);
    setShowShipmentModal(false);
    loadData();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Back to orders"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl text-on-surface">
                {order.orderNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold uppercase">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-outline font-sans">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!linkedShipment && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
            <button
              type="button"
              onClick={() => setShowShipmentModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-wider font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Book Courier Dispatch</span>
            </button>
          )}

          {linkedShipment && (
            <Link
              href={`/admin/shipments/${linkedShipment.shipmentId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs text-secondary font-semibold transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Track Dispatch #{linkedShipment.awbCode}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Lifecycle Status Stepper */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-xs uppercase tracking-wider text-outline font-semibold">
            Order Fulfillment Lifecycle
          </span>
          <span className="text-xs text-secondary font-label-sm font-bold">
            Current: {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ORDER_LIFECYCLE_STEPS.map((step, idx) => {
            const isCurrent = order.status === step;
            const isPast =
              ORDER_LIFECYCLE_STEPS.indexOf(order.status) > idx ||
              order.status === 'DELIVERED';

            return (
              <button
                key={step}
                type="button"
                onClick={() => handleStatusChange(step)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-secondary text-on-secondary border-secondary shadow-lime-glow font-bold'
                    : isPast
                    ? 'bg-primary-container/40 border-primary text-primary font-medium'
                    : 'bg-surface-container border-outline-variant/20 text-outline hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="font-label-sm text-[10px] uppercase tracking-wider">
                  Step 0{idx + 1}
                </span>
                <span className="font-sans text-xs font-semibold leading-tight">
                  {step.replace(/_/g, ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Order Items & Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Item Snapshot Table */}
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-on-surface">
              Order Item Snapshot ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-outline font-label-sm uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Product Artifact</th>
                    <th className="pb-3 font-semibold">SKU</th>
                    <th className="pb-3 font-semibold">Unit Price</th>
                    <th className="pb-3 font-semibold">Qty</th>
                    <th className="pb-3 font-semibold text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container/40">
                      <td className="py-3 font-semibold text-on-surface">
                        {item.nameSnapshot}
                      </td>
                      <td className="py-3 font-mono text-outline">{item.sku}</td>
                      <td className="py-3 font-display text-on-surface font-semibold">
                        ₹{(item.unitPricePaise / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 font-display font-bold text-secondary">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-display font-bold text-on-surface">
                        ₹{(item.lineTotalPaise / 100).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-outline-variant/20 pt-4 space-y-2 max-w-xs ml-auto text-xs">
              <div className="flex justify-between text-outline">
                <span>Items Subtotal:</span>
                <span className="font-display font-semibold text-on-surface">
                  ₹{(order.subtotalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-outline">
                <span>Pan-India Safe Transit:</span>
                <span className="text-secondary font-medium">
                  {order.shippingPaise === 0 ? 'FREE' : `₹${(order.shippingPaise / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-outline-variant/20 pt-2 flex justify-between text-sm">
                <span className="font-bold text-on-surface">Total Order Amount:</span>
                <span className="font-display font-bold text-lg text-secondary">
                  ₹{(order.totalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Internal Notes & Event History */}
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-base text-on-surface flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Operational Notes &amp; Audit Trail</span>
            </h3>

            {order.customerNotes ? (
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 text-xs font-mono text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                {order.customerNotes}
              </div>
            ) : (
              <p className="text-xs text-outline italic">No internal notes attached to this order.</p>
            )}

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Append operational note (e.g. Verified humidity packaging)..."
                className="flex-1 bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-secondary text-on-secondary font-label-sm text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Append Note</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Patron & Payment Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patron Card */}
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
              <User className="w-4 h-4 text-secondary" />
              <span>Patron Information</span>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-display font-bold text-base text-on-surface">
                {order.customer.name}
              </h4>
              <p className="text-on-surface-variant">{order.customer.phone}</p>
              {order.customer.email && (
                <p className="text-outline">{order.customer.email}</p>
              )}
            </div>

            <div className="border-t border-outline-variant/20 pt-3 space-y-1 text-xs">
              <span className="font-label-sm text-[10px] uppercase text-outline tracking-wider block">
                Destination Address
              </span>
              <p className="text-on-surface font-medium">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p className="text-on-surface-variant">{order.shippingAddress.line2}</p>
              )}
              <p className="text-secondary font-medium">
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-outline text-[11px]">Country: {order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-primary font-label-sm text-xs uppercase tracking-wider font-bold">
              <CreditCard className="w-4 h-4 text-secondary" />
              <span>Settlement Audit</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-outline">Method:</span>
                <span className="font-semibold text-on-surface">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-outline">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-secondary-container/30 text-secondary'
                      : 'bg-tertiary-container/30 text-tertiary'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-outline">Reference:</span>
                  <span className="font-mono text-secondary text-[11px] truncate max-w-[150px]">
                    {order.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Book Courier Dispatch Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-surface-container-low border border-outline-variant/40 p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
                Logistics Dispatch
              </span>
              <h3 className="font-display font-bold text-lg text-on-surface">
                Book Courier for {order.orderNumber}
              </h3>
              <p className="text-xs text-outline">
                Generate an electronic manifest and allocate an automated AWB.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-outline uppercase font-label-sm mb-1">
                  Logistics Carrier *
                </label>
                <select
                  value={carrierChoice}
                  onChange={(e) => setCarrierChoice(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:outline-none focus:border-secondary font-label-sm"
                >
                  <option value="Blue Dart Express Air">Blue Dart Express (Air Express)</option>
                  <option value="Delhivery Surface Premium">Delhivery Surface (Fragile Pack)</option>
                  <option value="Xpressbees Priority">Xpressbees Priority Botanical</option>
                </select>
              </div>

              <div>
                <label className="block text-outline uppercase font-label-sm mb-1">
                  Service Speed *
                </label>
                <select
                  value={serviceChoice}
                  onChange={(e) => setServiceChoice(e.target.value as any)}
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2 text-on-surface focus:outline-none focus:border-secondary font-label-sm"
                >
                  <option value="AIR_EXPRESS">Air Express (24-48 Hours)</option>
                  <option value="SURFACE_STANDARD">Surface Standard (3-5 Days)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 space-y-1 text-[11px] text-outline">
                <p>Origin: Plantrix Regional Fulfillment Hub (Bengaluru)</p>
                <p>Destination: {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShipmentModal(false)}
                className="px-4 py-2 rounded-full font-label-sm text-xs uppercase font-semibold text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBookShipment}
                className="px-5 py-2 rounded-full bg-secondary text-on-secondary font-label-sm text-xs uppercase font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
              >
                Confirm Booking &amp; Generate AWB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
