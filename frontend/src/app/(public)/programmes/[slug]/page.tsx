import type { Metadata } from 'next';
import { ProgrammeDetail } from './ProgrammeDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ard-ziguinchor.sn';

async function getProgramme(slug: string) {
  try {
    const res = await fetch(`${API_URL}/programmes/${slug}`, { next: { revalidate: 600 } });
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
  const prog = await getProgramme(slug);

  if (!prog) {
    return { title: 'Programme introuvable' };
  }

  const description = prog.resume || prog.description?.replace(/<[^>]+>/g, '').slice(0, 160);

  return {
    title: prog.nom,
    description,
    openGraph: {
      title: prog.nom,
      description,
      type: 'article',
      url: `${SITE_URL}/programmes/${slug}`,
      images: prog.image ? [{ url: prog.image, alt: prog.nom }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: prog.nom,
      description,
    },
  };
}

export default function ProgrammeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ProgrammeDetail params={params} />;
}
