'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText, Building2, MapPinned } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatFileSize } from '@/lib/utils';
import { documentsService } from '@/services/documents.service';
import { cn } from '@/lib/utils';

const FORMAT_COLORS: Record<string, string> = {
  pdf:  'bg-red-100 text-red-700',
  docx: 'bg-blue-100 text-blue-700',
  xlsx: 'bg-green-100 text-green-700',
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
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: 'Documentation', href: '/documentation' },
              { label: 'Planification territoriale' },
            ]}
          />
          <SectionTitle
            title="Planification territoriale"
            subtitle="Plans de Développement Communaux (PDC) et Plans Départementaux de Développement (PDD)"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <LoadingState message="Chargement des documents…" />
        ) : !data || (!data.pdc.length && !data.pdd.length) ? (
          <EmptyState
            title="Aucun document territorial"
            description="Aucun document de planification territoriale n'est disponible pour le moment."
            icon={<Building2 className="h-12 w-12" />}
          />
        ) : (
          <div className="space-y-8">
            {/* Sélecteur PDC / PDD */}
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => selectSection('pdc')}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeSection === 'pdc'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                )}
              >
                Plan de Développement Communal (PDC)
              </button>
              <button
                onClick={() => selectSection('pdd')}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeSection === 'pdd'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                )}
              >
                Plan Départemental de Développement (PDD)
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
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                {/* Départements */}
                <aside className="space-y-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Départements
                  </h3>
                  {section.map((dep) => (
                    <button
                      key={dep.departement?.id ?? 'sans-departement'}
                      onClick={() => selectDepartement(dep.departement?.id ?? null)}
                      className={cn(
                        'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        currentDepartement?.departement?.id === dep.departement?.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                      )}
                    >
                      {dep.departement?.nom ?? 'Sans département'}
                    </button>
                  ))}

                  {activeSection === 'pdc' && currentDepartement && (
                    <>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3 px-2">
                        Communes
                      </h3>
                      {currentDepartement.communes.map((communeGroup, idx) => {
                        const key = communeGroup.commune?.id ?? `commune-${idx}`;
                        return (
                          <button
                            key={key}
                            onClick={() => selectCommune(key)}
                            className={cn(
                              'w-full text-left px-4 py-2 rounded-lg text-sm transition-colors',
                              activeCommune === key
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
                            )}
                          >
                            {communeGroup.commune?.nom ?? 'Sans commune'}
                          </button>
                        );
                      })}
                    </>
                  )}
                </aside>

                {/* Documents */}
                <main>
                  {activeSection === 'pdc' ? (
                    <div className="space-y-6">
                      {currentDepartement.communes
                        .filter((c) => !activeCommune || (c.commune?.id ?? `commune-${currentDepartement.communes.indexOf(c)}`) === activeCommune)
                        .map((communeGroup, idx) => {
                          const key = communeGroup.commune?.id ?? `commune-${idx}`;
                          return (
                            <div key={key}>
                              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPinned className="h-5 w-5 text-primary" />
                                {communeGroup.commune?.nom ?? 'Sans commune'}
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {communeGroup.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4 text-primary" />
                                      </div>
                                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase ${FORMAT_COLORS[doc.format] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {doc.format}
                                      </span>
                                    </div>
                                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{doc.titre}</h3>
                                    <div className="mt-auto text-xs text-gray-400 flex items-center gap-3">
                                      {doc.datePublication && <span>{formatDate(doc.datePublication)}</span>}
                                      {doc.taille && <span>{formatFileSize(doc.taille)}</span>}
                                    </div>
                                    <button
                                      onClick={() => handleDownload(doc)}
                                      className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-primary text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      Télécharger
                                    </button>
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
                          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            {communeGroup.commune?.nom ?? 'Sans commune'}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {communeGroup.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="h-4 w-4 text-primary shrink-0" />
                                  <span className="text-sm text-gray-800 truncate">{doc.titre}</span>
                                </div>
                                <button
                                  onClick={() => handleDownload(doc)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors shrink-0"
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
      </div>
    </div>
  );
}