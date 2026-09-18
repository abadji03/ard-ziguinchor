'use client';

import type { ReactNode } from 'react';
import { useContenuStatique } from '@/hooks/useContenus';
import { LoadingState } from '@/components/ui/Spinner';

interface Props {
  cle: string;
  fallbackClassName?: string;
  children: ReactNode;
}

/**
 * Rendu conditionnel d'un contenu statique externalisé.
 *
 * - Si le contenu existe et est `actif` en base, on injecte le HTML stocké par l'admin.
 * - Sinon, on retombe sur le JSX en dur fourni en `children` (fallback legacy).
 *
 * Utilisation serveur/prérendu — le hook est en mode client mais SSR-safe
 * grâce à `useQueryData` configuré en `initialData`/`suspense: false`.
 */
export function ContenuStatiqueRenderer({ cle, children, fallbackClassName }: Props) {
  const { data: contenu, isLoading } = useContenuStatique(cle);

  if (isLoading) {
    return <LoadingState />;
  }

  // Contenu externalisé disponible et actif → priorité absolue.
  if (contenu?.actif && contenu.contenu) {
    return (
      <div
        className={fallbackClassName}
        dangerouslySetInnerHTML={{ __html: contenu.contenu }}
      />
    );
  }

  // Fallback JSX codé en dur.
  return <>{children}</>;
}
