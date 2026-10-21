'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

const FREE_SHIPPING_THRESHOLD_PAISE = 99900; // ₹999.00

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, subtotalPaise } = useShop();

  if (!isCartOpen) return null;

  const isFreeShipping = subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE;
  const progressPercent = Math.min(100, Math.round((subtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100));
  const remainingPaise = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-surface-container-low/95 border-l border-outline-variant/40 shadow-glass flex flex-col justify-between">
          {/* Top Header */}
          <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              <h3 className="font-display font-bold text-lg text-on-surface">Curated Shopping Bag</h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-bold">
                {cart.reduce((total, i) => total + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full bg-surface-container-high/80 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Close shopping bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3.5 bg-surface-container-lowest/70 border-b border-outline-variant/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-label-sm">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-primary" />
                {isFreeShipping
                  ? 'Complimentary Safe Dispatch Unlocked!'
                  : `Add ₹${(remainingPaise / 100).toLocaleString('en-IN')} for Free Pan-India Delivery`}
              </span>
              <span className="text-secondary font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-secondary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary border border-outline-variant/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-base text-on-surface">Your bag is empty</h4>
                  <p className="text-xs text-outline max-w-xs">
                    Explore our curated living flora, architectural planters, and domestic organizers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-label-sm text-xs font-bold uppercase tracking-wider shadow-lime-glow hover:shadow-lime-glow-lg transition-all"
                >
                  Explore Botanical Artifacts
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-3.5 rounded-xl bg-surface-container/60 border border-outline-variant/20 relative group"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container-lowest shrink-0 border border-outline-variant/30">
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

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-on-surface truncate">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-outline hover:text-error transition-colors p-0.5"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-display font-bold text-secondary mt-0.5">
                        ₹{(item.pricePaise / 100).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-outline-variant/40 rounded-full bg-surface-container-lowest/80 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-display font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] text-outline ml-auto font-label-sm">
                        Total: ₹{((item.pricePaise * item.quantity) / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-outline-variant/30 bg-surface-container-lowest/80 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant font-label-sm uppercase tracking-wider text-xs">
                  Subtotal
                </span>
                <span className="font-display font-bold text-lg text-secondary">
                  ₹{(subtotalPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-outline">
                <span>Pan-India Transit & Taxes</span>
                <span>{isFreeShipping ? 'FREE' : 'Calculated at checkout'}</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest font-bold shadow-lime-glow hover:shadow-lime-glow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-outline">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>100% Transit Guarantee • Encrypted Checkout</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
