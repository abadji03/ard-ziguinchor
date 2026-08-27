'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { DataTable, type Column } from '@/components/admin/DataTable';
import { ActionButtons } from '@/components/admin/ActionButtons';
import { documentsService } from '@/services/documents.service';
import { adminDocuments } from '@/services/admin.service';
import { formatDate, formatFileSize } from '@/lib/utils';
import { usePagination } from '@/hooks/usePagination';
import type { Document } from '@/types';

const FORMAT_COLORS: Record<string, string> = {
  pdf: 'bg-red-100 text-red-700', docx: 'bg-blue-100 text-blue-700',
  xlsx: 'bg-green-100 text-green-700', pptx: 'bg-orange-100 text-orange-700',
};

export default function AdminDocumentsPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(10);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-documents', { page, limit, search }],
    queryFn: () => documentsService.getAll({ page, limit, search: search || undefined }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminDocuments.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-documents'] }),
  });

  const columns: Column<Document>[] = [
    {
      key: 'titre',
      label: 'Document',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-xs">{row.titre}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {row.categorie && <p className="text-xs text-gray-400">{row.categorie.nom}</p>}
            {row.typePlanification && (
              <span className="text-[10px] px-1.5 py-px rounded bg-gray-100 text-gray-600 uppercase">
                {row.typePlanification === 'TERRITORIALE' ? (row.sousType ?? 'Territorial') : row.typePlanification === 'REGIONALE' ? 'Régional' : 'Autre'}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'format',
      label: 'Format',
      render: (row) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded uppercase ${FORMAT_COLORS[row.format] ?? 'bg-gray-100 text-gray-600'}`}>
          {row.format}
        </span>
      ),
    },
    {
      key: 'taille',
      label: 'Taille',
      render: (row) => <span className="text-xs text-gray-500">{row.taille ? formatFileSize(row.taille) : '—'}</span>,
    },
    {
      key: 'telechargements',
      label: 'Téléchargements',
      render: (row) => (
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Download className="h-3.5 w-3.5" /> {row.telechargements}
        </span>
      ),
    },
    {
      key: 'datePublication',
      label: 'Date',
      render: (row) => <span className="text-xs text-gray-500">{row.datePublication ? formatDate(row.datePublication) : '—'}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'text-right w-28',
      render: (row) => (
        <ActionButtons
          viewHref={row.fichier}
          editHref={`/admin/documents/${row.id}/edit`}
          onDelete={() => deleteMut.mutateAsync(row.id)}
          deleteLabel={row.titre}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Documents"
        description="Bibliothèque de ressources"
        createHref="/admin/documents/new"
        createLabel="Ajouter un document"
      />
      <SearchFilter
        search={search}
        onSearch={(v) => { setSearch(v); resetPage(); }}
        placeholder="Rechercher un document…"
      />
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={data?.page}
        totalPages={data?.totalPages}
        onPageChange={goToPage}
        emptyTitle="Aucun document"
        emptyDesc="Ajoutez votre premier document."
      />
    </div>
  );
}
