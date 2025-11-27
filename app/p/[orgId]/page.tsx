// app/p/[orgId]/page.tsx
// White-label landingsside for partnere – Module 21

import type { Metadata } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

type Service = {
  title: string;
  description: string;
  icon?: string;
  price?: string;
};

type OpeningHour = {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
};

type LandingPageSettings = {
  // Hero section
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_image_url?: string | null;
  hero_cta_text?: string | null;
  hero_cta_link?: string | null;

  // About section
  about_title?: string | null;
  about_content?: string | null;
  about_image_url?: string | null;

  // Services section
  services_title?: string | null;
  services_content?: Service[] | null;

  // Contact section
  show_contact?: boolean | null;
  contact_title?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  contact_address?: string | null;
  contact_map_url?: string | null;

  // Social media
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;

  // Appearance
  primary_color?: string | null;
  secondary_color?: string | null;
  font_family?: string | null;
  logo_url?: string | null;

  // Opening hours (new for Module 21)
  opening_hours?: OpeningHour[] | null;

  // SEO
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;

  // Settings
  is_published?: boolean | null;
  show_booking_widget?: boolean | null;
  custom_css?: string | null;

  // Legacy fields (backward compat)
  heroBadge?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  feature1Title?: string | null;
  feature1Body?: string | null;
  feature2Title?: string | null;
  feature2Body?: string | null;
  feature3Title?: string | null;
  feature3Body?: string | null;
  isPublished?: boolean | null;
};

