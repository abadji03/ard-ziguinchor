'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { ActualiteCard } from '@/components/features/actualites/ActualiteCard';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { actualitesService } from '@/services/actualites.service';
import { usePagination } from '@/hooks/usePagination';

export default function ActualitesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['actualites', { page, limit, search }],
    queryFn: () => actualitesService.getAll({
      page, limit,
      search: search || undefined,
      statut: 'publie',
    }),
    staleTime: 2 * 60 * 1000,
  });

  const handleSearch = (v: string) => { setSearch(v); resetPage(); };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Actualités' }]} />
          <SectionTitle
            title="Actualités"
            subtitle="Toutes les nouvelles de l'ARD Ziguinchor"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Input
            placeholder="Rechercher une actualité…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
            aria-label="Recherche d'actualités"
          />
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des actualités…" />
        ) : !data?.data?.length ? (
          <EmptyState title="Aucune actualité" description="Aucune actualité ne correspond à vos critères." />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {data.total} actualité{data.total > 1 ? 's' : ''} trouvée{data.total > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((a) => (
                <ActualiteCard key={a.id} actualite={a} />
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
