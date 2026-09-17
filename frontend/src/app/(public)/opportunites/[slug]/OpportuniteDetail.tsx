'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, Clock, Building2, ExternalLink, Download, ArrowLeft, Tag } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { STATUT_OPPORTUNITE } from '@/constants';
import { opportunitesService } from '@/services/opportunites.service';

export function OpportuniteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: opp, isLoading, error } = useQuery({
    queryKey: ['opportunite', slug],
    queryFn: () => opportunitesService.getBySlug(slug),
  });

  if (isLoading) return <div className="py-20"><LoadingState /></div>;
  if (error || !opp) return (
    <div className="py-20 text-center">
      <p className="text-gray-500">Opportunité introuvable.</p>
      <Link href="/opportunites" className="text-primary mt-2 inline-block hover:underline">← Retour</Link>
    </div>
  );

  const statut = STATUT_OPPORTUNITE[opp.statut] ?? { label: opp.statut, color: 'bg-gray-100 text-gray-700' };
  const isExpiringSoon = opp.dateLimite &&
    new Date(opp.dateLimite) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    new Date(opp.dateLimite) > new Date();

  return (
    <div className="bg-background min-h-screen">
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Breadcrumb items={[{ label: 'Opportunités', href: '/opportunites' }, { label: opp.titre }]} />
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full">
              {opp.type.nom}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statut.color}`}>
              {statut.label}
            </span>
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl">
            {opp.titre}
          </h1>
          <p className="text-blue-200 mt-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" /> {opp.organisme}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {opp.resume && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <p className="text-blue-800 text-sm leading-relaxed italic">{opp.resume}</p>
              </div>
            )}
            <div className="vitrine-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: opp.description }} />
            </div>
            {opp.conditions && (
              <div className="vitrine-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Conditions de participation</h2>
                <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: opp.conditions }} />
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="vitrine-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Informations clés</h3>
              <div className="flex gap-3 text-sm">
                <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Publié le</p>
                  <p className="font-medium">{formatDate(opp.datePublication)}</p>
                </div>
              </div>
              {opp.dateLimite && (
                <div className={`flex gap-3 text-sm rounded-lg p-3 ${isExpiringSoon ? 'bg-red-50 border border-red-200' : ''}`}>
                  <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${isExpiringSoon ? 'text-red-500' : 'text-primary'}`} />
                  <div>
                    <p className={`text-xs ${isExpiringSoon ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                      {isExpiringSoon ? '⚠️ Date limite proche' : 'Date limite'}
                    </p>
                    <p className={`font-medium ${isExpiringSoon ? 'text-red-600' : ''}`}>{formatDate(opp.dateLimite)}</p>
                  </div>
                </div>
              )}
              {opp.secteur && (
                <div className="flex gap-3 text-sm">
                  <Tag className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Secteur</p>
                    <p className="font-medium">{opp.secteur}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {opp.lienExterne && (
                <a href={opp.lienExterne} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm">
                  <ExternalLink className="h-4 w-4" /> Postuler / Accéder
                </a>
              )}
              {opp.document && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-800 truncate">{opp.document.titre || 'Document'}</p>
                  <a href={opp.document.fichier} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-colors text-sm">
                    <ExternalLink className="h-4 w-4" /> Voir le document
                  </a>
                  <a href={opp.document.fichier} download rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-primary text-primary rounded-xl font-medium hover:bg-primary hover:text-white transition-colors text-sm">
                    <Download className="h-4 w-4" /> Télécharger le dossier
                  </a>
                </div>
              )}
            </div>

            <Link href="/opportunites" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Retour aux opportunités
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
