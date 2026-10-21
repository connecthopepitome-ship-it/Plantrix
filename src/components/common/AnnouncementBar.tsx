'use client';

import React from 'react';

interface AnnouncementBarProps {
  message?: string;
}

export function AnnouncementBar({
  message = 'Atmospheric Release — Specimen Batch No. 09 Arrived • Free Safe Dispatch Across India on Orders Above ₹999',
}: AnnouncementBarProps) {
  return (
    <div
      role="region"
      aria-label="Store Announcement"
      className="w-full bg-surface-container-lowest/95 backdrop-blur-md px-4 sm:px-6 py-2 text-center border-b border-outline-variant/30 flex items-center justify-center gap-2.5 z-40 relative"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shrink-0" />
      <p className="font-label-sm text-[11px] sm:text-xs uppercase tracking-widest text-on-surface-variant truncate">
        {message}
      </p>
    </div>
  );
}
