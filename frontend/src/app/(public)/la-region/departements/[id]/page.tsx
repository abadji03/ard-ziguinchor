'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Building2, Users, Layers, ArrowLeft, ImageIcon, MapPinned, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';

const DEPT_COLORS: Record<string, string> = {
  Ziguinchor: 'bg-blue-100 text-blue-700',
  Bignona: 'bg-green-100 text-green-700',
  Oussouye: 'bg-orange-100 text-orange-700',
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
      <div className="bg-background min-h-screen">
        <LoadingState message="Chargement du département…" />
      </div>
    );
  }

  if (!departement) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Département introuvable.</p>
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

  const deptColor = DEPT_COLORS[departement.nom] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: 'La Région', href: '/la-region' },
              { label: 'Départements', href: '/la-region/departements' },
              { label: departement.nom },
            ]}
          />
          <SectionTitle
            title={`Département de ${departement.nom}`}
            subtitle={`${arrondissements.length} arrondissements · ${communes.length} communes`}
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Lien retour */}
        <Link
          href="/la-region/departements"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux départements
        </Link>

        {/* Image principale */}
        {departement.image && (
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src={departement.image}
              alt={departement.nom}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>
        )}

        {/* Carte d'identité */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Carte d'identité
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <MapPinned className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Code</div>
              <div className="text-sm font-semibold text-gray-900">{departement.code}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Layers className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Arrondissements</div>
              <div className="text-sm font-semibold text-gray-900">{arrondissements.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Building2 className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Communes</div>
              <div className="text-sm font-semibold text-gray-900">{communes.length}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-xs text-gray-500 mb-1">Population</div>
              <div className="text-sm font-semibold text-gray-900">
                {departement.population ? departement.population.toLocaleString('fr-FR') : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Description détaillée */}
        {departement.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              À propos du département
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              {departement.description.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return (
                    <h3 key={i} className="text-base font-bold text-gray-900 mt-6 mb-3 first:mt-0">
                      {line.replace('## ', '')}
                    </h3>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={i} className="ml-4 text-sm leading-relaxed">
                      {line.replace('- ', '')}
                    </li>
                  );
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-2" />;
                }
                return (
                  <p key={i} className="text-sm leading-relaxed mb-2">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* Données démographiques */}
        {(departement.superficie || departement.population) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Données démographiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departement.superficie && (
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {departement.superficie.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">km² de superficie</div>
                </div>
              )}
              {departement.population && (
                <div className="bg-primary/5 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {departement.population.toLocaleString('fr-FR')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">habitants</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Arrondissements du département */}
        {arrondissements.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Arrondissements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {arrondissements.map((arr) => {
                const arrCommunes = communes.filter((c) => c.arrondissement?.id === arr.id);
                return (
                  <Link
                    key={arr.id}
                    href={`/la-region/arrondissements/${arr.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary/5 hover:border-primary/30 border border-transparent transition-all group"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{arr.nom}</div>
                      <div className="text-xs text-gray-500">{arrCommunes.length} communes</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Communes du département */}
        {communes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Communes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {communes.map((commune) => (
                <Link
                  key={commune.id}
                  href={`/la-region/communes/${commune.id}`}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl hover:bg-primary/5 hover:border-primary/30 border border-transparent transition-all text-sm font-medium text-gray-700"
                >
                  {commune.image ? (
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={commune.image}
                        alt={commune.nom}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  {commune.nom}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="text-center">
          <span className={cn('inline-flex items-center px-4 py-2 rounded-full text-sm font-medium', deptColor)}>
            Région de Ziguinchor
          </span>
        </div>
      </div>
    </div>
  );
}