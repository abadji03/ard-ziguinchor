'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Users, Layers, ArrowLeft, ImageIcon, MapPinned, ChevronRight, Ruler, Compass } from 'lucide-react';
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

export default function DepartementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: departement, isLoading } = useQuery({
    queryKey: ['departement-detail', id],
    queryFn: () => referencesService.getDepartementById(id),
  });

  const { data: arrondissements = [] } = useQuery({
    queryKey: ['departement-arrondissements', id],
    queryFn: () => referencesService.getArrondissements(id),
  });

  const { data: communes = [] } = useQuery({
    queryKey: ['departement-communes-detail', id],
    queryFn: () => referencesService.getCommunes(id),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement du département…" />
      </div>
    );
  }

  if (!departement) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Département introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Le département recherché n'existe pas ou a été déplacé.
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

  const deptBadge = DEPT_BADGES[departement.nom] ?? 'bg-slate-100 text-slate-800 border-slate-200';
  const densite = departement.population && departement.superficie
    ? Math.round(departement.population / departement.superficie)
    : null;

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
                { label: departement.nom },
              ]}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Département de la Région
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${deptBadge}`}>
                  Code {departement.code}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Département de {departement.nom}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal">
                {arrondissements.length} arrondissements administratifs et {communes.length} communes territoriales
              </p>
            </div>

            <Link
              href="/la-region/departements"
              className="self-start md:self-center inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors border border-slate-700 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              Tous les départements
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        {/* At-a-glance KPI metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {departement.population ? departement.population.toLocaleString('fr-FR') : '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Habitants (ANSD)</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
              <Ruler className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {departement.superficie ? departement.superficie.toLocaleString('fr-FR') : '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Superficie (km²)</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {arrondissements.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Arrondissements</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {communes.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Communes</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center mb-3">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {densite ? `${densite} hab/km²` : '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Densité moyenne</p>
          </div>
        </div>

        {/* Image principale si disponible */}
        {departement.image && (
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
            <Image
              src={departement.image}
              alt={departement.nom}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-6">
              <span className="text-white text-xs font-semibold bg-slate-900/60 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                Panorama du département de {departement.nom}
              </span>
            </div>
          </div>
        )}

        {/* Description détaillée */}
        {departement.description && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-emerald-600" />
              Présentation et Spécificités Territoriales
            </h2>
            <div className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: legacyContentToHtml(departement.description) }} />
            </div>
          </div>
        )}

        {/* Arrondissements du département */}
        {arrondissements.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-600" />
                Arrondissements de {departement.nom}
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {arrondissements.length} entités
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {arrondissements.map((arr) => {
                const arrCommunes = communes.filter((c) => c.arrondissement?.id === arr.id);
                return (
                  <Link
                    key={arr.id}
                    href={`/la-region/arrondissements/${arr.id}`}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-emerald-50/70 hover:border-emerald-300 border border-slate-200/70 transition-all group"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                        {arr.nom}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {arrCommunes.length} commune{arrCommunes.length > 1 ? 's' : ''} rattachée{arrCommunes.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Communes du département */}
        {communes.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                Communes de {departement.nom}
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {communes.length} collectivités
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {communes.map((commune) => (
                <Link
                  key={commune.id}
                  href={`/la-region/communes/${commune.id}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-emerald-50/70 hover:border-emerald-300 border border-slate-200/70 transition-all text-xs font-bold text-slate-800 group"
                >
                  {commune.image ? (
                    <div className="relative h-9 w-9 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={commune.image}
                        alt={commune.nom}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                    </div>
                  )}
                  <span className="group-hover:text-emerald-800 transition-colors truncate">
                    {commune.nom}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
