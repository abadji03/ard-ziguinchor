'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjetCard } from '@/components/features/projets/ProjetCard';
import { LoadingState } from '@/components/ui/Spinner';
import { useQueryData } from '@/hooks/useQueryData';
import { projetsService } from '@/services/projets.service';

export function ProjetsRecents() {
  const { data: projets, isLoading } = useQueryData(
    ['projets-recents'],
    () => projetsService.getRecents(3)
  );

  if (isLoading) return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <LoadingState />
      </div>
    </section>
  );

  if (!projets?.length) return null;

  return (
    <section className="py-16 bg-white" aria-label="Projets récents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <SectionTitle
            title="Nos Projets"
            subtitle="Les derniers projets menés par l'ARD"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projets.slice(0, 3).map((p) => (
            <ProjetCard key={p.id} projet={p} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Voir tous nos projets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
