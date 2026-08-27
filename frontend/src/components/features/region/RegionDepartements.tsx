'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { cn } from '@/lib/utils';

const DEPT_STYLE: Record<string, string> = {
  Ziguinchor: 'border-blue-200',
  Bignona: 'border-green-200',
  Oussouye: 'border-orange-200',
};

export function RegionDepartements() {
  const { data: departements, isLoading } = useQuery({
    queryKey: ['ref-region-departements'],
    queryFn: () => referencesService.getDepartements(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <LoadingState />
      </div>
    );
  }

  if (!departements?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {departements.map((dep) => (
        <Link
          key={dep.id}
          href={`/la-region/departements/${dep.id}`}
          className={cn(
            'group rounded-xl overflow-hidden border bg-white hover:shadow-lg transition-shadow block',
            DEPT_STYLE[dep.nom] ?? 'border-gray-200'
          )}
        >
          {dep.image ? (
            <div className="relative h-44 w-full bg-gray-100">
              <Image
                src={dep.image}
                alt={`Département de ${dep.nom}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-44 bg-gray-100 flex items-center justify-center">
              <MapPin className="h-10 w-10 text-gray-300" />
            </div>
          )}
          <div className="p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-primary transition-colors">
              {dep.nom}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Chef-lieu :</span>
                <span>{dep.nom}</span>
              </div>
              {dep.superficie && (
                <div className="flex justify-between">
                  <span className="font-medium">Superficie :</span>
                  <span>{dep.superficie.toLocaleString('fr-FR')} km²</span>
                </div>
              )}
              {dep.population && (
                <div className="flex justify-between">
                  <span className="font-medium">Population :</span>
                  <span>{dep.population.toLocaleString('fr-FR')} hab.</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}