'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ActualiteCard } from '@/components/features/actualites/ActualiteCard';
import { LoadingState } from '@/components/ui/Spinner';
import { useQueryData } from '@/hooks/useQueryData';
import { actualitesService } from '@/services/actualites.service';

export function ActualitesRecentes() {
  const { data: actualites, isLoading } = useQueryData(
    ['actualites-recentes'],
    () => actualitesService.getRecentes(3)
  );

  if (isLoading) return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <LoadingState />
      </div>
    </section>
  );

  if (!actualites?.length) return null;

  return (
    <section className="py-16 bg-background" aria-label="Actualités récentes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <SectionTitle
            title="Actualités"
            subtitle="Restez informé des dernières nouvelles de l'ARD"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actualites.slice(0, 3).map((a) => (
            <ActualiteCard key={a.id} actualite={a} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
          >
            Toutes les actualités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
