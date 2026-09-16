'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Newspaper } from 'lucide-react';
import { ActualiteCard } from '@/components/features/actualites/ActualiteCard';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { actualitesService } from '@/services/actualites.service';
import { usePagination } from '@/hooks/usePagination';

export default function ActualitesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['actualites', { page, limit, search }],
    queryFn: () =>
      actualitesService.getAll({
        page,
        limit,
        search: search || undefined,
        statut: 'publie',
      }),
    staleTime: 2 * 60 * 1000,
  });

  const handleSearch = (v: string) => {
    setSearch(v);
    resetPage();
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Actualités & Presse' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Communication & Médias
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Actualités & Informations Officielles
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Suivez au jour le jour les activités de l'ARD, les conventions de partenariat signées,
              les avancées des chantiers et les rendez-vous du développement en Casamance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Recherche */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher par mot-clé, événement, localité…"
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

        {/* Liste */}
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des actualités régionales…" />
          </div>
        ) : !data?.data?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title="Aucune actualité trouvée"
              description="Aucun article ne correspond à votre recherche pour le moment."
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Afficher toutes les actualités
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                <span className="font-bold text-slate-900">{data.total}</span> publication
                {data.total > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.data.map((a) => (
                <ActualiteCard key={a.id} actualite={a} />
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
