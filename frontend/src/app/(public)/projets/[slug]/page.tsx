import type { Metadata } from 'next';
import { ProjetDetail } from './ProjetDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ard-ziguinchor.sn';

async function getProjet(slug: string) {
  try {
    const res = await fetch(`${API_URL}/projets/${slug}`, { next: { revalidate: 600 } });
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
  const projet = await getProjet(slug);

  if (!projet) {
    return { title: 'Projet introuvable' };
  }

  const description = projet.resume || projet.description?.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: projet.titre,
    description,
    openGraph: {
      title: projet.titre,
      description,
      type: 'article',
      url: `${SITE_URL}/projets/${slug}`,
      images: projet.imagePrincipale ? [{ url: projet.imagePrincipale, alt: projet.titre }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: projet.titre,
      description,
      images: projet.imagePrincipale ? [projet.imagePrincipale] : [],
    },
  };
}

export default function ProjetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProjetDetail params={params} />;
}
