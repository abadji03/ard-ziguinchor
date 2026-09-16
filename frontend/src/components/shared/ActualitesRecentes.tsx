'use client';

import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { ActualiteCard } from '@/components/features/actualites/ActualiteCard';
import { LoadingState } from '@/components/ui/Spinner';
import { useQueryData } from '@/hooks/useQueryData';
import { actualitesService } from '@/services/actualites.service';

export function ActualitesRecentes() {
  const { data: actualites, isLoading } = useQueryData(
    ['actualites-recentes'],
    () => actualitesService.getRecentes(3)
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (!actualites?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200/80" aria-label="Actualités récentes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300/60">
              Journal Régional & Communiqués
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Actualités & Vie de l'Institution
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Retrouvez les temps forts de l'ARD : ateliers de concertation, lancements de chantiers,
              coopérations décentralisées et publications d'études territoriales.
            </p>
          </div>

          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-sm transition-all self-start md:self-auto"
          >
            <Newspaper className="h-4 w-4" />
            <span>Toutes les actualités</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actualites.slice(0, 3).map((a) => (
            <ActualiteCard key={a.id} actualite={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
