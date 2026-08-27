'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import type { Evenement, PaginatedResponse } from '@/types';

const STATUT_COLORS: Record<string, string> = {
  a_venir:  'bg-blue-100 text-blue-700',
  en_cours: 'bg-yellow-100 text-yellow-700',
  termine:  'bg-gray-100 text-gray-500',
  annule:   'bg-red-100 text-red-700',
};
const STATUT_LABELS: Record<string, string> = {
  a_venir: 'À venir', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé',
};

const STATUT_OPTIONS = [
  { value: 'a_venir',  label: 'À venir'  },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine',  label: 'Terminé'  },
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
      <div className="bg-background min-h-screen">
        <div className="bg-primary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumb items={[{ label: 'Agenda' }]} />
            <SectionTitle
              title="Agenda"
              subtitle="Événements, séminaires et manifestations de l'ARD"
              className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Filtre statut */}
          <div className="flex justify-end mb-6">
            <Select
              options={STATUT_OPTIONS}
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-40"
              aria-label="Filtrer par statut"
            />
          </div>

          {isLoading ? (
            <LoadingState message="Chargement de l'agenda…" />
          ) : !data?.data?.length ? (
            <EmptyState
              title="Aucun événement"
              description="Aucun événement prévu pour le moment."
              icon={<Calendar className="h-12 w-12" />}
            />
          ) : (
            <div className="space-y-4">
              {data.data.map((evt) => (
                <Link key={evt.id} href={`/agenda/${evt.slug}`} className="block">
                <Card hover className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Date bloc */}
                    <div className="sm:w-24 shrink-0 flex sm:flex-col items-center sm:items-center justify-start gap-3 sm:gap-1 sm:text-center">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xl font-bold text-primary leading-tight">
                          {new Date(evt.dateDebut).getDate()}
                        </span>
                        <span className="text-xs text-primary/70 uppercase">
                          {new Date(evt.dateDebut).toLocaleString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_COLORS[evt.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                        {STATUT_LABELS[evt.statut] ?? evt.statut}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{evt.titre}</h3>
                      {evt.resume && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{evt.resume}</p>
                      )}

                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {formatDate(evt.dateDebut)}
                          {evt.dateFin && evt.dateFin !== evt.dateDebut && ` → ${formatDate(evt.dateFin)}`}
                        </span>
                        {(evt.heureDebut || evt.heureFin) && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {evt.heureDebut}{evt.heureFin ? ` – ${evt.heureFin}` : ''}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {evt.lieu}
                        </span>
                        {evt.organisateur && (
                          <span className="text-gray-400">
                            Organisé par : <span className="text-gray-600">{evt.organisateur}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Capacité / inscription */}
                    {evt.capacite && (
                      <div className="sm:text-right shrink-0">
                        <p className="text-xs text-gray-400">Capacité</p>
                        <p className="font-semibold text-gray-700">{evt.capacite} pers.</p>
                      </div>
                    )}
                  </div>
                </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
