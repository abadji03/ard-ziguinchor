'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, MapPin, Building2, Calendar } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import type { Indicateur, PaginatedResponse } from '@/types';

const CURRENT_YEAR = new Date().getFullYear();
const ANNEE_OPTIONS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

export default function ObservatoirePage() {
  const [annee, setAnnee] = useState(String(CURRENT_YEAR));

  const { data, isLoading } = useQuery({
    queryKey: ['indicateurs-public', annee],
    queryFn: async (): Promise<PaginatedResponse<Indicateur>> => {
      const res = await api.get(`/indicateurs?annee=${annee}&limit=50`);
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const chartData =
    data?.data?.reduce((acc, ind) => {
      const key = ind.secteur?.nom ?? 'Général';
      const existing = acc.find((i) => i.secteur === key);
      if (existing) {
        existing.total += 1;
      } else {
        acc.push({ secteur: key, total: 1 });
      }
      return acc;
    }, [] as { secteur: string; total: number }[]) ?? [];

  return (
    <PublicLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* En-tête Institutionnel */}
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
            <div className="text-slate-400 mb-4">
              <Breadcrumb items={[{ label: 'Observatoire Territorial' }]} />
            </div>

            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
                Données & Aide à la Décision
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Observatoire Territorial de Ziguinchor
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Dispositif régional de collecte, de traitement et d'analyse des indicateurs socio-économiques
                et environnementaux pour guider les investissements publics.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Sélecteur d'année */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Millésime des données</h2>
              <p className="text-xs text-slate-500">
                Visualisation des indicateurs consolidés pour l'exercice {annee}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <select
                value={annee}
                onChange={(e) => setAnnee(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
                aria-label="Sélectionner l'année"
              >
                {ANNEE_OPTIONS.map((a) => (
                  <option key={a} value={String(a)}>
                    Année {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16">
              <LoadingState message="Chargement des indicateurs territoriaux…" />
            </div>
          ) : !data?.data?.length ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <EmptyState
                title="Aucun indicateur disponible"
                description={`Aucune donnée n'a été consolidée pour l'année ${annee}. Vous pouvez sélectionner un autre exercice.`}
                icon={<BarChart3 className="h-12 w-12 text-slate-300" />}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Cartes métriques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    label: 'Indicateurs actifs',
                    value: data.total,
                    icon: BarChart3,
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
                  },
                  {
                    label: 'Secteurs couverts',
                    value: [...new Set(data.data.map((i) => i.secteur?.nom).filter(Boolean))].length,
                    icon: TrendingUp,
                    color: 'text-blue-700 bg-blue-50 border-blue-100',
                  },
                  {
                    label: 'Départements couverts',
                    value: [...new Set(data.data.map((i) => i.departement?.nom).filter(Boolean))].length,
                    icon: Building2,
                    color: 'text-amber-700 bg-amber-50 border-amber-100',
                  },
                  {
                    label: 'Communes suivies',
                    value: [...new Set(data.data.map((i) => i.commune?.nom).filter(Boolean))].length,
                    icon: MapPin,
                    color: 'text-purple-700 bg-purple-50 border-purple-100',
                  },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${stat.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {stat.value}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Graphique de distribution */}
              {chartData.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Répartition Sectorielle
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-2">
                      Nombre d’indicateurs suivis par secteur en {annee}
                    </h2>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="secteur"
                          tick={{ fontSize: 11, fill: '#64748b' }}
                          angle={-25}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                          }}
                          formatter={(v) => [`${v} indicateur(s)`, 'Effectif']}
                        />
                        <Bar dataKey="total" fill="#047857" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tableau de consultation */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Tableau des indicateurs régionaux
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Données transmises par les services techniques déconcentrés et l'ANSD
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5 text-left">Indicateur</th>
                        <th className="px-5 py-3.5 text-left">Secteur</th>
                        <th className="px-5 py-3.5 text-left">Valeur</th>
                        <th className="px-5 py-3.5 text-left">Échelle</th>
                        <th className="px-5 py-3.5 text-left">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {data.data.map((ind) => (
                        <tr key={ind.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4 font-semibold text-slate-900">{ind.nom}</td>
                          <td className="px-5 py-4 text-xs font-medium">
                            <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                              {ind.secteur?.nom ?? 'Général'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-extrabold text-emerald-800 text-base">
                              {ind.valeur.toLocaleString('fr-FR')}
                            </span>{' '}
                            <span className="text-xs font-semibold text-slate-500">{ind.unite}</span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600">
                            {ind.commune?.nom ?? ind.departement?.nom ?? 'Échelle Régionale'}
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400 font-mono">
                            {ind.source ?? 'ARD / ANSD'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
