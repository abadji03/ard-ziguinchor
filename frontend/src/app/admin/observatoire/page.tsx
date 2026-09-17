'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart3, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import type { Indicateur, PaginatedResponse } from '@/types';

export default function AdminObservatoirePage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-indicateurs', { page, limit, search }],
    queryFn: async (): Promise<PaginatedResponse<Indicateur>> => {
      const q = buildQueryString({ page, limit, search: search || undefined });
      const res = await api.get(`/indicateurs?${q}`);
      return res.data;
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/indicateurs/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-indicateurs'] }),
  });

  const columns: Column<Indicateur>[] = [
    {
      key: 'nom',
      label: 'Indicateur',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 truncate max-w-xs">{row.nom}</p>
          {row.secteur && <p className="text-xs text-emerald-700 font-medium mt-0.5">{row.secteur.nom}</p>}
        </div>
      ),
    },
    {
      key: 'valeur',
      label: 'Valeur',
      render: (row) => (
        <span className="font-semibold text-gray-900">
          {row.valeur.toLocaleString('fr-FR')} <span className="text-xs font-normal text-gray-400">{row.unite}</span>
        </span>
      ),
    },
    {
      key: 'annee',
      label: 'Année',
      render: (row) => <span className="text-sm text-gray-500">{row.annee}</span>,
    },
    {
      key: 'scope',
      label: 'Territoire',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.commune?.nom ?? row.departement?.nom ?? 'Région'}
        </span>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      render: (row) => <span className="text-xs text-gray-400">{row.source ?? '—'}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          editHref={`/admin/observatoire/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.nom}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Observatoire territorial"
        description="Indicateurs de développement de la région"
        createHref="/admin/observatoire/new"
        createLabel="Nouvel indicateur"
      />

      {/* Résumé visuel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total indicateurs', icon: BarChart3, value: data?.total ?? '—' },
          { label: 'Mise à jour annuelle', icon: TrendingUp, value: new Date().getFullYear() },
          { label: 'Couverture', icon: BarChart3, value: '3 départements' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 shadow-2xs">
              <item.icon className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher un indicateur…"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
        emptyTitle="Aucun indicateur"
        emptyDesc="Ajoutez votre premier indicateur territorial."
      />
    </div>
  );
}
