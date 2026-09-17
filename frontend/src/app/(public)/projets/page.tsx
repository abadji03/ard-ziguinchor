'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, MapPinned } from 'lucide-react';
import { ProjetCard } from '@/components/features/projets/ProjetCard';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { projetsService } from '@/services/projets.service';
import { usePagination } from '@/hooks/usePagination';

const STATUT_FILTERS = [
  { value: '', label: 'Tous les projets' },
  { value: 'encours', label: 'En cours d’exécution' },
  { value: 'planifie', label: 'Planifiés' },
  { value: 'realise', label: 'Réalisés / Clôturés' },
  { value: 'suspendu', label: 'Suspendus' },
];

export default function ProjetsPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['projets', { page, limit, search, statut }],
    queryFn: () =>
      projetsService.getAll({
        page,
        limit,
        search: search || undefined,
        statut: statut || undefined,
      }),
    staleTime: 2 * 60 * 1000,
  });

  const handleSearch = (v: string) => {
    setSearch(v);
    resetPage();
  };

  const handleStatut = (v: string) => {
    setStatut(v);
    resetPage();
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="relative bg-primary-dark text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Projets Territoriaux' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Portefeuille d'Investissements
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Projets de Développement Régional
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Explorez les réalisations et initiatives structurantes portées par l'ARD en appui aux
              communes et départements de Ziguinchor, Bignona et Oussouye.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Accès cartographie des projets */}
        <div className="mb-8 flex justify-end">
          <Link
            href="/projets/cartographie"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <MapPinned className="h-4 w-4" />
            Cartographie des projets
          </Link>
        </div>
        {/* Barre de filtre & recherche moderne */}
        <div className="vitrine-card rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher par titre, commune, bailleur ou mot-clé…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtres rapides par pastilles statut */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Statut :</span>
            </span>
            {STATUT_FILTERS.map((f) => {
              const active = statut === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => handleStatut(f.value)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des projets de la région…" />
          </div>
        ) : !data?.data?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title="Aucun projet correspondant"
              description="Aucun projet ne correspond à vos filtres actuels. Essayez de réinitialiser la recherche ou de sélectionner un autre statut."
            />
            <button
              onClick={() => {
                setSearch('');
                setStatut('');
                resetPage();
              }}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                <span className="font-bold text-slate-900">{data.total}</span> projet
                {data.total > 1 ? 's' : ''} répertorié{data.total > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.data.map((p) => (
                <ProjetCard key={p.id} projet={p} />
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={goToPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
