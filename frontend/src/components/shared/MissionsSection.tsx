'use client';

import Link from 'next/link';
import { Target, Users, BarChart3, Handshake, ArrowRight } from 'lucide-react';

const MISSIONS = [
  {
    icon: <Target className="h-6 w-6" />,
    badge: 'Axe 01',
    titre: 'Planification Territoriale',
    desc: "Appui à l'élaboration, la révision et la cohérence des Schémas Régionaux d'Aménagement du Territoire (SRAT), Plans Départementaux et Communaux de Développement (PCD).",
    color: 'emerald',
  },
  {
    icon: <Users className="h-6 w-6" />,
    badge: 'Axe 02',
    titre: 'Renforcement des Capacités',
    desc: "Formation continue, ingénierie administrative et assistance technique aux élus locaux, agents territoriaux et commissions de passation des marchés.",
    color: 'amber',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    badge: 'Axe 03',
    titre: 'Mobilisation des Financements',
    desc: "Montage de dossiers bancables, recherche de partenariats techniques et financiers (PTF) nationaux et internationaux, et cofinancement de projets d'intérêt régional.",
    color: 'blue',
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    badge: 'Axe 04',
    titre: 'Concertation & Synergie',
    desc: "Animation du dialogue territorial entre l'Administration centrale, les collectivités territoriales, la société civile et le secteur privé pour une convergence des actions.",
    color: 'purple',
  },
];

export function MissionsSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80" aria-label="Nos missions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60">
              Mandat Légal & Missions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Quatre Piliers Stratégiques au Cœur du Territoire
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Créée par décret dans le cadre des lois de décentralisation, l'ARD de Ziguinchor accompagne les
              décideurs locaux pour bâtir un développement équitable et résilient.
            </p>
          </div>
          <Link
            href="/a-propos"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all self-start md:self-auto"
          >
            <span>En savoir plus sur l'ARD</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MISSIONS.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    {m.icon}
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-emerald-800 transition-colors">
                  {m.titre}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                <span>Découvrir ce pôle</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
