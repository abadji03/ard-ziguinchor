'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Building2,
  Banknote,
  ArrowLeft,
  Download,
  ExternalLink,
  Target,
  Sparkles,
  CheckCircle2,
  FileText,
  Layers,
  Users,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { programmesService } from '@/services/programmes.service';

export function ProgrammeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: prog, isLoading, error } = useQuery({
    queryKey: ['programme', slug],
    queryFn: () => programmesService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement du programme…" />
      </div>
    );
  }

  if (error || !prog) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <Layers className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Programme introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Le programme recherché n'existe pas ou a été archivé.
          </p>
          <Link
            href="/programmes"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux programmes
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
                { label: 'Programmes de développement', href: '/programmes' },
                { label: prog.nom },
              ]}
            />
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              {prog.acronyme && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  {prog.acronyme}
                </span>
              )}
              {prog.organismePilote && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Pilote : {prog.organismePilote}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {prog.nom}
            </h1>

            {prog.resume && (
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                {prog.resume}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* KPI Essentiels du Programme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 -mt-16 sm:-mt-20 mb-10 relative z-10">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Alloué</span>
              <Banknote className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight truncate">
              {prog.budget ? `${prog.budget.toLocaleString('fr-FR')}` : 'Non précisé'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">FCFA</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Période</span>
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {prog.dateDebut ? new Date(prog.dateDebut).getFullYear() : '—'}{' '}
              {prog.dateFin ? `→ ${new Date(prog.dateFin).getFullYear()}` : ''}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {prog.dateDebut ? formatDate(prog.dateDebut) : ''}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organisme Pilote</span>
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">
              {prog.organismePilote || 'ARD Ziguinchor'}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Maîtrise d'ouvrage déléguée</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partenaires</span>
              <Users className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">
              {prog.partenaires?.length ?? 0}
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Institutions et bailleurs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu Principal */}
          <div className="lg:col-span-2 space-y-8">
            {prog.image && (
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
                <Image
                  src={prog.image}
                  alt={prog.nom}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Présentation du programme
              </h2>
              <div
                className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: prog.description }}
              />
            </div>

            {/* Objectifs */}
            {prog.objectifs && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Objectifs prioritaires & Axes d'intervention
                </h2>
                <div
                  className="prose-content text-slate-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: prog.objectifs }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Informations Clés
              </h3>

              {prog.dateDebut && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Période d'exécution</p>
                    <p className="font-bold text-slate-800">
                      {formatDate(prog.dateDebut)}{prog.dateFin ? ` au ${formatDate(prog.dateFin)}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {prog.organismePilote && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Building2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Coordination générale</p>
                    <p className="font-bold text-slate-800">{prog.organismePilote}</p>
                  </div>
                </div>
              )}

              {prog.budget && (
                <div className="flex items-start gap-3 text-xs sm:text-sm">
                  <Banknote className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-400 text-xs font-medium">Enveloppe budgétaire</p>
                    <p className="font-bold text-slate-800">
                      {prog.budget.toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Partenaires */}
            {prog.partenaires && prog.partenaires.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" />
                  Partenaires du Programme
                </h3>
                <ul className="divide-y divide-slate-100">
                  {prog.partenaires.map((pp: { partenaire: { slug: string; nom: string }; role?: string }, i: number) => (
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

            {/* Documents */}
            {prog.documents && prog.documents.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Documents & Livrables
                </h3>
                <ul className="space-y-2.5">
                  {prog.documents.map((doc) => (
                    <li key={doc.id} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                      <p className="text-xs font-bold text-slate-800 mb-2 truncate">
                        {doc.titre || 'Fiche programme'}
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

            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline p-1"
            >
              <ArrowLeft className="h-4 w-4" /> Retour aux programmes
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

