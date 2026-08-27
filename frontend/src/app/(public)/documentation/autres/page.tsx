'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, FileText, FolderOpen } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Card } from '@/components/ui/Card';
import { Search } from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';
import { documentsService } from '@/services/documents.service';
import { usePagination } from '@/hooks/usePagination';
import { useState } from 'react';

const FORMAT_COLORS: Record<string, string> = {
  pdf:  'bg-red-100 text-red-700',
  docx: 'bg-blue-100 text-blue-700',
  xlsx: 'bg-green-100 text-green-700',
  pptx: 'bg-orange-100 text-orange-700',
};

export default function AutresDocumentsPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(12);

  const { data, isLoading } = useQuery({
    queryKey: ['documents-autres', { page, limit, search }],
    queryFn: () => documentsService.getAll({
      page,
      limit,
      search: search || undefined,
      typePlanification: 'AUTRE',
      statut: 'publie',
    }),
    staleTime: 3 * 60 * 1000,
  });

  const handleSearch = (v: string) => { setSearch(v); resetPage(); };

  const handleDownload = async (doc: { id: string; fichier: string }) => {
    // Le compteur ne doit jamais bloquer le téléchargement du fichier
    try {
      await documentsService.incrementDownload(doc.id);
    } catch {
      // ignorer l'échec de l'incrément
    }
    try {
      await documentsService.download(doc.id);
    } catch (e: any) {
      alert(e?.message || 'Téléchargement impossible');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: 'Documentation', href: '/documentation' },
              { label: 'Autres documents' },
            ]}
          />
          <SectionTitle
            title="Autres documents"
            subtitle="Rapports, études, guides et ressources diverses"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Input
            placeholder="Rechercher un document…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des documents…" />
        ) : !data?.data?.length ? (
          <EmptyState
            title="Aucun document"
            description="Aucun document ne correspond à votre recherche."
            icon={<FolderOpen className="h-12 w-12" />}
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {data.total} document{data.total > 1 ? 's' : ''} disponible{data.total > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.data.map((doc) => (
                <Card key={doc.id} hover className="flex flex-col">
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded uppercase ${FORMAT_COLORS[doc.format] ?? 'bg-gray-100 text-gray-600'}`}>
                        {doc.format}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{doc.titre}</h3>

                    {doc.resume && <p className="text-xs text-gray-500 line-clamp-2">{doc.resume}</p>}

                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      {doc.datePublication && <span>{formatDate(doc.datePublication)}</span>}
                      {doc.taille && <span>{formatFileSize(doc.taille)}</span>}
                      <span className="flex items-center gap-1 ml-auto">
                        <Download className="h-3.5 w-3.5" /> {doc.telechargements}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pb-4">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger
                    </button>
                  </div>
                </Card>
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}