'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const FREE_SHIPPING_THRESHOLD_PAISE = 99900; // ₹999.00

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotalPaise } = useShop();

  const isFreeShipping = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const remainingPaise = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);
  const progressPercent = Math.min(100, Math.round((subtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      {/* Page Title */}
      <div>
        <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">
          Your Selections
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface mt-1">
          Curated Shopping Bag
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-secondary border border-outline-variant/30">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-xl text-on-surface">Your Bag is Empty</h2>
          <p className="text-sm text-outline">
            Discover our curated living flora, architectural planters, and domestic organizers.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/plants-botanics"
              className="px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
            >
              Explore Botanics
            </Link>
            <Link
              href="/home-essentials"
              className="px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-xs uppercase font-bold border border-outline-variant/30 transition-all"
            >
              Shop Home Essentials
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Alert */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-label-sm">
                <span className="text-on-surface-variant flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" />
                  {isFreeShipping
                    ? 'Complimentary Safe Dispatch Unlocked Across India!'
                    : `Add ₹${(remainingPaise / 100).toLocaleString('en-IN')} more to unlock Free Pan-India Delivery`}
                </span>
                <span className="text-secondary font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-container-lowest shrink-0 border border-outline-variant/30">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-outline">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="truncate">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-display font-semibold text-base text-on-surface hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="font-display font-bold text-secondary text-sm mt-0.5">
                        ₹{(item.pricePaise / 100).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-outline-variant/40 rounded-full bg-surface-container px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-display font-bold text-sm text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="font-display font-bold text-base text-on-surface">
                        ₹{((item.pricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-outline hover:text-error transition-colors p-1"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 rounded-3xl bg-surface-container-low border border-outline-variant/30 p-6 space-y-6 shadow-xl">
            <h3 className="font-display font-bold text-lg text-on-surface border-b border-outline-variant/20 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-display font-bold text-on-surface">
                  ₹{(subtotalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Safe Transit Packaging</span>
                <span className="text-secondary font-medium">Included</span>
              </div>

              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Pan-India Delivery</span>
                <span className="font-medium text-on-surface">
                  {isFreeShipping ? 'FREE' : '₹99.00'}
                </span>
              </div>

              <div className="border-t border-outline-variant/20 pt-3 flex items-center justify-between text-base">
                <span className="font-semibold text-on-surface">Estimated Total</span>
                <span className="font-display font-bold text-2xl text-secondary">
                  ₹{((subtotalPaise + (isFreeShipping ? 0 : 9900)) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="space-y-2 pt-2 border-t border-outline-variant/20 text-xs text-outline">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>100% Transit Guarantee on All Live Plants &amp; Planters</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-secondary shrink-0" />
                <span>Dispatches from Bengaluru &amp; Delhi Fulfillment Hubs</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
