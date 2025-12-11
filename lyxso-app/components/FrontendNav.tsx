"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavLink = {
  label: string;
  href: string;
  badge?: string;
};

const mainNav: NavLink[] = [
  { label: "Hjem", href: "/" },
  { label: "Funksjoner", href: "/funksjoner" },
  { label: "Priser", href: "/priser" },
  { label: "AI-Moduler", href: "/ai-moduler", badge: "Ny" },
  { label: "Integrasjoner", href: "/integrasjoner" },
  { label: "Om oss", href: "/om-oss" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function FrontendNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span className="text-lg font-bold text-white">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">LYXso</span>
              <span className="text-xs text-slate-500">Revolusjonerende SaaS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
                {isActive(link.href) && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Logg inn
            </Link>
            <Link
              href="/registrer"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Start gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-slate-700 transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-6 bg-slate-700 transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 bg-slate-700 transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 py-4 md:hidden">
            <div className="flex flex-col space-y-2">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Logg inn
                </Link>
                <Link
                  href="/registrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg"
                >
                  Start gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
