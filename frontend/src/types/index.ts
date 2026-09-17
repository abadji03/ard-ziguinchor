// ============================================
// TYPES PARTAGÉS
// ============================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: unknown;
}

// ============================================
// ACTUALITÉS
// ============================================

export interface Categorie {
  id: string;
  nom: string;
  slug: string;
  couleur?: string;
  icone?: string;
}

export interface Actualite {
  id: string;
  titre: string;
  slug: string;
  resume?: string;
  contenu: string;
  imagePrincipale?: string;
  statut: string;
  datePublication?: string;
  vue: number;
  tempsLecture?: number;
  tags: string[];
  categorie?: Categorie;
  auteur?: { nom: string; prenom: string };
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PROJETS
// ============================================

export interface Secteur {
  id: string;
  nom: string;
  slug: string;
  icone?: string;
  couleur?: string;
}

export interface Departement {
  id: string;
  nom: string;
  code: string;
  superficie?: number;
  population?: number;
  description?: string;
  image?: string;
}

export interface Arrondissement {
  id: string;
  nom: string;
  code: string;
  description?: string;
  departement?: Departement;
  departementId?: string;
}

export interface Commune {
  id: string;
  nom: string;
  code: string;
  latitude?: number;
  longitude?: number;
  superficie?: number;
  population?: number;
  image?: string;
  description?: string;
  departement?: Departement;
  departementId?: string;
  arrondissement?: Arrondissement;
  arrondissementId?: string;
}

export interface Projet {
  id: string;
  titre: string;
  slug: string;
  code?: string;
  resume?: string;
  description: string;
  objectifs?: string;
  resultats?: string;
  secteur: Secteur;
  statut: string;
  niveauAvancement: number;
  budget?: number;
  budgetExecute?: number;
  devise: string;
  dateDebut?: string;
  dateFin?: string;
  latitude?: number;
  longitude?: number;
  beneficiaires?: number;
  imagePrincipale?: string;
  departement?: Departement;
  commune?: Commune;
  partenaires?: PartenaireProjet[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface PartenaireProjet {
  partenaire: Partenaire;
  role?: string;
}

// ============================================
// PROGRAMMES
// ============================================

export interface Programme {
  id: string;
  nom: string;
  acronyme?: string;
  slug: string;
  resume?: string;
  description: string;
  objectifs?: string;
  organismePilote?: string;
  dateDebut?: string;
  dateFin?: string;
  budget?: number;
  statut: string;
  image?: string;
  partenaires?: PartenaireProgramme[];
  projets?: Projet[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface PartenaireProgramme {
  partenaire: Partenaire;
  role?: string;
}

// ============================================
// PARTENAIRES
// ============================================

export interface TypePartenaire {
  id: string;
  nom: string;
  icone?: string;
}

export interface Partenaire {
  id: string;
  nom: string;
  sigle?: string;
  slug: string;
  logo?: string;
  description: string;
  type: TypePartenaire;
  pays?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  adresse?: string;
  dateDebutPartenariat?: string;
  statut: string;
  createdAt: string;
}

// ============================================
// DOCUMENTS
// ============================================

export interface CategorieDocument {
  id: string;
  nom: string;
  slug: string;
  icone?: string;
}

export type TypePlanification =
  | 'REGIONALE'
  | 'TERRITORIALE'
  | 'URBAIN'
  | 'SECTORIEL'
  | 'ENVIRONNEMENT'
  | 'HISTORIQUE'
  | 'AUTRE';

export interface Document {
  id: string;
  titre: string;
  slug: string;
  resume?: string;
  fichier: string;
  format: string;
  typePlanification: TypePlanification;
  sousType?: string;
  taille?: number;
  nombrePages?: number;
  auteur?: string;
  datePublication?: string;
  langue: string;
  version: string;
  statut?: 'brouillon' | 'publie' | 'archive';
  telechargements: number;
  categorie?: CategorieDocument;
  departement?: Departement;
  departementId?: string;
  arrondissement?: Arrondissement;
  arrondissementId?: string;
  commune?: Commune;
  communeId?: string;
  createdAt: string;
}

// ============================================
// GALERIE / MÉDIAS
// ============================================

export interface Media {
  id: string;
  nom: string;
  fichier: string;
  type: string;
  format?: string;
  taille?: number;
  largeur?: number;
  hauteur?: number;
  texteAlt?: string;
  legende?: string;
  credit?: string;
}

export interface Album {
  id: string;
  titre: string;
  description?: string;
  galerie?: { id: string; nom: string; slug: string };
  medias?: Media[];
}

export interface Galerie {
  id: string;
  nom: string;
  description?: string;
  slug: string;
  albums?: Album[];
  /** Médias directement liés à la galerie (via GalerieMedia) */
  galerieMedias?: { id: string; ordre: number; media: Media }[];
}

// ============================================
// OPPORTUNITÉS
// ============================================

export interface TypeOpportunite {
  id: string;
  nom: string;
  icone?: string;
}

export interface Opportunite {
  id: string;
  titre: string;
  slug: string;
  resume?: string;
  description: string;
  type: TypeOpportunite;
  organisme: string;
  secteur?: string;
  datePublication: string;
  dateLimite?: string;
  statut: string;
  conditions?: string;
  lienExterne?: string;
  document?: Document;
  createdAt: string;
}

// ============================================
// ÉVÉNEMENTS
// ============================================

export interface Evenement {
  id: string;
  titre: string;
  slug: string;
  resume?: string;
  description: string;
  lieu: string;
  latitude?: number;
  longitude?: number;
  dateDebut: string;
  dateFin?: string;
  heureDebut?: string;
  heureFin?: string;
  organisateur?: string;
  capacite?: number;
  inscriptionOuverte?: boolean;
  statut: string;
  image?: string;
}

// ============================================
// MEMBRES / ÉQUIPE
// ============================================

export interface Membre {
  id: string;
  nom: string;
  prenom: string;
  fonction: string;
  direction?: string;
  bio?: string;
  photo?: string;
  email?: string;
  telephone?: string;
  ordre: number;
  actif: boolean;
}

// ============================================
// INDICATEURS
// ============================================

export interface Indicateur {
  id: string;
  nom: string;
  slug: string;
  description?: string;
  valeur: number;
  unite: string;
  annee: number;
  source?: string;
  secteur?: Secteur;
  commune?: Commune;
  departement?: Departement;
}

// ============================================
// CHIFFRES CLÉS / BANNIÈRES
// ============================================

export interface ChiffreCle {
  id: string;
  valeur: string;
  label: string;
  description?: string;
  icone?: string;
  ordre: number;
  actif?: boolean;
}

export interface Banniere {
  id: string;
  titre: string;
  sousTitre?: string;
  image: string;
  lien?: string;
  boutonTexte?: string;
  ordre: number;
}

// ============================================
// PARAMÈTRES DU SITE
// ============================================

export interface ParametreSite {
  nomSite: string;
  description?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  instagram?: string;
}

// ============================================
// AUTH
// ============================================

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  poste?: string;
  telephone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITEUR' | 'REDACTEUR' | 'CONTRIBUTEUR';
  actif: boolean;
  dernierLogin?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail: string;
  action: string;
  entite: string;
  entiteId?: string;
  details?: string;
  ip?: string;
  createdAt: string;
}

export const AUDIT_ACTIONS = [
  'CONNEXION',
  'ECHEC_CONNEXION',
  'CONSULTATION',
  'CREATION',
  'MODIFICATION',
  'SUPPRESSION',
] as const;


export interface AuthResponse {
  access_token: string;
  user: User;
}

// ============================================
// CONTACT
// ============================================

export interface ContactForm {
  nom: string;
  email: string;
  telephone?: string;
  objet: string;
  message: string;
}

// ============================================
// RECHERCHE
// ============================================

export interface SearchResult {
  actualites: Actualite[];
  projets: Projet[];
  documents: Document[];
  total: number;
}

// ============================================
// FAQ
// ============================================

export interface Faq {
  id: string;
  question: string;
  reponse: string;
  categorie: { id: string; nom: string };
  ordre: number;
}
