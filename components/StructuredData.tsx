/**
 * Structured Data (JSON-LD) for LYXso
 * Provides rich snippets for search engines
 */

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LYXso AS",
    "alternateName": "LYXso",
    "url": "https://www.lyxso.no",
    "logo": "https://www.lyxso.no/logo.png",
    "description": "ServiceOS for bilbransjen - booking, kalender, kundekort, markedsføring og AI-oppfølging",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NO",
      "addressLocality": "Oslo",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "availableLanguage": ["Norwegian", "English"],
    },
    "sameAs": [
      // Add social media profiles here
      // "https://www.facebook.com/lyxso",
      // "https://www.linkedin.com/company/lyxso",
      // "https://twitter.com/lyxso"
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LYXso",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "599",
      "highPrice": "4990",
      "priceCurrency": "NOK",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "990",
        "priceCurrency": "NOK",
        "unitText": "MONTH",
      },
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
    },
    "description":
      "Moderne system for booking, kalender, kundekort, markedsføring, regnskap og AI-oppfølging. Spesielt tilpasset bilbransjen inkludert bilpleie, dekkhotell, PPF, coating og verksteder.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://www.lyxso.no${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export function FAQSchema({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export function ProductSchema() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "LYXso ServiceOS",
    "description": "Komplett system for bilbransjen med booking, kalender, kundekort, markedsføring og AI",
    "brand": {
      "@type": "Brand",
      "name": "LYXso",
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://www.lyxso.no/priser",
      "priceCurrency": "NOK",
      "lowPrice": "599",
      "highPrice": "4990",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}

export function LocalBusinessSchema() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LYXso",
    "url": "https://www.lyxso.no",
    "description": "ServiceOS for bilbransjen - booking, kalender, kundekort og AI-oppfølging",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "990",
      "priceCurrency": "NOK",
      "availability": "https://schema.org/InStock",
    },
    "creator": {
      "@type": "Organization",
      "name": "LYXso AS",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NO",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
    />
  );
}
