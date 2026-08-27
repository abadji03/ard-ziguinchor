'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProjetCard } from '@/components/features/projets/ProjetCard';
import { ProgrammeCard } from '@/components/features/programmes/ProgrammeCard';
import { LoadingState } from '@/components/ui/Spinner';
import { useQueryData } from '@/hooks/useQueryData';
import { projetsService } from '@/services/projets.service';
import { programmesService } from '@/services/programmes.service';

export function ProjetsEtProgrammes() {
  const { data: projets, isLoading: loadP } = useQueryData(
    ['accueil-projets'],
    () => projetsService.getRecents(3)
  );
  const { data: programmes, isLoading: loadPr } = useQueryData(
    ['accueil-programmes'],
    () => programmesService.getAll({ limit: 3, page: 1, statut: 'actif' }),
  );

  const isLoading = loadP || loadPr;
  const programmesList = (programmes?.data ?? []).filter(
    (p) => p.statut === 'actif'
  );
  const isEmpty = !projets?.length && !programmesList.length;

  if (isLoading) return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <LoadingState />
      </div>
    </section>
  );

  if (isEmpty) return null;

  return (
    <section className="py-16 bg-white" aria-label="Projets et programmes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Nos Projets & Programmes"
          subtitle="Les actions menées par l'ARD pour le développement de la région"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Projets */}
          {projets && projets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Projets récents</h3>
                <Link href="/projets" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Voir tous <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-5">
                {projets.slice(0, 3).map((p) => (
                  <ProjetCard key={p.id} projet={p} />
                ))}
              </div>
            </div>
          )}

          {/* Programmes */}
          {programmesList.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Programmes</h3>
                <Link href="/programmes" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Voir tous <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="space-y-5">
                {programmesList.slice(0, 3).map((pr) => (
                  <ProgrammeCard key={pr.id} programme={pr} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}