type PageProps = {
  params: Promise<{
    orgId: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const { orgId } = await props.params;

  let landing: LandingPageSettings | null = null;
  try {
    const res = await fetch(
      `${API_BASE}/api/orgs/${orgId}/landing-page`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const json = await res.json();
      landing = (json?.data || json?.landingPage) as LandingPageSettings ?? null;
    }
  } catch {
    // ignore
  }

  return {
    title: landing?.meta_title || landing?.hero_title || `Book time – LYXso partner`,
    description: landing?.meta_description || landing?.hero_subtitle || "Online booking, kunder og drift samlet på ett sted.",
    keywords: landing?.meta_keywords || undefined,
  };
}

export default async function PublicLandingPage(props: PageProps) {
  const { orgId } = await props.params;

  let landing: LandingPageSettings | null = null;
  let loadError: string | null = null;

  try {
    const res = await fetch(
      `${API_BASE}/api/orgs/${orgId}/landing-page`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      loadError = `Feil ved henting av landing-page (public): ${res.status}`;
    } else {
      const json = await res.json();
      landing = (json?.data || json?.landingPage) as LandingPageSettings ?? null;
    }
  } catch (err) {
    console.error("Feil ved henting av landing-page (public):", err);
    loadError = "Feil ved henting av landing-page (public).";
  }

  // Extract values with fallbacks (support both new and legacy formats)
  const primaryColor = landing?.primary_color || "#3B82F6";
  const secondaryColor = landing?.secondary_color || "#10B981";
  const fontFamily = landing?.font_family || "Inter";
  const logoUrl = landing?.logo_url;

  // Hero section
  const heroTitle = landing?.hero_title || landing?.heroTitle || "Velkommen til vår tjeneste";
  const heroSubtitle = landing?.hero_subtitle || landing?.heroSubtitle || "Vi tilbyr profesjonelle tjenester for din bil";
  const heroImageUrl = landing?.hero_image_url;
  const heroCtaText = landing?.hero_cta_text || landing?.primaryCtaLabel || "Book time";
  const heroCtaLink = landing?.hero_cta_link || landing?.primaryCtaUrl || "#booking";

  // About section
  const aboutTitle = landing?.about_title || "Om oss";
  const aboutContent = landing?.about_content;
  const aboutImageUrl = landing?.about_image_url;

  // Services
  const servicesTitle = landing?.services_title || "Våre tjenester";
  const services = landing?.services_content || [];

  // Contact
  const showContact = landing?.show_contact !== false;
  const contactTitle = landing?.contact_title || "Kontakt oss";
  const contactPhone = landing?.contact_phone;
  const contactEmail = landing?.contact_email;
  const contactAddress = landing?.contact_address;
  const contactMapUrl = landing?.contact_map_url;

  // Social
  const facebookUrl = landing?.facebook_url;
  const instagramUrl = landing?.instagram_url;
  const linkedinUrl = landing?.linkedin_url;

  // Opening hours
  const openingHours = landing?.opening_hours || [];

  // Settings
  const isPublished = landing?.is_published ?? landing?.isPublished ?? false;
  const showBookingWidget = landing?.show_booking_widget !== false;
  const customCss = landing?.custom_css;

  // Legacy features (if using old format)
  const feature1Title = landing?.feature1Title;
  const feature1Body = landing?.feature1Body;
  const feature2Title = landing?.feature2Title;
  const feature2Body = landing?.feature2Body;
  const feature3Title = landing?.feature3Title;
  const feature3Body = landing?.feature3Body;
  const hasLegacyFeatures = feature1Title || feature2Title || feature3Title;

  return (
    <>
      {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
      <main 
        className="min-h-screen"
        style={{ fontFamily: `${fontFamily}, system-ui, sans-serif` }}
      >
        {/* Header with logo */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div 
                  className="text-xl font-bold"
                  style={{ color: primaryColor }}
                >
                  {heroTitle?.split(' ')[0] || 'Partner'}
                </div>
              )}
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {aboutContent && <a href="#about" className="text-slate-600 hover:text-slate-900">Om oss</a>}
              {services.length > 0 && <a href="#services" className="text-slate-600 hover:text-slate-900">Tjenester</a>}
              {showContact && <a href="#contact" className="text-slate-600 hover:text-slate-900">Kontakt</a>}
              <a 
                href="#booking" 
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                {heroCtaText}
              </a>
            </nav>
          </div>
        </header>

        {/* Not published warning */}
        {!isPublished && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-700">
            ⚠️ Denne landingssiden er ikke publisert enda. Kun du kan se den.
          </div>
        )}

        {/* Hero Section */}
        <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
          {heroImageUrl ? (
            <>
              <img 
                src={heroImageUrl} 
                alt="Hero background" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </>
          ) : (
            <div 
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)` }}
            ></div>
          )}
          
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              style={{ color: heroImageUrl ? 'white' : primaryColor }}
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p 
                className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
                style={{ color: heroImageUrl ? 'rgba(255,255,255,0.9)' : '#475569' }}
              >
                {heroSubtitle}
              </p>
            )}
            {heroCtaText && (
              <a 
                href={heroCtaLink}
                className="inline-block px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                style={{ backgroundColor: primaryColor }}
              >
                {heroCtaText}
              </a>
            )}
          </div>
        </section>

        {/* About Section */}
        {aboutContent && (
          <section id="about" className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-8 text-center"
                style={{ color: primaryColor }}
              >
                {aboutTitle}
              </h2>
              <div className={`grid gap-12 ${aboutImageUrl ? 'md:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'} items-center`}>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {aboutContent}
                  </p>
                </div>
                {aboutImageUrl && (
                  <img 
                    src={aboutImageUrl} 
                    alt="About" 
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Legacy Features Section (if using old format) */}
        {hasLegacyFeatures && (
          <section className="py-16 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {feature1Title && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
                      {feature1Title}
                    </h3>
                    <p className="text-slate-600">{feature1Body}</p>
                  </div>
                )}
                {feature2Title && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
                      {feature2Title}
                    </h3>
                    <p className="text-slate-600">{feature2Body}</p>
                  </div>
                )}
                {feature3Title && (
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: primaryColor }}>
                      {feature3Title}
                    </h3>
                    <p className="text-slate-600">{feature3Body}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Services Section */}
        {services.length > 0 && (
          <section id="services" className="py-16 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-12 text-center"
                style={{ color: primaryColor }}
              >
                {servicesTitle}
              </h2>
              <div className={`grid gap-8 ${services.length === 1 ? 'max-w-md mx-auto' : services.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
                {services.map((svc, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border-2 border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-blue-300 transition-all group"
                  >
                    {svc.icon && (
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                        {svc.icon}
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
                      {svc.title}
                    </h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {svc.description}
                    </p>
                    {svc.price && (
                      <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
                        {svc.price}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Booking Section */}
        {showBookingWidget && (
          <section id="booking" className="py-16 px-4 bg-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: primaryColor }}
              >
                Book en time
              </h2>
              <p className="text-slate-600 mb-8">
                Velg ønsket tjeneste og tidspunkt som passer deg
              </p>
              <div className="bg-slate-50 rounded-xl p-8 border">
                <p className="text-slate-500 mb-4">
                  Bookingwidget vil vises her når den er konfigurert
                </p>
                <a 
                  href={`/bestill?org=${orgId}`}
                  className="inline-block px-8 py-3 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Se ledige timer
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {showContact && (contactPhone || contactEmail || contactAddress) && (
          <section id="contact" className="py-16 px-4 bg-slate-50">
            <div className="max-w-6xl mx-auto">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-12 text-center"
                style={{ color: primaryColor }}
              >
                {contactTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  {contactPhone && (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke={primaryColor} strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Telefon</div>
                        <a href={`tel:${contactPhone}`} className="text-lg font-semibold hover:underline">
                          {contactPhone}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactEmail && (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke={primaryColor} strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">E-post</div>
                        <a href={`mailto:${contactEmail}`} className="text-lg font-semibold hover:underline">
                          {contactEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {contactAddress && (
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke={primaryColor} strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Adresse</div>
                        <div className="text-lg font-semibold">{contactAddress}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Opening Hours */}
                  {openingHours.length > 0 && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold mb-3" style={{ color: primaryColor }}>
                        Åpningstider
                      </h3>
                      <div className="space-y-2 text-sm">
                        {openingHours.map((hour, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-slate-600">{hour.day}</span>
                            <span className="font-medium">
                              {hour.closed ? 'Stengt' : `${hour.open} - ${hour.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Media */}
                  {(facebookUrl || instagramUrl || linkedinUrl) && (
                    <div className="pt-6 border-t">
                      <div className="text-sm text-slate-600 mb-3">Følg oss</div>
                      <div className="flex gap-3">
                        {facebookUrl && (
                          <a 
                            href={facebookUrl}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            style={{ backgroundColor: primaryColor }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="text-white font-bold">f</span>
                          </a>
                        )}
                        {instagramUrl && (
                          <a 
                            href={instagramUrl}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            style={{ backgroundColor: primaryColor }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                        {linkedinUrl && (
                          <a 
                            href={linkedinUrl}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            style={{ backgroundColor: primaryColor }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="text-white font-bold text-sm">in</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {contactMapUrl && (
                  <div className="rounded-xl overflow-hidden shadow-lg h-80">
                    <iframe
                      src={contactMapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto opacity-80" />
              ) : (
                <span className="font-semibold text-white">{heroTitle?.split(' ')[0] || 'Partner'}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {contactPhone && <span>{contactPhone}</span>}
              {contactEmail && <span>{contactEmail}</span>}
            </div>
            <div className="text-xs">
              Driftes av <span className="text-sky-400">LYXso</span> – serviceOS for bilpleie
            </div>
          </div>
        </footer>

        {/* Error display */}
        {loadError && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
            {loadError}
          </div>
        )}
      </main>
    </>
  );
}
