'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Map, Filter, Info, Layers, Clock, Users, Banknote, MapPin } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { ProjetGeo } from '@/components/features/cartographie/CarteRegion';
import { projetsService } from '@/services/projets.service';

// Import dynamique pour éviter les erreurs SSR de react-leaflet
const CarteRegion = dynamic(
  () => import('@/components/features/cartographie/CarteRegion').then((m) => m.CarteRegion),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
        <div className="text-center text-slate-400">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Chargement de la carte interactive…</p>
        </div>
      </div>
    ),
  }
);

const STATUT_LABELS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  encours:  { label: 'En cours',  color: '#059669', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  realise:  { label: 'Réalisé',   color: '#2563EB', bg: 'bg-blue-50 text-blue-800 border-blue-200', dot: 'bg-blue-500'  },
  planifie: { label: 'Planifié',  color: '#D97706', bg: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  suspendu: { label: 'Suspendu',  color: '#DC2626', bg: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
};

const COORDONNEES_COMMUNES: Record<string, [number, number]> = {
  'ZG-COM-ZG': [12.5833, -16.2719],
  'ZG-COM-ADEANE': [12.63, -16.02],
  'ZG-COM-BOUTOUPA': [12.52, -16.08],
  'ZG-COM-ENAMPORE': [12.51, -16.45],
  'ZG-COM-NIAGUIS': [12.56, -16.19],
  'ZG-COM-NIASSIA': [12.49, -16.35],
  'BN-COM-BIGNONA': [12.81, -16.23],
  'BN-COM-KAFOUNTINE': [12.93, -16.75],
  'BN-COM-THIONCK': [12.79, -16.51],
  'BN-COM-DIOULOULOU': [13.04, -16.65],
  'BN-COM-TENGHORY': [12.84, -16.22],
  'OY-COM-OUSSOUYE': [12.48, -16.55],
  'OY-COM-DIEMBERING': [12.42, -16.78],
  'OY-COM-MLOMP': [12.55, -16.58],
};

const COORDONNEES_DEPARTEMENTS: Record<string, [number, number]> = {
  ZG: [12.5833, -16.2719],
  BN: [12.81, -16.23],
  OY: [12.48, -16.55],
};

export default function ProjetsCartographiePage() {
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [secteurFilter, setSecteurFilter] = useState<string>('tous');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cartographie-projets'],
    queryFn: () => projetsService.getAll({ page: 1, limit: 100 }),
    staleTime: 2 * 60 * 1000,
  });

  const projets: ProjetGeo[] = (data?.data ?? []).flatMap((projet) => {
    const coordonneesCommune = projet.commune?.code
      ? COORDONNEES_COMMUNES[projet.commune.code]
      : undefined;
    const coordonneesDepartement = projet.departement?.code
      ? COORDONNEES_DEPARTEMENTS[projet.departement.code]
      : undefined;
    const projetGeolocalise = Number.isFinite(projet.latitude) && Number.isFinite(projet.longitude);
    const communeLatitude = projet.commune?.latitude ?? coordonneesCommune?.[0];
    const communeLongitude = projet.commune?.longitude ?? coordonneesCommune?.[1];
    const territoireLatitude = communeLatitude ?? coordonneesDepartement?.[0];
    const territoireLongitude = communeLongitude ?? coordonneesDepartement?.[1];
    const territoireGeolocalise = Number.isFinite(territoireLatitude) && Number.isFinite(territoireLongitude);

    if (!projetGeolocalise && !territoireGeolocalise) return [];

    const latitude = projetGeolocalise ? projet.latitude : territoireLatitude;
    const longitude = projetGeolocalise ? projet.longitude : territoireLongitude;
    if (latitude === undefined || longitude === undefined) return [];

    return [{
      id: projet.id,
      titre: projet.titre,
      statut: projet.statut,
      latitude,
      longitude,
      secteur: projet.secteur?.nom,
      budget: projet.budget,
      beneficiaires: projet.beneficiaires,
      commune: projet.commune?.nom,
      localisationSource: projetGeolocalise
        ? 'projet'
        : communeLatitude !== undefined && communeLongitude !== undefined
          ? 'commune'
          : 'departement',
    }];
  });

  const secteurs = Array.from(new Set(projets.map((p) => p.secteur).filter(Boolean) as string[]));

  const projetsFiltres = projets.filter((p) => {
    const matchStatut = statutFilter === 'tous' || p.statut === statutFilter;
    const matchSecteur = secteurFilter === 'tous' || p.secteur === secteurFilter;
    return matchStatut && matchSecteur;
  });

  // Calcul des métriques globales
  const totalBeneficiaires = projets.reduce((acc, p) => acc + (p.beneficiaires || 0), 0);
  const totalBudget = projets.reduce((acc, p) => acc + (p.budget || 0), 0);
  const nbEncours = projets.filter((p) => p.statut === 'encours').length;
  const nbRealise = projets.filter((p) => p.statut === 'realise').length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Projets', href: '/projets' },
                { label: 'Cartographie des projets' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Système d'Information Géographique (SIG)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Cartographie des Projets Régionaux
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Visualisez l'implantation spatiale des infrastructures, programmes agricoles, sociaux
              et énergétiques déployés à travers les 3 départements et 30 communes de Ziguinchor.
            </p>
            <Link
              href="/la-region/cartographie"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors"
            >
              <Map className="h-4 w-4" />
              Cartographie de la région (territoire &amp; communes)
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        {/* KPI Essentiels en un coup d'œil */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-emerald-50 text-emerald-700 border-emerald-100">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {projets.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Projets géoréférencés</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-blue-50 text-blue-700 border-blue-100">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {nbEncours} en cours
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{nbRealise} chantiers réceptionnés</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-amber-50 text-amber-700 border-amber-100">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {totalBeneficiaires.toLocaleString('fr-FR')}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Bénéficiaires directs estimés</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-purple-50 text-purple-700 border-purple-100">
              <Banknote className="h-5 w-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {(totalBudget / 1000000).toFixed(0)} M FCFA
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Volume d'investissements cartographié</p>
          </div>
        </div>

        {/* Barre de Filtrage Moderne */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Filtres cartographiques</h2>
              <p className="text-xs text-slate-500">
                {projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''} visible{projetsFiltres.length > 1 ? 's' : ''} sur la zone
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
              aria-label="Filtrer par statut"
            >
              <option value="tous">Tous les statuts d'exécution</option>
              {Object.entries(STATUT_LABELS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>

            <select
              value={secteurFilter}
              onChange={(e) => setSecteurFilter(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
              aria-label="Filtrer par secteur"
            >
              <option value="tous">Tous les secteurs d'activité</option>
              {secteurs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {(statutFilter !== 'tous' || secteurFilter !== 'tous') && (
              <button
                onClick={() => {
                  setStatutFilter('tous');
                  setSecteurFilter('tous');
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 underline px-2 py-1"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Grille Carte & Liste */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Carte Principale */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-xs overflow-hidden">
              {isLoading ? (
                <div className="h-[560px] flex items-center justify-center bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-600">Chargement des projets géolocalisés…</p>
                </div>
              ) : isError ? (
                <div className="h-[560px] flex items-center justify-center bg-rose-50 rounded-xl border border-rose-200 px-6 text-center">
                  <div>
                    <p className="text-sm font-bold text-rose-800">Impossible de charger les projets</p>
                    <p className="text-xs text-rose-700 mt-1">Vérifiez la connexion au service de données puis réessayez.</p>
                  </div>
                </div>
              ) : (
                <CarteRegion projets={projetsFiltres} height="560px" />
              )}
            </div>

            {/* Légende interactive */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Légende des marqueurs
                </span>
                <div className="flex flex-wrap items-center gap-4">
                  {Object.entries(STATUT_LABELS).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${val.dot} ring-2 ring-white shadow-xs`} />
                      <span className="text-xs font-semibold text-slate-700">{val.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Volet Latéral des Projets */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-[640px]">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-emerald-700" />
                  <span className="text-sm font-bold text-slate-900">
                    Projets correspondants
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {projetsFiltres.length}
                </span>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2">
                {projetsFiltres.map((projet) => {
                  const s = STATUT_LABELS[projet.statut] || STATUT_LABELS.encours;
                  return (
                    <div
                      key={projet.id}
                      className="p-3.5 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {projet.secteur}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.bg}`}>
                          {s.label}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                        {projet.titre}
                      </h3>

                      <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {projet.commune}
                        </span>
                        {projet.budget && (
                          <span className="font-bold text-slate-800 font-mono">
                            {(projet.budget / 1000000).toLocaleString('fr-FR')} M FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {projetsFiltres.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    <Info className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">Aucun projet trouvé</p>
                    <p className="text-xs text-slate-400 mt-1">Ajustez vos filtres de statut ou de secteur.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

