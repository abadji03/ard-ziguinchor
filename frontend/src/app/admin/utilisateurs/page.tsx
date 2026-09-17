'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { User, PaginatedResponse } from '@/types';

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN:  'bg-purple-50 text-purple-800 border border-purple-200/60 font-semibold',
  ADMIN:        'bg-rose-50 text-rose-800 border border-rose-200/60 font-semibold',
  EDITEUR:      'bg-blue-50 text-blue-800 border border-blue-200/60 font-semibold',
  REDACTEUR:    'bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold',
  CONTRIBUTEUR: 'bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold',
};

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN',  label: 'Super Admin'  },
  { value: 'ADMIN',        label: 'Admin'         },
  { value: 'EDITEUR',      label: 'Éditeur'       },
  { value: 'REDACTEUR',    label: 'Rédacteur'     },
  { value: 'CONTRIBUTEUR', label: 'Contributeur'  },
];

export default function AdminUtilisateursPage() {
  const [search, setSearch] = useState('');
  const [role, setRole]     = useState('');
  const { user: me }        = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { search, role }],
    queryFn: async (): Promise<PaginatedResponse<User>> => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role)   params.set('role', role);
      const res = await api.get(`/auth/users?${params}`);
      return res.data;
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/auth/users/${id}`); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const columns: Column<User>[] = [
    {
      key: 'nom',
      label: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-emerald-700">{row.prenom.charAt(0)}{row.nom.charAt(0)}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.prenom} {row.nom}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Rôle',
      render: (row) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ROLE_COLORS[row.role] ?? 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
          {row.role}
        </span>
      ),
    },
    {
      key: 'actif',
      label: 'Statut',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.actif
            ? <><ShieldCheck className="h-4 w-4 text-emerald-600" /><span className="text-xs text-emerald-700 font-semibold">Actif</span></>
            : <><ShieldAlert className="h-4 w-4 text-rose-500" /><span className="text-xs text-rose-600 font-semibold">Inactif</span></>
          }
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        row.id !== me?.id ? (
          <ActionButtons
            editHref={`/admin/utilisateurs/${row.id}/edit`}
            onDelete={() => deleteMut.mutateAsync(row.id)}
            deleteLabel={`${row.prenom} ${row.nom}`}
          />
        ) : (
          <span className="text-xs text-gray-300 px-2">Vous</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Utilisateurs"
        description="Gestion des comptes et permissions"
        createHref="/admin/utilisateurs/new"
        createLabel="Nouvel utilisateur"
      />
      <SearchFilter
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher un utilisateur…"
        filters={[{ label: 'Rôle', value: role, options: ROLE_OPTIONS, onChange: setRole }]}
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        emptyTitle="Aucun utilisateur"
        emptyDesc="Créez le premier compte administrateur."
      />
    </div>
  );
}
