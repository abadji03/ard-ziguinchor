'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { opportunitesService } from '@/services/opportunites.service';
import { adminOpportunites } from '@/services/admin.service';
import { formatDate } from '@/lib/utils';
import { STATUT_OPPORTUNITE } from '@/constants';
import { usePagination } from '@/hooks/usePagination';
import type { Opportunite } from '@/types';

const STATUT_OPTIONS = Object.entries(STATUT_OPPORTUNITE).map(([v, s]) => ({ value: v, label: s.label }));

export default function AdminOpportunitesPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-opportunites', { page, limit, search, statut }],
    queryFn: () => opportunitesService.getAll({ page, limit, search: search || undefined, statut: statut || undefined }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminOpportunites.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-opportunites'] }),
  });

  const columns: Column<Opportunite>[] = [
    {
      key: 'titre',
      label: 'Opportunité',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 truncate max-w-xs">{row.titre}</p>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{row.type.nom} • {row.organisme}</p>
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => {
        const s = STATUT_OPPORTUNITE[row.statut];
        const colorClasses: Record<string, string> = {
          OUVERT: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold',
          FERME: 'bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold',
          A_VENIR: 'bg-blue-50 text-blue-800 border border-blue-200/60 font-semibold',
        };
        const badgeClass = colorClasses[row.statut] || 'bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold';
        return s ? <span className={`text-xs px-2.5 py-0.5 rounded-full ${badgeClass}`}>{s.label}</span> : null;
      },
    },
    {
      key: 'dateLimite',
      label: 'Date limite',
      render: (row) => {
        if (!row.dateLimite) return <span className="text-slate-300 text-xs">—</span>;
        const expired = new Date(row.dateLimite) < new Date();
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${expired ? 'text-rose-600 font-semibold' : 'text-slate-600'}`}>
            <Clock className="h-3.5 w-3.5" />
            {formatDate(row.dateLimite)}
          </span>
        );
      },
    },
    {
      key: 'datePublication',
      label: 'Publié le',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{formatDate(row.datePublication)}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={`/opportunites/${row.slug}`}
          editHref={`/admin/opportunites/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.titre}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Opportunités"
        description="Appels à projets, offres et formations"
        createHref="/admin/opportunites/new"
        createLabel="Nouvelle opportunité"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher une opportunité…"
        filters={[{ label: 'Statut', value: statut, options: STATUT_OPTIONS, onChange: (v) => { setStatut(v); resetPage(); } }]}
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
        emptyTitle="Aucune opportunité"
        emptyDesc="Ajoutez votre première opportunité."
      />
    </div>
  );
}
