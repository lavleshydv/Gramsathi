import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GramSathi (ग्राम साथी) - Rural Governance & Welfare Companion',
  description: 'Multilingual, offline-first civic platform connecting rural citizens to schemes, grievances, and mandi rates.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="flex flex-col min-h-screen bg-neutral-50 text-slate-900 pb-20 md:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-900">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
              <span className="text-2xl" role="img" aria-label="Sprout">🌾</span>
              <div>
                <span className="block leading-none text-white">GramSathi</span>
                <span className="text-xs text-amber-300 font-normal">ग्राम साथी</span>
              </div>
            </Link>

            {/* Village Selector & Panchayat Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-900/60 px-3 py-1.5 rounded-full text-xs text-emerald-100 border border-emerald-700">
              <span className="text-amber-400">📍</span>
              <span>रामपुर | बिलारी | मुरादाबाद (उ.प्र.)</span>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                aria-label="Language selection"
                className="flex items-center gap-1.5 bg-emerald-900 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-100 border border-emerald-700 hover:bg-emerald-700 transition"
              >
                <span>🌐</span>
                <span>हिन्दी / EN</span>
              </button>

              <Link
                href="/panchayat"
                className="hidden md:inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
              >
                <span>🏛️</span>
                <span>पंचायत डेस्क</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
          {children}
        </main>

        {/* Bottom Mobile Navigation (Thumb Zone friendly for rural users) */}
        <nav 
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-2xl px-2 py-2 flex justify-around items-center"
        >
          <Link href="/" className="flex flex-col items-center justify-center p-2 text-emerald-800">
            <span className="text-xl">🏠</span>
            <span className="text-[11px] font-bold mt-0.5">होम</span>
          </Link>
          <Link href="/schemes" className="flex flex-col items-center justify-center p-2 text-slate-700">
            <span className="text-xl">📜</span>
            <span className="text-[11px] font-bold mt-0.5">योजनाएं</span>
          </Link>
          <Link href="/grievances" className="flex flex-col items-center justify-center p-2 text-slate-700">
            <span className="text-xl">📢</span>
            <span className="text-[11px] font-bold mt-0.5">शिकायत</span>
          </Link>
          <Link href="/mandi" className="flex flex-col items-center justify-center p-2 text-slate-700">
            <span className="text-xl">🚜</span>
            <span className="text-[11px] font-bold mt-0.5">मंडी भाव</span>
          </Link>
          <Link href="/panchayat" className="flex flex-col items-center justify-center p-2 text-slate-700">
            <span className="text-xl">🏛️</span>
            <span className="text-[11px] font-bold mt-0.5">पंचायत</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
