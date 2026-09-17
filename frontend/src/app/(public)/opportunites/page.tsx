'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, Calendar, ExternalLink, Download, Clock, AlertCircle, X, Filter } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils';
import { STATUT_OPPORTUNITE } from '@/constants';
import { opportunitesService } from '@/services/opportunites.service';
import { usePagination } from '@/hooks/usePagination';
import type { Opportunite } from '@/types';

const STATUT_FILTERS = [
  { value: '', label: 'Toutes les opportunités' },
  { value: 'ouvert', label: 'En cours (Ouvertes)' },
  { value: 'ferme', label: 'Clôturées' },
  { value: 'expire', label: 'Expirées' },
];

function OpportuniteCardItem({ opp }: { opp: Opportunite }) {
  const statut = STATUT_OPPORTUNITE[opp.statut] ?? {
    label: opp.statut,
    color: 'bg-slate-100 text-slate-700',
  };
  const isExpiringSoon =
    opp.dateLimite &&
    new Date(opp.dateLimite) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    new Date(opp.dateLimite) > new Date();

  return (
    <div className="flex flex-col vitrine-card hover-lift rounded-2xl p-6 border-slate-200/90 justify-between group h-full">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {opp.type.nom}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statut.color}`}
          >
            {statut.label}
          </span>
        </div>

        <Link href={`/opportunites/${opp.slug}`} className="block">
          <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base leading-snug line-clamp-2">
            {opp.titre}
          </h3>
        </Link>
        <p className="text-xs font-medium text-slate-500 mt-1">{opp.organisme}</p>

        {opp.resume && (
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-3 leading-relaxed">
            {opp.resume}
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
            Voir les détails
          </Link>
          {opp.lienExterne && (
            <a
              href={opp.lienExterne}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lien externe"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="Lien externe"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {opp.document && (
            <a
              href={opp.document.fichier}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Télécharger le document d'opportunité"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900 transition-colors"
              title="Télécharger le dossier"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OpportunitesPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('ouvert');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['opportunites', { page, limit, search, statut }],
    queryFn: () =>
      opportunitesService.getAll({
        page,
        limit,
        search: search || undefined,
        statut: statut || undefined,
      }),
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="relative bg-primary-dark text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Opportunités & Marchés' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Appels d'Offres & Recrutement
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Avis de Marchés & Opportunités
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Consultez les dossiers d'appels d'offres publics, manifestations d'intérêt, postes à
              pourvoir et stages de l'ARD Ziguinchor et de ses partenaires institutionnels.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Filtres & Recherche */}
        <div className="vitrine-card rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Rechercher par mot-clé, profil ou numéro d'avis…"
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

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Statut :</span>
            </span>
            {STATUT_FILTERS.map((f) => {
              const active = statut === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => {
                    setStatut(f.value);
                    resetPage();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des opportunités…" />
          </div>
        ) : !data?.data?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title="Aucune opportunité pour le moment"
              description="Aucun appel d'offres ou offre de recrutement ne correspond à ces critères."
            />
            {statut && (
              <button
                onClick={() => {
                  setStatut('');
                  resetPage();
                }}
                className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Afficher toutes les opportunités (y compris clôturées)
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                <span className="font-bold text-slate-900">{data.total}</span> opportunité
                {data.total > 1 ? 's' : ''} répertoriée{data.total > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.data.map((o) => (
                <OpportuniteCardItem key={o.id} opp={o} />
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
