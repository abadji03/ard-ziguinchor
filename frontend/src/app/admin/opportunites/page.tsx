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
          <p className="font-medium text-gray-900 truncate max-w-xs">{row.titre}</p>
          <p className="text-xs text-gray-400 mt-0.5">{row.type.nom} • {row.organisme}</p>
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => {
        const s = STATUT_OPPORTUNITE[row.statut];
        return s ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span> : null;
      },
    },
    {
      key: 'dateLimite',
      label: 'Date limite',
      render: (row) => {
        if (!row.dateLimite) return <span className="text-gray-300 text-xs">—</span>;
        const expired = new Date(row.dateLimite) < new Date();
        return (
          <span className={`flex items-center gap-1 text-xs ${expired ? 'text-red-500' : 'text-gray-500'}`}>
            <Clock className="h-3.5 w-3.5" />
            {formatDate(row.dateLimite)}
          </span>
        );
      },
    },
    {
      key: 'datePublication',
      label: 'Publié le',
      render: (row) => <span className="text-xs text-gray-500">{formatDate(row.datePublication)}</span>,
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
