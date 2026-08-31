'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, Clock, User, Users } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { legacyContentToHtml } from '@/lib/legacyContent';
import api from '@/lib/api';
import type { Evenement } from '@/types';

const STATUT_COLORS: Record<string, string> = {
  a_venir:  'bg-blue-100 text-blue-700',
  en_cours: 'bg-yellow-100 text-yellow-700',
  termine:  'bg-gray-100 text-gray-500',
  annule:   'bg-red-100 text-red-700',
};
const STATUT_LABELS: Record<string, string> = {
  a_venir: 'À venir', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé',
};

export default function EvenementDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;

  const { data: evt, isLoading } = useQuery({
    queryKey: ['evenement', slug],
    queryFn: async (): Promise<Evenement> => {
      const res = await api.get(`/evenements/slug/${slug}`);
      return res.data;
    },
    enabled: Boolean(slug),
  });

  return (
    <PublicLayout>
      <div className="bg-background min-h-screen">
        <div className="bg-primary py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Breadcrumb
              items={[
                { label: 'Agenda', href: '/agenda' },
                { label: evt?.titre ?? 'Événement' },
              ]}
            />
            {evt && (
              <div className="mt-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLORS[evt.statut] ?? 'bg-gray-100 text-gray-500'}`}>
                  {STATUT_LABELS[evt.statut] ?? evt.statut}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Button
            variant="ghost"
            onClick={() => router.push('/agenda')}
            className="mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l&apos;agenda
          </Button>

          {isLoading ? (
            <LoadingState message="Chargement de l'événement…" />
          ) : !evt ? (
            <EmptyState
              title="Événement introuvable"
              description="Cet événement n'existe pas ou n'est plus disponible."
              icon={<Calendar className="h-12 w-12" />}
            />
          ) : (
            <article>
              {evt.image && (
                <div className="rounded-2xl overflow-hidden mb-8">
                  <Image
                    src={evt.image}
                    alt={evt.titre}
                    width={1024}
                    height={384}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              <Card className="p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{evt.titre}</h1>
                {evt.resume && (
                  <p className="text-gray-500 mt-3 leading-relaxed">{evt.resume}</p>
                )}
                <EvenementMeta evt={evt} />
                {evt.description && (
                  <div className="mt-8">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                      Description
                    </h2>
                  <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: legacyContentToHtml(evt.description) }} />
                  </div>
                )}
              </Card>
            </article>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function EvenementMeta({ evt }: { evt: Evenement }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
        <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-gray-400 uppercase">Dates</p>
          <p className="text-sm font-medium text-gray-700">
            {formatDate(evt.dateDebut)}
            {evt.dateFin && evt.dateFin !== evt.dateDebut && ` → ${formatDate(evt.dateFin)}`}
          </p>
        </div>
      </div>

      {(evt.heureDebut || evt.heureFin) && (
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
          <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 uppercase">Horaires</p>
            <p className="text-sm font-medium text-gray-700">
              {evt.heureDebut}{evt.heureFin ? ` – ${evt.heureFin}` : ''}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-gray-400 uppercase">Lieu</p>
          <p className="text-sm font-medium text-gray-700">{evt.lieu}</p>
        </div>
      </div>

      {evt.organisateur && (
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
          <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 uppercase">Organisateur</p>
            <p className="text-sm font-medium text-gray-700">{evt.organisateur}</p>
          </div>
        </div>
      )}

      {evt.capacite ? (
        <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
          <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-400 uppercase">Capacité</p>
            <p className="text-sm font-medium text-gray-700">{evt.capacite} personnes</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
