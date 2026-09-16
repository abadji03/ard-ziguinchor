import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Building2, ArrowRight } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import type { Programme } from '@/types';

interface ProgrammeCardProps {
  programme: Programme;
}

const STATUT_COLORS: Record<string, string> = {
  actif: 'bg-emerald-100 text-emerald-800 border border-emerald-300/60',
  termine: 'bg-slate-100 text-slate-700 border border-slate-300/60',
  suspendu: 'bg-rose-100 text-rose-800 border border-rose-300/60',
};

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  const statutLabel =
    programme.statut.charAt(0).toUpperCase() + programme.statut.slice(1);

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-200 group h-full">
      {/* Image */}
      <div className="relative h-44 bg-slate-100 shrink-0 overflow-hidden">
        {programme.image ? (
          <Image
            src={programme.image}
            alt={programme.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-amber-50 to-emerald-50 text-emerald-800">
            <span className="text-4xl opacity-40">📋</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs ${
              STATUT_COLORS[programme.statut] ?? 'bg-slate-100 text-slate-700'
            }`}
          >
            {statutLabel}
          </span>
          {programme.acronyme && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
              {programme.acronyme}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1 justify-between">
        <div>
          <Link href={`/programmes/${programme.slug}`} className="block">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
              {programme.nom}
            </h3>
          </Link>

          {programme.resume && (
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {truncate(programme.resume, 110)}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
          <div className="flex items-center gap-3">
            {programme.dateDebut && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {formatDate(programme.dateDebut)}
              </span>
            )}
            {programme.organismePilote && (
              <span className="flex items-center gap-1 truncate max-w-[140px] text-slate-700 font-medium">
                <Building2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{programme.organismePilote}</span>
              </span>
            )}
          </div>

          <Link
            href={`/programmes/${programme.slug}`}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 group-hover:translate-x-0.5 transition-all"
          >
            <span>Explorer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
