'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Map } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/Spinner';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { documentsService } from '@/services/documents.service';

export default function PlanificationRegionalePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['documents-regionaux'],
    queryFn: () => documentsService.getAll({ limit: 50, typePlanification: 'REGIONALE', statut: 'publie' }),
    staleTime: 3 * 60 * 1000,
  });

  const handleDownload = async (doc: { id: string; fichier: string }) => {
    try {
      await documentsService.incrementDownload(doc.id);
    } catch {
      // Le téléchargement reste disponible si le compteur échoue.
    }
    try {
      await documentsService.download(doc.id);
    } catch (error: any) {
      alert(error?.message || 'Téléchargement impossible');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <Breadcrumb items={[{ label: 'Documentation', href: '/documentation' }, { label: 'Planification régionale' }]} />
          <SectionTitle title="Planification régionale" subtitle="Documents de planification au niveau de la région de Ziguinchor" className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {isLoading ? (
          <LoadingState message="Chargement des documents…" />
        ) : !data?.data?.length ? (
          <EmptyState title="Aucun document régional" description="Aucun document de planification régionale n'est disponible pour le moment." icon={<Map className="h-12 w-12" />} />
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">{data.total} document{data.total > 1 ? 's' : ''} de planification régionale</p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((doc) => <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} />)}
            </div>
          </>
        )}
        <div className="mt-10">
          <Link href="/documentation/planification-territoriale" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">→ Voir la planification territoriale</Link>
        </div>
      </div>
    </div>
  );
}
