'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Users, Filter, Building2, Ruler, Compass, ChevronRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';

const DEPARTEMENTS_FILTER = ['Tous', 'Ziguinchor', 'Bignona', 'Oussouye'];

const DEPT_BADGES: Record<string, string> = {
  Ziguinchor: 'bg-blue-100 text-blue-800 border-blue-200',
  Bignona: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Oussouye: 'bg-amber-100 text-amber-800 border-amber-200',
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
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'La Région', href: '/la-region' },
                { label: 'Communes' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Annuaire Territorial
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Les Communes de la Région
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Accédez au répertoire officiel des 30 communes réparties dans les départements
              de Ziguinchor, Bignona et Oussouye.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Barre de Recherche et Filtres */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une commune par nom (ex: Niaguis, Djibidione, Oussouye)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {DEPARTEMENTS_FILTER.map((d) => (
                <button
                  key={d}
                  onClick={() => setDeptFilter(d)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-colors',
                    deptFilter === d
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  {d === 'Tous' ? 'Tous les départements' : d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des communes…" />
        ) : (
          <div className="space-y-12">
            {grouped.map((group) => {
              const deptBadge = DEPT_BADGES[group.departement.nom] ?? 'bg-slate-100 text-slate-800 border-slate-200';
              const totalDepCommunes = group.arrondissements.reduce((acc, a) => acc + a.communes.length, 0) + group.communesSansArrondissement.length;

              return (
                <section key={group.departement.id} className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <h2 className="text-xl font-black text-slate-900">
                        Département de {group.departement.nom}
                      </h2>
                      <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full border', deptBadge)}>
                        {totalDepCommunes} commune{totalDepCommunes > 1 ? 's' : ''}
                      </span>
                    </div>

                    <Link
                      href={`/la-region/departements/${group.departement.id}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      Détails du département
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Communes du chef-lieu */}
                  {group.communesSansArrondissement.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Chef-lieu & Communes Urbaines
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {group.communesSansArrondissement.map((commune) => (
                          <Link
                            key={commune.id}
                            href={`/la-region/communes/${commune.id}`}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-md transition-all group block shadow-xs"
                          >
                            {commune.image ? (
                              <div className="relative h-32 w-full bg-slate-100">
                                <Image
                                  src={commune.image}
                                  alt={commune.nom}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 25vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="h-16 bg-gradient-to-r from-emerald-50 to-slate-50 flex items-center justify-center border-b border-slate-100">
                                <Compass className="h-6 w-6 text-emerald-600/40" />
                              </div>
                            )}
                            <div className="p-4">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                                  {commune.nom}
                                </h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  Chef-lieu
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                                {commune.population && (
                                  <span className="flex items-center gap-1 font-medium text-slate-700">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    {commune.population.toLocaleString('fr-FR')} hab.
                                  </span>
                                )}
                                {commune.superficie && (
                                  <span className="flex items-center gap-1 font-medium text-slate-700">
                                    <Ruler className="h-3 w-3 text-slate-400" />
                                    {commune.superficie.toLocaleString('fr-FR')} km²
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Communes par arrondissement */}
                  {group.arrondissements.map(({ arrondissement, communes: arrCommunes }) => (
                    <div key={arrondissement.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          Arrondissement de {arrondissement.nom}
                          <span className="text-slate-400 font-normal lowercase">({arrCommunes.length} communes)</span>
                        </h3>
                        <Link
                          href={`/la-region/arrondissements/${arrondissement.id}`}
                          className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition-colors"
                        >
                          Fiche arrondissement &rarr;
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {arrCommunes.map((commune) => (
                          <Link
                            key={commune.id}
                            href={`/la-region/communes/${commune.id}`}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-md transition-all group block shadow-xs"
                          >
                            {commune.image ? (
                              <div className="relative h-28 w-full bg-slate-100">
                                <Image
                                  src={commune.image}
                                  alt={commune.nom}
                                  fill
                                  sizes="(max-width: 768px) 50vw, 25vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="h-12 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                                <MapPin className="h-5 w-5 text-slate-300" />
                              </div>
                            )}
                            <div className="p-4">
                              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                                {commune.nom}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                Arr. {arrondissement.nom}
                              </p>
                              <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                                {commune.population ? (
                                  <span className="flex items-center gap-1 font-medium text-slate-700">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    {commune.population.toLocaleString('fr-FR')} hab.
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Pop. en cours</span>
                                )}
                                {commune.superficie && (
                                  <span className="flex items-center gap-1 font-medium text-slate-700">
                                    <Ruler className="h-3 w-3 text-slate-400" />
                                    {commune.superficie.toLocaleString('fr-FR')} km²
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}

            {grouped.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center text-slate-400">
                <Search className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-base font-bold text-slate-800">Aucune commune ne correspond à votre recherche</p>
                <p className="text-xs text-slate-400 mt-1">Essayez un autre mot-clé ou réinitialisez le filtre département.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
