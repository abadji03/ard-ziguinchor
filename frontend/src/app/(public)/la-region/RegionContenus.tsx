'use client';

/**
 * Blocs éditoriaux de la page « La Région ».
 *
 * Les chiffres clés, les cartes de navigation territoriale et les pôles de
 * compétitivité étaient auparavant codés en dur ici. Ils sont désormais lus
 * depuis la table `contenus_editoriaux` (section « la-region ») et modifiables
 * depuis Admin → Paramètres → Contenus & textes.
 *
 * Les tableaux ci-dessous ne servent que de repli si la base est vide : le site
 * ne s'affiche jamais à blanc, même en cas de purge de l'administration.
 */
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useContenusSection } from '@/hooks/useContenus';
import { blocsOu, type BlocVue } from '@/lib/contenus';
import { ContenuIcon, resolveContenuCouleur } from '@/lib/contenu-icons';

/** Repli : chiffres clés régionaux (bandeau). */
const CHIFFRES_DEFAUT: BlocVue[] = [
  {
    titre: 'Superficie régionale',
    sousTitre: '7 329',
    description: 'km²',
    icone: 'Map',
    couleur: '',
    lien: '',
  },
  {
    titre: 'Estimation ANSD 2023',
    sousTitre: '617 567',
    description: 'hab.',
    icone: 'Users',
    couleur: '',
    lien: '',
  },
  {
    titre: 'Ziguinchor, Bignona, Oussouye',
    sousTitre: '3',
    description: 'Départements',
    icone: 'Building2',
    couleur: '',
    lien: '',
  },
  {
    titre: 'Domaine forestier classé (30 massifs)',
    sousTitre: '116 776',
    description: 'ha',
    icone: 'TreePine',
    couleur: '',
    lien: '',
  },
];

/** Repli : cartes de navigation territoriale. */
const SOUS_PAGES_DEFAUT: BlocVue[] = [
  {
    titre: 'Départements',
    sousTitre: '3 Départements',
    description:
      'Les spécificités démographiques et économiques des départements de Ziguinchor, Bignona et Oussouye.',
    icone: 'Building2',
    couleur: '',
    lien: '/la-region/departements',
  },
  {
    titre: 'Communes & Arrondissements',
    sousTitre: '30 Communes',
    description:
      'Annuaire complet des 30 communes de la région, leurs coordonnées administratives et maire.',
    icone: 'Users',
    couleur: '',
    lien: '/la-region/communes',
  },
  {
    titre: 'Système d’Information Géographique (SIG)',
    sousTitre: 'Cartes Interactives',
    description:
      'Visualisez en direct la répartition spatiale des investissements et infrastructures.',
    icone: 'Compass',
    couleur: '',
    lien: '/la-region/cartographie',
  },
];

/** Repli : pôles de compétitivité & ressources. */
const POTENTIELS_DEFAUT: BlocVue[] = [
  {
    titre: 'Agriculture & Pêche',
    description:
      "Premières activités régionales : la production de riz a atteint 229 825 tonnes en 2022-2023 (ANSD) et les débarquements de la pêche artisanale 82 576,9 tonnes en 2023, valorisés à 39,4 milliards de FCFA.",
    icone: 'Sparkles',
    couleur: 'emerald',
    sousTitre: '',
    lien: '',
  },
  {
    titre: 'Écotourisme & Patrimoine',
    description:
      "26 841 arrivées de touristes en 2023 (contre 11 355 en 2020) et 177 réceptifs hôteliers : la façade maritime, l'embouchure du fleuve Casamance et les atouts culturels portent une filière en forte croissance (ANSD 2023).",
    icone: 'Waves',
    couleur: 'blue',
    sousTitre: '',
    lien: '',
  },
  {
    titre: 'Forêt & Biodiversité',
    description:
      'Le domaine forestier classé couvre 116 776,3 hectares répartis dans 30 forêts classées : 20 massifs dans le département de Bignona (100 405,3 ha), 6 à Oussouye (6 469 ha) et 4 à Ziguinchor (9 902 ha).',
    icone: 'TreePine',
    couleur: 'emerald',
    sousTitre: '',
    lien: '',
  },
  {
    titre: 'Carrefour Transfrontalier',
    description:
      "Limitrophe de la Gambie et de la Guinée-Bissau, la région est ouverte sur l'océan Atlantique et reliée à Kolda et Sédhiou à l'est.",
    icone: 'Compass',
    couleur: 'amber',
    sousTitre: '',
    lien: '',
  },
  {
    titre: 'Commerce & Services',
    description:
      'Le RGE 2015 (ANSD) recensait 15 743 unités économiques dans la région, dont 54,8 % dans le commerce et 63,1 % concentrées dans le département de Ziguinchor.',
    icone: 'Sun',
    couleur: 'amber',
    sousTitre: '',
    lien: '',
  },
  {
    titre: 'Eau, Fleuve et Littoral',
    description:
      "Avec une façade maritime de 85 km, le fleuve Casamance (environ 300 km) et ses bolongs constituent des ressources territoriales structurantes pour la riziculture, la pêche et l'aquaculture.",
    icone: 'Droplets',
    couleur: 'purple',
    sousTitre: '',
    lien: '',
  },
];

/** Bandeau des chiffres clés territoriaux. */
export function RegionChiffres() {
  const { data } = useContenusSection('la-region');
  const chiffres = blocsOu(CHIFFRES_DEFAUT, data?.CHIFFRE);

  return (
    <div className="relative -mt-6 z-10 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chiffres.map((c, i) => (
            <div key={`${c.titre}-${i}`} className="vitrine-card hover-lift p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-3">
                <ContenuIcon nom={c.icone} className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                {c.sousTitre}{' '}
                {c.description && (
                  <span className="text-xs font-bold text-slate-500">{c.description}</span>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-2">{c.titre}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Cartes d'accès aux dossiers territoriaux (départements, communes, SIG). */
export function RegionSousPages() {
  const { data } = useContenusSection('la-region');
  const sousPages = blocsOu(SOUS_PAGES_DEFAUT, data?.SOUS_PAGE);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sousPages.map((p, i) => (
        <Link
          key={p.lien || i}
          href={p.lien || '#'}
          className="group bg-white rounded-2xl border border-slate-200/90 p-6 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <ContenuIcon nom={p.icone} className="h-6 w-6" />
              </div>
              {p.sousTitre ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {p.sousTitre}
                </span>
              ) : null}
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
      ))}
    </div>
  );
}

/** Pôles de compétitivité & ressources du territoire. */
export function RegionPotentiels() {
  const { data } = useContenusSection('la-region');
  const potentiels = blocsOu(POTENTIELS_DEFAUT, data?.POTENTIEL);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {potentiels.map((item, i) => {
        const coul = resolveContenuCouleur(item.couleur);
        return (
          <div
            key={`${item.titre}-${i}`}
            className="vitrine-card hover-lift p-6 flex flex-col justify-between"
          >
            <div>
              <div
                className={`w-12 h-12 rounded-xl border ${coul.bg} ${coul.text} ${coul.border} flex items-center justify-center mb-4`}
              >
                <ContenuIcon nom={item.icone} className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{item.titre}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
