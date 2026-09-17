import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

/**
 * Références : ANSD, SES de Ziguinchor 2022-2023 et carte administrative
 * fournie avec le projet. Les populations sont des estimations 2023.
 */
const DEPARTEMENTS = [
  { code: 'ZG', population: 275501 },
  { code: 'BN', population: 287499 },
  { code: 'OY', population: 54567 },
];

const COMMUNES_ARRONDISSEMENTS = [
  ['BN-COM-BALINGHORE', 'BN-TENDOUCK'],
  ['BN-COM-COUBALAN', 'BN-TENGHORY'],
  ['BN-COM-DIEGOUNE', 'BN-TENDOUCK'],
  ['BN-COM-MLOMP', 'BN-TENDOUCK'],
  ['BN-COM-OULAMPANE', 'BN-SINDIAN'],
  ['BN-COM-OUONCK', 'BN-TENGHORY'],
  ['OY-COM-MLOMP', 'OY-LOUDIA'],
  ['OY-COM-SANTHIABA', 'OY-CABROUSSE'],
] as const;

async function main() {
  for (const { code, population } of DEPARTEMENTS) {
    await prisma.departement.update({ where: { code }, data: { population } });
  }

  for (const [communeCode, arrondissementCode] of COMMUNES_ARRONDISSEMENTS) {
    const arrondissement = await prisma.arrondissement.findUniqueOrThrow({
      where: { code: arrondissementCode },
      select: { id: true },
    });
    const commune = await prisma.commune.findFirstOrThrow({
      where: { code: communeCode },
      select: { id: true },
    });
    await prisma.commune.update({
      where: { id: commune.id },
      data: { arrondissementId: arrondissement.id },
    });
  }

  console.log('Références territoriales de Ziguinchor mises à jour.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
