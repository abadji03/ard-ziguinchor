'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { actualitesService } from '@/services/actualites.service';

export function ActualiteDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: actu, isLoading, error } = useQuery({
    queryKey: ['actualite', slug],
    queryFn: () => actualitesService.getBySlug(slug),
  });

  if (isLoading) return <div className="py-20"><LoadingState message="Chargement…" /></div>;
  if (error || !actu) return (
    <div className="py-20 text-center">
      <p className="text-gray-500">Actualité introuvable.</p>
      <Link href="/actualites" className="text-primary mt-2 inline-block hover:underline">← Retour</Link>
    </div>
  );

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="bg-background min-h-screen">
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <Breadcrumb items={[{ label: 'Actualités', href: '/actualites' }, { label: actu.titre }]} />
          {actu.categorie && (
            <span
              className="mt-4 inline-block text-xs font-medium px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: actu.categorie.couleur || '#F4B400' }}
            >
              {actu.categorie.nom}
            </span>
          )}
          <h1 className="mt-3 text-2xl md:text-4xl font-extrabold text-white leading-tight">{actu.titre}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-blue-100 text-sm">
            {actu.datePublication && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatDate(actu.datePublication)}
              </span>
            )}
            {actu.tempsLecture && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {actu.tempsLecture} min de lecture
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {actu.vue} vues
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {actu.imagePrincipale && (
          <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8 shadow-xl shadow-slate-900/10">
            <Image src={actu.imagePrincipale} alt={actu.titre} fill className="object-cover" priority />
          </div>
        )}

        {actu.resume && (
          <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-secondary pl-4 mb-8 italic">
            {actu.resume}
          </p>
        )}

        <article className="prose-content vitrine-card rounded-xl p-6 md:p-8">
          <div dangerouslySetInnerHTML={{ __html: actu.contenu }} />
        </article>

        {/* Tags */}
        {actu.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 items-center">
            <Tag className="h-4 w-4 text-gray-400" />
            {actu.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Partage */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
          <Share2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Partager :</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >Facebook</a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(actu.titre)}`}
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >Twitter</a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >LinkedIn</a>
        </div>

        <Link href="/actualites" className="flex items-center gap-2 text-sm text-primary hover:underline mt-6">
          <ArrowLeft className="h-4 w-4" /> Retour aux actualités
        </Link>
      </div>
    </div>
  );
}
