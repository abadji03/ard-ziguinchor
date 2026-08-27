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
          <div className="w-9 h-9 rounded-full bg-primary/10 shrink-0 overflow-hidden flex items-center justify-center">
            {row.photo
              ? <Image src={row.photo} alt={`${row.prenom} ${row.nom}`} width={36} height={36} className="object-cover w-full h-full" />
              : <span className="text-xs font-bold text-primary/50">{row.prenom.charAt(0)}{row.nom.charAt(0)}</span>}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.prenom} {row.nom}</p>
            <p className="text-xs text-primary mt-0.5">{row.fonction}</p>
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
            <a href={`mailto:${row.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary">
              <Mail className="h-3 w-3" /> {row.email}
            </a>
          )}
          {row.telephone && (
            <a href={`tel:${row.telephone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary">
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
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
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
