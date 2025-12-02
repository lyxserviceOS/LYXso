// app/(public)/bestill/[slug]/page.tsx
import { notFound } from 'next/navigation';
import PublicBookingWizard from './PublicBookingWizard';

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getOrgInfo(slug: string) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
    const response = await fetch(`${apiBase}/api/public/orgs/${slug}/info`, {
      cache: 'no-store' // Always fresh data
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.org;
  } catch (error) {
    console.error('Error fetching org info:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrgInfo(slug);

  if (!org) {
    return {
      title: 'Organisasjon ikke funnet - LYXso',
      description: 'Denne organisasjonen finnes ikke eller er ikke aktiv.'
    };
  }

  return {
    title: `Book time hos ${org.name} - LYXso`,
    description: `Book time direkte hos ${org.name}. Velg tjeneste og tidspunkt som passer deg.`,
    openGraph: {
      title: `Book time hos ${org.name}`,
      description: `Book time direkte hos ${org.name}`,
      type: 'website',
    }
  };
}

export default async function PublicBookingPage({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrgInfo(slug);

  if (!org) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center gap-4">
            {org.logo_url && (
              <img
                src={org.logo_url}
                alt={org.name}
                className="h-12 w-12 rounded-lg object-contain"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
              <p className="text-sm text-slate-600">Book time online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <PublicBookingWizard org={org} />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-slate-600">
          <p>Drevet av <strong>LYXso</strong></p>
          {org.phone && (
            <p className="mt-2">
              Trenger du hjelp? Ring{' '}
              <a href={`tel:${org.phone}`} className="text-blue-600 hover:underline">
                {org.phone}
              </a>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
