import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Building2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate, truncate } from '@/lib/utils';
import type { Programme } from '@/types';

interface ProgrammeCardProps {
  programme: Programme;
}

const STATUT_COLORS: Record<string, string> = {
  actif:    'bg-green-100 text-green-700',
  termine:  'bg-gray-100 text-gray-600',
  suspendu: 'bg-red-100 text-red-700',
};

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  const statutLabel = programme.statut.charAt(0).toUpperCase() + programme.statut.slice(1);

  return (
    <Card hover className="flex flex-col overflow-hidden h-full">
      {/* Image */}
      <div className="relative h-40 bg-gray-50 shrink-0">
        {programme.image ? (
          <Image
            src={programme.image}
            alt={programme.nom}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-4xl opacity-30">📋</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${STATUT_COLORS[programme.statut] ?? 'bg-gray-100 text-gray-600'}`}>
          {statutLabel}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {programme.acronyme && (
          <Badge variant="info" className="self-start text-xs">{programme.acronyme}</Badge>
        )}

        <Link href={`/programmes/${programme.slug}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {programme.nom}
          </h3>
        </Link>

        {programme.resume && (
          <p className="text-sm text-gray-500 line-clamp-2">{truncate(programme.resume, 110)}</p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          {programme.dateDebut && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(programme.dateDebut)}
            </span>
          )}
          {programme.organismePilote && (
            <span className="flex items-center gap-1 truncate">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{programme.organismePilote}</span>
            </span>
          )}
        </div>

        <Link
          href={`/programmes/${programme.slug}`}
          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1"
        >
          Voir le programme <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}