'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { projetsService } from '@/services/projets.service';
import { adminProjets } from '@/services/admin.service';
import { usePagination } from '@/hooks/usePagination';
import { STATUT_PROJET } from '@/constants';
import type { Projet } from '@/types';

const STATUT_OPTIONS = Object.entries(STATUT_PROJET).map(([v, s]) => ({ value: v, label: s.label }));

export default function AdminProjetsPage() {
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projets', { page, limit, search, statut }],
    queryFn: () => projetsService.getAll({ page, limit, search: search || undefined, statut: statut || undefined }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminProjets.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projets'] }),
  });

  const columns: Column<Projet>[] = [
    {
      key: 'titre',
      label: 'Projet',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{row.titre}</p>
          <p className="text-xs text-gray-400 mt-0.5">{row.secteur?.nom}</p>
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => {
        const s = STATUT_PROJET[row.statut];
        return s ? <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span> : <span>{row.statut}</span>;
      },
    },
    {
      key: 'niveauAvancement',
      label: 'Avancement',
      render: (row) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${row.niveauAvancement}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-700 shrink-0">{row.niveauAvancement}%</span>
        </div>
      ),
    },
    {
      key: 'departement',
      label: 'Lieu',
      render: (row) => row.departement ? (
        <span className="flex flex-col text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {row.departement.nom}
          </span>
          {row.commune?.nom && <span className="pl-5 text-gray-400">{row.commune.nom}</span>}
        </span>
      ) : <span className="text-xs text-gray-300">—</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={`/projets/${row.slug}`}
          editHref={`/admin/projets/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.titre}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Projets"
        description="Gérez les projets de développement"
        createHref="/admin/projets/new"
        createLabel="Nouveau projet"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher un projet…"
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
        emptyTitle="Aucun projet"
        emptyDesc="Ajoutez votre premier projet."
      />
    </div>
  );
}
