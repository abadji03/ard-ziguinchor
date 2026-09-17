'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, MapPin, ChevronRight, Layers } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';

const DEPT_COLORS: Record<string, { border: string; bg: string; badge: string }> = {
  Ziguinchor: { border: 'border-blue-400', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  Bignona: { border: 'border-green-400', bg: 'bg-green-50', badge: 'bg-green-100 text-green-700' },
  Oussouye: { border: 'border-orange-400', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
};

const DEPT_DESCRIPTIONS: Record<string, { description: string; atouts: string[] }> = {
  Ziguinchor: {
    description:
      "Département chef-lieu de la région, Ziguinchor est le poumon économique de la Casamance. La ville de Ziguinchor est un carrefour commercial et culturel important, avec un port fluvial actif sur le fleuve Casamance.",
    atouts: ['Port fluvial', 'Université Assane Seck', 'Centre commercial régional', 'Aéroport international'],
  },
  Bignona: {
    description:
      "Le plus grand département de la région, Bignona est caractérisé par ses vastes forêts, ses rizières et sa façade maritime. Il abrite des zones touristiques renommées comme Kafountine.",
    atouts: ['Kafountine & tourisme balnéaire', 'Production rizicole', 'Commerce transfrontalier', 'Pêche artisanale'],
  },
  Oussouye: {
    description:
      "Département le moins peuplé mais riche en biodiversité, Oussouye est le fief de la culture diola. Il est connu pour ses bolongs, mangroves et son écotourisme.",
    atouts: ['Réserve de Pointe Saint-Georges', 'Culture Diola préservée', 'Îles et bolongs', 'Écotourisme'],
  },
};

export default function DepartementsPage() {
  const { data: departements = [], isLoading } = useQuery({
    queryKey: ['ref-departements-hierarchie'],
    queryFn: () => referencesService.getDepartements(),
  });

  const { data: arrondissements = [] } = useQuery({
    queryKey: ['ref-arrondissements-hierarchie'],
    queryFn: () => referencesService.getArrondissements(),
  });

  const { data: communes = [] } = useQuery({
    queryKey: ['ref-communes-hierarchie'],
    queryFn: () => referencesService.getCommunes(),
  });

  const totalCommunes = communes.length;
  const totalArrondissements = arrondissements.length;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-transparent to-primary-dark" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: 'La Région', href: '/la-region' },
              { label: 'Départements' },
            ]}
          />
          <div className="mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionTitle
              title="Les Départements"
              subtitle={`La région de Ziguinchor est divisée en 3 départements, ${totalArrondissements} arrondissements et ${totalCommunes} communes`}
              className="mb-0 [&_h2]:text-white [&_p]:text-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="relative -mt-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="vitrine-card hover-lift text-center px-3 py-5">
              <div className="text-3xl font-black text-primary">3</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Départements</div>
            </div>
            <div className="vitrine-card hover-lift text-center px-3 py-5">
              <div className="text-3xl font-black text-primary">{totalArrondissements}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Arrondissements</div>
            </div>
            <div className="vitrine-card hover-lift text-center px-3 py-5">
              <div className="text-3xl font-black text-primary">{totalCommunes}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">Communes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {isLoading ? (
          <LoadingState message="Chargement des départements…" />
        ) : (
          departements.map((dep) => {
            const colors = DEPT_COLORS[dep.nom] ?? { border: 'border-gray-400', bg: 'bg-gray-50', badge: 'bg-gray-100 text-gray-700' };
            const info = DEPT_DESCRIPTIONS[dep.nom] ?? { description: '', atouts: [] };
            const depArrondissements = arrondissements.filter((a) => a.departement?.id === dep.id);
            const depCommunes = communes.filter((c) => c.departement?.id === dep.id);

            return (
              <Link
                key={dep.id}
                href={`/la-region/departements/${dep.id}`}
                className={cn('vitrine-card hover-lift rounded-2xl border-l-4 overflow-hidden block', colors.border, colors.bg)}
              >
                {dep.image && (
                  <div className="relative h-56 w-full bg-gray-100">
                    <Image
                      src={dep.image}
                      alt={`Département de ${dep.nom}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/70 border border-slate-100 shadow-sm flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Département de {dep.nom}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-500">Chef-lieu : {dep.nom}</span>
                        </div>
                      </div>
                    </div>
                    <span className={cn('inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start', colors.badge)}>
                      Code : {dep.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl p-4 text-center bg-white/80 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className="text-xl font-bold text-primary">{dep.superficie?.toLocaleString('fr-FR') ?? '—'}</div>
                      <div className="text-xs text-gray-500 mt-1">km²</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="text-xl font-bold text-primary">{dep.population?.toLocaleString('fr-FR') ?? '—'}</div>
                      <div className="text-xs text-gray-500 mt-1">Habitants</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="text-xl font-bold text-primary">{depArrondissements.length}</div>
                      <div className="text-xs text-gray-500 mt-1">Arrondissements</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <div className="text-xl font-bold text-primary">{depCommunes.length}</div>
                      <div className="text-xs text-gray-500 mt-1">Communes</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{info.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Arrondissements
                      </h3>
                      <ul className="space-y-2">
                        {depArrondissements.map((arr) => {
                          const arrCommunes = depCommunes.filter((c) => c.arrondissement?.id === arr.id);
                          return (
                            <li key={arr.id} className="flex items-center gap-2 text-sm text-gray-600">
                              <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="font-medium">{arr.nom}</span>
                              <span className="text-xs text-gray-400">({arrCommunes.length} communes)</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Atouts économiques
                      </h3>
                      <ul className="space-y-2">
                        {info.atouts.map((atout) => (
                          <li key={atout} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {atout}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}

        {/* Lien communes */}
        <div className="text-center py-6">
          <Link
            href="/la-region/communes"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Users className="h-5 w-5" />
            Voir toutes les communes
          </Link>
        </div>
      </div>
    </div>
  );
}