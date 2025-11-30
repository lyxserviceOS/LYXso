'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Car, Package, Shield, FileText } from 'lucide-react';

const navItems = [
  { href: '/min-side', label: 'Oversikt', icon: Calendar },
  { href: '/min-side/bookinger', label: 'Bookinger', icon: Calendar },
  { href: '/min-side/kjoretoy', label: 'Kjøretøy', icon: Car },
  { href: '/min-side/dekkhotell', label: 'Dekkhotell', icon: Package },
  { href: '/min-side/coating', label: 'Coating', icon: Shield },
  { href: '/min-side/betalinger', label: 'Betalinger', icon: FileText },
];

export default function CustomerNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap
                  ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
