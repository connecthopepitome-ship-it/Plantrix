'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sprout, Check, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative z-10 w-full bg-surface-container-lowest mt-20 border-t border-outline-variant/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-outline-variant/20">
          {/* Brand Intro & Specimen Station */}
          <div className="lg:col-span-5 flex flex-col gap-4 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/plantrix-logo.png"
                alt="Plantrix Botanics"
                width={150}
                height={45}
                className="h-8 w-auto object-contain"
              />
              <span className="font-display font-semibold text-xl tracking-tight text-on-surface">
                Plantrix Botanics
              </span>
            </Link>

            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-md">
              Synthesis of wild horticulture and synthetic precision. Engineering biophilic architecture,
              rare specimen acclimatization, and high-fidelity indoor microclimates for discerning homes.
            </p>

            <div className="flex items-center gap-2.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
                Greenhouse Station 01 • Calibrated Hydration Active
              </span>
            </div>
          </div>

          {/* Departments */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-label-md text-xs uppercase tracking-widest text-primary font-bold">
              Departments
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/plants-botanics" className="hover:text-on-surface transition-colors">
                  Rare Living Specimens
                </Link>
              </li>
              <li>
                <Link href="/plants-botanics" className="hover:text-on-surface transition-colors">
                  Architectural Planters
                </Link>
              </li>
              <li>
                <Link href="/plants-botanics" className="hover:text-on-surface transition-colors">
                  Hydration &amp; Mist Vessels
                </Link>
              </li>
              <li>
                <Link href="/home-essentials" className="hover:text-on-surface transition-colors">
                  Modular Pantry Organizers
                </Link>
              </li>
              <li>
                <Link href="/home-essentials" className="hover:text-on-surface transition-colors">
                  Everyday Kitchen Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-label-md text-xs uppercase tracking-widest text-primary font-bold">
              Client Concierge
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/about" className="hover:text-on-surface transition-colors">
                  Specimen Health Guarantee
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-on-surface transition-colors">
                  Safe Transit Tracking
                </Link>
              </li>
              <li>
                <Link href="/#acclimatization" className="hover:text-on-surface transition-colors">
                  Acclimatization Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-on-surface transition-colors">
                  Botanical Care Advisory
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-on-surface transition-colors">
                  Returns &amp; Safe Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Biophilic Dispatch (Newsletter) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-label-md text-xs uppercase tracking-widest text-primary font-bold">
              Biophilic Dispatch
            </h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Receive archival releases, specimen harvest notes, and horticultural research bulletins.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-surface-container border border-secondary/40 text-secondary text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-secondary shrink-0" />
                <span>Subscription confirmed. Welcome to the Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@domain.org"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-full px-4 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-secondary text-on-secondary font-label-md text-xs uppercase tracking-widest py-2.5 px-4 rounded-full font-bold hover:shadow-lime-glow transition-all flex items-center justify-center gap-1.5"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Subscribe to Journal</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-label-sm text-xs uppercase tracking-wider text-outline text-center sm:text-left">
            <p>© {currentYear} Plantrix Botanics Inc. All Rights Preserved.</p>
            <span className="hidden sm:inline">•</span>
            <p className="hidden md:inline">Synthetic Horticultural Architecture</p>
          </div>

          <div className="flex items-center gap-4 font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Spec
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Cultivation
            </Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">
              Transit Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
