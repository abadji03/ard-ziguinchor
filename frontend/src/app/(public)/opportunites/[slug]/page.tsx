import type { Metadata } from 'next';
import { OpportuniteDetail } from './OpportuniteDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ard-ziguinchor.sn';

async function getOpportunite(slug: string) {
  try {
    const res = await fetch(`${API_URL}/opportunites/${slug}`, { next: { revalidate: 300 } });
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
  const opp = await getOpportunite(slug);

  if (!opp) {
    return { title: 'Opportunité introuvable' };
  }

  const description = opp.resume || opp.description?.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: opp.titre,
    description,
    openGraph: {
      title: opp.titre,
      description,
      type: 'article',
      url: `${SITE_URL}/opportunites/${slug}`,
    },
    twitter: {
      card: 'summary',
      title: opp.titre,
      description,
    },
  };
}

export default function OpportuniteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <OpportuniteDetail params={params} />;
}
