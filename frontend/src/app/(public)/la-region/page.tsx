import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { RegionDepartements } from '@/components/features/region/RegionDepartements';
import { RegionChiffres, RegionPotentiels, RegionSousPages } from './RegionContenus';

export const metadata: Metadata = {
  title: 'La Région de Ziguinchor | Territoire et Potentialités',
  description:
    'Découvrez la région de Ziguinchor : ses 3 départements, 30 communes, données démographiques et cartographie interactive.',
};

/**
 * Les chiffres clés (CHIFFRE), les cartes de navigation (SOUS_PAGE) et les
 * pôles de compétitivité (POTENTIEL) sont désormais pilotés depuis
 * Admin -> Paramètres -> Contenus & textes (voir `RegionContenus.tsx`).
 */
export default function LaRegionPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="relative bg-primary-dark text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'La Région de Ziguinchor' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Territoire & Géographie
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              La Région de Ziguinchor
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Porte d'entrée de la Casamance naturelle, Ziguinchor combine un patrimoine écologique
              remarquable, un tissu humain solidaire et une vocation stratégique de pôle d'équilibre au
              Sénégal.
            </p>
          </div>
        </div>
      </div>

      {/* Bandeau Chiffres Clés Territoriaux */}
      <RegionChiffres />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
        {/* Section 1 : Portrait géographique */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Présentation Régionale
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Une Région Stratégique au Cœur des Écosystèmes Ouest-Africains
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>
                Bordée par l'océan Atlantique à l'ouest, la République de Gambie au nord, la République
                de Guinée-Bissau au sud et la région de Sédhiou à l'est, la région de Ziguinchor constitue
                un carrefour économique et culturel de premier plan.
              </p>
              <p>
                Arrosée par le fleuve Casamance et un réseau hydrographique dense de bolongs et de rizières
                inondables, la région bénéficie d'une pluviométrie abondante (1 200 à 1 800 mm/an) qui en fait
                l'une des zones les plus fertiles et arborées du Sénégal.
              </p>
              <p>
                L'Agence Régionale de Développement veille à l'équilibre spatial entre les grands centres
                urbains comme Ziguinchor et Bignona, et les communes insulaires ou enclavées d'Oussouye.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-900 rounded-2xl p-6 text-white text-center space-y-4 border border-slate-800 shadow-lg">
                <Compass className="h-12 w-12 mx-auto text-emerald-400" />
                <h3 className="text-lg font-bold">Cartographie Interactive SIG</h3>
                <p className="text-xs text-slate-300">
                  Accédez à la carte dynamique géoréférençant l'ensemble des communes, infrastructures et
                  projets en temps réel.
                </p>
                <Link
                  href="/la-region/cartographie"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <span>Ouvrir la cartographie</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 : Les 3 Départements */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Subdivisions Administratives
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Les Trois Départements de la Région
              </h2>
            </div>
            <Link
              href="/la-region/departements"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>Fiches détaillées des départements</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <RegionDepartements />
        </section>

        {/* Section 3 : Accès aux dossiers territoriaux */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Navigation Territoriale
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Explorer le Territoire en Détail
            </h2>
          </div>

          <RegionSousPages />
        </section>

        {/* Section 4 : Potentiels économiques et naturels */}
        <section>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Filières d’Avenir
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Pôles de Compétitivité & Ressources
            </h2>
          </div>

          <RegionPotentiels />
        </section>
      </div>
    </div>
  );
}
