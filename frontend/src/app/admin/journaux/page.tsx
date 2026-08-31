'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, LogIn, Pencil, Plus, Trash2, Eye, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { AuditLog } from '@/types';
import { AUDIT_ACTIONS } from '@/types';

const ACTION_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  CONNEXION:        { label: 'Connexion',        color: 'bg-green-100 text-green-700',   icon: <LogIn className="h-3.5 w-3.5" /> },
  ECHEC_CONNEXION:  { label: 'Échec connexion',  color: 'bg-red-100 text-red-700',       icon: <XCircle className="h-3.5 w-3.5" /> },
  CONSULTATION:     { label: 'Consultation',     color: 'bg-blue-100 text-blue-700',     icon: <Eye className="h-3.5 w-3.5" /> },
  CREATION:         { label: 'Création',         color: 'bg-emerald-100 text-emerald-700', icon: <Plus className="h-3.5 w-3.5" /> },
  MODIFICATION:     { label: 'Modification',     color: 'bg-amber-100 text-amber-700',   icon: <Pencil className="h-3.5 w-3.5" /> },
  SUPPRESSION:      { label: 'Suppression',      color: 'bg-red-100 text-red-700',       icon: <Trash2 className="h-3.5 w-3.5" /> },
};

const ACTION_OPTIONS = AUDIT_ACTIONS.map((a) => ({ value: a, label: ACTION_META[a]?.label ?? a }));

const ENTITE_LABELS: Record<string, string> = {
  auth: 'Authentification',
  'auth/users': 'Utilisateurs',
  actualites: 'Actualités',
  projets: 'Projets',
  programmes: 'Programmes',
  documents: 'Documents',
  evenements: 'Événements',
  opportunites: 'Opportunités',
  partenaires: 'Partenaires',
  faq: 'FAQ',
  galeries: 'Galeries',
  membres: 'Équipe',
  indicateurs: 'Observatoire',
  references: 'Références',
  medias: 'Médias',
  contact: 'Contact',
};

export default function AdminJournauxPage() {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit', { search, action }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (action) params.set('action', action);
      const res = await api.get(`/audit?${params}`);
      return res.data as { data: AuditLog[]; total: number };
    },
  });

  const columns: Column<AuditLog>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-900">{formatDate(row.createdAt)}</p>
          <p className="text-xs text-gray-400">
            {new Date(row.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
    },
    {
      key: 'userEmail',
      label: 'Utilisateur',
      render: (row) => <span className="text-sm text-gray-900">{row.userEmail}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => {
        const meta = ACTION_META[row.action];
        return (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${meta?.color ?? 'bg-gray-100 text-gray-600'}`}>
            {meta?.icon}
            {meta?.label ?? row.action}
          </span>
        );
      },
    },
    {
      key: 'entite',
      label: 'Entité',
      render: (row) => (
        <div>
          <p className="text-sm text-gray-700">{ENTITE_LABELS[row.entite] ?? row.entite}</p>
          {row.entiteId && <p className="text-xs text-gray-400">#{row.entiteId.slice(0, 12)}</p>}
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Détails',
      render: (row) => <span className="text-xs text-gray-500">{row.details ?? '—'}</span>,
    },
    {
      key: 'ip',
      label: 'IP',
      render: (row) => <span className="text-xs text-gray-400">{row.ip ?? '—'}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Journal des actions"
        description="Traçabilité : connexions, créations, modifications et suppressions"
      />
      <SearchFilter
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher (email, entité, détails)…"
        filters={[{ label: 'Action', value: action, options: ACTION_OPTIONS, onChange: setAction }]}
      />
      <Card>
        <div className="p-5 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <History className="h-4 w-4" />
          Les consultations ne sont journalisées que pour la gestion des utilisateurs.
        </div>
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          isLoading={isLoading}
          total={data?.total}
          emptyTitle="Aucune action enregistrée"
          emptyDesc="Le journal se remplira au fur et à mesure des actions."
        />
      </Card>
    </div>
  );
}
