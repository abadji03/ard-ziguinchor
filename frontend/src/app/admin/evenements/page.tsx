'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { adminEvenements } from '@/services/admin.service';
import api from '@/lib/api';
import { buildQueryString } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import type { Evenement, PaginatedResponse } from '@/types';

const STATUT_COLORS: Record<string, string> = {
  a_venir:  'bg-blue-100 text-blue-700',
  en_cours: 'bg-yellow-100 text-yellow-700',
  termine:  'bg-gray-100 text-gray-600',
  annule:   'bg-red-100 text-red-700',
};

const STATUT_LABELS: Record<string, string> = {
  a_venir: 'À venir', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé',
};

export default function AdminEvenementsPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-evenements', { page, limit, search }],
    queryFn: async (): Promise<PaginatedResponse<Evenement>> => {
      const q = buildQueryString({ page, limit, search: search || undefined });
      const res = await api.get(`/evenements?${q}`);
      return res.data;
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminEvenements.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-evenements'] }),
  });

  const columns: Column<Evenement>[] = [
    {
      key: 'titre',
      label: 'Événement',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{row.titre}</p>
          {row.organisateur && <p className="text-xs text-gray-400 mt-0.5">{row.organisateur}</p>}
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_COLORS[row.statut] ?? 'bg-gray-100 text-gray-600'}`}>
          {STATUT_LABELS[row.statut] ?? row.statut}
        </span>
      ),
    },
    {
      key: 'dateDebut',
      label: 'Date',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(row.dateDebut)}
        </span>
      ),
    },
    {
      key: 'lieu',
      label: 'Lieu',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5" /> {row.lieu}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={`/agenda`}
          editHref={`/admin/evenements/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.titre}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Événements"
        description="Agenda et manifestations"
        createHref="/admin/evenements/new"
        createLabel="Nouvel événement"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher un événement…"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
        emptyTitle="Aucun événement"
        emptyDesc="Ajoutez votre premier événement."
      />
    </div>
  );
}
