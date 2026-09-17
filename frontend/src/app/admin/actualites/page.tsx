'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { Badge } from '@/components/ui/Badge';
import { actualitesService } from '@/services/actualites.service';
import { adminActualites } from '@/services/admin.service';
import { formatDate } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import type { Actualite } from '@/types';

const STATUT_OPTIONS = [
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'publie',    label: 'Publié'    },
  { value: 'archive',   label: 'Archivé'   },
];

const STATUT_BADGE: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
  publie:    'success',
  brouillon: 'default',
  archive:   'warning',
};

export default function AdminActualitesPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-actualites', { page, limit, search, statut }],
    queryFn: () => actualitesService.getAll({ page, limit, search: search || undefined, statut: statut || undefined }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminActualites.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-actualites'] }),
  });

  const columns: Column<Actualite>[] = [
    {
      key: 'titre',
      label: 'Titre',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 truncate max-w-xs">{row.titre}</p>
          {row.categorie && (
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{row.categorie.nom}</p>
          )}
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => {
        const colors: Record<string, string> = {
          publie: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold',
          brouillon: 'bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold',
          archive: 'bg-amber-50 text-amber-800 border border-amber-200/60 font-semibold',
        };
        const labels: Record<string, string> = {
          publie: 'Publié',
          brouillon: 'Brouillon',
          archive: 'Archivé',
        };
        return (
          <span className={`text-xs px-2.5 py-0.5 rounded-full ${colors[row.statut] || 'bg-slate-100 text-slate-700'}`}>
            {labels[row.statut] || row.statut}
          </span>
        );
      },
    },
    {
      key: 'datePublication',
      label: 'Publication',
      render: (row) => row.datePublication ? (
        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {formatDate(row.datePublication)}
        </span>
      ) : <span className="text-xs text-slate-300">—</span>,
    },
    {
      key: 'vue',
      label: 'Vues',
      render: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Eye className="h-3.5 w-3.5 text-slate-400" /> {row.vue}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={`/actualites/${row.slug}`}
          editHref={`/admin/actualites/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.titre}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Actualités"
        description="Gérez les articles et communiqués"
        createHref="/admin/actualites/new"
        createLabel="Nouvelle actualité"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher une actualité…"
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
        emptyTitle="Aucune actualité"
        emptyDesc="Créez votre première actualité."
      />
    </div>
  );
}
