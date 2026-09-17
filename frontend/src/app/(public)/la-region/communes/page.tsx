'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Users, Filter, Building2, Ruler } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';

const DEPARTEMENTS_FILTER = ['Tous', 'Ziguinchor', 'Bignona', 'Oussouye'];

const DEPT_COLORS: Record<string, string> = {
  Ziguinchor: 'bg-blue-100 text-blue-700',
  Bignona: 'bg-green-100 text-green-700',
  Oussouye: 'bg-orange-100 text-orange-700',
};

export default function CommunesPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tous');

  const { data: departements = [], isLoading } = useQuery({
    queryKey: ['ref-departements-communes'],
    queryFn: () => referencesService.getDepartements(),
  });

  const { data: arrondissements = [] } = useQuery({
    queryKey: ['ref-arrondissements-all'],
    queryFn: () => referencesService.getArrondissements(),
  });

  const { data: communes = [] } = useQuery({
    queryKey: ['ref-communes-all'],
    queryFn: () => referencesService.getCommunes(),
  });

  const filtered = communes.filter((c) => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'Tous' || c.departement?.nom === deptFilter;
    return matchSearch && matchDept;
  });

  const grouped = departements
    .filter((d) => deptFilter === 'Tous' || d.nom === deptFilter)
    .map((dep) => {
      const depCommunes = filtered.filter((c) => c.departement?.id === dep.id);
      const arrondissementsDep = arrondissements.filter((a) => a.departement?.id === dep.id);
      return {
        departement: dep,
        arrondissements: arrondissementsDep.map((arr) => ({
          arrondissement: arr,
          communes: depCommunes.filter((c) => c.arrondissement?.id === arr.id),
        })),
        communesSansArrondissement: depCommunes.filter((c) => !c.arrondissement),
      };
    })
    .filter((g) => g.arrondissements.length > 0 || g.communesSansArrondissement.length > 0);

  return (
    <div className="bg-background min-h-screen">
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-transparent to-primary-dark" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: 'La Région', href: '/la-region' },
              { label: 'Communes' },
            ]}
          />
          <SectionTitle
            title="Les Communes"
            subtitle={`${communes.length} communes réparties dans les 3 départements et 8 arrondissements de la région`}
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="vitrine-card rounded-xl border border-gray-100 p-4 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une commune…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400 shrink-0" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
            >
              {DEPARTEMENTS_FILTER.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des communes…" />
        ) : (
          <div className="space-y-10">
            {grouped.map((group) => (
              <section key={group.departement.id}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Département de {group.departement.nom}
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', DEPT_COLORS[group.departement.nom] ?? 'bg-gray-100 text-gray-600')}>
                    {group.arrondissements.reduce((acc, a) => acc + a.communes.length, 0) + group.communesSansArrondissement.length} communes
                  </span>
                </h2>

                {group.communesSansArrondissement.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Communes du chef-lieu
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.communesSansArrondissement.map((commune) => (
                        <Link
                          key={commune.id}
                          href={`/la-region/communes/${commune.id}`}
                          className="vitrine-card hover-lift rounded-xl overflow-hidden border border-gray-100 group block"
                        >
                          {commune.image && (
                            <div className="relative h-28 w-full bg-gray-100">
                              <Image
                                src={commune.image}
                                alt={commune.nom}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                                {commune.nom}
                              </h3>
                              <p className="text-xs text-gray-500">Commune du chef-lieu</p>
                              <div className="flex flex-wrap gap-3 mt-1">
                                {commune.superficie && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Ruler className="h-3 w-3" />
                                    {commune.superficie.toLocaleString('fr-FR')} km²
                                  </p>
                                )}
                                {commune.population && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {commune.population.toLocaleString('fr-FR')} hab.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {group.arrondissements.map(({ arrondissement, communes: arrCommunes }) => (
                  <div key={arrondissement.id} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Arrondissement de {arrondissement.nom}
                      <span className="text-xs font-normal text-gray-400">({arrCommunes.length} communes)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {arrCommunes.map((commune) => (
                        <Link
                          key={commune.id}
                          href={`/la-region/communes/${commune.id}`}
                          className="vitrine-card hover-lift rounded-xl overflow-hidden border border-gray-100 group block"
                        >
                          {commune.image && (
                            <div className="relative h-28 w-full bg-gray-100">
                              <Image
                                src={commune.image}
                                alt={commune.nom}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4 flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                                {commune.nom}
                              </h3>
                              <p className="text-xs text-gray-500">Arrondissement de {arrondissement.nom}</p>
                              <div className="flex flex-wrap gap-3 mt-1">
                                {commune.superficie && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Ruler className="h-3 w-3" />
                                    {commune.superficie.toLocaleString('fr-FR')} km²
                                  </p>
                                )}
                                {commune.population && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {commune.population.toLocaleString('fr-FR')} hab.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}