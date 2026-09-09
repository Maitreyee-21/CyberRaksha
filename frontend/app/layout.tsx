import './globals.css';

import { LanguageProvider } from '@/components/providers/LanguageProvider';

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
      <body className="bg-[#070B0F] text-white antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}