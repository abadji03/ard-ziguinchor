'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, History, Landmark } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { documentsService } from '@/services/documents.service';
import { usePagination } from '@/hooks/usePagination';
import Link from 'next/link';

const SOUSTYPE_LABELS: Record<string, string> = {
  SRAT: 'SRAT — Schéma Régional d’Aménagement du Territoire',
  PRDI: 'PRDI — Plan Régional de Développement Intégré',
  PIC: 'PIC — Plan d’Investissement Communal',
  PLD: 'PLD — Plan Local de Développement',
  PAR: 'PAR — Plan d’Action Régional',
  PIL: 'PIL — Programme d’Investissement Local',
  PVD: 'PVD — Plan Villageois de Développement',
  PZD: 'PZD — Plan Zonal de Développement',
};

export default function ArchivesHistoriquesPage() {
  const [search, setSearch] = useState('');
  const { page, limit, goToPage, resetPage } = usePagination(12);

  const { data, isLoading } = useQuery({
    queryKey: ['documents-historiques', { page, limit, search }],
    queryFn: () => documentsService.getAll({
      page, limit,
      search: search || undefined,
      typePlanification: 'HISTORIQUE',
      statut: 'publie',
    }),
    staleTime: 3 * 60 * 1000,
  });

  const handleDownload = async (doc: { id: string; fichier: string }) => {
    try { await documentsService.incrementDownload(doc.id); } catch { /* ignorer */ }
    try { await documentsService.download(doc.id); } catch (e: any) {
      alert(e?.message || 'Téléchargement impossible');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[
              { label: 'Accueil', href: '/' },
              { label: 'Documentation', href: '/documentation' },
              { label: 'Archives historiques' },
            ]} />
          </div>
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 mb-3">
              Instruments antérieurs à l’Acte III de la décentralisation
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Archives Historiques de Planification
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              SRAT, PRDI, PIC, PLD, PAR, PIL, PVD et PZD : les anciens instruments de planification
              décentralisée conservés à titre d’archive. Ils ne constituent pas les instruments
              actuels du Système national de planification (SDADT/PDD/PDC).
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="w-full sm:max-w-sm mb-8">
          <Input
            label=""
            type="search"
            placeholder="Rechercher un document…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="Aucune archive disponible"
            description="Les documents historiques numérisés apparaîtront ici."
            icon={<History className="h-12 w-12" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.data.map((doc) => (
                <div key={doc.id}>
                  {doc.sousType && (
                    <p className="text-[11px] font-bold text-amber-700 mb-1 flex items-center gap-1">
                      <Landmark className="h-3 w-3" />
                      {SOUSTYPE_LABELS[doc.sousType]?.split('—')[0] ?? doc.sousType}
                    </p>
                  )}
                  <DocumentCard doc={doc} onDownload={handleDownload} />
                </div>
              ))}
            </div>
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}

        <div className="mt-12 pt-6 border-t border-slate-200">
          <Link
            href="/documentation"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-700 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Centre de documentation
          </Link>
        </div>
      </div>
    </div>
  );
}