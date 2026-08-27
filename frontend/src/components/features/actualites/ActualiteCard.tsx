import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, truncate } from '@/lib/utils';
import type { Actualite } from '@/types';

interface ActualiteCardProps {
  actualite: Actualite;
}

export function ActualiteCard({ actualite }: ActualiteCardProps) {
  return (
    <Card hover className="flex flex-col overflow-hidden h-full">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 shrink-0">
        {actualite.imagePrincipale ? (
          <Image
            src={actualite.imagePrincipale}
            alt={actualite.titre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-secondary/10 to-secondary/5">
            <span className="text-4xl opacity-30">📰</span>
          </div>
        )}
        {actualite.categorie && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: actualite.categorie.couleur || '#F4B400' }}
            >
              {actualite.categorie.nom}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <Link href={`/actualites/${actualite.slug}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {actualite.titre}
          </h3>
        </Link>

        {actualite.resume && (
          <p className="text-sm text-gray-500 line-clamp-2">{truncate(actualite.resume, 110)}</p>
        )}

        {actualite.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {actualite.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
          {actualite.datePublication && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(actualite.datePublication)}
            </span>
          )}
          {actualite.tempsLecture && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {actualite.tempsLecture} min
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Eye className="h-3.5 w-3.5" />
            {actualite.vue}
          </span>
        </div>
      </div>
    </Card>
  );
}
