import { notFound } from 'next/navigation';
import LandingPageRenderer from '@/components/landing-page/LandingPageRenderer';
import { getApiBaseUrl } from "@/lib/apiConfig";

const API_BASE_URL = getApiBaseUrl();

async function getLandingPageData(orgSlug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/landing/${orgSlug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch landing page:', error);
    return null;
  }
}

export default async function PartnerLandingPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const data = await getLandingPageData(params.orgSlug);

  if (!data || !data.org) {
    notFound();
  }

  return <LandingPageRenderer org={data.org} landingPage={data.landingPage} />;
}

export async function generateMetadata({ params }: { params: { orgSlug: string } }) {
  const data = await getLandingPageData(params.orgSlug);

  if (!data || !data.org) {
    return {
      title: 'Organisasjon ikke funnet',
    };
  }

  return {
    title: `${data.org.name} - Booking og tjenester`,
    description: data.landingPage?.hero_subtitle || `Bestill time hos ${data.org.name}`,
  };
}
