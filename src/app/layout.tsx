import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AnnouncementBar } from '@/components/common/AnnouncementBar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Plantrix Botanics — Plants, Planters & Everyday Home Essentials',
  description:
    'Discover curated indoor live plants, handcrafted planters, plant stands, and functional home storage utilities. Thoughtfully designed for mindful botanical spaces.',
  metadataBase: new URL('https://plantrixbotanics.com'),
  openGraph: {
    title: 'Plantrix Botanics — Plants & Home Living',
    description: 'Bespoke indoor greenery, planters, and functional everyday home essentials.',
    siteName: 'Plantrix Botanics',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal selection:bg-brand-sage selection:text-brand-forest">
        <AnnouncementBar />
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
