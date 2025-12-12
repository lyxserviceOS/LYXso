// app/(public)/sertifikat/[token]/page.tsx
import PublicCertificatePage from './PublicCertificatePage';

export default function Page({ params }: { params: { token: string } }) {
  return <PublicCertificatePage token={params.token} />;
}
