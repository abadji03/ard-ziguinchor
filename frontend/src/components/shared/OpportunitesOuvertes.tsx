'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Download } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { useQueryData } from '@/hooks/useQueryData';
import { opportunitesService } from '@/services/opportunites.service';

export function OpportunitesOuvertes() {
  const { data, isLoading } = useQueryData(
    ['accueil-opportunites-ouvertes'],
    () => opportunitesService.getAll({ limit: 3, page: 1, statut: 'ouvert' }),
  );

  const opportunites = (data?.data ?? []).filter((o) => o.statut === 'ouvert');

  if (isLoading) return null;
  if (!opportunites.length) return null;

  return (
    <section className="py-16 bg-background" aria-label="Opportunités ouvertes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <SectionTitle
            title="Opportunités en cours"
            subtitle="Appels à candidatures et offres d'opportunités ouvertes par l'ARD"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunites.slice(0, 3).map((opp) => {
            const isExpiringSoon =
              opp.dateLimite &&
              new Date(opp.dateLimite) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
              new Date(opp.dateLimite) > new Date();
            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {opp.type.nom}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                    Ouverte
                  </span>
                </div>

                <Link href={`/opportunites/${opp.slug}`} className="group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {opp.titre}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500">{opp.organisme}</p>

                <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(opp.datePublication)}
                  </span>
                  {opp.dateLimite && (
                    <span className={`flex items-center gap-1 ${isExpiringSoon ? 'text-red-500 font-medium' : ''}`}>
                      <Clock className="h-3.5 w-3.5" /> Limite : {formatDate(opp.dateLimite)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/opportunites/${opp.slug}`}
                    className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-medium"
                  >
                    Voir les détails
                  </Link>
                  {opp.document && (
                    <a
                      href={opp.document.fichier}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Télécharger le document"
                      className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/opportunites"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Voir toutes les opportunités
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}