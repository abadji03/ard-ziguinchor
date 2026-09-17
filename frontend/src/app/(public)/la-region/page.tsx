import type { Metadata } from 'next';
import Link from 'next/link';
import { Map, Users, TreePine, Building2, ArrowRight, Compass, Waves, Sun, Sparkles } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { RegionDepartements } from '@/components/features/region/RegionDepartements';

export const metadata: Metadata = {
  title: 'La Région de Ziguinchor | Territoire et Potentialités',
  description:
    'Découvrez la région de Ziguinchor : ses 3 départements, 30 communes, données démographiques et cartographie interactive.',
};

const CHIFFRES = [
  { valeur: '7 339', unite: 'km²', label: 'Superficie régionale', icon: Map },
  { valeur: '612 343', unite: 'hab.', label: 'Population (ANSD 2023)', icon: Users },
  { valeur: '3', unite: 'Départements', label: 'Ziguinchor, Bignona, Oussouye', icon: Building2 },
  { valeur: '60%', unite: 'Couverture', label: 'Forêts & Mangroves', icon: TreePine },
];

const SOUS_PAGES = [
  {
    href: '/la-region/departements',
    titre: 'Départements',
    description:
      'Les spécificités démographiques et économiques des départements de Ziguinchor, Bignona et Oussouye.',
    icon: Building2,
    badge: '3 Départements',
  },
  {
    href: '/la-region/communes',
    titre: 'Communes & Arrondissements',
    description:
      "Annuaire complet des 30 communes de la région, leurs coordonnées administratives et maires.",
    icon: Users,
    badge: '30 Communes',
  },
  {
    href: '/la-region/cartographie',
    titre: 'Système d’Information Géographique (SIG)',
    description:
      'Visualisez en direct la répartition spatiale des investissements et infrastructures.',
    icon: Compass,
    badge: 'Cartes Interactives',
  },
];

const POTENTIELS = [
  {
    titre: 'Agriculture & Pêche',
    description:
      "Riziculture de vallée, mangues, anacarde, maraîchage bio et riche façade maritime font de Ziguinchor un grenier agroalimentaire.",
    icon: <Sparkles className="h-6 w-6 text-emerald-600" />,
  },
  {
    titre: 'Écotourisme & Patrimoine',
    description:
      "Plages renommées du Cap Skirring, campements villageois intégrés, architecture en terre et traditions culturelles d'exception.",
    icon: <Waves className="h-6 w-6 text-blue-600" />,
  },
  {
    titre: 'Forêt & Biodiversité',
    description:
      "Sanctuaire écologique d'Afrique de l'Ouest : forêts classées, parcs ornithologiques et mangroves vitales pour la résilience côtière.",
    icon: <TreePine className="h-6 w-6 text-emerald-700" />,
  },
  {
    titre: 'Carrefour Transfrontalier',
    description:
      "Position géographique charnière limitrophe de la Gambie et de la Guinée-Bissau, propice aux corridors d'échanges sous-régionaux.",
    icon: <Compass className="h-6 w-6 text-amber-600" />,
  },
  {
    titre: 'Énergie Renouvelable & Climat',
    description:
      "Ensoleillement généreux et biomasse offrant des opportunités d'électrification rurale solaire et d'économie verte.",
    icon: <Sun className="h-6 w-6 text-amber-500" />,
  },
  {
    titre: 'Artisanat d’Art & Savoir-Faire',
    description:
      "Vannerie réputée, travail du bois, transformation locale des fruits et dynamisme d'une jeunesse créative et entreprenante.",
    icon: <Building2 className="h-6 w-6 text-purple-600" />,
  },
];

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
      <div className="relative -mt-6 z-10 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CHIFFRES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="vitrine-card hover-lift p-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                    {c.valeur}{' '}
                    {c.unite && <span className="text-xs font-bold text-slate-500">{c.unite}</span>}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-2">{c.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SOUS_PAGES.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group bg-white rounded-2xl border border-slate-200/90 p-6 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {p.titre}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>Accéder à la section</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POTENTIELS.map((item) => (
              <div
                key={item.titre}
                className="vitrine-card hover-lift p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{item.titre}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
