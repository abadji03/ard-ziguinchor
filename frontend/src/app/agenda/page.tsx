'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import type { Evenement, PaginatedResponse } from '@/types';

const STATUT_COLORS: Record<string, string> = {
  a_venir: 'bg-emerald-100 text-emerald-800 border-emerald-300/60',
  en_cours: 'bg-amber-100 text-amber-800 border-amber-300/60',
  termine: 'bg-slate-100 text-slate-600 border-slate-300/60',
  annule: 'bg-rose-100 text-rose-800 border-rose-300/60',
};

const STATUT_LABELS: Record<string, string> = {
  a_venir: 'À venir',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
};

const STATUT_TABS = [
  { value: 'a_venir', label: 'Événements à venir' },
  { value: 'en_cours', label: 'En cours aujourd’hui' },
  { value: 'termine', label: 'Éditions passées' },
];

export default function AgendaPage() {
  const [statut, setStatut] = useState('a_venir');

  const { data, isLoading } = useQuery({
    queryKey: ['evenements', statut],
    queryFn: async (): Promise<PaginatedResponse<Evenement>> => {
      const res = await api.get(`/evenements?statut=${statut}&limit=20`);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  return (
    <PublicLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* En-tête Institutionnel */}
        <div className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
            <div className="text-slate-400 mb-4">
              <Breadcrumb items={[{ label: 'Agenda & Rencontres' }]} />
            </div>

            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
                Calendrier Territorial
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Agenda des Rencontres Régionales
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Ateliers de validation des plans de développement, sessions de formation des élus,
                comités régionaux et forums économiques organisés en Casamance.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Onglets Statut */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-8">
            {STATUT_TABS.map((tab) => {
              const active = statut === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatut(tab.value)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="py-16">
              <LoadingState message="Chargement des événements de l'agenda…" />
            </div>
          ) : !data?.data?.length ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
              <EmptyState
                title="Aucun événement programmé"
                description="Aucun événement ne correspond à ce filtre pour le moment."
                icon={<Calendar className="h-12 w-12 text-slate-300" />}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {data.data.map((evt) => {
                const eventDate = new Date(evt.dateDebut);
                return (
                  <Link key={evt.id} href={`/agenda/${evt.slug}`} className="block group">
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-slate-900/5 transition-all">
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        {/* Bloc Calendrier Visuel */}
                        <div className="flex sm:flex-col items-center justify-center bg-slate-900 text-white rounded-2xl p-3.5 sm:w-24 sm:h-24 shrink-0 shadow-xs group-hover:bg-emerald-800 transition-colors">
                          <span className="text-2xl sm:text-3xl font-black leading-none">
                            {eventDate.getDate()}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 ml-2 sm:ml-0 sm:mt-1">
                            {eventDate.toLocaleString('fr-FR', { month: 'short' })}
                          </span>
                          <span className="text-[10px] text-slate-300 ml-1 sm:ml-0 hidden sm:block font-mono">
                            {eventDate.getFullYear()}
                          </span>
                        </div>

                        {/* Détails Événement */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                                STATUT_COLORS[evt.statut] ?? 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {STATUT_LABELS[evt.statut] ?? evt.statut}
                            </span>
                            {evt.organisateur && (
                              <span className="text-xs text-slate-500 font-medium truncate">
                                Par : {evt.organisateur}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {evt.titre}
                          </h3>

                          {evt.resume && (
                            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                              {evt.resume}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                              {formatDate(evt.dateDebut)}
                              {evt.dateFin && evt.dateFin !== evt.dateDebut && ` au ${formatDate(evt.dateFin)}`}
                            </span>

                            {(evt.heureDebut || evt.heureFin) && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                {evt.heureDebut}
                                {evt.heureFin ? ` – ${evt.heureFin}` : ''}
                              </span>
                            )}

                            {evt.lieu && (
                              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <MapPin className="h-3.5 w-3.5 text-amber-600" />
                                {evt.lieu}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Flèche d'action */}
                        <div className="self-end sm:self-center shrink-0">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 bg-slate-50 group-hover:bg-emerald-50 px-3 py-2 rounded-xl transition-colors">
                            <span>Détails</span>
                            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
