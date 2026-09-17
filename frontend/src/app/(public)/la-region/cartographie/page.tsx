'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Map, Filter, Info } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import type { ProjetGeo } from '@/components/features/cartographie/CarteRegion';

// Import dynamique pour éviter les erreurs SSR de react-leaflet
const CarteRegion = dynamic(
  () => import('@/components/features/cartographie/CarteRegion').then((m) => m.CarteRegion),
  { ssr: false, loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm">Chargement de la carte…</p>
      </div>
    </div>
  )}
);

// Données fictives pour démo (en production, viendront de l'API)
const PROJETS_DEMO: ProjetGeo[] = [
  {
    id: '1',
    titre: 'Aménagement hydro-agricole de Djibock',
    statut: 'encours',
    latitude: 12.48,
    longitude: -16.35,
    secteur: 'Agriculture',
    budget: 450000000,
    beneficiaires: 2500,
    commune: 'Djibock',
  },
  {
    id: '2',
    titre: 'Électrification rurale de Niassia',
    statut: 'realise',
    latitude: 12.52,
    longitude: -16.18,
    secteur: 'Énergie',
    budget: 180000000,
    beneficiaires: 4200,
    commune: 'Niassia',
  },
  {
    id: '3',
    titre: 'Piste rurale Bignona - Sindian',
    statut: 'planifie',
    latitude: 12.81,
    longitude: -16.23,
    secteur: 'Infrastructure',
    budget: 320000000,
    beneficiaires: 8000,
    commune: 'Sindian',
  },
  {
    id: '4',
    titre: 'Réhabilitation du marché de Bignona',
    statut: 'realise',
    latitude: 12.86,
    longitude: -16.23,
    secteur: 'Commerce',
    budget: 95000000,
    beneficiaires: 1500,
    commune: 'Bignona',
  },
  {
    id: '5',
    titre: 'Construction école primaire Oussouye',
    statut: 'realise',
    latitude: 12.48,
    longitude: -16.55,
    secteur: 'Éducation',
    budget: 65000000,
    beneficiaires: 600,
    commune: 'Oussouye',
  },
  {
    id: '6',
    titre: 'Appui à la pêche artisanale Kafountine',
    statut: 'encours',
    latitude: 12.7,
    longitude: -16.73,
    secteur: 'Pêche',
    budget: 120000000,
    beneficiaires: 3200,
    commune: 'Kafountine',
  },
  {
    id: '7',
    titre: 'Centre de santé Mlomp',
    statut: 'realise',
    latitude: 12.55,
    longitude: -16.57,
    secteur: 'Santé',
    budget: 75000000,
    beneficiaires: 5000,
    commune: 'Mlomp',
  },
  {
    id: '8',
    titre: 'Forêt communautaire Thionck-Essyl',
    statut: 'encours',
    latitude: 12.67,
    longitude: -16.47,
    secteur: 'Environnement',
    budget: 55000000,
    beneficiaires: 2800,
    commune: 'Thionck-Essyl',
  },
];

const STATUT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  encours:  { label: 'En cours',  color: '#F59E0B', bg: 'bg-yellow-100 text-yellow-700' },
  realise:  { label: 'Réalisé',   color: '#16A34A', bg: 'bg-green-100 text-green-700'  },
  planifie: { label: 'Planifié',  color: '#F4B400', bg: 'bg-yellow-100 text-yellow-700'    },
  suspendu: { label: 'Suspendu',  color: '#DC2626', bg: 'bg-red-100 text-red-700'      },
};

export default function CartographiePage() {
  const [statutFilter, setStatutFilter] = useState<string>('tous');
  const [secteurFilter, setSecteurFilter] = useState<string>('tous');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const secteurs = Array.from(new Set(PROJETS_DEMO.map((p) => p.secteur).filter(Boolean) as string[]));

  const projetsFiltres = PROJETS_DEMO.filter((p) => {
    const matchStatut = statutFilter === 'tous' || p.statut === statutFilter;
    const matchSecteur = secteurFilter === 'tous' || p.secteur === secteurFilter;
    return matchStatut && matchSecteur;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-dark/40" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: 'La Région', href: '/la-region' },
              { label: 'Cartographie' },
            ]}
          />
          <div className="mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionTitle
              title="Cartographie interactive"
              subtitle="Visualisez les projets de développement géolocalisés dans la région de Ziguinchor"
              className="mb-0 [&_h2]:text-white [&_p]:text-blue-100"
            />
            {/* Statistiques clés */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="glass-card rounded-xl px-4 py-2.5 text-center">
                <div className="text-xl font-black text-white leading-none">{projetsFiltres.length}</div>
                <div className="text-[11px] font-medium text-blue-200">Projets affichés</div>
              </div>
              <div className="glass-card rounded-xl px-4 py-2.5 text-center">
                <div className="text-xl font-black text-white leading-none">{secteurs.length}</div>
                <div className="text-[11px] font-medium text-blue-200">Secteurs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            La carte affiche {projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''} géolocalisé{projetsFiltres.length > 1 ? 's' : ''}.
            Cliquez sur un marqueur pour voir les détails. Utilisez les filtres pour affiner l&apos;affichage.
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium shrink-0">
            <Filter className="h-4 w-4" />
            Filtrer :
          </div>
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="tous">Tous les statuts</option>
            {Object.entries(STATUT_LABELS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={secteurFilter}
            onChange={(e) => setSecteurFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="tous">Tous les secteurs</option>
            {secteurs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Carte */}
          <div className="lg:col-span-3">
            <CarteRegion
              projets={projetsFiltres}
              height="520px"
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            {/* Légende */}
            <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Légende</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(STATUT_LABELS).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: val.color }}
                    />
                    <span className="text-xs text-gray-600">{val.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Liste projets */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-gray-700">
                  {projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[460px] overflow-y-auto">
                {projetsFiltres.map((projet) => {
                  const s = STATUT_LABELS[projet.statut];
                  const isActive = projet.id === selectedId;
                  return (
                    <button
                      key={projet.id}
                      type="button"
                      onClick={() => setSelectedId(projet.id)}
                      className={`w-full text-left p-3 transition-colors cursor-pointer ${
                        isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="mt-1 w-2 h-2 rounded-full shrink-0"
                          style={{ background: s?.color || '#94a3b8' }}
                        />
                        <div className="min-w-0">
                          <div className={`text-xs font-medium leading-snug mb-1.5 ${isActive ? 'text-blue-800' : 'text-gray-900'}`}>
                            {projet.titre}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-400">{projet.commune}</span>
                            <span
                              className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${s?.bg || 'bg-gray-100 text-gray-600'}`}
                            >
                              {s?.label || projet.statut}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {projetsFiltres.length === 0 && (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    Aucun projet avec ces filtres
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
