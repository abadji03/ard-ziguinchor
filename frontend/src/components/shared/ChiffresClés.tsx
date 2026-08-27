'use client';

import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';
import type { ChiffreCle } from '@/types';

export function ChiffresClés() {
  const { data } = useQueryData(
    ['chiffres-cles'],
    () => referencesService.getChiffresCles()
  );

  // Les chiffres clés sont fournis par l'API (calculés depuis la base réelle).
  const items = data ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-14 bg-white" aria-label="Chiffres clés">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((c) => (
            <div
              key={c.id}
              className="text-center p-6 rounded-xl bg-background border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              {c.icone && <div className="text-3xl mb-2">{c.icone}</div>}
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{c.valeur}</div>
              <div className="text-sm text-gray-600 font-medium">{c.label}</div>
              {c.description && <div className="text-xs text-gray-400 mt-1">{c.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
