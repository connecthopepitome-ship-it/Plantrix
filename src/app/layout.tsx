import type { Metadata } from 'next';
import { Space_Grotesk, Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AnnouncementBar } from '@/components/common/AnnouncementBar';
import { SearchModal } from '@/components/common/SearchModal';
import { CartDrawer } from '@/components/common/CartDrawer';
import { StorefrontChrome } from '@/components/common/StorefrontChrome';
import { ShopProvider } from '@/context/ShopContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Plantrix Botanics — Botanical Living & Mindful Home Essentials',
  description:
    'Curated indoor flora, architectural planters, botanical mist vessels, and thoughtful everyday domestic organizers. Engineered for biophilic modern homes.',
  metadataBase: new URL('https://plantrixbotanics.com'),
  openGraph: {
    title: 'Plantrix Botanics — Botanical Living & Mindful Home Essentials',
    description: 'Living specimens, handcrafted ceramic planters, and functional everyday home organizers.',
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
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <body className="bg-background font-sans text-on-surface antialiased min-h-screen relative overflow-x-hidden selection:bg-secondary selection:text-on-secondary">
        <ShopProvider>
          {/* Atmospheric Ambient Glows */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-primary-container/20 rounded-full blur-[140px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-[160px]" />
          </div>

          <StorefrontChrome>{children}</StorefrontChrome>
        </ShopProvider>
      </body>
    </html>
  );
}
