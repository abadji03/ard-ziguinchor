'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ExternalLink } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { partenairesService } from '@/services/partenaires.service';
import { usePagination } from '@/hooks/usePagination';

export default function PartenairesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(12);

  const { data, isLoading } = useQuery({
    queryKey: ['partenaires', { page, limit, search }],
    queryFn: () => partenairesService.getAll({ page, limit, search: search || undefined }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Partenaires' }]} />
          <SectionTitle
            title="Nos Partenaires"
            subtitle="Les acteurs qui soutiennent le développement de la région"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Input
            placeholder="Rechercher un partenaire…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des partenaires…" />
        ) : !data?.data?.length ? (
          <EmptyState title="Aucun partenaire" description="Aucun partenaire ne correspond à votre recherche." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data.data.map((p) => (
                <Card key={p.id} hover className="flex flex-col items-center text-center p-6 gap-4">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {p.logo ? (
                      <Image src={p.logo} alt={p.nom} width={80} height={80} className="object-contain p-2" />
                    ) : (
                      <span className="text-2xl font-bold text-primary/30">
                        {p.sigle ?? p.nom.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.nom}</h3>
                    {p.sigle && <span className="text-xs text-gray-400">{p.sigle}</span>}
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full self-center mt-1">
                      {p.type.nom}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      href={`/partenaires/${p.slug}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-medium"
                    >
                      Voir le profil
                    </Link>
                    {p.siteWeb && (
                      <a
                        href={p.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Site web de ${p.nom}`}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
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
