'use client';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>CyberRaksha — AI Cyber Security Assistant</title>
        <meta name="description" content="Minimal, professional scam detection assistant powered by IBM Granite AI models." />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
