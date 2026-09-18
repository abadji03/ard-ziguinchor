/**
 * Peuplement de la table `contenus_editoriaux`.
 *
 * Tous les textes et listes ci-dessous étaient auparavant **codés en dur** dans
 * les pages du site (accueil, à propos, la région, documentation). Ils sont
 * désormais stockés en base et modifiables depuis
 * Admin → Paramètres → Contenus & textes, sans redéploiement.
 *
 * Le script est **idempotent** : un bloc déjà présent (même type + section +
 * titre) n'est pas recréé. On peut donc le relancer sans risque.
 *
 * Exécution : npx ts-node prisma/seed-contenus.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface Bloc {
  type: string;
  section: string;
  titre: string;
  sousTitre?: string;
  description?: string;
  icone?: string;
  couleur?: string;
  lien?: string;
  /** Position d'affichage ; calculée automatiquement si non fournie. */
  ordre?: number;
}

const BLOCS: Bloc[] = [
  // ── Accueil : axes stratégiques (ex. MissionsSection) ─────────────────────
  {
    type: 'MISSION',
    section: 'accueil',
    titre: 'Planification Territoriale',
    sousTitre: 'Axe 01',
    description:
      "Appui à l'élaboration, la révision et la cohérence des Schémas Régionaux d'Aménagement du Territoire (SRAT), Plans Départementaux et Communaux de Développement (PCD).",
    icone: 'Target',
    couleur: 'emerald',
  },
  {
    type: 'MISSION',
    section: 'accueil',
    titre: 'Renforcement des Capacités',
    sousTitre: 'Axe 02',
    description:
      "Formation continue, ingénierie administrative et assistance technique aux élus locaux, agents territoriaux et commissions de passation des marchés.",
    icone: 'Users',
    couleur: 'amber',
  },
  {
    type: 'MISSION',
    section: 'accueil',
    titre: 'Mobilisation des Financements',
    sousTitre: 'Axe 03',
    description:
      "Montage de dossiers bancables, recherche de partenariats techniques et financiers (PTF) nationaux et internationaux, et cofinancement de projets d'intérêt régional.",
    icone: 'BarChart3',
    couleur: 'blue',
  },
  {
    type: 'MISSION',
    section: 'accueil',
    titre: 'Concertation & Synergie',
    sousTitre: 'Axe 04',
    description:
      "Animation du dialogue territorial entre l'Administration centrale, les collectivités territoriales, la société civile et le secteur privé pour une convergence des actions.",
    icone: 'Handshake',
    couleur: 'purple',
  },

  // ── À propos : missions ───────────────────────────────────────────────────
  {
    type: 'MISSION',
    section: 'a-propos',
    titre: 'Planification Territoriale',
    sousTitre: '01',
    description:
      "Appui à l'élaboration et à la révision des Schémas Régionaux (SRAT), Plans Départementaux (PDD) et Plans Communaux de Développement (PCD).",
    icone: 'Target',
  },
  {
    type: 'MISSION',
    section: 'a-propos',
    titre: 'Renforcement des Capacités',
    sousTitre: '02',
    description:
      'Sessions de formation des élus locaux, perfectionnement des secrétaires municipaux et appui aux commissions techniques.',
    icone: 'Users',
  },
  {
    type: 'MISSION',
    section: 'a-propos',
    titre: 'Mobilisation des Ressources',
    sousTitre: '03',
    description:
      'Structuration de dossiers bancables, négociation de financements avec les bailleurs et coopération décentralisée.',
    icone: 'BarChart3',
  },
  {
    type: 'MISSION',
    section: 'a-propos',
    titre: 'Coordination & Concertation',
    sousTitre: '04',
    description:
      'Animation des cadres territoriaux de concertation, mise en réseau des acteurs et harmonisation des interventions en Casamance.',
    icone: 'Handshake',
  },

  // ─── À propos : organisation / gouvernance ────────────────────────────────
  {
    type: 'ORGANE',
    section: 'a-propos',
    titre: "Conseil d'Administration",
    sousTitre: 'Orientation & Contrôle',
    description:
      'Organe de délibération et de gouvernance suprême réunissant les représentants des départements et communes de Ziguinchor.',
    icone: 'Landmark',
  },
  {
    type: 'ORGANE',
    section: 'a-propos',
    titre: 'Direction Générale',
    sousTitre: 'Pilotage Opérationnel',
    description:
      "Assure le management opérationnel, la coordination des pôles d'ingénierie et la représentation légale de l'Agence.",
    icone: 'Network',
  },
  {
    type: 'ORGANE',
    section: 'a-propos',
    titre: 'Division Planification & Projets',
    sousTitre: 'Ingénierie de Développement',
    description:
      "Assistance technique aux collectivités, élaboration des PCD/PDD/SRAT et suivi-évaluation des investissements physiques.",
    icone: 'Cog',
  },
  {
    type: 'ORGANE',
    section: 'a-propos',
    titre: 'Division Administrative & Financière',
    sousTitre: 'Gestion & Conformité',
    description:
      'Supervision budgétaire, gestion des procédures de passation des marchés publics et ressources humaines.',
    icone: 'FileText',
  },

  // ─── À propos : jalons historiques ────────────────────────────────────────
  {
    type: 'JALON',
    section: 'a-propos',
    titre: "Décret Fondateur de l'ARD",
    sousTitre: '2001',
    description:
      'Création des Agences Régionales de Développement au Sénégal pour opérationnaliser la décentralisation en Casamance.',
  },
  {
    type: 'JALON',
    section: 'a-propos',
    titre: 'Généralisation des PCD',
    sousTitre: '2008',
    description:
      'Accompagnement de l’ensemble des communes de la région dans l’adoption de leurs premiers plans de développement.',
  },
  {
    type: 'JALON',
    section: 'a-propos',
    titre: 'Mise en œuvre de l’Acte III',
    sousTitre: '2014',
    description:
      'Refonte institutionnelle suite à la communalisation intégrale et à la départementalisation au Sénégal.',
  },
  {
    type: 'JALON',
    section: 'a-propos',
    titre: 'Observatoire Territorial & SIG',
    sousTitre: '2019',
    description:
      'Mise en place d’un Système d’Information Géographique régional et publication des premières banques de données.',
  },
  {
    type: 'JALON',
    section: 'a-propos',
    titre: 'Cap Vision Sénégal 2050',
    sousTitre: '2024',
    description:
      'Alignement stratégique sur les pôles territoriaux de développement et l’industrialisation agro-écologique de la Casamance.',
  },

  // ─── La Région : chiffres clés (bandeau) ──────────────────────────────────
  {
    type: 'CHIFFRE',
    section: 'la-region',
    titre: 'Superficie régionale',
    sousTitre: '7 329',
    description: 'km²',
    icone: 'Map',
  },
  {
    type: 'CHIFFRE',
    section: 'la-region',
    titre: 'Estimation ANSD 2023',
    sousTitre: '617 567',
    description: 'hab.',
    icone: 'Users',
  },
  {
    type: 'CHIFFRE',
    section: 'la-region',
    titre: 'Ziguinchor, Bignona, Oussouye',
    sousTitre: '3',
    description: 'Départements',
    icone: 'Building2',
  },
  {
    type: 'CHIFFRE',
    section: 'la-region',
    titre: 'Domaine forestier classé (30 massifs)',
    sousTitre: '116 776',
    description: 'ha',
    icone: 'TreePine',
  },

  // ─── La Région : sous-pages (cartes de navigation) ────────────────────────
  {
    type: 'SOUS_PAGE',
    section: 'la-region',
    titre: 'Départements',
    sousTitre: '3 Départements',
    description:
      'Les spécificités démographiques et économiques des départements de Ziguinchor, Bignona et Oussouye.',
    icone: 'Building2',
    lien: '/la-region/departements',
  },
  {
    type: 'SOUS_PAGE',
    section: 'la-region',
    titre: 'Communes & Arrondissements',
    sousTitre: '30 Communes',
    description:
      'Annuaire complet des 30 communes de la région, leurs coordonnées administratives et maires.',
    icone: 'Users',
    lien: '/la-region/communes',
  },
  {
    type: 'SOUS_PAGE',
    section: 'la-region',
    titre: 'Système d’Information Géographique (SIG)',
    sousTitre: 'Cartes Interactives',
    description:
      'Visualisez en direct la répartition spatiale des investissements et infrastructures.',
    icone: 'Compass',
    lien: '/la-region/cartographie',
  },

  // ─── La Région : pôles de compétitivité & ressources ──────────────────────
  {
    type: 'POTENTIEL',
    section: 'la-region',
    titre: 'Agriculture & Pêche',
    description:
      "Premières activités régionales : la production de riz a atteint 229 825 tonnes en 2022-2023 (ANSD) et les débarquements de la pêche artisanale 82 576,9 tonnes en 2023, valorisés à 39,4 milliards de FCFA.",
    icone: 'Sparkles',
    couleur: 'emerald',
  },
  {
    type: 'POTENTIEL',
    section: 'la-region',
    titre: 'Écotourisme & Patrimoine',
    description:
      "26 841 arrivées de touristes en 2023 (contre 11 355 en 2020) et 177 réceptifs hôteliers : la façade maritime, l'embouchure du fleuve Casamance et les atouts culturels portent une filière en forte croissance (ANSD 2023).",
    icone: 'Waves',
    couleur: 'blue',
  },
  {
    type: 'POTENTIEL',
    section: 'la-region',
    titre: 'Forêt & Biodiversité',
    description:
      'Le domaine forestier classé couvre 116 776,3 hectares répartis dans 30 forêts classées : 20 massifs dans le département de Bignona (100 405,3 ha), 6 à Oussouye (6 469 ha) et 4 à Ziguinchor (9 902 ha).',
    icone: 'TreePine',
    couleur: 'emerald',
  },
  {
    type: 'POTENTIEL',
    section: 'la-region',
    titre: 'Carrefour Transfrontalier',
    description:
      "Limitrophe de la Gambie et de la Guinée-Bissau, la région est ouverte sur l'océan Atlantique et reliée à Kolda et Sédhiou à l'est.",
    icone: 'Compass',
    couleur: 'amber',
  },
  {
    type: 'POTENTIEL',
    section: 'la-region',
    titre: 'Commerce & Services',
    description:
      'Le RGE 2015 (ANSD) recensait 15 743 unités économiques dans la région, dont 54,8 % dans le commerce et 63,1 % concentrées dans le département de Ziguinchor.',
    icone: 'Sun',
    couleur: 'amber',
  },
  {
    type: 'POTENTIEL',
    section: 'la-region',
    titre: 'Eau, Fleuve et Littoral',
    description:
      "Avec une façade maritime de 85 km, le fleuve Casamance (environ 300 km) et ses bolongs constituent des ressources territoriales structurantes pour la riziculture, la pêche et l'aquaculture.",
    icone: 'Building2',
    couleur: 'purple',
  },

  // ─── Équipe : directions / divisions (select du formulaire membre) ────────
  // ⚠️ Structure fonctionnelle reconstituée (Division Planification/Formation
  // et Division Suivi-Évaluation documentées ; blocs PDEC/SDADT). À ajuster dès
  // que l'organigramme officiel de l'ARD sera disponible.
  {
    type: 'DIRECTION',
    section: 'equipe',
    titre: 'Direction Générale',
    description: "Direction de l'Agence (management opérationnel, représentation légale)",
    icone: 'Landmark',
  },
  {
    type: 'DIRECTION',
    section: 'equipe',
    titre: 'Division Planification et Développement Territorial',
    description:
      'PDC/PDD, SDADT/SCADT, diagnostic territorial, formation et renforcement des capacités',
    icone: 'Target',
  },
  {
    type: 'DIRECTION',
    section: 'equipe',
    titre: 'Division Ingénierie et Appui Technique',
    description:
      'Infrastructures, travaux publics, passation des marchés, assistance technique aux communes',
    icone: 'Cog',
  },
  {
    type: 'DIRECTION',
    section: 'equipe',
    titre: 'Division Suivi-Évaluation et Observatoire',
    description: 'Suivi-évaluation des projets, observatoire territorial, données et indicateurs',
    icone: 'BarChart3',
  },
  {
    type: 'DIRECTION',
    section: 'equipe',
    titre: 'Division Développement Local et Financement',
    description: 'Montage de projets, financement local, gouvernance et finances locales, foncier',
    icone: 'Handshake',
  },
  {
    type: 'DIRECTION',
    section: 'equipe',
    titre: 'Division Administration et Finances',
    description: 'Administration générale, ressources humaines, finances et fonctions support',
    icone: 'FileText',
  },

  // ─── Documentation : rubriques du centre de documentation ─────────────────
  {
    type: 'CATEGORIE_DOC',
    section: 'documentation',
    titre: 'Planification Régionale',
    description:
      'Documents de portée régionale : stratégies, plans et programmes de développement territorial.',
    icone: 'Map',
    lien: '/documentation/planification-regionale',
  },
  {
    type: 'CATEGORIE_DOC',
    section: 'documentation',
    titre: 'Planification Territoriale (PDC / PDD / SDADT)',
    description:
      'Plans de développement communal et départemental, schémas d’aménagement et de développement territorial.',
    icone: 'Building2',
    lien: '/documentation/planification-territoriale',
  },
  {
    type: 'CATEGORIE_DOC',
    section: 'documentation',
    titre: 'Urbanisme & Aménagement',
    description:
      'Documents d’urbanisme (SDAU, PCU, PCUI, PUPA, PAZ, lotissements) et plans d’occupation des sols (POAS).',
    icone: 'Compass',
    lien: '/documentation/urbanisme-amenagement',
  },
  {
    type: 'CATEGORIE_DOC',
    section: 'documentation',
    titre: 'Archives Historiques de Planification',
    description:
      'Instruments antérieurs à l’Acte III conservés à titre d’archive : SRAT, PRDI, PIC, PLD, PAR, PIL, PVD, PZD.',
    icone: 'Landmark',
    lien: '/documentation/archives-historiques',
  },
  {
    type: 'CATEGORIE_DOC',
    section: 'documentation',
    titre: 'Rapports, Études & Guides',
    description:
      'Rapports annuels, études sectorielles, plans sectoriels, documents environnementaux et guides méthodologiques.',
    icone: 'FileText',
    lien: '/documentation/autres',
  },
];

