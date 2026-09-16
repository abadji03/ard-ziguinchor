'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Download, FileText, AlertCircle } from 'lucide-react';
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
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80" aria-label="Opportunités ouvertes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300/60">
              Commande Publique & Recrutement
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Avis d'Appels d'Offres & Opportunités
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Consultez les dossiers de consultation, avis de recrutement et manifestations d'intérêt
              lancés par l'ARD Ziguinchor et ses partenaires territoriaux.
            </p>
          </div>

          <Link
            href="/opportunites"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-emerald-700 font-bold text-sm transition-colors self-start md:self-auto shadow-sm"
          >
            <span>Toutes les opportunités</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
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
                className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-amber-500/60 hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {opp.type.nom}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/50">
                      En cours
                    </span>
                  </div>

                  <Link href={`/opportunites/${opp.slug}`} className="block">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {opp.titre}
                    </h3>
                  </Link>

                  {opp.organisme && (
                    <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <span>{opp.organisme}</span>
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Publié le {formatDate(opp.datePublication)}</span>
                    </div>
                    {opp.dateLimite && (
                      <div
                        className={`flex items-center gap-1.5 font-semibold ${
                          isExpiringSoon ? 'text-rose-600' : 'text-amber-700'
                        }`}
                      >
                        {isExpiringSoon ? (
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                        )}
                        <span>Date limite : {formatDate(opp.dateLimite)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/opportunites/${opp.slug}`}
                      className="flex-1 text-center text-xs py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 hover:bg-emerald-700 hover:text-white font-bold transition-colors"
                    >
                      Consulter le dossier
                    </Link>
                    {opp.document && (
                      <a
                        href={opp.document.fichier}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Télécharger le document d'appel d'offres"
                        className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900 transition-colors"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
