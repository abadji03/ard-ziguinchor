'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { partenairesService } from '@/services/partenaires.service';
import type { Partenaire } from '@/types';

function PartenaireCard({ partenaire }: { partenaire: Partenaire }) {
  return (
    <Link
      href={`/partenaires/${partenaire.slug}`}
      className="flex-shrink-0 w-36 md:w-44 group"
    >
      <div className="bg-white border border-gray-100 rounded-xl p-4 h-20 flex items-center justify-center hover:border-primary/30 hover:shadow-md transition-all">
        {partenaire.logo ? (
          <Image
            src={partenaire.logo}
            alt={partenaire.nom}
            width={120}
            height={60}
            className="object-contain max-h-12 w-auto grayscale group-hover:grayscale-0 transition-all"
          />
        ) : (
          <div className="text-center">
            {partenaire.sigle ? (
              <div className="font-bold text-primary text-lg group-hover:scale-105 transition-transform">
                {partenaire.sigle}
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-600 text-center leading-tight px-1 group-hover:text-primary transition-colors">
                {partenaire.nom}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function PartenairesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['partenaires', 'actifs'],
    queryFn: () => partenairesService.getAll({ limit: 20, statut: 'actif' }),
    staleTime: 300_000,
  });

  const partenaires = data?.data ?? [];

  if (partenaires.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-gray-50 border-y border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Nos Partenaires</h2>
            <p className="text-sm text-gray-500 mt-1">Ils nous font confiance et soutiennent le développement de la région</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
              aria-label="Défiler à gauche"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-colors"
              aria-label="Défiler à droite"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {partenaires.map((p) => (
            <PartenaireCard key={p.id} partenaire={p} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/partenaires"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
          >
            Voir tous nos partenaires →
          </Link>
        </div>
      </div>
    </section>
  );
}