/**
 * Insère les blocs manquants. Idempotent : un bloc déjà présent pour le même
 * couple type + section + titre est laissé intact, afin de ne jamais écraser
 * une modification effectuée depuis l'administration.
 *
 * L'ordre d'affichage (`ordre`) suit l'ordre de déclaration ci-dessus au sein
 * de chaque couple type + section. Il n'est appliqué à un bloc existant que si
 * celui-ci n'a encore aucun ordre défini (valeur 0), pour ne pas écraser un
 * réordonnancement fait depuis l'administration.
 */
async function main() {
  console.log('Peuplement des contenus éditoriaux…');

  // Position de chaque bloc dans son groupe (type + section).
  const compteurs = new Map<string, number>();
  const ordreDe = new Map<string, number>();
  for (const bloc of BLOCS) {
    const cle = `${bloc.type}|${bloc.section}`;
    const suivant = compteurs.get(cle) ?? 0;
    ordreDe.set(`${cle}|${bloc.titre}`, bloc.ordre ?? suivant);
    compteurs.set(cle, suivant + 1);
  }

  let created = 0;
  let skipped = 0;
  let reordered = 0;

  for (const bloc of BLOCS) {
    const ordre = ordreDe.get(`${bloc.type}|${bloc.section}|${bloc.titre}`) ?? 0;
    const existing = await prisma.contenuEditorial.findFirst({
      where: { type: bloc.type, section: bloc.section, titre: bloc.titre },
      select: { id: true, ordre: true },
    });

    if (existing) {
      if (existing.ordre === 0 && ordre > 0) {
        await prisma.contenuEditorial.update({ where: { id: existing.id }, data: { ordre } });
        reordered += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    await prisma.contenuEditorial.create({
      data: {
        type: bloc.type,
        section: bloc.section,
        titre: bloc.titre,
        sousTitre: bloc.sousTitre ?? null,
        description: bloc.description ?? null,
        icone: bloc.icone ?? null,
        couleur: bloc.couleur ?? null,
        lien: bloc.lien ?? null,
        ordre,
      },
    });
    created += 1;
  }

  const total = await prisma.contenuEditorial.count();
  console.log(
    `OK  ${created} bloc(s) créé(s), ${reordered} réordonné(s), ${skipped} déjà présent(s) — total en base : ${total}`,
  );
}

main()
  .catch((error) => {
    console.error('Échec du peuplement des contenus éditoriaux', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });