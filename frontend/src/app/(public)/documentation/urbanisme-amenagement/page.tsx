'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Building2, Landmark } from 'lucide-react';
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
  SDAU: 'SDAU — Schéma Directeur d’Aménagement et d’Urbanisme',
  PCU: 'PCU — Plan Communal d’Urbanisme',
  PCUI: 'PCUI — Plan Communal ou Intercommunal d’Urbanisme',
  PUPA: 'PUPA — Plan d’Urbanisme des Petites Agglomérations',
  PAZ: 'PAZ — Plan d’Aménagement de Zone',
  Lotissement: 'Plan de lotissement',
};

const ONGLETS = [
  { id: 'urbain', label: 'Urbanisme (PCU, PUPA, PAZ…)', icon: Building2 },
  { id: 'poas', label: 'POAS — Occupation & affectation des sols', icon: Landmark },
] as const;

type OngletId = (typeof ONGLETS)[number]['id'];

export default function UrbanismeAmenagementPage() {
  const [search, setSearch] = useState('');
  const [onglet, setOnglet] = useState<OngletId>('urbain');
  const { page, limit, goToPage, resetPage } = usePagination(12);

  const { data, isLoading } = useQuery({
    queryKey: ['documents-urbain', onglet, { page, limit, search }],
    queryFn: () =>
      onglet === 'urbain'
        ? documentsService.getAll({
            page, limit,
            search: search || undefined,
            typePlanification: 'URBAIN',
            statut: 'publie',
          })
        : documentsService.getAll({
            page, limit,
            search: search || undefined,
            typePlanification: 'TERRITORIALE',
            sousType: 'POAS',
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
              { label: 'Urbanisme & Aménagement' },
            ]} />
          </div>
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Documents d’urbanisme — Code de l’urbanisme (2023)
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Urbanisme &amp; Opérations d’Aménagement
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Plans communaux et intercommunaux d’urbanisme (PCU/PCUI), plans d’urbanisme des
              petites agglomérations (PUPA), plans d’aménagement de zone (PAZ), plans de
              lotissement et schémas directeurs d’urbanisme (SDAU).
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Onglets par famille d’instruments */}
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
            title={onglet === 'urbain' ? "Aucun document d'urbanisme disponible" : 'Aucun POAS disponible'}
            description={
              onglet === 'urbain'
                ? 'Les documents d’urbanisme publiés par les communes et services techniques apparaîtront ici.'
                : 'Les plans d’occupation et d’affectation des sols (POAS) publiés apparaîtront ici.'
            }
            icon={onglet === 'urbain' ? <Building2 className="h-12 w-12" /> : <Landmark className="h-12 w-12" />}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.data.map((doc) => (
                <div key={doc.id}>
                  {doc.sousType && (
                    <p className="text-[11px] font-bold text-emerald-700 mb-1 flex items-center gap-1">
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