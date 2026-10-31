import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GramSathi AI — Government Services, Made Simpler for Every Village',
  description:
    'A voice-first government services and documentation assistant designed for rural India. Understand schemes, organise documents, and prepare applications with evidence-linked verification.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-warm text-text-main antialiased selection:bg-fresh/30 selection:text-forest-dark">
        {children}
      </body>
    </html>
  );
}
