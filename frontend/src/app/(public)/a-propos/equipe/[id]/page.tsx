'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Briefcase, Building2, User } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { legacyContentToHtml } from '@/lib/legacyContent';
import type { Membre } from '@/types';
import Link from 'next/link';

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
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: "L'ARD", href: '/a-propos' },
                { label: 'Équipe', href: '/a-propos#equipe' },
                { label: nomComplet || 'Membre' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Équipe Opérationnelle & Expertise
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
              {nomComplet || 'Profil du Membre'}
            </h1>
            {membre?.fonction && (
              <p className="text-base sm:text-lg text-emerald-400 font-semibold">
                {membre.fonction}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="mb-6">
          <Link
            href="/a-propos#equipe"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l&apos;équipe
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement du profil…" />
          </div>
        ) : !membre ? (
          <EmptyState
            title="Membre introuvable"
            description="Ce profil n'existe pas ou n'est plus disponible au sein de l'équipe."
            icon={<Briefcase className="h-12 w-12" />}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 p-6 sm:p-10">
              {/* Photo & Badge */}
              <div className="flex flex-col items-center text-center">
                <div className="w-44 h-44 rounded-2xl bg-slate-100 border-2 border-emerald-500/20 overflow-hidden mb-4 shadow-xs relative">
                  {membre.photo ? (
                    <Image
                      src={membre.photo}
                      alt={nomComplet}
                      width={176}
                      height={176}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-extrabold text-slate-400 bg-slate-100">
                      {initiales || <User className="h-16 w-16 text-slate-300" />}
                    </div>
                  )}
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {membre.fonction}
                </span>

                <div className="mt-6 w-full pt-6 border-t border-slate-100 space-y-2.5">
                  {membre.email && (
                    <a
                      href={`mailto:${membre.email}`}
                      className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 p-2.5 rounded-xl border border-slate-200/80 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-emerald-600" />
                      <span className="truncate">{membre.email}</span>
                    </a>
                  )}
                  {membre.telephone && (
                    <a
                      href={`tel:${membre.telephone}`}
                      className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 p-2.5 rounded-xl border border-slate-200/80 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-emerald-600" />
                      <span>{membre.telephone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Infos & Bio */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{nomComplet}</h2>
                  <p className="text-sm font-bold text-emerald-700 mt-1">{membre.fonction}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Agence Régionale de Développement de Ziguinchor</p>
                </div>

                {membre.bio && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Biographie & Domaine d&apos;Expertise
                    </h3>
                    <div
                      className="prose-content text-slate-700 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: legacyContentToHtml(membre.bio) }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

