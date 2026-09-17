'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { partenairesService } from '@/services/partenaires.service';
import { adminPartenaires } from '@/services/admin.service';
import { usePagination } from '@/hooks/usePagination';
import type { Partenaire } from '@/types';

export default function AdminPartenairesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-partenaires', { page, limit, search }],
    queryFn: () => partenairesService.getAll({ page, limit, search: search || undefined }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminPartenaires.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-partenaires'] }),
  });

  const columns: Column<Partenaire>[] = [
    {
      key: 'nom',
      label: 'Partenaire',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {row.logo
              ? <Image src={row.logo} alt={row.nom} width={36} height={36} className="object-contain p-1" />
              : <span className="text-xs font-bold text-emerald-700">{row.nom.charAt(0)}</span>}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.nom}</p>
            {row.sigle && <p className="text-xs text-slate-400 font-medium">{row.sigle}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200/60 px-2.5 py-0.5 rounded-full font-medium">{row.type.nom}</span>
      ),
    },
    {
      key: 'pays',
      label: 'Pays',
      render: (row) => <span className="text-sm text-slate-600">{row.pays ?? '—'}</span>,
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (row) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${row.statut === 'actif' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-slate-100 text-slate-600 border border-slate-200/60'}`}>
          {row.statut}
        </span>
      ),
    },
    {
      key: 'siteWeb',
      label: 'Site',
      render: (row) => row.siteWeb
        ? <a href={row.siteWeb} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 inline-block p-1 hover:bg-emerald-50 rounded-lg"><Globe className="h-4 w-4" /></a>
        : <span className="text-slate-300">—</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={`/partenaires/${row.slug}`}
          editHref={`/admin/partenaires/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.nom}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Partenaires"
        description="Gérez les partenaires techniques et financiers"
        createHref="/admin/partenaires/new"
        createLabel="Nouveau partenaire"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher un partenaire…"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
        emptyTitle="Aucun partenaire"
        emptyDesc="Ajoutez votre premier partenaire."
      />
    </div>
  );
}
