'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export function ToastNotification() {
  const { lastActionMessage, dismissToast, setIsCartOpen } = useShop();

  if (!lastActionMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-surface-container-high/95 border border-outline-variant/50 shadow-glass backdrop-blur-xl text-on-surface text-xs font-medium">
        <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5" />
        </div>
        <span>{lastActionMessage}</span>
        <button
          onClick={() => {
            dismissToast();
            setIsCartOpen(true);
          }}
          className="ml-1 text-secondary underline hover:text-primary transition-colors text-xs font-semibold"
        >
          View Bag
        </button>
        <button
          onClick={dismissToast}
          className="p-1 rounded-full text-outline hover:text-on-surface transition-colors ml-1"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
