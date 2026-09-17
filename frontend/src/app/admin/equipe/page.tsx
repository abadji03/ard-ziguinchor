'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { referencesService } from '@/services/references.service';
import { adminMembres } from '@/services/admin.service';
import { useQueryClient as useQC } from '@tanstack/react-query';
import type { Membre } from '@/types';

export default function AdminEquipePage() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data: all, isLoading } = useQuery({
    queryKey: ['admin-membres'],
    queryFn: () => referencesService.getMembres(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminMembres.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-membres'] }),
  });

  const filtered = (all ?? []).filter((m) =>
    !search || `${m.prenom} ${m.nom} ${m.fonction}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Membre>[] = [
    {
      key: 'nom',
      label: 'Membre',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/60 shrink-0 overflow-hidden flex items-center justify-center">
            {row.photo
              ? <Image src={row.photo} alt={`${row.prenom} ${row.nom}`} width={36} height={36} className="object-cover w-full h-full" />
              : <span className="text-xs font-bold text-emerald-700">{row.prenom.charAt(0)}{row.nom.charAt(0)}</span>}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.prenom} {row.nom}</p>
            <p className="text-xs text-emerald-700 font-medium mt-0.5">{row.fonction}</p>
            {row.direction && (
              <p className="text-[11px] text-gray-400 mt-0.5">{row.direction}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Contact',
      render: (row) => (
        <div className="space-y-0.5">
          {row.email && (
            <a href={`mailto:${row.email}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 transition-colors">
              <Mail className="h-3 w-3" /> {row.email}
            </a>
          )}
          {row.telephone && (
            <a href={`tel:${row.telephone}`} className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 transition-colors">
              <Phone className="h-3 w-3" /> {row.telephone}
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${row.actif ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-slate-100 text-slate-600 border border-slate-200/60'}`}>
          {row.actif ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'ordre',
      label: 'Ordre',
      render: (row) => <span className="text-sm text-gray-500">{row.ordre}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          editHref={`/admin/equipe/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={`${row.prenom} ${row.nom}`}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Équipe"
        description="Membres de l'équipe ARD"
        createHref="/admin/equipe/new"
        createLabel="Ajouter un membre"
      />
      <SearchFilter
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un membre…"
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        total={filtered.length}
        emptyTitle="Aucun membre"
        emptyDesc="Ajoutez votre premier membre."
      />
    </div>
  );
}
