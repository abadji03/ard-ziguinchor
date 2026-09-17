'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Building2, Users, MapPin, ChevronRight, Layers, ArrowRight, Compass, Sparkles, Ruler } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';

const DEPT_CONFIG: Record<string, { badge: string; border: string; accent: string }> = {
  Ziguinchor: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    border: 'hover:border-blue-300',
    accent: 'text-blue-700',
  },
  Bignona: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    border: 'hover:border-emerald-300',
    accent: 'text-emerald-700',
  },
  Oussouye: {
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    border: 'hover:border-amber-300',
    accent: 'text-amber-700',
  },
};

const DEPT_DESCRIPTIONS: Record<string, { description: string; atouts: string[] }> = {
  Ziguinchor: {
    description:
      "Chef-lieu et poumon économique de la région, le département de Ziguinchor est un carrefour stratégique doté d'infrastructures portuaires fluviales, universitaires et commerciales d'envergure sous-régionale. Le plus dense de la région (296 hab./km² en 2023, ANSD), il concentre 63,1 % des unités économiques régionales.",
    atouts: ['Port fluvial sur la Casamance', 'Université Assane Seck (UASZ)', 'Carrefour commercial régional', 'Aéroport international'],
  },
  Bignona: {
    description:
      "Plus vaste département de la région, Bignona se distingue par son potentiel agro-sylvo-pastoral exceptionnel, ses filières anacarde et mangue, ainsi que sa façade littorale touristique renommée. Premier département par la population (287 499 habitants, 46,6 % de la région en 2023, ANSD), il abrite aussi 20 des 30 massifs forestiers classés.",
    atouts: ['Littoral touristique de Kafountine', 'Bassin rizicole et arboricole', 'Économie transfrontalière', 'Filière anacarde et maraîchage'],
  },
  Oussouye: {
    description:
      "Cœur historique et culturel du Kassa, le département d'Oussouye conjugue traditions séculaires, écotourisme communautaire d'excellence, plages balnéaires du Cap Skirring et préservation des mangroves. Premier département touristique de la région en 2023 : 71 réceptifs hôteliers et 2 338 lits (ANSD).",
    atouts: ['Station balnéaire du Cap Skirring', 'Écotourisme villageois intégré', 'Patrimoine culturel du Kassa', 'Sanctuaire des bolongs et lamantins'],
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

  const totalCommunes = communes.length || 30;
  const totalArrondissements = arrondissements.length || 8;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'La Région', href: '/la-region' },
                { label: 'Départements' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Découpage Administratif
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Les Départements de la Région
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              La région de Ziguinchor s'articule autour de 3 départements complémentaires,
              regroupant {totalArrondissements} arrondissements et {totalCommunes} communes au service
              des populations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
        {/* KPI Essentiels Régionaux */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">3</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Départements territoriaux</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-3">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{totalArrondissements}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Arrondissements administratifs</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-3">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{totalCommunes}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Communes de plein exercice</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-3">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">617 567 hab.</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Estimation ANSD 2023</p>
          </div>
        </div>

        {/* Liste des Départements */}
        <div className="space-y-8">
          {isLoading ? (
            <LoadingState message="Chargement des départements…" />
          ) : (
            departements.map((dep) => {
              const cfg = DEPT_CONFIG[dep.nom] ?? {
                badge: 'bg-slate-100 text-slate-800 border-slate-200',
                border: 'hover:border-slate-300',
                accent: 'text-slate-700',
              };
              const info = DEPT_DESCRIPTIONS[dep.nom] ?? { description: '', atouts: [] };
              const depArrondissements = arrondissements.filter((a) => a.departement?.id === dep.id);
              const depCommunes = communes.filter((c) => c.departement?.id === dep.id);

              return (
                <div
                  key={dep.id}
                  className={cn(
                    'bg-white rounded-2xl border border-slate-200/90 hover:shadow-md transition-all overflow-hidden',
                    cfg.border
                  )}
                >
                  {dep.image && (
                    <div className="relative h-56 sm:h-64 w-full bg-slate-100">
                      <Image
                        src={dep.image}
                        alt={`Département de ${dep.nom}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 80vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                        <span className="text-white font-bold text-lg">
                          Département de {dep.nom}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-black text-slate-900">
                            Département de {dep.nom}
                          </h2>
                          <span className={cn('text-xs font-bold px-2.5 py-0.5 rounded-full border', cfg.badge)}>
                            Code {dep.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          Chef-lieu administratif : <span className="font-semibold text-slate-700">{dep.nom}</span>
                        </p>
                      </div>

                      <Link
                        href={`/la-region/departements/${dep.id}`}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-xs"
                      >
                        Consulter la fiche complète
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {/* KPIs du département */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Superficie</p>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          {dep.superficie?.toLocaleString('fr-FR') ?? '—'} <span className="text-xs font-normal text-slate-500">km²</span>
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Population</p>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          {dep.population?.toLocaleString('fr-FR') ?? '—'} <span className="text-xs font-normal text-slate-500">hab.</span>
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Arrondissements</p>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          {depArrondissements.length}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Communes</p>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          {depCommunes.length}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {info.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-emerald-600" />
                          Arrondissements rattachés
                        </h3>
                        <div className="space-y-2">
                          {depArrondissements.map((arr) => {
                            const arrCommunes = depCommunes.filter((c) => c.arrondissement?.id === arr.id);
                            return (
                              <Link
                                key={arr.id}
                                href={`/la-region/arrondissements/${arr.id}`}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 text-xs transition-colors group"
                              >
                                <span className="font-semibold text-slate-800 group-hover:text-emerald-800">
                                  {arr.nom}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {arrCommunes.length} commune{arrCommunes.length > 1 ? 's' : ''}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-emerald-600" />
                          Atouts & Pôles de développement
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {info.atouts.map((atout, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span className="truncate">{atout}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bannière de redirection vers l'annuaire des communes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Explorer les 30 Communes de la Région
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Accédez aux fiches individuelles, maires, coordonnées administratives et priorités communales.
            </p>
          </div>
          <Link
            href="/la-region/communes"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            <Users className="h-4 w-4" />
            Consulter l'annuaire des communes
          </Link>
        </div>
      </div>
    </div>
  );
}
