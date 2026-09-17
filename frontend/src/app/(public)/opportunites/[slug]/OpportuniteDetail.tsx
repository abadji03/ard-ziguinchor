'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Building2,
  ExternalLink,
  Download,
  ArrowLeft,
  Tag,
  Briefcase,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { STATUT_OPPORTUNITE } from '@/constants';
import { opportunitesService } from '@/services/opportunites.service';

const STATUT_BADGES: Record<string, string> = {
  OUVERT: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CLOTURE: 'bg-slate-100 text-slate-800 border-slate-200',
  ATTRIBUE: 'bg-blue-100 text-blue-800 border-blue-200',
  ANNULE: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function OpportuniteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: opp, isLoading, error } = useQuery({
    queryKey: ['opportunite', slug],
    queryFn: () => opportunitesService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement de l'opportunité…" />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Opportunité introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Cette offre d'emploi ou cet appel d'offres n'existe plus ou a été retiré.
          </p>
          <Link
            href="/opportunites"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux opportunités
          </Link>
        </div>
      </div>
    );
  }

  const statutConfig = STATUT_OPPORTUNITE[opp.statut] ?? { label: opp.statut, color: 'bg-slate-100 text-slate-700' };
  const statutBadge = STATUT_BADGES[opp.statut] ?? 'bg-slate-100 text-slate-800 border-slate-200';

  const isExpiringSoon =
    opp.dateLimite &&
    new Date(opp.dateLimite) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
    new Date(opp.dateLimite) > new Date();

  const isExpired = opp.dateLimite && new Date(opp.dateLimite) < new Date();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Marchés & Opportunités', href: '/opportunites' },
                { label: opp.titre },
              ]}
            />
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                {opp.type.nom}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statutBadge}`}>
                {statutConfig.label}
              </span>
              {opp.secteur && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {opp.secteur}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
              {opp.titre}
            </h1>

            <div className="flex items-center gap-2 text-slate-300 text-sm sm:text-base font-medium">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>Organisme émetteur : {opp.organisme}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Alerte échéance imminente */}
        {isExpiringSoon && !isExpired && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-4 sm:p-5 mb-8 flex items-center gap-3 shadow-2xs">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong className="font-bold">Attention, date limite imminente !</strong> Les dossiers de candidature ou soumissions doivent être envoyés avant le{' '}
              <span className="font-bold underline">{formatDate(opp.dateLimite!)}</span>.
            </div>
          </div>
        )}

        {isExpired && (
          <div className="bg-slate-100 border border-slate-300 text-slate-700 rounded-2xl p-4 sm:p-5 mb-8 flex items-center gap-3 shadow-2xs">
            <Clock className="h-5 w-5 text-slate-500 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong className="font-bold">Appel clôturé :</strong> La date limite de soumission ({formatDate(opp.dateLimite!)}) est dépassée. Les résultats seront communiqués prochainement.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu Principal */}
          <div className="lg:col-span-2 space-y-8">
            {opp.resume && (
              <div className="bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-2xl p-5 sm:p-6 text-slate-800 text-base sm:text-lg font-medium leading-relaxed shadow-2xs">
                {opp.resume}
              </div>
            )}

            {/* Description complète */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Description et Cahier des charges
              </h2>
              <div
                className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: opp.description }}
              />
            </div>

            {/* Conditions de participation */}
            {opp.conditions && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-emerald-600" />
                  Conditions d'éligibilité et critères
                </h2>
                <div
                  className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: opp.conditions }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Calendrier & Détails
              </h3>

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs font-medium">Date de parution</p>
                  <p className="font-bold text-slate-800">{formatDate(opp.datePublication)}</p>
                </div>
              </div>

              {opp.dateLimite && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Clock className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Date limite de dépôt</p>
                    <p className="font-bold text-slate-900">{formatDate(opp.dateLimite)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 text-xs sm:text-sm">
                <Building2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-400 text-xs font-medium">Commanditaire</p>
                  <p className="font-bold text-slate-800">{opp.organisme}</p>
                </div>
              </div>

              {opp.secteur && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Tag className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Domaine sectoriel</p>
                    <p className="font-bold text-slate-800">{opp.secteur}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions & Candidature */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 mb-2">Dépôt & Documents</h3>

              {opp.lienExterne && (
                <a
                  href={opp.lienExterne}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs transition-colors shadow-2xs"
                >
                  <ExternalLink className="h-4 w-4" />
                  Postuler / Accéder au portail
                </a>
              )}

              {opp.document && (
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                    <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                    {opp.document.titre || 'Dossier complet (TDR)'}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={opp.document.fichier}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-300 text-slate-700 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> Voir
                    </a>
                    <a
                      href={opp.document.fichier}
                      download
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs"
                    >
                      <Download className="h-3 w-3" /> Télécharger
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/opportunites"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline p-1"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux opportunités
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

