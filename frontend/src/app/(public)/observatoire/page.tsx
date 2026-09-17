'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  Layers,
  Building2,
  Calendar,
  Info,
  MapPin,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BookOpen,
  Activity,
  CheckCircle2,
  Droplets,
  GraduationCap,
  HeartPulse,
  Sprout,
  Truck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { indicateursService } from '@/services/indicateurs.service';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';
import type { Indicateur } from '@/types';

const FALLBACK_INDICATEURS: Indicateur[] = [
  {
    id: 'ind-1',
    nom: "Taux brut de scolarisation primaire (TBS)",
    slug: 'taux-brut-scolarisation-primaire',
    description: "Pourcentage d'enfants scolarisés dans l'enseignement primaire par rapport à la population scolarisable.",
    valeur: 84.6,
    unite: '%',
    annee: 2023,
    source: "Inspection d'Académie (IA) / ANSD",
    secteur: { id: 's-edu', nom: 'Éducation', slug: 'education' },
  },
  {
    id: 'ind-2',
    nom: "Taux d'accès à l'eau potable en milieu rural",
    slug: 'taux-acces-eau-potable-rural',
    description: "Proportion des ménages ruraux ayant accès à une source d'eau améliorée à moins de 30 minutes.",
    valeur: 73.2,
    unite: '%',
    annee: 2023,
    source: "Division Régionale de l'Hydraulique (DRH)",
    secteur: { id: 's-eau', nom: 'Eau & Assainissement', slug: 'eau-assainissement' },
  },
  {
    id: 'ind-3',
    nom: 'Production de riz paddy annuelle',
    slug: 'production-riz-paddy-annuelle',
    description: 'Volume total estimé de riz de plateau et de bas-fonds récolté sur la campagne agricole régionale.',
    valeur: 142500,
    unite: 'Tonnes',
    annee: 2023,
    source: 'Direction Régionale du Développement Rural (DRDR)',
    secteur: { id: 's-agri', nom: 'Agriculture & Pêche', slug: 'agriculture-peche' },
  },
  {
    id: 'ind-4',
    nom: 'Couverture vaccinale infantile (enfants 0-11 mois)',
    slug: 'couverture-vaccinale-infantile',
    description: 'Taux de couverture complète Penta 3 chez les nourrissons de la région de Ziguinchor.',
    valeur: 89.4,
    unite: '%',
    annee: 2023,
    source: 'Région Médicale de Ziguinchor',
    secteur: { id: 's-sante', nom: 'Santé & Nutrition', slug: 'sante-nutrition' },
  },
  {
    id: 'ind-5',
    nom: 'Réseau routier praticable en toute saison',
    slug: 'reseau-routier-praticable',
    description: 'Linéaire de routes bitumées ou pistes classées praticables en toutes saisons.',
    valeur: 62.8,
    unite: '%',
    annee: 2023,
    source: 'AGEROUTE / ARD Ziguinchor',
    secteur: { id: 's-infra', nom: 'Infrastructures & Désenclavement', slug: 'infrastructures' },
  },
  {
    id: 'ind-6',
    nom: 'Taux délectrification rurale',
    slug: 'taux-electrification-rurale',
    description: "Pourcentage de villages et hameaux raccordés au réseau national ou mini-réseaux solaires.",
    valeur: 58.1,
    unite: '%',
    annee: 2023,
    source: 'ASER / Senelec',
    secteur: { id: 's-infra', nom: 'Infrastructures & Désenclavement', slug: 'infrastructures' },
  },
  {
    id: 'ind-7',
    nom: "Exportations d'anacarde brut contrôlées",
    slug: 'exportations-anacarde-brut',
    description: "Volume d'anacarde certifié au port de Ziguinchor et corridors terrestres.",
    valeur: 92400,
    unite: 'Tonnes',
    annee: 2023,
    source: 'Direction Régionale du Commerce',
    secteur: { id: 's-econ', nom: 'Économie & Commerce', slug: 'economie-commerce' },
  },
  {
    id: 'ind-8',
    nom: 'Taux de réussite au BFEM régional',
    slug: 'taux-reussite-bfem',
    description: "Proportion de candidats admis au Brevet de Fin d'Études Moyennes dans l'académie.",
    valeur: 71.3,
    unite: '%',
    annee: 2023,
    source: "Inspection d'Académie (IA) Ziguinchor",
    secteur: { id: 's-edu', nom: 'Éducation', slug: 'education' },
  },
];

