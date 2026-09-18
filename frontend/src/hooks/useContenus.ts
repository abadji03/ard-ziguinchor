import type { ContenuEditorial, ContenuStatique, NavigationItem } from '@/types';
import { referencesService } from '@/services/references.service';
import { useQueryData } from './useQueryData';
import { toBlocs } from '@/lib/contenus';
import { DIRECTIONS_ARD } from '@/lib/directions';

/** Option générique de liste déroulante alimentée par la base. */
export interface OptionContenu {
  value: string;
  label: string;
  description?: string;
}

/**
 * Contenus éditoriaux d'une page, regroupés par type (`MISSION`, `ORGANE`,
 * `JALON`, `POTENTIEL`, `CHIFFRE`, `SOUS_PAGE`…).
 *
 * Les blocs sont désormais pilotés depuis Admin → Paramètres → Contenus &
 * textes : plus besoin de redéployer le site pour corriger un texte.
 */
export function useContenusSection(section: string) {
  return useQueryData<Record<string, ContenuEditorial[]>>(
    ['contenus', 'section', section],
    () => referencesService.getContenusSection(section),
    { staleTime: 10 * 60 * 1000 },
  );
}

/** Contenus éditoriaux d'un type donné (ex. `DIRECTION` pour les selects). */
export function useContenusType(type: string) {
  return useQueryData<ContenuEditorial[]>(
    ['contenus', 'type', type],
    () => referencesService.getContenusByType(type),
    { staleTime: 10 * 60 * 1000 },
  );
}

/**
 * Directions / divisions proposées dans les formulaires RH.
 *
 * Source : blocs `DIRECTION` de la section « equipe » (Admin → Paramètres →
 * Contenus & textes). Si l'administration est vide, repli sur la structure
 * fonctionnelle documentée (`lib/directions.ts`) pour ne jamais bloquer la
 * saisie d'un membre.
 */
export function useDirectionsArd(): OptionContenu[] {
  const { data } = useContenusType('DIRECTION');
  const blocs = toBlocs(data);
  if (!blocs.length) return DIRECTIONS_ARD;
  return blocs.map((b) => ({
    value: b.titre,
    label: b.titre,
    description: b.description || undefined,
  }));
}

/**
 * Contenu statique (texte long) adressable par clé (mentions légales,
 * confidentialité, accessibilité, mot du directeur…).
 *
 * La donnée provient de la base (Admin → Paramètres → Contenus & textes).
 * Si la clé est absente ou désactivée, `data` vaut null → la page utilise
 * son repli codé en dur.
 */
export function useContenuStatique(cle: string) {
  return useQueryData<ContenuStatique | null>(
    ['contenu-statique', cle],
    () => referencesService.getContenuStatique(cle),
    { staleTime: 10 * 60 * 1000 },
  );
}

/** Navigation d'une section (header / footer / legal) — liste plate. */
export function useNavigation(section = 'header') {
  return useQueryData<NavigationItem[]>(
    ['navigation', section],
    () => referencesService.getNavigation(section),
    { staleTime: 10 * 60 * 1000 },
  );
}