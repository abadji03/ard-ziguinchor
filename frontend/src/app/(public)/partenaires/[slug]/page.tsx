import type { Metadata } from 'next';
import { PartenaireDetail } from './PartenaireDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ard-ziguinchor.sn';

async function getPartenaire(slug: string) {
  try {
    const res = await fetch(`${API_URL}/partenaires/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPartenaire(slug);

  if (!p) {
    return { title: 'Partenaire introuvable' };
  }

  return {
    title: p.sigle ? `${p.sigle} – ${p.nom}` : p.nom,
    description: p.description?.slice(0, 160),
    openGraph: {
      title: p.nom,
      description: p.description?.slice(0, 160),
      type: 'profile',
      url: `${SITE_URL}/partenaires/${slug}`,
      images: p.logo ? [{ url: p.logo, alt: p.nom }] : [],
    },
  };
}

export default function PartenaireDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <PartenaireDetail params={params} />;
}
