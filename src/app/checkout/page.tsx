'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function CheckoutPage() {
  const { cart, subtotalPaise, clearCart } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'COD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFreeShipping = subtotalPaise >= 99900;
  const shippingPaise = isFreeShipping ? 0 : 9900;
  const totalPaise = subtotalPaise + shippingPaise;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        throw new Error('Please enter a valid 10-digit Indian mobile number.');
      }
      if (!/^\d{6}$/.test(formData.pinCode.trim())) {
        throw new Error('Please enter a valid 6-digit Indian PIN code.');
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email || undefined,
            phone: cleanPhone,
          },
          shippingAddress: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.pinCode.trim(),
            country: 'IN',
          },
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.selectedVariant?.variantId,
            quantity: item.quantity,
          })),
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit order. Please check address details.');
      }

      setPlacedOrderNumber(data.orderNumber || data.orderId);
      setOrderComplete(true);
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error while placing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-secondary/20 text-secondary mx-auto flex items-center justify-center border border-secondary/40 shadow-lime-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
            Order Confirmed
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface">
            Thank you, {formData.name || 'Botanical Patron'}!
          </h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
            Your specimen parcel has been queued for transit conditioning at our regional fulfillment hub.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-left space-y-3 max-w-md mx-auto">
          <div className="flex justify-between text-xs">
            <span className="text-outline">Order Reference:</span>
            <span className="font-display font-bold text-secondary">{placedOrderNumber}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-outline">Payment Method:</span>
            <span className="text-on-surface font-medium">
              {formData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Prepaid'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-outline">Destination:</span>
            <span className="text-on-surface font-medium">
              {formData.city}, {formData.state} - {formData.pinCode}
            </span>
          </div>
          <div className="border-t border-outline-variant/20 pt-3 flex justify-between text-sm">
            <span className="text-outline font-medium">Amount Due:</span>
            <span className="font-display font-bold text-secondary text-base">
              ₹{(totalPaise / 100).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
          >
            <span>Return to Plantrix Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-on-surface">No Items to Checkout</h2>
        <p className="text-sm text-outline">Please add artifacts to your bag before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <div>
          <Link
            href="/cart"
            className="font-label-sm text-xs text-outline hover:text-on-surface flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Shopping Bag</span>
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface">
            Secure Controlled Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary font-label-sm">
          <Lock className="w-4 h-4" />
          <span className="hidden sm:inline">256-Bit Encrypted</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contact */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h3 className="font-display font-bold text-base text-on-surface">1. Patron Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Rao"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="patron@domain.in"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h3 className="font-display font-bold text-base text-on-surface">2. Dispatch Destination</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                  Street Address &amp; Apartment / Villa *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat No, Building, Street"
                  className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bengaluru"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Karnataka"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-sm uppercase tracking-wider text-outline mb-1">
                    PIN Code (6-Digit) *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    pattern="[0-9]{6}"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="560001"
                    className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h3 className="font-display font-bold text-base text-on-surface">3. Payment Selection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'COD'
                    ? 'bg-primary-container/40 border-secondary text-on-surface'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="accent-secondary"
                />
                <div>
                  <span className="font-display font-semibold text-sm block">Cash on Delivery</span>
                  <span className="text-[11px] text-outline">Pay upon parcel arrival</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'ONLINE'
                    ? 'bg-primary-container/40 border-secondary text-on-surface'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={formData.paymentMethod === 'ONLINE'}
                  onChange={handleChange}
                  className="accent-secondary"
                />
                <div>
                  <span className="font-display font-semibold text-sm block">Instant UPI / Cards</span>
                  <span className="text-[11px] text-outline">GPay, PhonePe, Cards, NetBanking</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-6 shadow-xl sticky top-28">
          <h3 className="font-display font-bold text-lg text-on-surface border-b border-outline-variant/20 pb-3">
            Bag Items ({cart.reduce((t, i) => t + i.quantity, 0)})
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 text-xs">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-container-lowest shrink-0 border border-outline-variant/30">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : (
                    <ShoppingBag className="w-4 h-4 text-outline m-auto" />
                  )}
                </div>
                <div className="truncate flex-1">
                  <h4 className="font-medium text-on-surface truncate">{item.name}</h4>
                  <span className="text-outline">Qty: {item.quantity}</span>
                </div>
                <span className="font-display font-bold text-secondary">
                  ₹{((item.pricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-outline-variant/20 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-display font-bold text-on-surface">
                ₹{(subtotalPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between text-on-surface-variant">
              <span>Pan-India Transit</span>
              <span className="font-medium text-on-surface">{isFreeShipping ? 'FREE' : '₹99.00'}</span>
            </div>

            <div className="border-t border-outline-variant/20 pt-3 flex justify-between text-base">
              <span className="font-semibold text-on-surface">Final Payable</span>
              <span className="font-display font-bold text-2xl text-secondary">
                ₹{(totalPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-error/15 border border-error/40 text-error text-xs font-sans animate-fade-in leading-relaxed">
              <strong>Order Placement Notice:</strong> {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Verifying &amp; Queuing Dispatch...</span>
            ) : (
              <span>Confirm &amp; Place Dispatch Order</span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-outline pt-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Pan-India Transit Conditioning Guarantee</span>
          </div>
        </div>
      </form>
    </div>
  );
}
