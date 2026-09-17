/**
 * Pré-remplissage du répertoire des documents de planification de la région
 * de Ziguinchor, d'après l'étude ANAT « Pôle-Territoire Sud » et le cadre
 * juridique (LOADT 2021, Loi SNP 2022-10, Code de l'urbanisme 2023-20).
 *
 * Sont créés ici uniquement les documents clairement documentés :
 *  - 3 SDADT en vigueur (un par département : Bignona, Oussouye, Ziguinchor).
 *
 * Les documents dont le territoire exact n'est pas confirmé (1 PDD en vigueur,
 * 2 POAS, 18 PDC, et les documents caducs : 2 PDD, 12 PDC) doivent être
 * référencés manuellement via l'admin Documents une fois les territoires et
 * fichiers identifiés — utiliser alors les types/sous-types définis dans
 * lib/document-types.ts (famille TERRITORIALE : PDC, PDD, SDADT, POAS…).
 *
 * Les fiches sont créées en statut « brouillon » : elles n'apparaissent pas
 * publiquement tant que le fichier PDF n'est pas chargé et le statut passé
 * à « publie » depuis l'admin.
 *
 * Exécution : npx ts-node prisma/seed-documents-planification.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DOCUMENTS = [
  {
    titre: 'SDADT — Schéma Départemental d’Aménagement et de Développement Territorial de Ziguinchor',
    slug: 'sdadt-ziguinchor',
    sousType: 'SDADT',
    deptCode: 'ZG',
    resume:
      'Document-cadre d’aménagement et de développement territorial du département de Ziguinchor (LOADT n°2021-04) : options d’aménagement, organisation de l’espace, occupation des sols, pôles économiques, réseaux et hiérarchie des établissements humains. Horizon 25 ans, révision tous les 10 ans.',
  },
  {
    titre: 'SDADT — Schéma Départemental d’Aménagement et de Développement Territorial de Bignona',
    slug: 'sdadt-bignona',
    sousType: 'SDADT',
    deptCode: 'BN',
    resume:
      'Document-cadre d’aménagement et de développement territorial du département de Bignona (LOADT n°2021-04). Horizon 25 ans, révision tous les 10 ans.',
  },
  {
    titre: 'SDADT — Schéma Départemental d’Aménagement et de Développement Territorial d’Oussouye',
    slug: 'sdadt-oussouye',
    sousType: 'SDADT',
    deptCode: 'OY',
    resume:
      'Document-cadre d’aménagement et de développement territorial du département d’Oussouye (LOADT n°2021-04). Horizon 25 ans, révision tous les 10 ans.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RÉPERTOIRE ANAT « Pôle-Territoire Sud » — à compléter une fois les territoires
// identifiés (l'étude ANAT recense 1 PDD et 2 POAS en vigueur, 18 PDC en
// vigueur, ainsi que 2 PDD et 12 PDC caducs, sans détailler les territoires).
//
// 1) PDD_EN_VIGUEUR : code du département possédant le PDD en vigueur.
// 2) POAS_SLUGS_COMMUNE : codes de communes possédant un POAS en vigueur.
// 3) COMMUNES_AVEC_PDC : codes de communes possédant un PDC en vigueur
//    (18 attendus). Renseignez puis relancez : npx ts-node prisma/seed-documents-planification.ts
//    → les fiches sont créées automatiquement (statut « brouillon », à publier
//    après chargement du PDF dans l'admin).
// ─────────────────────────────────────────────────────────────────────────────
const PDD_EN_VIGUEUR: string[] = []; // ex. ['ZG']
const POAS_COMMUNES: string[] = []; // ex. ['ZG-COM-NIAGUIS', 'BN-COM-DIOULOULOU']
const COMMUNES_AVEC_PDC: string[] = []; // ex. ['BN-COM-TENGHORY', 'OY-COM-DIEMBERING', …] (18 codes)

async function upsertFiche(params: {
  slug: string;
  titre: string;
  sousType: string;
  resume: string;
  typePlanification: 'TERRITORIALE' | 'URBAIN' | 'HISTORIQUE' | 'AUTRE';
  departementId?: string;
  communeId?: string;
  auteur: string;
}) {
  await prisma.document.upsert({
    where: { slug: params.slug },
    update: {
      titre: params.titre,
      resume: params.resume,
      sousType: params.sousType,
      departementId: params.departementId ?? null,
      communeId: params.communeId ?? null,
    },
    create: {
      titre: params.titre,
      slug: params.slug,
      resume: params.resume,
      fichier: '',
      format: 'pdf',
      typePlanification: params.typePlanification,
      sousType: params.sousType,
      departementId: params.departementId,
      communeId: params.communeId,
      langue: 'fr',
      statut: 'brouillon',
      auteur: params.auteur,
    },
  });
  console.log(`✓ Répertoire : ${params.titre}`);
}

async function main() {
  for (const doc of DOCUMENTS) {
    const dept = await prisma.departement.findUnique({ where: { code: doc.deptCode } });
    if (!dept) {
      console.log(`✗ Département ${doc.deptCode} introuvable, document ignoré`);
      continue;
    }
    await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {
        titre: doc.titre,
        resume: doc.resume,
        sousType: doc.sousType,
        departementId: dept.id,
      },
      create: {
        titre: doc.titre,
        slug: doc.slug,
        resume: doc.resume,
        fichier: '',
        format: 'pdf',
        typePlanification: 'TERRITORIALE',
        sousType: doc.sousType,
        departementId: dept.id,
        langue: 'fr',
        statut: 'brouillon',
        auteur: 'ANAT / Collectivités départementales',
      },
    });
    console.log(`✓ Répertoire : ${doc.titre}`);
  }
  console.log('\n✅ Répertoire des documents de planification pré-rempli (statut brouillon).');
  console.log('   Chargez les fichiers PDF et passez les fiches à « publie » depuis l’admin Documents.');

  // ── PDD en vigueur (ANAT : 1 PDD) ──────────────────────────────────────────
  for (const code of PDD_EN_VIGUEUR) {
    const dept = await prisma.departement.findUnique({ where: { code } });
    if (!dept) { console.log(`✗ Département ${code} introuvable`); continue; }
    await upsertFiche({
      slug: `pdd-${dept.nom.toLowerCase()}`,
      titre: `PDD — Plan Départemental de Développement de ${dept.nom}`,
      sousType: 'PDD',
      typePlanification: 'TERRITORIALE',
      resume: `Plan Départemental de Développement de ${dept.nom} (Loi n°2022-10 portant Système national de planification) : planification économique et sociale du département, horizon 5 ans.`,
      departementId: dept.id,
      auteur: 'Conseil départemental',
    });
  }

  // ── POAS en vigueur (ANAT : 2 POAS) ────────────────────────────────────────
  for (const code of POAS_COMMUNES) {
    const commune = await prisma.commune.findFirst({ where: { code }, include: { departement: true } });
    if (!commune) { console.log(`✗ Commune ${code} introuvable`); continue; }
    await upsertFiche({
      slug: `poas-${commune.code.toLowerCase()}`,
      titre: `POAS — Plan d’Occupation et d’Affectation des Sols de ${commune.nom}`,
      sousType: 'POAS',
      typePlanification: 'TERRITORIALE',
      resume: `Plan d’Occupation et d’Affectation des Sols de la commune de ${commune.nom} : vocation des terres (agriculture, élevage, habitat, zones forestières…).`,
      departementId: commune.departementId,
      communeId: commune.id,
      auteur: 'Commune de ' + commune.nom,
    });
  }

  // ── PDC en vigueur (ANAT : 18 PDC) ─────────────────────────────────────────
  for (const code of COMMUNES_AVEC_PDC) {
    const commune = await prisma.commune.findFirst({ where: { code }, include: { departement: true } });
    if (!commune) { console.log(`✗ Commune ${code} introuvable`); continue; }
    await upsertFiche({
      slug: `pdc-${commune.code.toLowerCase()}`,
      titre: `PDC — Plan de Développement Communal de ${commune.nom}`,
      sousType: 'PDC',
      typePlanification: 'TERRITORIALE',
      resume: `Plan de Développement Communal de ${commune.nom} (Loi n°2022-10) : planification économique et sociale de la commune, horizon 5 ans.`,
      departementId: commune.departementId,
      communeId: commune.id,
      auteur: 'Conseil municipal de ' + commune.nom,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });