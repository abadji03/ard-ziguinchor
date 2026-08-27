import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate, truncate } from '@/lib/utils';
import { STATUT_PROJET } from '@/constants';
import type { Projet } from '@/types';

interface ProjetCardProps {
  projet: Projet;
}

export function ProjetCard({ projet }: ProjetCardProps) {
  const statut = STATUT_PROJET[projet.statut] ?? { label: projet.statut, color: 'bg-gray-100 text-gray-700' };

  return (
    <Card hover className="flex flex-col overflow-hidden h-full">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 shrink-0">
        {projet.imagePrincipale ? (
          <Image
            src={projet.imagePrincipale}
            alt={projet.titre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl opacity-30">🏗️</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statut.color}`}>
            {statut.label}
          </span>
        </div>
        {/* Barre de progression */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
          <div
            className="h-full bg-secondary transition-all"
            style={{ width: `${projet.niveauAvancement}%` }}
            aria-label={`Avancement : ${projet.niveauAvancement}%`}
          />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {projet.secteur && (
          <Badge variant="info" className="self-start text-xs">
            {projet.secteur.nom}
          </Badge>
        )}

        <Link href={`/projets/${projet.slug}`} className="group">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {projet.titre}
          </h3>
        </Link>

        {projet.resume && (
          <p className="text-sm text-gray-500 line-clamp-2">{truncate(projet.resume, 120)}</p>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
          {projet.departement && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {projet.departement.nom}
            </span>
          )}
          {projet.dateDebut && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(projet.dateDebut)}
            </span>
          )}
          <span className="ml-auto font-medium text-primary">{projet.niveauAvancement}%</span>
        </div>
      </div>
    </Card>
  );
}
