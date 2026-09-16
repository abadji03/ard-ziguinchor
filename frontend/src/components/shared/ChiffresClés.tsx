'use client';

import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';
import { Building, Map, Award, TrendingUp } from 'lucide-react';

const FALLBACK_STATS = [
  {
    id: 'dep',
    valeur: '3',
    label: 'Départements',
    description: 'Ziguinchor, Bignona, Oussouye',
    icon: <Map className="h-6 w-6 text-emerald-600" />,
  },
  {
    id: 'com',
    valeur: '30',
    label: 'Collectivités Territoriales',
    description: 'Communes et conseils départementaux appuyés',
    icon: <Building className="h-6 w-6 text-amber-600" />,
  },
  {
    id: 'proj',
    valeur: '45+',
    label: 'Projets & Programmes',
    description: 'Planifiés, en exécution ou finalisés',
    icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
  },
  {
    id: 'part',
    valeur: '100%',
    label: 'Couverture Territoriale',
    description: 'Accompagnement continu en Casamance',
    icon: <Award className="h-6 w-6 text-purple-600" />,
  },
];

export function ChiffresClés() {
  const { data } = useQueryData(['chiffres-cles'], () =>
    referencesService.getChiffresCles()
  );

  const apiItems = data && data.length > 0 ? data : null;

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-100" aria-label="Chiffres clés">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Impact & Données Territoriales
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            La Région de Ziguinchor en Chiffres
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            Des indicateurs clés mesurant la dynamique de développement local et l'appui de l'ARD aux collectivités.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apiItems
            ? apiItems.map((c) => (
                <div
                  key={c.id}
                  className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-500/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-950/5 transition-all group"
                >
                  <div className="text-3xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {c.valeur}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{c.label}</div>
                  {c.description && (
                    <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {c.description}
                    </div>
                  )}
                </div>
              ))
            : FALLBACK_STATS.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-500/50 hover:bg-white hover:shadow-lg hover:shadow-emerald-950/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {item.valeur}
                  </div>
                  <div className="text-sm font-bold text-slate-800">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {item.description}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
