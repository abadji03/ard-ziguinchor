import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import type { Actualite } from '@/types';

interface ActualiteCardProps {
  actualite: Actualite;
}

export function ActualiteCard({ actualite }: ActualiteCardProps) {
  return (
    <article className="flex flex-col vitrine-card rounded-2xl border-slate-200/90 overflow-hidden hover-lift group h-full">
      {/* Image principale */}
      <div className="relative h-48 bg-slate-100 shrink-0 overflow-hidden">
        {actualite.imagePrincipale ? (
          <Image
            src={actualite.imagePrincipale}
            alt={actualite.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-slate-100 to-emerald-50 text-emerald-800">
            <span className="text-4xl opacity-40">📰</span>
          </div>
        )}

        {actualite.categorie && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-xs backdrop-blur-xs"
              style={{
                backgroundColor: actualite.categorie.couleur || '#0b5c42',
              }}
            >
              {actualite.categorie.nom}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1 justify-between">
        <div>
          <Link href={`/actualites/${actualite.slug}`} className="block">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {actualite.titre}
            </h3>
          </Link>

          {actualite.resume && (
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {truncate(actualite.resume, 120)}
            </p>
          )}

          {actualite.tags && actualite.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {actualite.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-2">
          <div className="flex items-center gap-3">
            {actualite.datePublication && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(actualite.datePublication)}
              </span>
            )}
            {actualite.tempsLecture && (
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {actualite.tempsLecture} min
              </span>
            )}
          </div>

          <Link
            href={`/actualites/${actualite.slug}`}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
          >
            <span>Lire</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
