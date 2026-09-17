'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ExternalLink, X, Handshake, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
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
    queryFn: () =>
      partenairesService.getAll({ page, limit, search: search || undefined }),
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
            <Breadcrumb items={[{ label: 'Partenaires & Coopération' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Écosystème & Coopération
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Partenaires Techniques & Financiers
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Organisations internationales, agences de coopération bilatérale, ministères sectoriels,
              ONG et universités engagés aux côtés de l'ARD Ziguinchor pour le développement territorial.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
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
              placeholder="Rechercher par nom, sigle ou type d'institution…"
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

        {/* Liste */}
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement de l'annuaire des partenaires…" />
          </div>
        ) : !data?.data?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title="Aucun partenaire trouvé"
              description="Aucun organisme ne correspond à votre recherche."
              icon={<Handshake className="h-12 w-12 text-slate-300" />}
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                <span className="font-bold text-slate-900">{data.total}</span> organisation
                {data.total > 1 ? 's' : ''} partenaire{data.total > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {data.data.map((p) => (
                <div
                  key={p.id}
                  className="vitrine-card hover-lift rounded-2xl p-6 border-slate-200/90 flex flex-col items-center text-center justify-between group"
                >
                  {/* Logo */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3 mb-4 group-hover:scale-105 transition-transform duration-200">
                    {p.logo ? (
                      <Image
                        src={p.logo}
                        alt={p.nom}
                        width={80}
                        height={80}
                        className="object-contain max-h-16"
                      />
                    ) : (
                      <span className="text-2xl font-black text-slate-400">
                        {p.sigle ?? p.nom.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="w-full mb-5">
                    {p.type?.nom && (
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {p.type.nom}
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                      {p.nom}
                    </h3>
                    {p.sigle && (
                      <p className="text-xs font-bold text-emerald-800 mt-1 uppercase tracking-wider">
                        {p.sigle}
                      </p>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="w-full pt-4 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href={`/partenaires/${p.slug}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-emerald-700 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Profil</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    {p.siteWeb && (
                      <a
                        href={p.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Site officiel de ${p.nom}`}
                        className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        title="Visiter le site officiel"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
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
