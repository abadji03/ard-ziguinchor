'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { ProgrammeCard } from '@/components/features/programmes/ProgrammeCard';
import { ProjetCard } from '@/components/features/projets/ProjetCard';
import { programmesService } from '@/services/programmes.service';
import { projetsService } from '@/services/projets.service';
import { usePagination } from '@/hooks/usePagination';
import { FolderKanban, LayoutGrid } from 'lucide-react';
import type { PaginatedResponse, Programme, Projet } from '@/types';

export default function ProgrammesPage() {
  const [onglet, setOnglet] = useState<'programmes' | 'projets'>('programmes');
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery<PaginatedResponse<Programme | Projet>>({
    queryKey: [onglet, { page, limit, search }],
    queryFn: () =>
      onglet === 'programmes'
        ? programmesService.getAll({ page, limit, search: search || undefined })
        : projetsService.getAll({ page, limit, search: search || undefined }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="relative bg-primary-dark text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Programmes de Développement' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Cadres Stratégiques & Bailleurs
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Programmes Structurants
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Les grands programmes pluriannuels financés par l'État du Sénégal et les Partenaires
              Techniques et Financiers (PTF) pour la transformation durable de la Casamance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Onglets Programmes / Projets */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 gap-1">
            <button
              type="button"
              onClick={() => {
                setOnglet('programmes');
                resetPage();
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                onglet === 'programmes'
                  ? 'bg-primary-dark text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Programmes
            </button>
            <button
              type="button"
              onClick={() => {
                setOnglet('projets');
                resetPage();
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                onglet === 'projets'
                  ? 'bg-primary-dark text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderKanban className="h-4 w-4" />
              Projets
            </button>
          </div>
        </div>

        {/* Recherche */}
        <div className="vitrine-card rounded-2xl p-4 sm:p-5 mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Rechercher un programme par nom, acronyme, bailleur…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  resetPage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Résultats */}
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des programmes…" />
          </div>
        ) : !data?.data?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title={onglet === 'programmes' ? 'Aucun programme trouvé' : 'Aucun projet trouvé'}
              description={
                onglet === 'programmes'
                  ? 'Aucun programme ne correspond à votre recherche pour le moment.'
                  : 'Aucun projet ne correspond à votre recherche pour le moment.'
              }
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                <span className="font-bold text-slate-900">{data.total}</span>{' '}
                {onglet === 'programmes' ? 'programme' : 'projet'}
                {data.total > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {onglet === 'programmes'
                ? data.data.map((prog) => (
                    <ProgrammeCard key={prog.id} programme={prog as Programme} />
                  ))
                : data.data.map((p) => <ProjetCard key={p.id} projet={p as Projet} />)}
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
