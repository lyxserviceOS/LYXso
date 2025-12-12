'use client';

import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import USPSection from './sections/USPSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';

type Org = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  org_settings: {
    primary_color: string | null;
    brand_name: string | null;
  } | null;
};

type LandingPage = {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  sections_json: any;
};

type Props = {
  org: Org;
  landingPage: LandingPage | null;
};

export default function LandingPageRenderer({ org, landingPage }: Props) {
  // Default sections hvis ingen landing page er satt opp
  const sections = landingPage?.sections_json || [
    { type: 'hero' },
    { type: 'services' },
    { type: 'usp' },
    { type: 'contact' },
  ];

  // Apply custom branding
  const primaryColor = org.org_settings?.primary_color || '#2563eb';
  const brandName = org.org_settings?.brand_name || org.name;

  return (
    <div className="min-h-screen">
      {/* Apply custom CSS variables */}
      <style jsx global>{`
        :root {
          --brand-primary: ${primaryColor};
        }
      `}</style>

      {/* Render sections dynamically */}
      {sections.map((section: any, index: number) => {
        switch (section.type) {
          case 'hero':
            return (
              <HeroSection
                key={index}
                org={org}
                section={{
                  title: landingPage?.hero_title || brandName,
                  subtitle:
                    landingPage?.hero_subtitle ||
                    'Bestill time for bilpleie, dekkhotell, coating og mer',
                  image_url: landingPage?.hero_image_url,
                  ...section,
                }}
              />
            );

          case 'services':
            return <ServicesSection key={index} org={org} section={section} />;

          case 'usp':
            return <USPSection key={index} org={org} section={section} />;

          case 'testimonials':
            return <TestimonialsSection key={index} org={org} section={section} />;

          case 'contact':
            return <ContactSection key={index} org={org} section={section} />;

          default:
            return null;
        }
      })}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-3">{brandName}</h3>
              <p className="text-sm">
                Profesjonell bilpleie og service
              </p>
            </div>

            {org.phone && (
              <div>
                <h4 className="text-white font-semibold mb-3">Kontakt</h4>
                <p className="text-sm">Telefon: {org.phone}</p>
                {org.email && <p className="text-sm">E-post: {org.email}</p>}
              </div>
            )}

            <div className="text-sm">
              <p>Drevet av <a href="https://lyxso.no" className="text-blue-400 hover:text-blue-300">LYXso</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
