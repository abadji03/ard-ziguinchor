'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Layers, ArrowLeft, ImageIcon, MapPinned, ChevronRight, Compass, Sparkles } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';
import { legacyContentToHtml } from '@/lib/legacyContent';

const DEPT_BADGES: Record<string, string> = {
  Ziguinchor: 'bg-blue-100 text-blue-800 border-blue-200',
  Bignona: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Oussouye: 'bg-amber-100 text-amber-800 border-amber-200',
};

export default function ArrondissementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: arrondissement, isLoading } = useQuery({
    queryKey: ['arrondissement-detail', id],
    queryFn: () => referencesService.getArrondissementById(id),
  });

  const { data: communes = [] } = useQuery({
    queryKey: ['arrondissement-communes', id],
    queryFn: () => referencesService.getCommunes(),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement de l'arrondissement…" />
      </div>
    );
  }

  if (!arrondissement) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Arrondissement introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            L'arrondissement recherché n'existe pas ou a été déplacé.
          </p>
          <Link
            href="/la-region/departements"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux départements
          </Link>
        </div>
      </div>
    );
  }

  const arrCommunes = communes.filter((c) => c.arrondissement?.id === arrondissement.id);
  const deptName = arrondissement.departement?.nom ?? '';
  const deptBadge = DEPT_BADGES[deptName] ?? 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'La Région', href: '/la-region' },
                { label: 'Départements', href: '/la-region/departements' },
                {
                  label: `Département de ${deptName || 'Ziguinchor'}`,
                  href: arrondissement.departement ? `/la-region/departements/${arrondissement.departement.id}` : '/la-region/departements',
                },
                { label: arrondissement.nom },
              ]}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Circonscription Administrative
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${deptBadge}`}>
                  Département de {deptName || 'Ziguinchor'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
                Arrondissement de {arrondissement.nom}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal">
                Regroupe {arrCommunes.length} commune{arrCommunes.length > 1 ? 's' : ''} dans le département de {deptName}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0 self-start md:self-center">
              {arrondissement.departement?.id && (
                <Link
                  href={`/la-region/departements/${arrondissement.departement.id}`}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-700"
                >
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  Département de {deptName}
                </Link>
              )}
              <Link
                href="/la-region/communes"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Annuaire des communes
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        {/* Cartes KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">{arrCommunes.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Communes rattachées</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-3">
              <MapPinned className="h-5 w-5" />
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">{arrondissement.code || '—'}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Code circonscription</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight truncate">{deptName || 'Ziguinchor'}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Département de rattachement</p>
          </div>
        </div>

        {/* Description détaillée si disponible */}
        {arrondissement.description && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              À propos de l'arrondissement
            </h2>
            <div className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: legacyContentToHtml(arrondissement.description) }} />
            </div>
          </div>
        )}

        {/* Communes de l'arrondissement */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-emerald-600" />
                Communes de l'Arrondissement ({arrCommunes.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Accédez aux fiches individuelles de chaque commune administrée
              </p>
            </div>
            <Link
              href="/la-region/communes"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hidden sm:inline-flex items-center gap-1"
            >
              Voir tout l'annuaire
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {arrCommunes.map((commune) => (
              <Link
                key={commune.id}
                href={`/la-region/communes/${commune.id}`}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-300 border border-slate-200/80 transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {commune.image ? (
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={commune.image}
                        alt={commune.nom}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors truncate">
                      {commune.nom}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Code {commune.code}</span>
                      {commune.population && (
                        <>
                          <span>•</span>
                          <span>{commune.population.toLocaleString('fr-FR')} hab.</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
