import { MapPin, Phone, Mail, Clock } from 'lucide-react';

type Props = {
  org: any;
  section: any;
};

export default function ContactSection({ org, section }: Props) {
  const title = section.title || 'Kontakt oss';
  const subtitle = section.subtitle || 'Vi er her for å hjelpe deg';

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            {org.phone && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Telefon</h3>
                  <a
                    href={`tel:${org.phone}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {org.phone}
                  </a>
                </div>
              </div>
            )}

            {org.email && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">E-post</h3>
                  <a
                    href={`mailto:${org.email}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {org.email}
                  </a>
                </div>
              </div>
            )}

            {section.address && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Adresse</h3>
                  <p className="text-slate-600">{section.address}</p>
                </div>
              </div>
            )}

            {section.opening_hours && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Åpningstider</h3>
                  <div className="text-slate-600 text-sm space-y-1">
                    {Object.entries(section.opening_hours).map(([day, hours]: [string, any]) => (
                      <div key={day} className="flex justify-between gap-4">
                        <span className="capitalize">{day}:</span>
                        <span>{hours || 'Stengt'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-slate-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Klar til å bestille?
            </h3>
            <p className="text-slate-600 mb-6">
              Book din neste time online eller ring oss for spørsmål.
            </p>
            <a
              href="/bestill"
              className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Bestill time nå
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
