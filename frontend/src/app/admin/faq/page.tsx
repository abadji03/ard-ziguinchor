'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { referencesService } from '@/services/references.service';
import { adminFaq } from '@/services/admin.service';
import type { Faq } from '@/types';

export default function AdminFaqPage() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data: all, isLoading } = useQuery({
    queryKey: ['admin-faq'],
    queryFn: () => referencesService.getFaqs(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminFaq.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-faq'] }),
  });

  const filtered = (all ?? []).filter((f) =>
    !search || f.question.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Faq>[] = [
    {
      key: 'question',
      label: 'Question',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-md">{row.question}</p>
          <p className="text-xs text-gray-400 mt-0.5">{row.categorie?.nom}</p>
        </div>
      ),
    },
    {
      key: 'reponse',
      label: 'Réponse (aperçu)',
      render: (row) => (
        <p className="text-xs text-gray-500 truncate max-w-xs"
          dangerouslySetInnerHTML={{ __html: row.reponse.slice(0, 100) + (row.reponse.length > 100 ? '…' : '') }}
        />
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
          editHref={`/admin/faq/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel="cette question"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="FAQ"
        description="Questions fréquemment posées"
        createHref="/admin/faq/new"
        createLabel="Nouvelle question"
      />
      <SearchFilter
        search={search}
        onSearch={setSearch}
        placeholder="Rechercher une question…"
      />
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        total={filtered.length}
        emptyTitle="Aucune question"
        emptyDesc="Ajoutez votre première question."
      />
    </div>
  );
}
