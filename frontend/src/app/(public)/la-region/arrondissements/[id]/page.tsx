'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Layers, ArrowLeft, ImageIcon, MapPinned, ChevronRight } from 'lucide-react';
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
      <div className="bg-background min-h-screen">
        <LoadingState message="Chargement de l'arrondissement…" />
      </div>
    );
  }

  if (!arrondissement) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Arrondissement introuvable.</p>
          <Link
            href="/la-region/departements"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux départements
          </Link>
        </div>
      </div>
    );
  }

  const arrCommunes = communes.filter((c) => c.arrondissement?.id === arrondissement.id);
  const deptColor = DEPT_COLORS[arrondissement.departement?.nom ?? ''] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: 'La Région', href: '/la-region' },
              { label: 'Départements', href: '/la-region/departements' },
              { label: `Département de ${arrondissement.departement?.nom}`, href: arrondissement.departement ? `/la-region/departements/${arrondissement.departement.id}` : '/la-region/departements' },
              { label: arrondissement.nom },
            ]}
          />
          <SectionTitle
            title={`Arrondissement de ${arrondissement.nom}`}
            subtitle={`${arrCommunes.length} communes · Département de ${arrondissement.departement?.nom}`}
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Lien retour */}
        <Link
          href={arrondissement.departement ? `/la-region/departements/${arrondissement.departement.id}` : '/la-region/departements'}
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au département
        </Link>

        {/* Carte d'identité */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Carte d'identité
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <MapPinned className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Code</div>
              <div className="text-sm font-semibold text-gray-900">{arrondissement.code}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Building2 className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Communes</div>
              <div className="text-sm font-semibold text-gray-900">{arrCommunes.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Département</div>
              <div className="text-sm font-semibold text-gray-900">{arrondissement.departement?.nom}</div>
            </div>
          </div>
        </div>

        {/* Description détaillée */}
        {arrondissement.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              À propos de l'arrondissement
            </h2>
            <div className="prose-content text-sm">
              <div dangerouslySetInnerHTML={{ __html: legacyContentToHtml(arrondissement.description) }} />
            </div>
          </div>
        )}

        {/* Communes de l'arrondissement */}
        {arrCommunes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Communes de l'arrondissement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {arrCommunes.map((commune) => (
                <Link
                  key={commune.id}
                  href={`/la-region/communes/${commune.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 hover:border-primary/30 border border-transparent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {commune.image ? (
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={commune.image}
                          alt={commune.nom}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{commune.nom}</div>
                      <div className="text-xs text-gray-500">{commune.code}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Badge département */}
        <div className="text-center">
          <Link
            href={arrondissement.departement ? `/la-region/departements/${arrondissement.departement.id}` : '/la-region/departements'}
            className={cn('inline-flex items-center px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition-opacity', deptColor)}
          >
            Département de {arrondissement.departement?.nom}
          </Link>
        </div>
      </div>
    </div>
  );
}