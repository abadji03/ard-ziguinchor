'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Users, Layers, ArrowLeft, MapPinned } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';
import { legacyContentToHtml } from '@/lib/legacyContent';

const DEPT_COLORS: Record<string, string> = {
  Ziguinchor: 'bg-blue-100 text-blue-700',
  Bignona: 'bg-green-100 text-green-700',
  Oussouye: 'bg-orange-100 text-orange-700',
};

export default function CommuneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: commune, isLoading } = useQuery({
    queryKey: ['commune-detail', id],
    queryFn: () => referencesService.getCommuneById(id),
  });

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <LoadingState message="Chargement de la commune…" />
      </div>
    );
  }

  if (!commune) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Commune introuvable.</p>
          <Link
            href="/la-region/communes"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux communes
          </Link>
        </div>
      </div>
    );
  }

  const deptColor = DEPT_COLORS[commune.departement?.nom ?? ''] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-background min-h-screen">
      {/* Hero avec image */}
      <div className="relative bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: 'La Région', href: '/la-region' },
              { label: 'Communes', href: '/la-region/communes' },
              { label: commune.nom },
            ]}
          />
          <SectionTitle
            title={`Commune de ${commune.nom}`}
            subtitle={
              commune.arrondissement
                ? `Arrondissement de ${commune.arrondissement.nom} · Département de ${commune.departement?.nom}`
                : `Chef-lieu du département de ${commune.departement?.nom}`
            }
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Lien retour */}
        <Link
          href="/la-region/communes"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux communes
        </Link>

        {/* Image principale */}
        {commune.image && (
          <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src={commune.image}
              alt={`Commune de ${commune.nom}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Carte d'identité */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            À propos de {commune.nom}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Département</div>
              <div className="text-sm font-semibold text-gray-900">{commune.departement?.nom}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Layers className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Arrondissement</div>
              <div className="text-sm font-semibold text-gray-900">
                {commune.arrondissement?.nom ?? 'Chef-lieu'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <MapPinned className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Code</div>
              <div className="text-sm font-semibold text-gray-900">{commune.code}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Coordonnées</div>
              <div className="text-sm font-semibold text-gray-900">
                {commune.latitude && commune.longitude
                  ? `${commune.latitude.toFixed(3)}, ${commune.longitude.toFixed(3)}`
                  : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Description détaillée (Markdown) */}
        {commune.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            À propos de {commune.nom}
          </h2>
            <div className="prose-content text-sm">
              <div dangerouslySetInnerHTML={{ __html: legacyContentToHtml(commune.description) }} />
            </div>
          </div>
        )}

        {/* Données démographiques */}
        {(commune.superficie || commune.population) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Données démographiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commune.superficie && (
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {commune.superficie.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">km² de superficie</div>
                </div>
              )}
              {commune.population && (
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {commune.population.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">habitants</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Badge département */}
        <div className="text-center">
          <span className={cn('inline-flex items-center px-4 py-2 rounded-full text-sm font-medium', deptColor)}>
            Département de {commune.departement?.nom}
          </span>
        </div>
      </div>
    </div>
  );
}