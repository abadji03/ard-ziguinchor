'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Radio, Calendar, ChevronRight } from 'lucide-react';
import { useQueryData } from '@/hooks/useQueryData';
import { actualitesService } from '@/services/actualites.service';
import { evenementsService } from '@/services/evenements.service';
import type { Actualite, Evenement } from '@/types';

interface TickerItem {
  id: string;
  label: string;
  href: string;
  type: 'actu' | 'event';
}

/**
 * Bande défilante (ticker) affichant les actualités récentes et événements à venir.
 * Placée juste sous la bannière principale.
 */
export function ActualitesTicker() {
  const { data: actualites } = useQueryData<Actualite[]>(
    ['ticker-actualites'],
    () => actualitesService.getRecentes(8),
    { staleTime: 5 * 60 * 1000 },
  );

  const { data: evenements } = useQueryData<Evenement[]>(
    ['ticker-evenements'],
    () => evenementsService.getAVenir(4),
    { staleTime: 5 * 60 * 1000 },
  );

  // Construit la liste des items à afficher
  const items: TickerItem[] = [
    ...(actualites ?? []).map((a) => ({
      id:    `actu-${a.id}`,
      label: a.titre,
      href:  `/actualites/${a.slug}`,
      type:  'actu' as const,
    })),
    ...(evenements ?? []).map((e) => ({
      id:    `event-${e.id}`,
      label: e.titre,
      href:  `/agenda`,
      type:  'event' as const,
    })),
  ];

  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplique les items pour un défilement infini fluide
  const displayed = items.length > 0 ? [...items, ...items] : [];

  if (!items.length) return null;

  return (
    <div
      className="bg-primary/95 text-white overflow-hidden"
      aria-label="Fil d'actualités"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-stretch">
        {/* Étiquette gauche */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-gray-900 font-semibold text-xs shrink-0 whitespace-nowrap">
          <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          <span className="uppercase tracking-wide">Actus</span>
        </div>

        {/* Piste défilante */}
        <div className="flex-1 overflow-hidden relative">
          {/* Dégradé gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-primary/95 to-transparent pointer-events-none" />
          {/* Dégradé droit */}
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-primary/95 to-transparent pointer-events-none" />

          <div
            ref={trackRef}
            className="flex items-center gap-0 whitespace-nowrap"
            style={{
              animation: paused
                ? 'none'
                : `ticker-scroll ${items.length * 6}s linear infinite`,
            }}
          >
            {displayed.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={item.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm hover:text-secondary transition-colors group shrink-0"
                tabIndex={idx < items.length ? 0 : -1}
                aria-hidden={idx >= items.length}
              >
                {item.type === 'event' ? (
                  <Calendar className="h-3.5 w-3.5 text-secondary/70 shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-white/50 shrink-0 group-hover:text-secondary transition-colors" aria-hidden="true" />
                )}
                <span className="group-hover:underline underline-offset-2">{item.label}</span>
                <span className="text-white/20 select-none mx-2" aria-hidden="true">|</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes CSS injectés inline (Tailwind ne gère pas les animations custom sans config) */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
