// components/PublicHeader.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sjekk om bruker er innlogget
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkAuth();

    // Lytt til auth-endringer
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Don't show on protected routes or login/register pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/onboarding")
  ) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Feil ved utlogging:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Hjem" },
    { href: "/om-lyxso", label: "Om LYXso" },
    { href: "/priser", label: "Priser" },
    { href: "/shop", label: "Nettbutikk" },
    { href: "/demo", label: "Demo" },
    { href: "/kontakt", label: "Kontakt" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-[11px] font-semibold tracking-[0.2em]">
            L
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-50">LYXso</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              ServiceOS
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-white transition-colors ${
                pathname === link.href ? "text-white font-medium" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/kontrollpanel"
                className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
              >
                Gå til kontrollpanel
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md bg-slate-700 px-4 py-2 text-xs font-medium text-white hover:bg-slate-600 transition-colors disabled:bg-slate-800 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Logger ut..." : "Logg ut"}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="rounded-md border border-blue-600 px-4 py-2 text-xs font-medium text-blue-400 hover:bg-blue-600/10 transition-colors"
              >
                Kom i gang
              </Link>
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
              >
                Logg inn
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-slate-200 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-6 bg-slate-200 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-slate-200 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm text-slate-200 hover:text-white transition-colors py-2 ${
                  pathname === link.href ? "text-white font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/kontrollpanel"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors text-center"
                >
                  Gå til kontrollpanel
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors text-center disabled:bg-slate-800 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? "Logger ut..." : "Logg ut"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-600/10 transition-colors text-center"
                >
                  Kom i gang
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors text-center"
                >
                  Logg inn
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
