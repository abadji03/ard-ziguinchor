'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, Newspaper, FolderOpen, FileText } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { rechercheService } from '@/services/recherche.service';

function RechercheContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const { data, isLoading } = useQuery({
    queryKey: ['recherche', searchParams.get('q')],
    queryFn: () => rechercheService.search(searchParams.get('q') || ''),
    enabled: !!searchParams.get('q'),
    staleTime: 2 * 60 * 1000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  };

  const q = searchParams.get('q');

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Recherche</h1>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher sur le site…"
              icon={<Search className="h-4 w-4" />}
              className="flex-1"
              aria-label="Terme de recherche"
            />
            <Button type="submit" size="lg" className="shrink-0">Rechercher</Button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {!q ? (
          <p className="text-center text-gray-500">Entrez un terme pour lancer la recherche.</p>
        ) : isLoading ? (
          <LoadingState message="Recherche en cours…" />
        ) : !data || data.total === 0 ? (
          <EmptyState
            title="Aucun résultat"
            description={`Aucun résultat pour « ${q} ». Essayez avec d'autres mots-clés.`}
          />
        ) : (
          <div className="space-y-8">
            <p className="text-sm text-gray-500">
              <strong>{data.total}</strong> résultat{data.total > 1 ? 's' : ''} pour « <em>{q}</em> »
            </p>

            {data.actualites?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Newspaper className="h-5 w-5 text-primary" /> Actualités ({data.actualites.length})
                </h2>
                <div className="space-y-3">
                  {data.actualites.map((a) => (
                    <Link key={a.id} href={`/actualites/${a.slug}`}
                      className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all">
                      <h3 className="font-medium text-gray-900 hover:text-primary">{a.titre}</h3>
                      {a.resume && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{a.resume}</p>}
                      {a.datePublication && <p className="text-xs text-gray-400 mt-1">{formatDate(a.datePublication)}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data.projets?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <FolderOpen className="h-5 w-5 text-primary" /> Projets ({data.projets.length})
                </h2>
                <div className="space-y-3">
                  {data.projets.map((p) => (
                    <Link key={p.id} href={`/projets/${p.slug}`}
                      className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all">
                      <h3 className="font-medium text-gray-900 hover:text-primary">{p.titre}</h3>
                      {p.resume && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.resume}</p>}
                      <p className="text-xs text-gray-400 mt-1">{p.secteur?.nom} • {p.departement?.nom}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data.documents?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <FileText className="h-5 w-5 text-primary" /> Documents ({data.documents.length})
                </h2>
                <div className="space-y-3">
                  {data.documents.map((d) => (
                    <Link key={d.id} href={`/documentation`}
                      className="block bg-white rounded-xl p-4 border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all">
                      <h3 className="font-medium text-gray-900">{d.titre}</h3>
                      {d.resume && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{d.resume}</p>}
                      <span className="text-xs uppercase font-medium text-gray-400">{d.format}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <PublicLayout>
      <Suspense fallback={<LoadingState />}>
        <RechercheContent />
      </Suspense>
    </PublicLayout>
  );
}
