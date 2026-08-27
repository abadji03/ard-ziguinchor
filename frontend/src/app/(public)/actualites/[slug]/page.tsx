import type { Metadata } from 'next';
import { ActualiteDetail } from './ActualiteDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ard-ziguinchor.sn';

async function getActualite(slug: string) {
  try {
    const res = await fetch(`${API_URL}/actualites/${slug}`, { next: { revalidate: 300 } });
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
  const actu = await getActualite(slug);

  if (!actu) {
    return { title: 'Actualité introuvable' };
  }

  return {
    title: actu.titre,
    description: actu.resume || actu.titre,
    openGraph: {
      title: actu.titre,
      description: actu.resume || actu.titre,
      type: 'article',
      publishedTime: actu.datePublication,
      url: `${SITE_URL}/actualites/${slug}`,
      images: actu.imagePrincipale ? [{ url: actu.imagePrincipale, alt: actu.titre }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: actu.titre,
      description: actu.resume || actu.titre,
      images: actu.imagePrincipale ? [actu.imagePrincipale] : [],
    },
  };
}

export default function ActualiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ActualiteDetail params={params} />;
}
