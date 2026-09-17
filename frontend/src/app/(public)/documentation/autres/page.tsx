'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderOpen, Search } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/Spinner';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { usePagination } from '@/hooks/usePagination';
import { documentsService } from '@/services/documents.service';

export default function AutresDocumentsPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(12);
  const { data, isLoading } = useQuery({
    queryKey: ['documents-autres', { page, limit, search }],
    queryFn: () => documentsService.getAll({ page, limit, search: search || undefined, typePlanification: 'AUTRE', statut: 'publie' }),
    staleTime: 3 * 60 * 1000,
  });

  const handleDownload = async (doc: { id: string; fichier: string }) => {
    try { await documentsService.incrementDownload(doc.id); } catch { /* le fichier reste téléchargeable */ }
    try { await documentsService.download(doc.id); } catch (error: any) { alert(error?.message || 'Téléchargement impossible'); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <Breadcrumb items={[{ label: 'Documentation', href: '/documentation' }, { label: 'Autres documents' }]} />
          <SectionTitle title="Autres documents" subtitle="Rapports, études, guides et ressources diverses" className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6"><Input placeholder="Rechercher un document…" value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} icon={<Search className="h-4 w-4" />} className="max-w-md" /></div>
        {isLoading ? <LoadingState message="Chargement des documents…" /> : !data?.data?.length ? (
          <EmptyState title="Aucun document" description="Aucun document ne correspond à votre recherche." icon={<FolderOpen className="h-12 w-12" />} />
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">{data.total} document{data.total > 1 ? 's' : ''} disponible{data.total > 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((doc) => <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} />)}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
