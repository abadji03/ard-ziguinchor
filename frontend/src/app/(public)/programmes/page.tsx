'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Building2, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate, truncate } from '@/lib/utils';
import { programmesService } from '@/services/programmes.service';
import { usePagination } from '@/hooks/usePagination';

const STATUT_COLORS: Record<string, string> = {
  actif:    'bg-green-100 text-green-700',
  termine:  'bg-gray-100 text-gray-600',
  suspendu: 'bg-red-100 text-red-700',
};

export default function ProgrammesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['programmes', { page, limit, search }],
    queryFn: () => programmesService.getAll({ page, limit, search: search || undefined }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Programmes' }]} />
          <SectionTitle
            title="Programmes"
            subtitle="Les programmes de développement portés par l'ARD Ziguinchor"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Input
            placeholder="Rechercher un programme…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des programmes…" />
        ) : !data?.data?.length ? (
          <EmptyState title="Aucun programme" description="Aucun programme ne correspond à votre recherche." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((prog) => (
                <Card key={prog.id} hover className="flex flex-col overflow-hidden h-full">
                  <div className="relative h-44 bg-gray-50 shrink-0">
                    {prog.image ? (
                      <Image src={prog.image} alt={prog.nom} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
                        <span className="text-4xl opacity-30">📋</span>
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLORS[prog.statut] ?? 'bg-gray-100 text-gray-600'}`}>
                      {prog.statut.charAt(0).toUpperCase() + prog.statut.slice(1)}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {prog.acronyme && (
                      <Badge variant="info" className="self-start">{prog.acronyme}</Badge>
                    )}
                    <Link href={`/programmes/${prog.slug}`} className="group">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {prog.nom}
                      </h3>
                    </Link>
                    {prog.resume && (
                      <p className="text-sm text-gray-500 line-clamp-2">{truncate(prog.resume, 110)}</p>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      {prog.dateDebut && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(prog.dateDebut)}
                        </span>
                      )}
                      {prog.organismePilote && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {prog.organismePilote}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/programmes/${prog.slug}`}
                      className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1"
                    >
                      Voir le programme <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
