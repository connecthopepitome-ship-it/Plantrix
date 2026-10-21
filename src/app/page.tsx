import React from 'react';
import Link from 'next/link';
import { Sprout, Home, ArrowRight, ShieldCheck, Sparkles, Droplets, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS } from '@/types/category';

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden bg-radial-subtle pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-brand-sage-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-sage/80 border border-brand-sage-border text-brand-forest text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-botanical" />
              Mindful Botanical Living
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-brand-forest tracking-tight text-balance leading-[1.15]">
              Living Greenery & <br className="hidden sm:inline" />
              Functional Home Essentials.
            </h1>

            <p className="text-base sm:text-lg text-brand-charcoal/80 text-balance leading-relaxed max-w-2xl mx-auto">
              Cultivate calming spaces with resilient indoor plants, handcrafted artisanal planters, and thoughtful everyday organizers crafted for intentional living.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/plants-botanics"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-forest text-white font-semibold text-sm hover:bg-brand-botanical transition-all shadow-sm hover:shadow-hover"
              >
                <Sprout className="w-4 h-4 text-brand-sage" />
                <span>Explore Plants & Botanics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/home-essentials"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-brand-sage-border text-brand-forest font-semibold text-sm hover:bg-brand-sage-light transition-all shadow-subtle"
              >
                <Home className="w-4 h-4 text-brand-botanical" />
                <span>Shop Home Essentials</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two Main Department Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
            Two Complementary Departments
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-brand-forest">
            Choose Your Destination
          </h2>
          <p className="text-sm text-brand-muted">
            Seamlessly switch between lush greenery and practical home storage solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Department 1: Plants & Botanics */}
          <div className="group relative rounded-3xl overflow-hidden bg-brand-forest text-white p-8 sm:p-10 flex flex-col justify-between shadow-soft hover:shadow-hover transition-all duration-300 border border-brand-botanical/30">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-botanical/60 flex items-center justify-center text-brand-sage border border-brand-sage/20">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-sage">
                Department 01
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
                {DEPARTMENTS.PLANTS_BOTANICS.title}
              </h3>
              <p className="text-sm text-brand-sage/90 leading-relaxed max-w-md">
                Indoor plants, bespoke planters, propagation stations, modern plant stands, and ergonomic botanical tools.
              </p>
              <ul className="pt-2 space-y-2 text-xs text-brand-sage/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0" />
                  <span>Low-maintenance indoor live varieties</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0" />
                  <span>Ceramic, terracotta & fiber planters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-sage shrink-0" />
                  <span>Transit-safe packaging across India</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/plants-botanics"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-sage text-brand-forest font-semibold text-xs tracking-wide hover:bg-white transition-colors"
              >
                <span>Browse Botanics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Department 2: Home & Everyday Essentials */}
          <div className="group relative rounded-3xl overflow-hidden bg-white text-brand-charcoal p-8 sm:p-10 flex flex-col justify-between shadow-soft hover:shadow-hover transition-all duration-300 border border-brand-sage-border">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-terracotta-light flex items-center justify-center text-brand-terracotta border border-brand-terracotta/20">
                <Home className="w-6 h-6" />
              </div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-terracotta">
                Department 02
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-brand-forest">
                {DEPARTMENTS.HOME_ESSENTIALS.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed max-w-md">
                Thoughtfully engineered kitchen utilities, pantry storage, bathroom organizers, and compact space-savers.
              </p>
              <ul className="pt-2 space-y-2 text-xs text-brand-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-terracotta shrink-0" />
                  <span>Durable food-grade & rust-resistant materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-terracotta shrink-0" />
                  <span>Space-saving modular organizers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-terracotta shrink-0" />
                  <span>Straightforward everyday utility</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/home-essentials"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-forest text-white font-semibold text-xs tracking-wide hover:bg-brand-botanical transition-colors"
              >
                <span>Browse Home Essentials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Living Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
              Curated Highlights
            </p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-forest mt-1">
              Explore by Living Need
            </h2>
          </div>
          <Link
            href="/plants-botanics"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-botanical hover:text-brand-forest transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/collections/best-sellers"
            className="p-5 rounded-2xl bg-white border border-brand-sage-border/70 hover:border-brand-botanical hover:shadow-subtle transition-all group"
          >
            <span className="text-xs font-bold text-brand-botanical uppercase tracking-wider block mb-1">
              Popular
            </span>
            <h4 className="font-display font-bold text-base text-brand-forest group-hover:text-brand-botanical transition-colors">
              Best Sellers
            </h4>
            <p className="text-xs text-brand-muted mt-1">Customer-favorite botanicals & utilities</p>
          </Link>

          <Link
            href="/collections/new-arrivals"
            className="p-5 rounded-2xl bg-white border border-brand-sage-border/70 hover:border-brand-botanical hover:shadow-subtle transition-all group"
          >
            <span className="text-xs font-bold text-brand-botanical uppercase tracking-wider block mb-1">
              Fresh
            </span>
            <h4 className="font-display font-bold text-base text-brand-forest group-hover:text-brand-botanical transition-colors">
              New Arrivals
            </h4>
            <p className="text-xs text-brand-muted mt-1">Newly curated planters & accessories</p>
          </Link>

          <Link
            href="/collections/under-499"
            className="p-5 rounded-2xl bg-white border border-brand-sage-border/70 hover:border-brand-botanical hover:shadow-subtle transition-all group"
          >
            <span className="text-xs font-bold text-brand-terracotta uppercase tracking-wider block mb-1">
              Budget Finds
            </span>
            <h4 className="font-display font-bold text-base text-brand-forest group-hover:text-brand-terracotta transition-colors">
              Under ₹499
            </h4>
            <p className="text-xs text-brand-muted mt-1">Essential tools, clips & organizers</p>
          </Link>

          <Link
            href="/collections/small-spaces"
            className="p-5 rounded-2xl bg-white border border-brand-sage-border/70 hover:border-brand-botanical hover:shadow-subtle transition-all group"
          >
            <span className="text-xs font-bold text-brand-botanical uppercase tracking-wider block mb-1">
              Apartment Living
            </span>
            <h4 className="font-display font-bold text-base text-brand-forest group-hover:text-brand-botanical transition-colors">
              Small-Space Living
            </h4>
            <p className="text-xs text-brand-muted mt-1">Compact balcony & kitchen organizers</p>
          </Link>
        </div>
      </section>

      {/* Brand Philosophy Editorial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-sage-light p-8 sm:p-12 border border-brand-sage-border/80 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-botanical">
              Our Sourcing Standard
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-brand-forest">
              Honest Quality. Thoughtful Craft.
            </h3>
            <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
              Every planter is evaluated for drainage and thermal insulation. Every live plant is conditioned before dispatch. And every home organizer is checked for real-world functionality. No false claims, no artificial countdowns.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white shadow-subtle border border-brand-sage-border/40">
              <span className="font-display font-extrabold text-2xl text-brand-forest block">100%</span>
              <span className="text-[11px] text-brand-muted font-medium">Safe Transit</span>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-subtle border border-brand-sage-border/40">
              <span className="font-display font-extrabold text-2xl text-brand-forest block">₹0</span>
              <span className="text-[11px] text-brand-muted font-medium">Surprise Fees</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
