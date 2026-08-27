'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, MapPin } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import type { Indicateur, PaginatedResponse } from '@/types';

// Années dynamiques : de l'année courante (max) vers le passé (20 ans).
// La limite supérieure est TOUJOURS l'année en cours, jamais le futur.
const CURRENT_YEAR = new Date().getFullYear();
const ANNEE_OPTIONS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i).map(a => ({ value: String(a), label: String(a) }));

export default function ObservatoirePage() {
  // Sélection par défaut : année courante
  const [annee, setAnnee] = useState(String(CURRENT_YEAR));

  const { data, isLoading } = useQuery({
    queryKey: ['indicateurs-public', annee],
    queryFn: async (): Promise<PaginatedResponse<Indicateur>> => {
      const res = await api.get(`/indicateurs?annee=${annee}&limit=50`);
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Grouper par secteur pour le graphique
  const chartData = data?.data?.reduce((acc, ind) => {
    const key = ind.secteur?.nom ?? 'Général';
    const existing = acc.find(i => i.secteur === key);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({ secteur: key, total: 1 });
    }
    return acc;
  }, [] as { secteur: string; total: number }[]) ?? [];

  return (
    <PublicLayout>
      <div className="bg-background min-h-screen">
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumb items={[{ label: 'Observatoire territorial' }]} />
            <SectionTitle
              title="Observatoire territorial"
              subtitle="Données et indicateurs de développement de la région de Ziguinchor"
              className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Filtre année */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Données pour l&apos;année <strong>{annee}</strong>
            </p>
            <Select
              options={ANNEE_OPTIONS}
              value={annee}
              onChange={(e) => setAnnee(e.target.value)}
              className="w-32"
              aria-label="Sélectionner l'année"
            />
          </div>

          {isLoading ? (
            <LoadingState message="Chargement des indicateurs…" />
          ) : !data?.data?.length ? (
            <EmptyState
              title="Aucun indicateur"
              description={`Aucune donnée disponible pour ${annee}.`}
              icon={<BarChart3 className="h-12 w-12" />}
            />
          ) : (
            <div className="space-y-8">
              {/* Résumé statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Indicateurs disponibles', value: data.total, icon: BarChart3 },
                  { label: 'Secteurs couverts', value: [...new Set(data.data.map(i => i.secteur?.nom).filter(Boolean))].length, icon: TrendingUp },
                  { label: 'Départements', value: [...new Set(data.data.map(i => i.departement?.nom).filter(Boolean))].length, icon: MapPin },
                  { label: 'Communes', value: [...new Set(data.data.map(i => i.commune?.nom).filter(Boolean))].length, icon: MapPin },
                ].map((stat, i) => (
                  <Card key={i} className="p-5 text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </Card>
                ))}
              </div>

              {/* Graphique par secteur */}
              {chartData.length > 0 && (
                <Card>
                  <div className="p-5 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Répartition par secteur</h2>
                  </div>
                  <div className="p-5">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="secteur" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                          formatter={(v) => [`${v} indicateur(s)`, 'Total']}
                        />
                        <Bar dataKey="total" fill="#F4B400" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Tableau des indicateurs */}
              <Card>
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Détail des indicateurs</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Indicateur', 'Secteur', 'Valeur', 'Unité', 'Territoire', 'Source'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.data.map((ind) => (
                        <tr key={ind.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{ind.nom}</td>
                          <td className="px-4 py-3 text-gray-500">{ind.secteur?.nom ?? '—'}</td>
                          <td className="px-4 py-3 font-semibold text-primary">{ind.valeur.toLocaleString('fr-FR')}</td>
                          <td className="px-4 py-3 text-gray-500">{ind.unite}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {ind.commune?.nom ?? ind.departement?.nom ?? 'Région'}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{ind.source ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
