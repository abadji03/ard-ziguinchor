'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, ExternalLink, Download, Clock } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils';
import { STATUT_OPPORTUNITE } from '@/constants';
import { opportunitesService } from '@/services/opportunites.service';
import { usePagination } from '@/hooks/usePagination';
import type { Opportunite } from '@/types';

const STATUT_OPTIONS = [
  { value: 'ouvert',  label: 'Ouverts'  },
  { value: 'ferme',   label: 'Fermés'   },
  { value: 'expire',  label: 'Expirés'  },
];

function OpportuniteCard({ opp }: { opp: Opportunite }) {
  const statut = STATUT_OPPORTUNITE[opp.statut] ?? { label: opp.statut, color: 'bg-gray-100 text-gray-700' };
  const isExpiringSoon = opp.dateLimite && new Date(opp.dateLimite) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card hover className="flex flex-col p-5 gap-4 h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {opp.type.nom}
          </span>
          <h3 className="font-semibold text-gray-900 mt-2 text-sm line-clamp-2">{opp.titre}</h3>
          <p className="text-xs text-gray-500 mt-1">{opp.organisme}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statut.color}`}>
          {statut.label}
        </span>
      </div>

      {opp.resume && <p className="text-sm text-gray-500 line-clamp-3">{opp.resume}</p>}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Publié le {formatDate(opp.datePublication)}
        </span>
        {opp.dateLimite && (
          <span className={`flex items-center gap-1 ${isExpiringSoon ? 'text-red-500 font-medium' : ''}`}>
            <Clock className="h-3.5 w-3.5" />
            Limite : {formatDate(opp.dateLimite)}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <a
          href={`/opportunites/${opp.slug}`}
          className="flex-1 text-center text-xs px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-medium"
        >
          Voir les détails
        </a>
        {opp.lienExterne && (
          <a
            href={opp.lienExterne}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Lien externe"
            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
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
    </Card>
  );
}

export default function OpportunitesPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('ouvert');
  const { page, limit, goToPage, resetPage } = usePagination(9);

  const { data, isLoading } = useQuery({
    queryKey: ['opportunites', { page, limit, search, statut }],
    queryFn: () => opportunitesService.getAll({
      page, limit,
      search: search || undefined,
      statut: statut || undefined,
    }),
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Opportunités' }]} />
          <SectionTitle
            title="Opportunités"
            subtitle="Appels à projets, appels d'offres, recrutements et formations"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une opportunité…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <Select
            options={STATUT_OPTIONS}
            value={statut}
            onChange={(e) => { setStatut(e.target.value); resetPage(); }}
            placeholder="Tous les statuts"
            className="min-w-[160px]"
          />
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des opportunités…" />
        ) : !data?.data?.length ? (
          <EmptyState title="Aucune opportunité" description="Aucune opportunité ouverte pour le moment." />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {data.total} opportunité{data.total > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((o) => <OpportuniteCard key={o.id} opp={o} />)}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
