'use client';

import { useQuery } from '@tanstack/react-query';
import { Download, FileText, FolderOpen, ArrowLeft, Search, Layers, Leaf } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate, formatFileSize } from '@/lib/utils';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { documentsService } from '@/services/documents.service';
import { usePagination } from '@/hooks/usePagination';
import { useState } from 'react';
import Link from 'next/link';

const isPdf = (fichier: string, format?: string) =>
  format?.toLowerCase() === 'pdf' || /\.pdf(?:$|[?#])/i.test(fichier);

const FORMAT_COLORS: Record<string, string> = {
  pdf: 'bg-rose-100 text-rose-700 border-rose-200',
  docx: 'bg-blue-100 text-blue-700 border-blue-200',
  xlsx: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pptx: 'bg-amber-100 text-amber-700 border-amber-200',
};

const ONGLETS = [
  { id: 'AUTRE', label: 'Rapports & guides', icon: FolderOpen },
  { id: 'SECTORIEL', label: 'Plans sectoriels', icon: Layers },
  { id: 'ENVIRONNEMENT', label: 'Environnement & climat', icon: Leaf },
] as const;

type OngletId = (typeof ONGLETS)[number]['id'];

export default function AutresDocumentsPage() {
  const [search, setSearch] = useState('');
  const [onglet, setOnglet] = useState<OngletId>('AUTRE');
  const { page, limit, goToPage, resetPage } = usePagination(12);

  const { data, isLoading } = useQuery({
    queryKey: ['documents-autres', onglet, { page, limit, search }],
    queryFn: () => documentsService.getAll({
      page,
      limit,
      search: search || undefined,
      typePlanification: onglet,
      statut: 'publie',
    }),
    staleTime: 3 * 60 * 1000,
  });

  const handleSearch = (v: string) => { setSearch(v); resetPage(); };

  const handleDownload = async (doc: { id: string; fichier: string }) => {
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
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Documentation', href: '/documentation' },
                { label: 'Rapports & Guides' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Fonds Documentaire Spécialisé
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Rapports, Études & Guides
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Consultez les études sectorielles, bilans d’exécution, diagnostics territoriaux et manuels de procédures édités par l’ARD et ses partenaires techniques.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Onglets par famille */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ONGLETS.map((o) => {
            const Icon = o.icon;
            const active = onglet === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => { setOnglet(o.id); resetPage(); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  active
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {o.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="max-w-md w-full">
            <Input
              placeholder="Rechercher par titre, mot-clé, thème…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              icon={<Search className="h-4 w-4 text-slate-400" />}
              className="bg-white rounded-xl border-slate-200 shadow-2xs"
            />
          </div>
          {data && (
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              {data.total} publication{data.total > 1 ? 's' : ''} répertoriée{data.total > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des documents…" />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            title="Aucun document trouvé"
            description="Aucune publication ne correspond à vos critères de recherche pour le moment."
            icon={<FolderOpen className="h-12 w-12" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.data.map((doc) => (
                isPdf(doc.fichier, doc.format) ? (
                  <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} />
                ) : (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                          FORMAT_COLORS[doc.format] ?? 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {doc.format}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {doc.titre}
                    </h3>

                    {doc.resume && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {doc.resume}
                      </p>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                      {doc.datePublication && <span>{formatDate(doc.datePublication)}</span>}
                      {doc.taille && <span>{formatFileSize(doc.taille)}</span>}
                      <span className="flex items-center gap-1 ml-auto text-slate-500">
                        <Download className="h-3 w-3" /> {doc.telechargements}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Télécharger
                    </button>
                  </div>
                </div>
                )
              ))}
            </div>

            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={goToPage} />
          </>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
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
