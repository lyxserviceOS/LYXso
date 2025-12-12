'use client';

import { useState } from 'react';
import { X, FileText, Check, AlertTriangle } from 'lucide-react';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => Promise<void>;
}

export default function TermsAcceptanceModal({
  isOpen,
  onClose,
  onAccept
}: TermsAcceptanceModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrolledToBottom = 
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100;
    
    if (scrolledToBottom && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  const canAccept = hasScrolled && acceptedTerms && acceptedPrivacy && acceptedCookies;

  const handleAccept = async () => {
    if (!canAccept || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAccept();
    } catch (error) {
      console.error('Error accepting terms:', error);
      alert('Det oppstod en feil. Vennligst prøv igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="mx-auto max-w-4xl w-full bg-slate-900 rounded-xl shadow-2xl border border-slate-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                Aksepter Bruksvilkår
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Vennligst les og aksepter før du fortsetter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6"
          onScroll={handleScroll}
        >
          {/* Warning */}
          <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 sm:p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-200 mb-1 text-sm sm:text-base">Viktig informasjon</h3>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  Ved å bruke LYXso aksepterer du våre vilkår. Tjenesten leveres "som den er" 
                  uten garantier. Vennligst les hele dokumentet nøye.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-slate-200 text-sm sm:text-base">Sammendrag av nøkkelpunkter:</h4>
            
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
              {[
                { title: 'Ansvarsbegrensning', text: 'Vårt ansvar er begrenset til beløpet du har betalt siste 12 måneder, maks NOK 50,000' },
                { title: 'Ingen garantier', text: 'Tjenesten leveres "som den er" uten garantier for oppetid, sikkerhet eller nøyaktighet' },
                { title: 'Ditt ansvar', text: 'Du er ansvarlig for all bruk av kontoen, inkludert brudd på lover og regler' },
                { title: 'Datatap', text: 'Vi tar backups, men er ikke ansvarlige for datatap. Ta egne sikkerhetskopier' },
                { title: 'Refusjon', text: '14-dagers tilfredsgaranti, deretter ingen refusjon' },
                { title: 'Oppsigelse', text: 'Vi kan suspendere kontoen din ved brudd på vilkårene' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <p>
                    <strong className="text-slate-200">{item.title}:</strong> {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="border border-slate-700 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
            <p className="font-semibold text-slate-200 text-sm sm:text-base">Les fullstendige dokumenter:</p>
            <div className="grid gap-1 sm:gap-2">
              {[
                { href: '/bruksvilkar', text: 'Fullstendige Bruksvilkår' },
                { href: '/personvern', text: 'Personvernerklæring' },
                { href: '/cookies', text: 'Cookie-policy' }
              ].map((link, idx) => (
                <a 
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm underline inline-flex items-center gap-1"
                >
                  → {link.text}
                </a>
              ))}
            </div>
          </div>

          {!hasScrolled && (
            <div className="text-center text-xs sm:text-sm text-slate-400 py-3 sm:py-4 animate-bounce">
              ⬇️ Scroll ned for å fortsette
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Checkboxes */}
          <div className="space-y-2 sm:space-y-3">
            {[
              { state: acceptedTerms, setState: setAcceptedTerms, href: '/bruksvilkar', text: 'Bruksvilkårene' },
              { state: acceptedPrivacy, setState: setAcceptedPrivacy, href: '/personvern', text: 'Personvernerklæringen' },
              { state: acceptedCookies, setState: setAcceptedCookies, href: '/cookies', text: 'Cookie-policyen' }
            ].map((checkbox, idx) => (
              <label key={idx} className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checkbox.state}
                  onChange={(e) => checkbox.setState(e.target.checked)}
                  disabled={!hasScrolled}
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                  Jeg har lest og aksepterer{' '}
                  <a href={checkbox.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {checkbox.text}
                  </a>
                </span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              Avbryt
            </button>
            <button
              onClick={handleAccept}
              disabled={!canAccept || isSubmitting}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Aksepterer...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  Aksepter og fortsett
                </>
              )}
            </button>
          </div>

          {!hasScrolled && (
            <p className="text-xs text-center text-slate-500">
              Du må scrolle gjennom dokumentet før du kan akseptere
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
