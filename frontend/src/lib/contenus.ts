/**
 * Référentiel des « contenus éditoriaux ».
 *
 * Ces contenus étaient auparavant codés en dur dans les pages (missions,
 * organisation, jalons historiques, atouts territoriaux, sous-pages…).
 * Ils sont désormais stockés en base (table `contenus_editoriaux`) et
 * modifiables depuis Admin → Paramètres → Contenus & textes.
 *
 * `type`    : nature du bloc (une entité métier).
 * `section` : page / emplacement qui consomme le bloc.
 */
import type { ContenuEditorial } from '@/types';

/** Vue normalisée d'un bloc éditorial, consommée par les pages publiques. */
export interface BlocVue {
  titre: string;
  /** Numéro d'axe, année, rôle, badge… selon le type de bloc. */
  sousTitre: string;
  description: string;
  /** Nom d'icône Lucide (ex. "TreePine"). */
  icone: string;
  couleur: string;
  lien: string;
}

/** Convertit les blocs issus de l'API en vue normalisée (triés par `ordre`). */
export function toBlocs(items?: ContenuEditorial[] | null): BlocVue[] {
  if (!items?.length) return [];
  return [...items]
    .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))
    .map((c) => ({
      titre: c.titre,
      sousTitre: c.sousTitre ?? '',
      description: c.description ?? '',
      icone: c.icone ?? '',
      couleur: c.couleur ?? '',
      lien: c.lien ?? '',
    }));
}

/**
 * Blocs de la base, ou repli codé en dur si la base ne renvoie rien
 * (site jamais vide, même si l'admin supprime tous les blocs).
 */
export function blocsOu(
  defaut: BlocVue[],
  items?: ContenuEditorial[] | null,
): BlocVue[] {
  const blocs = toBlocs(items);
  return blocs.length ? blocs : defaut;
}

export interface ContenuTypeDef {
  value: string;
  label: string;
  description: string;
}

export const CONTENU_TYPES: ContenuTypeDef[] = [
  {
    value: 'ORGANE',
    label: 'Organe de gouvernance',
    description:
      "Structure de l'ARD (Conseil d'Administration, Direction, divisions…). Page À propos → Organisation.",
  },
  {
    value: 'MISSION',
    label: 'Mission / Axe stratégique',
    description:
      "Piliers d'intervention de l'Agence. Affichés sur l'accueil et la page À propos.",
  },
  {
    value: 'JALON',
    label: 'Jalon historique',
    description:
      "Étapes marquantes de l'histoire de l'ARD (année + intitulé). Page À propos → Historique.",
  },
  {
    value: 'POTENTIEL',
    label: 'Atout territorial',
    description:
      'Potentialités et ressources de la région. Page La Région → Pôles & Ressources.',
  },
  {
    value: 'SOUS_PAGE',
    label: 'Sous-page / rubrique',
    description:
      'Cartes de navigation interne (Départements, Communes, SIG…). Page La Région.',
  },
  {
    value: 'CHIFFRE',
    label: 'Chiffre clé régional',
    description:
      'Indicateurs affichés en bandeau (superficie, population, forêts…). Page La Région.',
  },
  {
    value: 'DIRECTION',
    label: 'Direction / Division',
    description:
      "Unités organisationnelles proposées dans le formulaire d'ajout d'un membre de l'équipe.",
  },
  {
    value: 'CATEGORIE_DOC',
    label: 'Catégorie documentaire',
    description:
      'Rubriques du centre de documentation (planification, urbanisme, archives…).',
  },
  {
    value: 'LIEN_SITE',
    label: 'Lien utile',
    description: 'Liens externes ou institutionnels affichés dans le pied de page ou l’aide.',
  },
  {
    value: 'VALEUR',
    label: 'Valeur / Engagement',
    description: "Valeurs institutionnelles de l'Agence (transparence, proximité…).",
  },
];

/** Sections (pages) pouvant consommer des contenus éditoriaux. */
export const CONTENU_SECTIONS: { value: string; label: string }[] = [
  { value: 'accueil', label: 'Accueil' },
  { value: 'a-propos', label: 'À propos' },
  { value: 'la-region', label: 'La Région' },
  { value: 'observatoire', label: 'Observatoire' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'equipe', label: 'Équipe' },
  { value: 'general', label: 'Général / transverse' },
];

export function contenuTypeLabel(type: string): string {
  return CONTENU_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function contenuSectionLabel(section?: string | null): string {
  if (!section) return 'Transverse';
  return CONTENU_SECTIONS.find((s) => s.value === section)?.label ?? section;
}

/**
 * Icônes Lucide utilisables en base (le champ `icone` stocke le nom du
 * composant). Liste volontairement limitée pour rester maîtrisable.
 */
export const ICONES_DISPONIBLES = [
  'Target',
  'Users',
  'BarChart3',
  'Handshake',
  'Landmark',
  'Network',
  'Cog',
  'FileText',
  'Building',
  'Building2',
  'FolderOpen',
  'ShieldCheck',
  'Map',
  'Compass',
  'TreePine',
  'Waves',
  'Sun',
  'Sparkles',
  'Leaf',
  'Droplets',
  'Fish',
  'GraduationCap',
  'HeartPulse',
  'Scale',
  'Globe',
] as const;