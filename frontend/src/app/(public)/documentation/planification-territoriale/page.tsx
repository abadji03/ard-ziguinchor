'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, MapPinned } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/Spinner';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/utils';
import { documentsService } from '@/services/documents.service';

export default function PlanificationTerritorialePage() {
  const [activeSection, setActiveSection] = useState<'pdc' | 'pdd'>('pdc');
  const [activeDepartement, setActiveDepartement] = useState<string | null>(null);
  const [activeCommune, setActiveCommune] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ['documents-territoriale'], queryFn: () => documentsService.getTerritoriale(), staleTime: 3 * 60 * 1000 });
  const section = data?.[activeSection] ?? [];
  const currentDepartement = section.find((item) => item.departement?.id === activeDepartement) ?? section[0];

  const selectSection = (sectionName: 'pdc' | 'pdd') => { setActiveSection(sectionName); setActiveDepartement(null); setActiveCommune(null); };
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
          <Breadcrumb items={[{ label: 'Documentation', href: '/documentation' }, { label: 'Planification territoriale' }]} />
          <SectionTitle title="Planification territoriale" subtitle="Plans de Développement Communaux (PDC) et Plans Départementaux de Développement (PDD)" className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {isLoading ? <LoadingState message="Chargement des documents…" /> : !data || (!data.pdc.length && !data.pdd.length) ? (
          <EmptyState title="Aucun document territorial" description="Aucun document de planification territoriale n'est disponible pour le moment." icon={<Building2 className="h-12 w-12" />} />
        ) : (
          <div className="space-y-8">
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              {(['pdc', 'pdd'] as const).map((item) => <button key={item} type="button" onClick={() => selectSection(item)} className={cn('rounded-lg px-5 py-2 text-sm font-medium transition-colors', activeSection === item ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary/5 hover:text-primary')}>{item === 'pdc' ? 'Plan de Développement Communal (PDC)' : 'Plan Départemental de Développement (PDD)'}</button>)}
            </div>
            {section.length === 0 ? <EmptyState title={`Aucun document ${activeSection.toUpperCase()}`} description="Aucun document n'est disponible pour le moment." icon={<MapPinned className="h-12 w-12" />} /> : currentDepartement && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="space-y-1">
                  <h3 className="mb-3 px-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Départements</h3>
                  {section.map((department) => <button key={department.departement?.id ?? 'sans-departement'} type="button" onClick={() => { setActiveDepartement(department.departement?.id ?? null); setActiveCommune(null); }} className={cn('w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors', currentDepartement.departement?.id === department.departement?.id ? 'bg-primary text-white shadow-sm' : 'text-gray-700 hover:bg-primary/5 hover:text-primary')}>{department.departement?.nom ?? 'Sans département'}</button>)}
                  {activeSection === 'pdc' && <><h3 className="mb-3 mt-6 px-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Communes</h3>{currentDepartement.communes.map((group, index) => { const key = group.commune?.id ?? `commune-${index}`; return <button key={key} type="button" onClick={() => setActiveCommune(key)} className={cn('w-full rounded-lg px-4 py-2 text-left text-sm transition-colors', activeCommune === key ? 'bg-primary/10 font-medium text-primary' : 'text-gray-600 hover:bg-primary/5 hover:text-primary')}>{group.commune?.nom ?? 'Sans commune'}</button>; })}</>}
                </aside>
                <main className="space-y-8">
                  {currentDepartement.communes.filter((group, index) => !activeCommune || (group.commune?.id ?? `commune-${index}`) === activeCommune).map((group, index) => <section key={group.commune?.id ?? `commune-${index}`}><h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900"><MapPinned className="h-5 w-5 text-primary" />{group.commune?.nom ?? 'Sans commune'}</h2><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">{group.documents.map((doc) => <DocumentCard key={doc.id} doc={doc} onDownload={handleDownload} />)}</div></section>)}
                </main>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
