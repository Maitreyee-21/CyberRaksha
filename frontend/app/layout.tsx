import type { Viewport } from 'next';
import './globals.css';

import { LanguageProvider } from '@/components/providers/LanguageProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070B0F',
};

export const metadata = {
  title:
    'CyberRaksha — Your Digital Safety Guardian',
  description:
    'Check suspicious messages, links, QR codes and screenshots before you click.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#070B0F] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}