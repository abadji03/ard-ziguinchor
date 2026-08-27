import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata: Metadata = {
  title: 'Plan du site',
  description: 'Plan du site de l\'ARD Ziguinchor – toutes les pages et sections du portail.',
};

const PLAN = [
  {
    section: 'Accueil',
    links: [
      { label: 'Page d\'accueil', href: '/' },
    ],
  },
  {
    section: "L'ARD",
    links: [
      { label: 'Présentation', href: '/a-propos' },
      { label: 'Mot du Directeur', href: '/a-propos/mot-du-directeur' },
      { label: 'Missions', href: '/a-propos#missions' },
      { label: 'Organisation', href: '/a-propos#organisation' },
      { label: 'Équipe', href: '/a-propos#equipe' },
    ],
  },
  {
    section: 'La Région',
    links: [
      { label: 'Présentation de la région', href: '/la-region' },
      { label: 'Départements', href: '/la-region/departements' },
      { label: 'Communes', href: '/la-region/communes' },
      { label: 'Cartographie interactive', href: '/la-region/cartographie' },
    ],
  },
  {
    section: 'Programmes',
    links: [
      { label: 'Tous les programmes', href: '/programmes' },
    ],
  },
  {
    section: 'Projets',
    links: [
      { label: 'Tous les projets', href: '/projets' },
    ],
  },
  {
    section: 'Actualités',
    links: [
      { label: 'Toutes les actualités', href: '/actualites' },
    ],
  },
  {
    section: 'Documentation',
    links: [
      { label: 'Bibliothèque de documents', href: '/documentation' },
    ],
  },
  {
    section: 'Partenaires',
    links: [
      { label: 'Tous les partenaires', href: '/partenaires' },
    ],
  },
  {
    section: 'Opportunités',
    links: [
      { label: 'Toutes les opportunités', href: '/opportunites' },
    ],
  },
  {
    section: 'Ressources',
    links: [
      { label: 'Galerie', href: '/galerie' },
      { label: 'Agenda', href: '/agenda' },
      { label: 'Observatoire du développement', href: '/observatoire' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Recherche', href: '/recherche' },
    ],
  },
  {
    section: 'Contact & Informations légales',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: 'Accessibilité', href: '/accessibilite' },
      { label: 'Plan du site', href: '/plan-du-site' },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Plan du site' }]} />
          <SectionTitle
            title="Plan du site"
            subtitle="Vue d'ensemble de toutes les pages du portail ARD Ziguinchor"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAN.map((group) => (
            <div key={group.section} className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 text-sm uppercase tracking-wide text-primary">
                {group.section}
              </h2>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
