import React from 'react';

interface AnnouncementBarProps {
  message?: string;
  badge?: string;
}

export function AnnouncementBar({
  message = 'Free standard shipping on orders over ₹999 across India • 7-day safe delivery guarantee',
  badge = 'Botanical Living',
}: AnnouncementBarProps) {
  return (
    <div
      role="region"
      aria-label="Store Announcement"
      className="bg-brand-forest text-brand-ivory text-xs py-2 px-4 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="hidden sm:inline-block bg-brand-botanical/60 text-brand-sage text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wider uppercase">
            {badge}
          </span>
          <p className="font-medium tracking-wide text-center sm:text-left text-brand-ivory/95">
            {message}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-brand-ivory/80 text-[11px]">
          <span className="hover:text-brand-ivory transition-colors">Pan-India Dispatch</span>
          <span>•</span>
          <span className="hover:text-brand-ivory transition-colors">Direct Customer Support</span>
        </div>
      </div>
    </div>
  );
}
