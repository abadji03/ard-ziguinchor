'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProjetCard } from '@/components/features/projets/ProjetCard';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { projetsService } from '@/services/projets.service';
import { usePagination } from '@/hooks/usePagination';

const STATUT_OPTIONS = [
  { value: 'planifie', label: 'Planifié' },
  { value: 'encours',  label: 'En cours' },
  { value: 'realise',  label: 'Réalisé'  },
  { value: 'suspendu', label: 'Suspendu' },
];

export default function ProjetsPage() {
  const [search, setSearch]  = useState('');
  const [statut, setStatut]  = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['projets', { page, limit, search, statut }],
    queryFn:  () => projetsService.getAll({ page, limit, search: search || undefined, statut: statut || undefined }),
    staleTime: 2 * 60 * 1000,
  });

  const handleSearch = (v: string) => { setSearch(v); resetPage(); };
  const handleStatut = (v: string) => { setStatut(v); resetPage(); };

  return (
    <div className="bg-background min-h-screen">
      {/* En-tête page */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Projets' }]} />
          <SectionTitle
            title="Nos Projets"
            subtitle="Découvrez les projets portés par l'ARD Ziguinchor"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un projet…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              aria-label="Recherche de projets"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
            <Select
              options={STATUT_OPTIONS}
              value={statut}
              onChange={(e) => handleStatut(e.target.value)}
              placeholder="Tous les statuts"
              className="min-w-[160px]"
              aria-label="Filtrer par statut"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des projets…" />
        ) : !data?.data?.length ? (
          <EmptyState
            title="Aucun projet trouvé"
            description="Aucun projet ne correspond à vos critères de recherche."
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {data.total} projet{data.total > 1 ? 's' : ''} trouvé{data.total > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((p) => (
                <ProjetCard key={p.id} projet={p} />
              ))}
            </div>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
