'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Languages, Menu, X, ArrowRight, UserRound, CheckCircle2 } from 'lucide-react';
import { Language, CONTENT } from '../lib/content';
import { CitizenUser } from './SignInModal';

interface NavbarProps {
  currentLang: Language;
  currentUser: CitizenUser;
  onToggleLang: () => void;
  onOpenDemo: () => void;
  onOpenSignIn: () => void;
}

export function Navbar({
  currentLang,
  currentUser,
  onToggleLang,
  onOpenDemo,
  onOpenSignIn,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = CONTENT[currentLang].nav;
  const isHi = currentLang === 'hi';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border-subtle transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Sprout className="w-5 h-5 text-fresh stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-forest-dark">
                {t.brand}
              </span>
            </div>
            <p className="text-[11px] font-medium text-text-secondary tracking-wide hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-forest transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-text-main border border-border-subtle bg-warm hover:bg-sage transition-colors"
            aria-label="Toggle language between English and Hindi"
          >
            <Languages className="w-4 h-4 text-agri stroke-[2]" />
            <span>{t.language}</span>
          </button>

          {/* User Sign In / Profile Button */}
          {currentUser.isAuthenticated ? (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-forest-dark border border-border-subtle bg-sage/50 hover:bg-sage transition-colors"
              title="Click to view or switch profile"
            >
              <div className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span>{currentUser.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-agri" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-forest transition-colors"
            >
              <UserRound className="w-3.5 h-3.5 stroke-[2]" />
              <span>{t.signIn}</span>
            </button>
          )}

          {/* Primary CTA */}
          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-all shadow-sm active:scale-95"
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-main border border-border-subtle bg-warm"
          >
            <Languages className="w-3.5 h-3.5 text-agri" />
            <span>{t.language}</span>
          </button>

          {/* Mobile Profile Trigger */}
          <button
            type="button"
            onClick={onOpenSignIn}
            className="p-1.5 rounded-lg border border-border-subtle text-forest hover:bg-sage"
            title="Profile"
          >
            <UserRound className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border-subtle text-text-main hover:bg-sage transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {t.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-text-secondary hover:text-forest py-2 px-3 rounded-lg hover:bg-warm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-border-subtle flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-forest-dark border border-border-subtle bg-warm"
            >
              <UserRound className="w-4 h-4 stroke-[2]" />
              <span>{currentUser.isAuthenticated ? currentUser.name : t.signIn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-forest hover:bg-forest-light transition-all shadow-sm"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
