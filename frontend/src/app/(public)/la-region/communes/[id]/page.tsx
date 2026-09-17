'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Users, Layers, ArrowLeft, MapPinned, Ruler, Compass, Sparkles } from 'lucide-react';
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

export default function CommuneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: commune, isLoading } = useQuery({
    queryKey: ['commune-detail', id],
    queryFn: () => referencesService.getCommuneById(id),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement de la commune…" />
      </div>
    );
  }

  if (!commune) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Commune introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            La commune demandée n'existe pas ou a été déplacée.
          </p>
          <Link
            href="/la-region/communes"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'annuaire des communes
          </Link>
        </div>
      </div>
    );
  }

  const deptName = commune.departement?.nom ?? '';
  const deptBadge = DEPT_BADGES[deptName] ?? 'bg-slate-100 text-slate-800 border-slate-200';
  const densite = commune.population && commune.superficie
    ? Math.round(commune.population / commune.superficie)
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
                { label: 'Communes', href: '/la-region/communes' },
                { label: commune.nom },
              ]}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Collectivité Territoriale
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${deptBadge}`}>
                  Département de {deptName || 'Ziguinchor'}
                </span>
                {commune.arrondissement && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Arr. {commune.arrondissement.nom}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
                Commune de {commune.nom}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal">
                {commune.arrondissement
                  ? `Commune rattachée à l'arrondissement de ${commune.arrondissement.nom}`
                  : `Chef-lieu communal et administratif du département de ${deptName}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0 self-start md:self-center">
              {commune.departement?.id && (
                <Link
                  href={`/la-region/departements/${commune.departement.id}`}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-700"
                >
                  <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                  Voir le département
                </Link>
              )}
              <Link
                href="/la-region/communes"
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Toutes les communes
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
        {/* At-a-glance KPI metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {commune.population ? commune.population.toLocaleString('fr-FR') : '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Population recensée</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
              <Ruler className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {commune.superficie ? commune.superficie.toLocaleString('fr-FR') : '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Superficie (km²)</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-3">
              <MapPinned className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {commune.code || '—'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Code administratif</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-3">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight truncate">
              {commune.latitude && commune.longitude
                ? `${commune.latitude.toFixed(2)}°, ${commune.longitude.toFixed(2)}°`
                : 'Ziguinchor'}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Coordonnées GPS</p>
          </div>
        </div>

        {/* Image principale */}
        {commune.image && (
          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
            <Image
              src={commune.image}
              alt={`Commune de ${commune.nom}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-6">
              <span className="text-white text-xs font-semibold bg-slate-900/60 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                Vue de la commune de {commune.nom}
              </span>
            </div>
          </div>
        )}

        {/* Description détaillée */}
        {commune.description && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Présentation de la Commune
            </h2>
            <div className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: legacyContentToHtml(commune.description) }} />
            </div>
          </div>
        )}

        {/* Données et rattachement institutionnel */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Cadre Administratif et Territorial
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Département de rattachement</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{deptName}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Arrondissement</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{commune.arrondissement?.nom ?? 'Chef-lieu'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">Densité démographique</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{densite ? `${densite} hab/km²` : 'Non disponible'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
