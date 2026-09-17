'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText, Building2, MapPinned, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatFileSize } from '@/lib/utils';
import { documentsService } from '@/services/documents.service';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const FORMAT_COLORS: Record<string, string> = {
  pdf: 'bg-rose-100 text-rose-700 border-rose-200',
  docx: 'bg-blue-100 text-blue-700 border-blue-200',
  xlsx: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function PlanificationTerritorialePage() {
  const [activeSection, setActiveSection] = useState<'pdc' | 'pdd'>('pdc');
  const [activeDepartement, setActiveDepartement] = useState<string | null>(null);
  const [activeCommune, setActiveCommune] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['documents-territoriale'],
    queryFn: () => documentsService.getTerritoriale(),
    staleTime: 3 * 60 * 1000,
  });

  const section = data?.[activeSection] ?? [];
  const currentDepartement = section.find((d) => d.departement?.id === activeDepartement) ?? section[0];

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

  const selectSection = (s: 'pdc' | 'pdd') => {
    setActiveSection(s);
    setActiveDepartement(null);
    setActiveCommune(null);
  };

  const selectDepartement = (depId: string | null) => {
    setActiveDepartement(depId);
    setActiveCommune(null);
  };

  const selectCommune = (communeKey: string | null) => {
    setActiveCommune(communeKey);
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
                { label: 'Planification Territoriale' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Développement Local & Décentralisation
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Planification Territoriale (PDC & PDD)
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Accédez aux Plans de Développement Communaux (PDC) des 30 communes et aux Plans Départementaux de Développement (PDD) de Ziguinchor, Bignona et Oussouye.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des documents territoriaux…" />
          </div>
        ) : !data || (!data.pdc.length && !data.pdd.length) ? (
          <EmptyState
            title="Aucun document territorial"
            description="Aucun document de planification territoriale n'est disponible pour le moment."
            icon={<Building2 className="h-12 w-12" />}
          />
        ) : (
          <div className="space-y-8">
            {/* Sélecteur PDC / PDD */}
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
              <button
                onClick={() => selectSection('pdc')}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all',
                  activeSection === 'pdc'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                Plans Communaux (PDC) — 30 Communes
              </button>
              <button
                onClick={() => selectSection('pdd')}
                className={cn(
                  'px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all',
                  activeSection === 'pdd'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                Plans Départementaux (PDD) — 3 Départements
              </button>
            </div>

            {/* Section active */}
            {section.length === 0 ? (
              <EmptyState
                title={`Aucun document ${activeSection === 'pdc' ? 'PDC' : 'PDD'}`}
                description={`Aucun ${activeSection === 'pdc' ? 'Plan de Développement Communal' : 'Plan Départemental de Développement'} n'est disponible pour le moment.`}
                icon={<MapPinned className="h-12 w-12" />}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                {/* Navigation Latérale Départements & Communes */}
                <aside className="space-y-6">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Départements
                    </h3>
                    <div className="space-y-1.5">
                      {section.map((dep) => {
                        const isSelected = currentDepartement?.departement?.id === dep.departement?.id;
                        return (
                          <button
                            key={dep.departement?.id ?? 'sans-departement'}
                            onClick={() => selectDepartement(dep.departement?.id ?? null)}
                            className={cn(
                              'w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between',
                              isSelected
                                ? 'bg-emerald-700 text-white shadow-2xs'
                                : 'text-slate-700 hover:bg-slate-100'
                            )}
                          >
                            <span>{dep.departement?.nom ?? 'Sans département'}</span>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-200" />}
                          </button>
                        );
                      })}
                    </div>

                    {activeSection === 'pdc' && currentDepartement && (
                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Communes ({currentDepartement.communes.length})
                          </h3>
                          {activeCommune && (
                            <button
                              onClick={() => setActiveCommune(null)}
                              className="text-[11px] font-bold text-emerald-700 hover:underline"
                            >
                              Voir toutes
                            </button>
                          )}
                        </div>
                        <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                          {currentDepartement.communes.map((communeGroup, idx) => {
                            const key = communeGroup.commune?.id ?? `commune-${idx}`;
                            const isCommuneSelected = activeCommune === key;
                            return (
                              <button
                                key={key}
                                onClick={() => selectCommune(key)}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between',
                                  isCommuneSelected
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                )}
                              >
                                <span className="truncate">{communeGroup.commune?.nom ?? 'Sans commune'}</span>
                                <span className="text-[10px] opacity-75 font-normal ml-1">
                                  ({communeGroup.documents.length})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </aside>

                {/* Documents Grid */}
                <main>
                  {activeSection === 'pdc' ? (
                    <div className="space-y-8">
                      {currentDepartement.communes
                        .filter((c) => !activeCommune || (c.commune?.id ?? `commune-${currentDepartement.communes.indexOf(c)}`) === activeCommune)
                        .map((communeGroup, idx) => {
                          const key = communeGroup.commune?.id ?? `commune-${idx}`;
                          return (
                            <div key={key} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                  <MapPinned className="h-5 w-5 text-emerald-600" />
                                  Commune de {communeGroup.commune?.nom ?? 'Sans commune'}
                                </h2>
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                  {communeGroup.documents.length} document{communeGroup.documents.length > 1 ? 's' : ''}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {communeGroup.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between transition-all hover:shadow-xs group"
                                  >
                                    <div className="space-y-2.5">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                          <FileText className="h-4 w-4" />
                                        </div>
                                        <span
                                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                                            FORMAT_COLORS[doc.format] ?? 'bg-slate-100 text-slate-700 border-slate-200'
                                          }`}
                                        >
                                          {doc.format}
                                        </span>
                                      </div>
                                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 line-clamp-2 transition-colors">
                                        {doc.titre}
                                      </h3>
                                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-3">
                                        {doc.datePublication && <span>{formatDate(doc.datePublication)}</span>}
                                        {doc.taille && <span>{formatFileSize(doc.taille)}</span>}
                                      </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                                      <button
                                        onClick={() => handleDownload(doc)}
                                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
                                      >
                                        <Download className="h-3 w-3" />
                                        Télécharger
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {currentDepartement.communes.map((communeGroup, idx) => (
                        <div
                          key={communeGroup.commune?.id ?? `pdd-${idx}`}
                          className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                            Département : {communeGroup.commune?.nom ?? currentDepartement.departement?.nom}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {communeGroup.documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 p-4 transition-all hover:shadow-xs"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">
                                      {doc.titre}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                      {doc.taille ? formatFileSize(doc.taille) : 'PDF'}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shrink-0 shadow-2xs"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Télécharger
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </main>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <Link
            href="/documentation"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-700 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Centre de documentation
          </Link>
          <Link
            href="/documentation/planification-regionale"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-xs font-bold"
          >
            Consulter la planification régionale (SRAT) →
          </Link>
        </div>
      </div>
    </div>
  );
}
