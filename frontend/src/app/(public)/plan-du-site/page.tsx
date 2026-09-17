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
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Plan du site' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Arborescence & Navigation
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Plan du Site
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Vue d&apos;ensemble de toutes les rubriques, portails thématiques et ressources documentaires de l&apos;ARD Ziguinchor.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAN.map((group) => (
            <div
              key={group.section}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-emerald-600/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <h2 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 text-sm uppercase tracking-wider text-emerald-700 flex items-center justify-between">
                  <span>{group.section}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {group.links.length}
                  </span>
                </h2>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-600 transition-colors shrink-0" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
