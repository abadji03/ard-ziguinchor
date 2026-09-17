'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Map, Users, Building2, Landmark, Satellite, MapPinned } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { referencesService } from '@/services/references.service';
import type { CommuneGeo } from '@/components/features/cartographie/CarteTerritoire';

// Import dynamique pour éviter les erreurs SSR de react-leaflet
const CarteTerritoire = dynamic(
  () => import('@/components/features/cartographie/CarteTerritoire').then((m) => m.CarteTerritoire),
  {
    ssr: false,
    loading: () => (
      <div className="h-[560px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
        <div className="text-center text-slate-400">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Chargement de la carte interactive…</p>
        </div>
      </div>
    ),
  }
);

export default function CartographieRegionPage() {
  const { data: communes = [], isLoading } = useQuery({
    queryKey: ['cartographie-communes'],
    queryFn: () => referencesService.getCommunes(),
    staleTime: 5 * 60 * 1000,
  });

  const geoCommunes: CommuneGeo[] = communes.map((c) => ({
    id: c.id,
    nom: c.nom,
    code: c.code,
    latitude: c.latitude,
    longitude: c.longitude,
    population: c.population,
    departement: c.departement ? { nom: c.departement.nom } : null,
  }));

  const populationTotale = communes.reduce((acc, c) => acc + (c.population || 0), 0);
  const nbDepartements = new Set(communes.map((c) => c.departement?.nom).filter(Boolean)).size;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'La Région', href: '/la-region' },
                { label: 'Cartographie' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Système d'Information Géographique (SIG)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Cartographie de la Région de Ziguinchor
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Explorez le territoire régional : limites administratives, 3 départements et 30
              communes, avec vue plan, satellite et relief. Basculez vers la cartographie des
              projets pour visualiser les interventions de l'ARD.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href="/projets/cartographie"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md"
              >
                <MapPinned className="h-4 w-4" />
                Cartographie des projets
              </Link>
              <Link
                href="/la-region/departements"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Départements &amp; communes
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        {/* Chiffres clés du territoire */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-emerald-50 text-emerald-700 border-emerald-100">
              <Map className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">7 329 km²</p>
            <p className="text-xs text-slate-500 mt-1">Superficie régionale (ANSD 2023)</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-blue-50 text-blue-700 border-blue-100">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{nbDepartements || 3}</p>
            <p className="text-xs text-slate-500 mt-1">Départements (Ziguinchor, Bignona, Oussouye)</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-amber-50 text-amber-700 border-amber-100">
              <Landmark className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">{communes.length || 30}</p>
            <p className="text-xs text-slate-500 mt-1">Communes géolocalisées</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border bg-purple-50 text-purple-700 border-purple-100">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {populationTotale ? populationTotale.toLocaleString('fr-FR') : '617 567'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Habitants (RGPH-5 2023)</p>
          </div>
        </div>

        {/* Carte territoriale */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Satellite className="h-4 w-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Territoire régional — vue plan, satellite ou relief
            </h2>
          </div>
          {isLoading ? (
            <div className="h-[560px] flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
              <div className="text-center text-slate-400">
                <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">Chargement des données territoriales…</p>
              </div>
            </div>
          ) : (
            <CarteTerritoire communes={geoCommunes} height="560px" />
          )}
          <p className="text-xs text-slate-400 mt-3">
            Limites administratives : GeoBoundaries (wmgeolab, données ouvertes) · Fonds de carte :
            OpenStreetMap, Esri World Imagery (satellite), OpenTopoMap. Cliquez sur une commune pour
            afficher sa population (RGPH-5 2023).
          </p>
        </div>

        {/* Accès cartographie projets */}
        <div className="vitrine-card rounded-2xl border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Cartographie des projets</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              La cartographie des projets (localisation des interventions de l'ARD par statut et
              secteur) est accessible via le bouton ci-contre ou depuis la rubrique Projets.
            </p>
          </div>
          <Link
            href="/projets/cartographie"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            <MapPinned className="h-4 w-4" />
            Voir les projets cartographiés
          </Link>
        </div>
      </div>
    </div>
  );
}