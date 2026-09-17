'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { programmesService } from '@/services/programmes.service';
import { adminProgrammes } from '@/services/admin.service';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/lib/utils';
import type { Programme } from '@/types';

const STATUT_COLORS: Record<string, string> = {
  actif:    'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
  termine:  'bg-slate-100 text-slate-700 border border-slate-200/60',
  suspendu: 'bg-rose-50 text-rose-800 border border-rose-200/60',
};

export default function AdminProgrammesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-programmes', { page, limit, search }],
    queryFn: () => programmesService.getAll({ page, limit, search: search || undefined }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminProgrammes.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-programmes'] }),
  });

  const columns: Column<Programme>[] = [
    {
      key: 'nom',
      label: 'Programme',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{row.nom}</p>
          {row.acronyme && <p className="text-xs font-bold text-emerald-700 mt-0.5">{row.acronyme}</p>}
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_COLORS[row.statut] ?? 'bg-gray-100 text-gray-600'}`}>
          {row.statut}
        </span>
      ),
    },
    {
      key: 'organismePilote',
      label: 'Organisme',
      render: (row) => <span className="text-sm text-gray-600">{row.organismePilote ?? '—'}</span>,
    },
    {
      key: 'dateDebut',
      label: 'Début',
      render: (row) => <span className="text-sm text-gray-500">{row.dateDebut ? formatDate(row.dateDebut) : '—'}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={`/programmes/${row.slug}`}
          editHref={`/admin/programmes/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.nom}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Programmes"
        description="Gérez les programmes de développement"
        createHref="/admin/programmes/new"
        createLabel="Nouveau programme"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher un programme…"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
        emptyTitle="Aucun programme"
        emptyDesc="Ajoutez votre premier programme."
      />
    </div>
  );
}
