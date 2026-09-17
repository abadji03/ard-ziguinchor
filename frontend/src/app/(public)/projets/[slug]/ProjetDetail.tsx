'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  Banknote,
  ArrowLeft,
  Download,
  ExternalLink,
  Target,
  CheckCircle2,
  FileText,
  Building2,
  Sparkles,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { STATUT_PROJET } from '@/constants';
import { projetsService } from '@/services/projets.service';

const STATUT_BADGES: Record<string, string> = {
  EN_COURS: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  TERMINE: 'bg-blue-100 text-blue-800 border-blue-200',
  PLANIFIE: 'bg-amber-100 text-amber-800 border-amber-200',
  SUSPENDU: 'bg-rose-100 text-rose-800 border-rose-200',
};

export function ProjetDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: projet, isLoading, error } = useQuery({
    queryKey: ['projet', slug],
    queryFn: () => projetsService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement des détails du projet…" />
      </div>
    );
  }

  if (error || !projet) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Projet introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Le projet demandé n'existe pas ou a été retiré de la publication.
          </p>
          <Link
            href="/projets"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const statutConfig = STATUT_PROJET[projet.statut] ?? { label: projet.statut, color: 'bg-slate-100 text-slate-700' };
  const statutBadge = STATUT_BADGES[projet.statut] ?? 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Projets de développement', href: '/projets' },
                { label: projet.titre },
              ]}
            />
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statutBadge}`}>
                {statutConfig.label}
              </span>
              {projet.secteur && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                  {projet.secteur.nom}
                </span>
              )}
              {projet.code && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Code : {projet.code}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {projet.titre}
            </h1>

            {projet.resume && (
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                {projet.resume}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* KPI Essentiels du Projet */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 -mt-16 sm:-mt-20 mb-10 relative z-10">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avancement</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">
              {projet.niveauAvancement ?? 0} %
            </p>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${projet.niveauAvancement ?? 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Global</span>
              <Banknote className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight truncate">
              {projet.budget ? `${projet.budget.toLocaleString('fr-FR')}` : 'Non précisé'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {projet.devise || 'FCFA'}{' '}
              {projet.budgetExecute ? `(Exécuté : ${projet.budgetExecute.toLocaleString('fr-FR')})` : ''}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bénéficiaires</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">
              {projet.beneficiaires ? projet.beneficiaires.toLocaleString('fr-FR') : 'Populations'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Impact direct & indirect</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Localisation</span>
              <MapPin className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 leading-tight truncate">
              {projet.departement?.nom || 'Régionale'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium truncate">
              {projet.commune?.nom ? `Commune de ${projet.commune.nom}` : 'Couverture territoriale'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu Principal */}
          <div className="lg:col-span-2 space-y-8">
            {projet.imagePrincipale && (
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
                <Image
                  src={projet.imagePrincipale}
                  alt={projet.titre}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Description détaillée */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Présentation du projet
              </h2>
              <div
                className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: projet.description }}
              />
            </div>

            {/* Objectifs */}
            {projet.objectifs && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Objectifs stratégiques & opérationnels
                </h2>
                <div
                  className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: projet.objectifs }}
                />
              </div>
            )}

            {/* Résultats attendus ou atteints */}
            {projet.resultats && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Résultats & Livrables
                </h2>
                <div
                  className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: projet.resultats }}
                />
              </div>
            )}
          </div>

          {/* Colonne Latérale */}
          <aside className="space-y-6">
            {/* Fiche d'identité synthétique */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Fiche d'identité
              </h3>

              {projet.departement && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Territoire d'intervention</p>
                    <p className="font-bold text-slate-800">
                      {projet.departement.nom}
                      {projet.commune ? ` · ${projet.commune.nom}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {(projet.dateDebut || projet.dateFin) && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Calendrier d'exécution</p>
                    <p className="font-bold text-slate-800">
                      {projet.dateDebut ? formatDate(projet.dateDebut) : '—'}
                      {projet.dateFin ? ` au ${formatDate(projet.dateFin)}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {projet.beneficiaires && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Users className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Bénéficiaires ciblés</p>
                    <p className="font-bold text-slate-800">{projet.beneficiaires.toLocaleString('fr-FR')} personnes</p>
                  </div>
                </div>
              )}

              {projet.budget && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Banknote className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Financement</p>
                    <p className="font-bold text-slate-800">
                      {projet.budget.toLocaleString('fr-FR')} {projet.devise || 'FCFA'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Partenaires et bailleurs */}
            {projet.partenaires && projet.partenaires.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  Partenaires & Bailleurs
                </h3>
                <ul className="divide-y divide-slate-100">
                  {projet.partenaires.map((pp, i) => (
                    <li key={i} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                      <Link
                        href={`/partenaires/${pp.partenaire.slug}`}
                        className="font-bold text-slate-800 hover:text-emerald-700 transition-colors"
                      >
                        {pp.partenaire.nom}
                      </Link>
                      {pp.role && (
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {pp.role}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documents attachés */}
            {projet.documents && projet.documents.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Documents de référence
                </h3>
                <ul className="space-y-2.5">
                  {projet.documents.map((doc) => (
                    <li key={doc.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-800 mb-2 truncate">
                        {doc.titre || 'Document technique'}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={doc.fichier}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 border border-slate-300 text-slate-700 rounded-lg font-bold text-xs hover:bg-white transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> Voir
                        </a>
                        <a
                          href={doc.fichier}
                          download
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs"
                        >
                          <Download className="h-3 w-3" /> Télécharger
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation retour */}
            <Link
              href="/projets"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline p-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au répertoire des projets
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

