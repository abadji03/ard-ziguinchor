export const SITE_NAME = 'ARD Ziguinchor';
export const SITE_DESCRIPTION =
  "Agence Régionale de Développement de Ziguinchor – Au service du développement local";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const COLORS = {
  primary: '#0A5CCF',
  secondary: '#F4B400',
  background: '#F8FAFC',
  text: '#1F2937',
  success: '#16A34A',
  error: '#DC2626',
} as const;

export const STATUT_PROJET: Record<string, { label: string; color: string }> = {
  planifie:  { label: 'Planifié',    color: 'bg-blue-100 text-blue-700'   },
  encours:   { label: 'En cours',    color: 'bg-yellow-100 text-yellow-700' },
  realise:   { label: 'Réalisé',     color: 'bg-green-100 text-green-700'  },
  suspendu:  { label: 'Suspendu',    color: 'bg-red-100 text-red-700'      },
};

export const STATUT_ACTUALITE: Record<string, { label: string; color: string }> = {
  brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700'    },
  publie:    { label: 'Publié',    color: 'bg-green-100 text-green-700'  },
  archive:   { label: 'Archivé',   color: 'bg-orange-100 text-orange-700' },
};

export const STATUT_OPPORTUNITE: Record<string, { label: string; color: string }> = {
  ouvert:  { label: 'Ouvert',  color: 'bg-green-100 text-green-700'  },
  ferme:   { label: 'Fermé',   color: 'bg-red-100 text-red-700'      },
  expire:  { label: 'Expiré',  color: 'bg-gray-100 text-gray-700'    },
};

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  {
    label: "L'ARD",
    href: '/a-propos',
    children: [
      { label: 'Présentation',      href: '/a-propos' },
      { label: 'Mot du Directeur',  href: '/a-propos/mot-du-directeur' },
      { label: 'Missions',          href: '/a-propos#missions' },
      { label: 'Organisation',      href: '/a-propos#organisation' },
      { label: 'Équipe',            href: '/a-propos#equipe' },
    ],
  },
  {
    label: 'La Région',
    href: '/la-region',
    children: [
      { label: 'Présentation',      href: '/la-region' },
      { label: 'Départements',      href: '/la-region/departements' },
      { label: 'Communes',          href: '/la-region/communes' },
      { label: 'Cartographie',      href: '/la-region/cartographie' },
      { label: 'Observatoire',      href: '/observatoire' },
    ],
  },
  {
    label: 'Nos Actions',
    href: '/programmes',
    children: [
      { label: 'Programmes',    href: '/programmes' },
      { label: 'Projets',       href: '/projets' },
      { label: 'Actualités',    href: '/actualites' },
      { label: 'Partenaires',   href: '/partenaires' },
      { label: 'Opportunités',  href: '/opportunites' },
    ],
  },
  {
    label: 'Documentation',
    href: '/documentation',
    children: [
      { label: 'Planification régionale',   href: '/documentation/planification-regionale' },
      { label: 'Planification territoriale', href: '/documentation/planification-territoriale' },
      { label: 'Autres documents',          href: '/documentation/autres' },
    ],
  },
  { label: 'Contact',       href: '/contact' },
  { label: 'Galerie',        href: '/galerie'  },
] as const;

export const SOCIAL_LINKS = {
  facebook:  'https://facebook.com/ard-ziguinchor',
  twitter:   'https://twitter.com/ard-ziguinchor',
  linkedin:  'https://linkedin.com/company/ard-ziguinchor',
  youtube:   '',
} as const;

export const CONTACT_INFO = {
  adresse:   'Ziguinchor, Sénégal',
  email:     'contact@ard-ziguinchor.sn',
  telephone: '+221 33 991 XX XX',
  horaires:  'Lun – Ven : 08h00 – 17h00',
} as const;

export const TYPE_PLANIFICATION_LABELS: Record<string, string> = {
  REGIONALE:   'Planification régionale',
  TERRITORIALE: 'Planification territoriale',
  AUTRE:       'Autres documents',
} as const;
