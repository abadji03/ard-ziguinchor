'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, Newspaper, FolderOpen, FileText } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
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
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel avec barre de recherche */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
            Moteur de Recherche Global
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Recherche sur le Portail
          </h1>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une actualité, un projet, un document…"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                aria-label="Terme de recherche"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shrink-0 shadow-xs"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {!q ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium text-sm">Entrez des mots-clés ci-dessus pour lancer la recherche.</p>
            <p className="text-xs text-slate-400 mt-1">Exemple : agriculture, PCD, éducation, budget, Ziguinchor</p>
          </div>
        ) : isLoading ? (
          <div className="py-12">
            <LoadingState message="Recherche en cours dans les bases de données…" />
          </div>
        ) : !data || data.total === 0 ? (
          <EmptyState
            title="Aucun résultat trouvé"
            description={`Aucun contenu ne correspond à votre recherche « ${q} ». Essayez avec d'autres termes.`}
          />
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                <strong className="text-slate-900 font-bold">{data.total}</strong> résultat{data.total > 1 ? 's' : ''} pour « <em className="text-emerald-700 font-bold not-italic">{q}</em> »
              </p>
            </div>

            {data.actualites?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  <Newspaper className="h-4 w-4 text-emerald-600" /> Actualités ({data.actualites.length})
                </h2>
                <div className="space-y-3">
                  {data.actualites.map((a) => (
                    <Link
                      key={a.id}
                      href={`/actualites/${a.slug}`}
                      className="block bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-600/50 hover:shadow-md transition-all group shadow-xs"
                    >
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 text-sm sm:text-base">{a.titre}</h3>
                      {a.resume && <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">{a.resume}</p>}
                      {a.datePublication && <p className="text-[11px] font-semibold text-slate-400 mt-2">{formatDate(a.datePublication)}</p>}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data.projets?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  <FolderOpen className="h-4 w-4 text-emerald-600" /> Projets ({data.projets.length})
                </h2>
                <div className="space-y-3">
                  {data.projets.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projets/${p.slug}`}
                      className="block bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-600/50 hover:shadow-md transition-all group shadow-xs"
                    >
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 text-sm sm:text-base">{p.titre}</h3>
                      {p.resume && <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">{p.resume}</p>}
                      <p className="text-[11px] font-semibold text-emerald-700 mt-2">{p.secteur?.nom} • {p.departement?.nom}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {data.documents?.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  <FileText className="h-4 w-4 text-emerald-600" /> Documents ({data.documents.length})
                </h2>
                <div className="space-y-3">
                  {data.documents.map((d) => (
                    <Link
                      key={d.id}
                      href="/documentation"
                      className="block bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-600/50 hover:shadow-md transition-all group shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 text-sm sm:text-base">{d.titre}</h3>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          {d.format}
                        </span>
                      </div>
                      {d.resume && <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2">{d.resume}</p>}
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
