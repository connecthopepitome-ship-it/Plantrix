'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from './SearchModal';
import { CartDrawer } from './CartDrawer';
import { ToastNotification } from './ToastNotification';

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="relative z-10 w-full bg-transparent min-h-screen">
        {children}
      </main>
      <Footer />
      <SearchModal />
      <CartDrawer />
      <ToastNotification />
    </>
  );
}
