// components/PublicFooter.tsx
import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Om LYXso */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-[11px] font-semibold tracking-[0.2em]">
                L
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-50">LYXso</div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  ServiceOS
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              ServiceOS for bilbransjen. Booking, CRM, dekkhotell, coating og AI – alt i én plattform.
            </p>
          </div>

          {/* Lenker */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Produkt</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#moduler" className="hover:text-slate-200 transition-colors">
                  Moduler
                </Link>
              </li>
              <li>
                <Link href="/lyx-vision" className="hover:text-slate-200 transition-colors">
                  LYX Vision
                </Link>
              </li>
              <li>
                <Link href="/lyxba" className="hover:text-slate-200 transition-colors">
                  LYXba
                </Link>
              </li>
              <li>
                <Link href="/priser" className="hover:text-slate-200 transition-colors">
                  Priser
                </Link>
              </li>
            </ul>
          </div>

          {/* Selskap */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Selskap</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/om-lyxso" className="hover:text-slate-200 transition-colors">
                  Om LYXso
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-200 transition-colors">
                  Kom i gang
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-slate-200 transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Juridisk & Personvern</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/personvern" className="hover:text-slate-200 transition-colors flex items-center gap-2">
                  <span className="text-green-500">✓</span> Personvernerklæring
                </Link>
              </li>
              <li>
                <Link href="/bruksvilkar" className="hover:text-slate-200 transition-colors flex items-center gap-2">
                  <span className="text-green-500">✓</span> Bruksvilkår
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-slate-200 transition-colors flex items-center gap-2">
                  <span className="text-green-500">✓</span> Cookie-policy
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  🔒 GDPR-compliant
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bunn */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} LYXso. Alle rettigheter reservert.
          </p>
          <p className="text-slate-500">
            Utviklet i Norge for bilbransjen.
          </p>
        </div>
      </div>
    </footer>
  );
}
