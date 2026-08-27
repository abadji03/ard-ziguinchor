import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ard-ziguinchor.sn';
const API_URL  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:3000/api';

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/${endpoint}?limit=200&page=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items: Array<{ slug: string }> = Array.isArray(json) ? json : (json.data ?? []);
    return items.map((i) => i.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Pages statiques
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                       lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/a-propos`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/a-propos/mot-du-directeur`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/la-region`,        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/la-region/departements`,   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/la-region/communes`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/la-region/cartographie`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/programmes`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/projets`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/actualites`,       lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/partenaires`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/opportunites`,     lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/documentation`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/galerie`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${BASE_URL}/agenda`,           lastModified: now, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE_URL}/observatoire`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`,              lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/recherche`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/contact`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/confidentialite`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/plan-du-site`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/accessibilite`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // Pages dynamiques : actualités
  const actualitesSlugs = await fetchSlugs('actualites');
  const actualitesRoutes: MetadataRoute.Sitemap = actualitesSlugs.map((slug) => ({
    url: `${BASE_URL}/actualites/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Pages dynamiques : projets
  const projetsSlugs = await fetchSlugs('projets');
  const projetsRoutes: MetadataRoute.Sitemap = projetsSlugs.map((slug) => ({
    url: `${BASE_URL}/projets/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Pages dynamiques : programmes
  const programmesSlugs = await fetchSlugs('programmes');
  const programmesRoutes: MetadataRoute.Sitemap = programmesSlugs.map((slug) => ({
    url: `${BASE_URL}/programmes/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Pages dynamiques : partenaires
  const partenairesSlugs = await fetchSlugs('partenaires');
  const partenairesRoutes: MetadataRoute.Sitemap = partenairesSlugs.map((slug) => ({
    url: `${BASE_URL}/partenaires/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // Pages dynamiques : opportunités
  const opportunitesSlugs = await fetchSlugs('opportunites');
  const opportunitesRoutes: MetadataRoute.Sitemap = opportunitesSlugs.map((slug) => ({
    url: `${BASE_URL}/opportunites/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...actualitesRoutes,
    ...projetsRoutes,
    ...programmesRoutes,
    ...partenairesRoutes,
    ...opportunitesRoutes,
  ];
}
