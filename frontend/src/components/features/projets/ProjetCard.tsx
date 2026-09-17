import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import { STATUT_PROJET } from '@/constants';
import type { Projet } from '@/types';

interface ProjetCardProps {
  projet: Projet;
}

export function ProjetCard({ projet }: ProjetCardProps) {
  const statut = STATUT_PROJET[projet.statut] ?? {
    label: projet.statut,
    color: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="flex flex-col vitrine-card rounded-2xl border-slate-200/90 overflow-hidden hover-lift group h-full">
      {/* Image avec badges superposés */}
      <div className="relative h-52 bg-slate-100 shrink-0 overflow-hidden">
        {projet.imagePrincipale ? (
          <Image
            src={projet.imagePrincipale}
            alt={projet.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-emerald-50 to-slate-100 text-emerald-800">
            <span className="text-4xl opacity-40">🏗️</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs ${statut.color}`}
          >
            {statut.label}
          </span>
          {projet.secteur && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
              {projet.secteur.nom}
            </span>
          )}
        </div>

        {/* Jauge d'avancement intégrée */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/40 backdrop-blur-xs p-2 flex items-center justify-between text-white text-xs font-semibold">
          <span>Avancement physique</span>
          <span className="text-amber-300 font-bold">{projet.niveauAvancement}%</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80">
          <div
            className="h-full bg-amber-400 transition-all duration-500"
            style={{ width: `${projet.niveauAvancement}%` }}
          />
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1 justify-between">
        <div>
          <Link href={`/projets/${projet.slug}`} className="block">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {projet.titre}
            </h3>
          </Link>

          {projet.resume && (
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {truncate(projet.resume, 120)}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
          <div className="flex items-center gap-3">
            {projet.departement && (
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                {projet.departement.nom}
              </span>
            )}
            {projet.dateDebut && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(projet.dateDebut)}
              </span>
            )}
          </div>
          <Link
            href={`/projets/${projet.slug}`}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
          >
            <span>Détails</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
