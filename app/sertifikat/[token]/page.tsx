// app/sertifikat/[token]/page.tsx - Public certificate viewing page
import { Metadata } from 'next';

interface Props {
  params: {
    token: string;
  };
}

async function getCertificate(token: string) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4200';
    const res = await fetch(`${apiBase}/api/public/certificate/${token}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.certificate;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const certificate = await getCertificate(params.token);

  if (!certificate) {
    return {
      title: 'Sertifikat ikke funnet - LYXso',
    };
  }

  return {
    title: `Coating Garantisertifikat - ${certificate.certificate_number}`,
    description: `Coating garantisertifikat for ${certificate.vehicle?.registration_number} - Garantert til ${new Date(certificate.expires_at).toLocaleDateString('nb-NO')}`,
  };
}

export default async function CertificatePage({ params }: Props) {
  const certificate = await getCertificate(params.token);

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sertifikat ikke funnet
          </h1>
          <p className="text-gray-600">
            Vi fant ingen coating-garantisertifikat med denne lenken.
          </p>
        </div>
      </div>
    );
  }

  const isValid = certificate.is_valid;
  const expiresDate = new Date(certificate.expires_at);
  const issuedDate = new Date(certificate.issued_at);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Coating Garantisertifikat
                </h1>
                <p className="text-blue-100">
                  Offisiell garantidokumentasjon
                </p>
              </div>
              {certificate.org?.logo_url && (
                <img
                  src={certificate.org.logo_url}
                  alt={certificate.org.name}
                  className="h-16 w-auto bg-white rounded-lg p-2"
                />
              )}
            </div>
          </div>

          {/* Certificate Status Banner */}
          <div className={`px-8 py-4 ${isValid ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-3">
              {isValid ? (
                <>
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-semibold">
                    ✓ Gyldig garantisertifikat
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 font-semibold">
                    ⚠️ Garantien har utløpt
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Certificate Content */}
          <div className="px-8 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Certificate Number */}
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">
                    Sertifikatnummer
                  </h2>
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {certificate.certificate_number}
                  </p>
                </div>

                {/* Customer */}
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">
                    Kunde
                  </h2>
                  <p className="text-lg font-semibold text-gray-900">
                    {certificate.customer?.name}
                  </p>
                </div>

                {/* Vehicle */}
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Kjøretøy
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xl font-bold text-gray-900 mb-2">
                      {certificate.vehicle?.registration_number}
                    </p>
                    <p className="text-gray-700">
                      {certificate.vehicle?.make} {certificate.vehicle?.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {certificate.vehicle?.year} • {certificate.vehicle?.color || 'Ukjent farge'}
                    </p>
                  </div>
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Coating-detaljer
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {certificate.job?.product_name || 'Premium Coating'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {certificate.job?.layers || 1} lag • Utført {issuedDate.toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <h2 className="text-sm font-medium text-gray-500 mb-3">
                    Verifikasjonskode
                  </h2>
                  <img
                    src={certificate.qr_code_url}
                    alt="QR Code"
                    className="w-48 h-48 border-4 border-gray-200 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Skann for å verifisere ekthet
                  </p>
                </div>

                {/* Warranty Period */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 text-center">
                  <h2 className="text-sm font-medium text-gray-600 mb-2">
                    Garantiperiode
                  </h2>
                  <p className="text-4xl font-bold text-indigo-600 mb-1">
                    {certificate.warranty_years}
                  </p>
                  <p className="text-lg text-gray-700 mb-3">
                    år garanti
                  </p>
                  <div className="pt-3 border-t border-indigo-200">
                    <p className="text-sm text-gray-600">
                      Gyldig til
                    </p>
                    <p className="text-xl font-semibold text-gray-900">
                      {expiresDate.toLocaleDateString('nb-NO', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Terms */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Garantibetingelser
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-700 space-y-2">
                <p>
                  • Garantien gjelder for produksjons- og påføringsfeil i henhold til produsentens spesifikasjoner.
                </p>
                <p>
                  • Garantien forutsetter normal bruk og regelmessig vedlikehold av kjøretøyet.
                </p>
                <p>
                  • Årlige kontroller må gjennomføres for at garantien skal være gyldig.
                </p>
                <p>
                  • Garantien dekker ikke skader forårsaket av ulykker, misbruk eller mangelfull vedlikehold.
                </p>
                <p>
                  • For full garantibetingelser, kontakt {certificate.org?.name}.
                </p>
              </div>
            </div>

            {/* Issued By */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-3">
                Utstedt av
              </h2>
              <div className="flex items-center gap-4">
                {certificate.org?.logo_url && (
                  <img
                    src={certificate.org.logo_url}
                    alt={certificate.org.name}
                    className="h-12 w-auto"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {certificate.org?.name}
                  </p>
                  {certificate.org?.contact_email && (
                    <p className="text-sm text-gray-600">
                      {certificate.org.contact_email}
                    </p>
                  )}
                  {certificate.org?.contact_phone && (
                    <p className="text-sm text-gray-600">
                      {certificate.org.contact_phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
            <p>
              Dette er et offisielt coating-garantisertifikat utstedt av {certificate.org?.name}
            </p>
            <p className="mt-1">
              Powered by <span className="font-semibold text-blue-600">LYXso</span>
            </p>
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Skriv ut sertifikat
          </button>

          {certificate.pdf_url && (
            <a
              href={certificate.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Last ned PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