const SECTEUR_COLORS: Record<string, { badge: string; bar: string; icon: any }> = {
  'Éducation': {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    bar: '#2563eb',
    icon: GraduationCap,
  },
  'Santé & Nutrition': {
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    bar: '#e11d48',
    icon: HeartPulse,
  },
  'Agriculture & Pêche': {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    bar: '#059669',
    icon: Sprout,
  },
  'Eau & Assainissement': {
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    bar: '#0891b2',
    icon: Droplets,
  },
  'Infrastructures & Désenclavement': {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    bar: '#d97706',
    icon: Truck,
  },
  'Économie & Commerce': {
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    bar: '#7c3aed',
    icon: Activity,
  },
};

export default function ObservatoirePage() {
  const [search, setSearch] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('Tous');
  const [selectedTerritoire, setSelectedTerritoire] = useState('Tous');

  const { data: indicateursRes, isLoading } = useQuery({
    queryKey: ['public-indicateurs'],
    queryFn: () => indicateursService.getIndicateurs({ limit: 100 }),
  });

  const { data: secteurs = [] } = useQuery({
    queryKey: ['ref-secteurs-observatoire'],
    queryFn: () => referencesService.getSecteurs(),
  });

  const { data: departements = [] } = useQuery({
    queryKey: ['ref-departements-observatoire'],
    queryFn: () => referencesService.getDepartements(),
  });

  // Indicateurs effectifs (API avec fallback harmonisé)
  const items: Indicateur[] = useMemo(() => {
    if (indicateursRes?.data && indicateursRes.data.length > 0) {
      return indicateursRes.data;
    }
    return FALLBACK_INDICATEURS;
  }, [indicateursRes]);

  // Filtrage
  const filteredIndicateurs = useMemo(() => {
    return items.filter((ind) => {
      const matchSearch =
        ind.nom.toLowerCase().includes(search.toLowerCase()) ||
        (ind.source && ind.source.toLowerCase().includes(search.toLowerCase())) ||
        (ind.description && ind.description.toLowerCase().includes(search.toLowerCase()));

      const matchSecteur =
        selectedSecteur === 'Tous' || ind.secteur?.nom === selectedSecteur;

      const territoireName = ind.commune?.nom || ind.departement?.nom || 'Région';
      const matchTerritoire =
        selectedTerritoire === 'Tous' ||
        (selectedTerritoire === 'Région' && !ind.commune && !ind.departement) ||
        territoireName === selectedTerritoire ||
        ind.departement?.nom === selectedTerritoire;

      return matchSearch && matchSecteur && matchTerritoire;
    });
  }, [items, search, selectedSecteur, selectedTerritoire]);

  // Données agrégées pour le graphique par secteur
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const sec = item.secteur?.nom || 'Autre';
      counts[sec] = (counts[sec] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      color: SECTEUR_COLORS[name]?.bar || '#059669',
    }));
  }, [items]);

  const uniqueSecteurs = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.secteur?.nom) set.add(i.secteur.nom);
    });
    return Array.from(set);
  }, [items]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Observatoire Territorial' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                Outil d'Aide à la Décision
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Données Consolidées ARD · ANSD
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Observatoire Territorial du Développement
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Dispositif centralisé de suivi des indicateurs socio-économiques, démographiques
              et sectoriels de la région de Ziguinchor pour éclairer les politiques publiques territoriales.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
        {/* KPI Essentiels du Territoire */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-3">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">84,6 %</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Scolarisation primaire (TBS)</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center mb-3">
              <Droplets className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">73,2 %</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Accès eau potable rurale</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
              <Sprout className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">142,5 k t</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Production rizicole 2023</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{items.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Indicateurs clés audités</p>
          </div>
        </div>

        {/* Section Analytique & Graphique */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  Répartition des indicateurs par secteur
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Volume de métriques suivies par grand pôle de développement régional
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 self-start">
                Mise à jour annuelle
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value} indicateurs`, 'Total']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Info className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Rôle de l'Observatoire ARD
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                L'Observatoire territorial consolide les bases de données issues des services déconcentrés,
                de l'ANSD et des 30 communes pour produire des tableaux de bord fiables et guider
                la planification régionale (PRD, SRAT).
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Données harmonisées et vérifiées</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Accès libre pour chercheurs et citoyens</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Interopérable avec la cartographie SIG</span>
              </div>
            </div>

            <Link
              href="/la-region/cartographie"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs w-full"
            >
              <MapPin className="h-3.5 w-3.5" />
              Voir les projets sur la carte SIG
            </Link>
          </div>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un indicateur (ex: scolarisation, eau, anacarde, santé)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            {/* Sélecteur de territoire */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={selectedTerritoire}
                onChange={(e) => setSelectedTerritoire(e.target.value)}
                aria-label="Filtrer par territoire"
                className="w-full md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="Tous">Tous les territoires</option>
                <option value="Région">Échelle Régionale</option>
                <option value="Ziguinchor">Dép. Ziguinchor</option>
                <option value="Bignona">Dép. Bignona</option>
                <option value="Oussouye">Dép. Oussouye</option>
              </select>
            </div>
          </div>

          {/* Filtre par secteur en boutons rapides */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1.5 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Secteurs :
            </span>
            <button
              onClick={() => setSelectedSecteur('Tous')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors',
                selectedSecteur === 'Tous'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Tous ({items.length})
            </button>
            {uniqueSecteurs.map((sec) => {
              const active = selectedSecteur === sec;
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSecteur(sec)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors',
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {sec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste des Indicateurs */}
        {isLoading ? (
          <LoadingState message="Chargement des indicateurs territoriaux…" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>{filteredIndicateurs.length} indicateur{filteredIndicateurs.length > 1 ? 's' : ''} trouvé{filteredIndicateurs.length > 1 ? 's' : ''}</span>
              <span>Années de collecte : 2023 - 2024</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredIndicateurs.map((ind) => {
                const secName = ind.secteur?.nom || 'Général';
                const secCfg = SECTEUR_COLORS[secName] ?? {
                  badge: 'bg-slate-100 text-slate-800 border-slate-200',
                  bar: '#059669',
                  icon: Activity,
                };
                const Icon = secCfg.icon;
                const scopeLabel = ind.commune?.nom
                  ? `Commune de ${ind.commune.nom}`
                  : ind.departement?.nom
                  ? `Dép. ${ind.departement.nom}`
                  : 'Région de Ziguinchor';

                return (
                  <div
                    key={ind.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className={cn('text-[11px] font-bold px-2.5 py-0.5 rounded-full border', secCfg.badge)}>
                          {secName}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          <Calendar className="h-3 w-3" />
                          {ind.annee}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
                        {ind.nom}
                      </h3>

                      {ind.description && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                          {ind.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {typeof ind.valeur === 'number'
                            ? ind.valeur.toLocaleString('fr-FR')
                            : ind.valeur}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {ind.unite}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 text-[11px] text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{scopeLabel}</span>
                        </div>
                        {ind.source && (
                          <div className="flex items-center gap-1.5 truncate text-slate-400">
                            <BookOpen className="h-3 w-3 shrink-0" />
                            <span className="truncate">Source : {ind.source}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredIndicateurs.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400">
                <BarChart3 className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-base font-bold text-slate-800">Aucun indicateur ne correspond aux filtres</p>
                <p className="text-xs text-slate-400 mt-1">Réinitialisez les critères de recherche pour afficher les données.</p>
              </div>
            )}
          </div>
        )}

        {/* Section Documents & Rapports de Synthèse */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Besoin de données d'études ou de documents de planification ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Consultez les plans de développement régional (PRD), schémas d'aménagement (SRAT) et rapports d'activités officiels.
            </p>
          </div>

          <Link
            href="/documentation/planification-regionale"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-xs shrink-0"
          >
            <BookOpen className="h-4 w-4" />
            Accéder à la documentation
          </Link>
        </div>
      </div>
    </div>
  );
}
