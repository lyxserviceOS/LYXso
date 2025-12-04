'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Home, Calendar, Users, FileText, Settings, BarChart,
  Package, Truck, Shield, CreditCard, Bell, HelpCircle, LogOut,
  ChevronRight, Search, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MobileMenuProps {
  user?: any;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const supabase = createClient();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const menuSections = [
    {
      title: 'Hovedmeny',
      items: [
        { href: '/dashboard', icon: Home, label: 'Dashboard', badge: null },
        { href: '/booking', icon: Calendar, label: 'Booking', badge: '3' },
        { href: '/kunder', icon: Users, label: 'Kunder', badge: null },
        { href: '/ansatte', icon: Users, label: 'Ansatte', badge: 'NY' },
      ]
    },
    {
      title: 'Moduler',
      items: [
        { href: '/coating', icon: Sparkles, label: 'Coating', badge: null },
        { href: '/dekkhotell', icon: Truck, label: 'Dekkhotell', badge: null },
        { href: '/addons', icon: Package, label: 'Tilleggstjenester', badge: null },
      ]
    },
    {
      title: 'Verktøy',
      items: [
        { href: '/rapporter', icon: BarChart, label: 'Rapporter', badge: null },
        { href: '/betaling', icon: CreditCard, label: 'Betaling', badge: null },
        { href: '/notifikasjoner', icon: Bell, label: 'Notifikasjoner', badge: '5' },
      ]
    },
    {
      title: 'Admin',
      items: [
        { href: '/admin', icon: Shield, label: 'Admin Panel', badge: 'ADMIN' },
        { href: '/settings', icon: Settings, label: 'Innstillinger', badge: null },
        { href: '/hjelp', icon: HelpCircle, label: 'Hjelp', badge: null },
      ]
    }
  ];

  const filteredSections = searchQuery
    ? menuSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : menuSections;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl hover:bg-slate-700 transition-all"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-slate-100" />
        ) : (
          <Menu className="w-6 h-6 text-slate-100" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  LYXso
                </h2>
                {user && (
                  <p className="text-sm text-slate-400 mt-1">
                    {user.email}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Søk i meny..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">
            {filteredSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all group ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badge === 'ADMIN'
                              ? 'bg-red-900/30 text-red-400'
                              : item.badge === 'NY'
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-blue-900/30 text-blue-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {!item.badge && !isActive && (
                          <ChevronRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 text-red-400 hover:bg-red-900/30 rounded-lg transition-all font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logg ut
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
              >
                Logg inn
              </Link>
            )}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
              <Link href="/personvern" className="hover:text-slate-300">Personvern</Link>
              <span>•</span>
              <Link href="/bruksvilkar" className="hover:text-slate-300">Vilkår</Link>
              <span>•</span>
              <Link href="/cookies" className="hover:text-slate-300">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
