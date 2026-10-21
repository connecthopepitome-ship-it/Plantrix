import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sprout, ShieldCheck, Truck, RotateCcw, HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-forest text-brand-ivory mt-auto border-t border-brand-botanical/40">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-brand-botanical/30 py-8 px-4 sm:px-6 lg:px-8 bg-brand-forest-dark/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-botanical/50 flex items-center justify-center shrink-0 text-brand-sage">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Pan-India Delivery</h4>
              <p className="text-xs text-brand-sage/80 mt-1 leading-relaxed">
                Carefully packaged plants and durable home essentials delivered safely to your door.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-botanical/50 flex items-center justify-center shrink-0 text-brand-sage">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Curated Quality</h4>
              <p className="text-xs text-brand-sage/80 mt-1 leading-relaxed">
                Hand-inspected botanicals and practical home organizers built for longevity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-botanical/50 flex items-center justify-center shrink-0 text-brand-sage">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">7-Day Transit Guarantee</h4>
              <p className="text-xs text-brand-sage/80 mt-1 leading-relaxed">
                Transit-damaged items replaced or refunded promptly upon photographic verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-botanical/50 flex items-center justify-center shrink-0 text-brand-sage">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Customer Support</h4>
              <p className="text-xs text-brand-sage/80 mt-1 leading-relaxed">
                Responsive assistance with order tracking, plant care guidance, and product advice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Intro */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-block bg-white/95 rounded-2xl px-3.5 py-2 shadow-sm border border-brand-sage/30">
              <Image
                src="/images/plantrix-logo.png"
                alt="Plantrix Botanics"
                width={160}
                height={58}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-brand-sage/80 leading-relaxed max-w-sm">
              Cultivating serene spaces through healthy indoor greenery, bespoke planters, and smart home essentials designed for intentional, clutter-free everyday living.
            </p>
            <div className="text-xs text-brand-sage/60 pt-2">
              <p>Email: care@plantrixbotanics.com</p>
              <p className="mt-1">Dispatched from Bengaluru & Delhi Fulfillment Hubs</p>
            </div>
          </div>

          {/* Department 1: Plants */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-sage mb-3">
              Plants & Botanics
            </h4>
            <ul className="space-y-2 text-xs text-brand-ivory/80">
              <li>
                <Link href="/plants-botanics" className="hover:text-white transition-colors">
                  All Greenery & Décor
                </Link>
              </li>
              <li>
                <Link href="/plants-botanics/indoor-plants" className="hover:text-white transition-colors">
                  Indoor Live Plants
                </Link>
              </li>
              <li>
                <Link href="/plants-botanics/pots-planters" className="hover:text-white transition-colors">
                  Ceramic Pots & Planters
                </Link>
              </li>
              <li>
                <Link href="/plants-botanics/plant-stands" className="hover:text-white transition-colors">
                  Metal & Wooden Stands
                </Link>
              </li>
              <li>
                <Link href="/plants-botanics/gardening-tools" className="hover:text-white transition-colors">
                  Watering & Care Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Department 2: Home */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-sage mb-3">
              Home Essentials
            </h4>
            <ul className="space-y-2 text-xs text-brand-ivory/80">
              <li>
                <Link href="/home-essentials" className="hover:text-white transition-colors">
                  All Home Utilities
                </Link>
              </li>
              <li>
                <Link href="/home-essentials/kitchen-utilities" className="hover:text-white transition-colors">
                  Kitchen Utilities
                </Link>
              </li>
              <li>
                <Link href="/home-essentials/storage-organizers" className="hover:text-white transition-colors">
                  Pantry & Storage Bins
                </Link>
              </li>
              <li>
                <Link href="/home-essentials/bathroom-accessories" className="hover:text-white transition-colors">
                  Bathroom Organization
                </Link>
              </li>
              <li>
                <Link href="/home-essentials/space-saving" className="hover:text-white transition-colors">
                  Space-Saving Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-sage mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-brand-ivory/80">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-brand-botanical/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-sage/60 gap-4">
          <p>© {new Date().getFullYear()} Plantrix Botanics. All rights reserved.</p>
          <p className="text-brand-sage/40">
            Handcrafted with care for botanical living & mindful spaces.
          </p>
        </div>
      </div>
    </footer>
  );
}
