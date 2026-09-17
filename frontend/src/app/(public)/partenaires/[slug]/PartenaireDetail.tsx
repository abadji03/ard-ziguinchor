'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Building2,
  ExternalLink,
  Handshake,
  Sparkles,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { partenairesService } from '@/services/partenaires.service';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export function PartenaireDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: p, isLoading, error } = useQuery({
    queryKey: ['partenaire', slug],
    queryFn: () => partenairesService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement de la fiche partenaire…" />
      </div>
    );
  }

  if (error || !p) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Partenaire introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            La fiche du partenaire demandée n'existe pas ou a été archivée.
          </p>
          <Link
            href="/partenaires"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux partenaires
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Réseau de Partenaires', href: '/partenaires' },
                { label: p.nom },
              ]}
            />
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                {p.type.nom}
              </span>
              {p.sigle && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {p.sigle}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {p.nom}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fiche de présentation principale */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
                {p.logo ? (
                  <div className="w-28 h-28 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-center p-3 shrink-0 shadow-2xs">
                    <Image
                      src={p.logo}
                      alt={p.nom}
                      width={100}
                      height={100}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-2xl border border-slate-200/80 bg-slate-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-10 w-10 text-slate-400" />
                  </div>
                )}

                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {p.nom}
                  </h2>
                  {p.sigle && (
                    <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">
                      {p.sigle}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Partenaire institutionnel certifié de l'ARD Ziguinchor
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Missions et Coopération avec la Région
                </h3>
                {p.description ? (
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {p.description}
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm italic">
                    Aucune description détaillée renseignée pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Coordonnées */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Coordonnées & Contact
              </h3>

              {(p.ville || p.pays) && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Siège / Localisation</p>
                    <p className="font-bold text-slate-800">
                      {[p.ville, p.pays].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {p.telephone && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Phone className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Ligne téléphonique</p>
                    <a
                      href={`tel:${p.telephone}`}
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      {p.telephone}
                    </a>
                  </div>
                </div>
              )}

              {p.email && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Mail className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Courrier électronique</p>
                    <a
                      href={`mailto:${p.email}`}
                      className="font-bold text-emerald-700 hover:underline break-all"
                    >
                      {p.email}
                    </a>
                  </div>
                </div>
              )}

              {p.siteWeb && (
                <div className="pt-2">
                  <a
                    href={p.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Visiter le site officiel
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                </div>
              )}

              {(p.facebook || p.linkedin || p.twitter) && (
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 mr-1">Réseaux :</span>
                  {p.facebook && (
                    <a
                      href={p.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <FacebookIcon />
                    </a>
                  )}
                  {p.linkedin && (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                  {p.twitter && (
                    <a
                      href={p.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors border border-sky-100"
                    >
                      <TwitterIcon />
                    </a>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/partenaires"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline p-1"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux partenaires
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

