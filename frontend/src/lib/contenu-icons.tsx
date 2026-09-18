/**
 * Résolution des icônes des contenus éditoriaux.
 *
 * En base, le champ `icone` stocke le **nom** du composant Lucide (ex.
 * `TreePine`). Cette table blanche garantit qu'une valeur erronée ou absente
 * n'empêche jamais l'affichage : on retombe alors sur une icône neutre.
 *
 * ⚠️ Toute icône ajoutée ici doit aussi être ajoutée à
 * `ICONES_DISPONIBLES` dans `lib/contenus.ts` pour apparaître dans le
 * formulaire d'administration.
 */
import {
  Target,
  Users,
  BarChart3,
  Handshake,
  Landmark,
  Network,
  Cog,
  FileText,
  Building,
  Building2,
  FolderOpen,
  ShieldCheck,
  Map,
  Compass,
  TreePine,
  Waves,
  Sun,
  Sparkles,
  Leaf,
  Droplets,
  Fish,
  GraduationCap,
  HeartPulse,
  Scale,
  Globe,
  type LucideIcon,
} from 'lucide-react';

export const CONTENU_ICONS: Record<string, LucideIcon> = {
  Target,
  Users,
  BarChart3,
  Handshake,
  Landmark,
  Network,
  Cog,
  FileText,
  Building,
  Building2,
  FolderOpen,
  ShieldCheck,
  Map,
  Compass,
  TreePine,
  Waves,
  Sun,
  Sparkles,
  Leaf,
  Droplets,
  Fish,
  GraduationCap,
  HeartPulse,
  Scale,
  Globe,
};

/** Icône neutre utilisée lorsqu'aucune correspondance n'est trouvée. */
export const ICONE_PAR_DEFAUT: LucideIcon = FileText;

/** Retourne le composant Lucide correspondant au nom stocké en base. */
export function resolveContenuIcon(name?: string | null): LucideIcon {
  if (!name) return ICONE_PAR_DEFAUT;
  return CONTENU_ICONS[name] ?? ICONE_PAR_DEFAUT;
}

/**
 * Rendu d'une icône éditoriale : permet aux pages publiques d'afficher
 * l'icône choisie en base (`<ContenuIcon nom={bloc.icone} />`) sans jamais
 * planter si le nom est inconnu (repli sur une icône neutre).
 */
export function ContenuIcon({
  nom,
  className,
}: {
  nom?: string | null;
  className?: string;
}) {
  const Icone = resolveContenuIcon(nom);
  return <Icone className={className} />;
}

/**
 * Palette utilisée par les cartes éditoriales (accueil, à propos…).
 * Le champ `couleur` en base contient la clé (ex. `emerald`).
 */
const COULEURS: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

export function resolveContenuCouleur(couleur?: string | null) {
  return COULEURS[couleur ?? ''] ?? COULEURS.emerald;
}