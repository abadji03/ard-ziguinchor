'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Briefcase } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import type { Membre } from '@/types';

export default function MembreDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const { data: membre, isLoading } = useQuery({
    queryKey: ['membre', id],
    queryFn: async (): Promise<Membre> => {
      const res = await api.get(`/membres/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });

  const nomComplet = membre ? `${membre.prenom} ${membre.nom}` : '';
  const initiales = membre ? `${membre.prenom.charAt(0)}${membre.nom.charAt(0)}` : '';

  return (
      <div className="bg-background min-h-screen">
        {/* Hero */}
        <div className="bg-primary py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Breadcrumb
              items={[
                { label: "L'ARD", href: '/a-propos' },
                { label: 'Notre Équipe', href: '/a-propos#equipe' },
                { label: nomComplet || 'Membre' },
              ]}
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <Button
            variant="ghost"
            onClick={() => router.push('/a-propos#equipe')}
            className="mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l&apos;équipe
          </Button>

          {isLoading ? (
            <LoadingState message="Chargement du profil…" />
          ) : !membre ? (
            <EmptyState
              title="Membre introuvable"
              description="Ce profil n'existe pas ou n'est plus disponible."
              icon={<Briefcase className="h-12 w-12" />}
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 p-8">
                {/* Photo */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-44 h-44 rounded-2xl bg-primary/10 overflow-hidden mb-4">
                    {membre.photo ? (
                      <Image
                        src={membre.photo}
                        alt={nomComplet}
                        width={176}
                        height={176}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary/40">
                        {initiales}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {membre.fonction}
                  </span>
                </div>

                {/* Infos */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{nomComplet}</h1>
                  <p className="text-primary font-medium mt-1">{membre.fonction}</p>

                  {membre.bio && (
                    <div className="mt-6">
                      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                        Profil
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {membre.bio}
                      </p>
                    </div>
                  )}

                  {/* Coordonnées */}
                  {(membre.email || membre.telephone) && (
                    <div className="mt-6">
                      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                        Contact
                      </h2>
                      <div className="space-y-2">
                        {membre.email && (
                          <a
                            href={`mailto:${membre.email}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
                          >
                            <Mail className="h-4 w-4 text-primary" /> {membre.email}
                          </a>
                        )}
                        {membre.telephone && (
                          <a
                            href={`tel:${membre.telephone}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
                          >
                            <Phone className="h-4 w-4 text-primary" /> {membre.telephone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
  );
}
