'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Tag, ArrowLeft, Share2, Sparkles, Newspaper } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { actualitesService } from '@/services/actualites.service';

export function ActualiteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: actu, isLoading, error } = useQuery({
    queryKey: ['actualite', slug],
    queryFn: () => actualitesService.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen py-20">
        <LoadingState message="Chargement de l'article…" />
      </div>
    );
  }

  if (error || !actu) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <Newspaper className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Actualité introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">
            Cet article n'existe pas ou a été archivé.
          </p>
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Actualités & Médias', href: '/actualites' },
                { label: actu.titre },
              ]}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {actu.categorie && (
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white shadow-2xs"
                  style={{ backgroundColor: actu.categorie.couleur || '#059669' }}
                >
                  {actu.categorie.nom}
                </span>
              )}
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Communication Officielle ARD
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {actu.titre}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs sm:text-sm pt-2 border-t border-slate-800/80">
              {actu.datePublication && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  {formatDate(actu.datePublication)}
                </span>
              )}
              {actu.tempsLecture && (
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  {actu.tempsLecture} min de lecture
                </span>
              )}
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <Eye className="h-4 w-4" />
                {actu.vue ?? 0} consultation{(actu.vue ?? 0) > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Visuel principal */}
        {actu.imagePrincipale && (
          <div className="relative h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs">
            <Image
              src={actu.imagePrincipale}
              alt={actu.titre}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Chapeau / Résumé */}
        {actu.resume && (
          <div className="bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-2xl p-5 sm:p-6 text-slate-800 text-base sm:text-lg font-medium leading-relaxed shadow-2xs">
            {actu.resume}
          </div>
        )}

        {/* Corps de l'article */}
        <article className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
          <div
            className="prose-content text-slate-800 leading-relaxed text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: actu.contenu }}
          />
        </article>

        {/* Tags */}
        {actu.tags?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-slate-400" /> Mots-clés :
            </span>
            {actu.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-colors border border-slate-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Barre de partage social et retour */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Partager cet article :</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(actu.titre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                Twitter (X)
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Toutes les actualités
          </Link>
        </div>
      </div>
    </div>
  );
}

