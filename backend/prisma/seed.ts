import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Créer le super admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@ard-ziguinchor.com' },
    update: {},
    create: {
      email: 'admin@ard-ziguinchor.com',
      nom: 'Admin',
      prenom: 'Super Admin',
      poste: 'Directeur de l\'agence',
      password: await bcrypt.hash('admin123', 10),
      role: 'SUPER_ADMIN',
      actif: true,
    },
  });
  console.log('Super admin créé:', superAdmin.email);

  // Créer les départements
  const departements = [
    // Estimations 2023 : ANSD, Situation économique et sociale de Ziguinchor 2022-2023.
    { nom: 'Ziguinchor', code: 'ZG', superficie: 1153, population: 275501 },
    { nom: 'Bignona', code: 'BN', superficie: 5295, population: 287499 },
    { nom: 'Oussouye', code: 'OY', superficie: 891, population: 54567 },
  ];

  const departementIds: Record<string, string> = {};
  for (const dept of departements) {
    const created = await prisma.departement.upsert({
      where: { code: dept.code },
      update: {
        nom: dept.nom,
        superficie: dept.superficie,
        population: dept.population,
      },
      create: dept,
    });
    departementIds[dept.code] = created.id;
  }
  console.log('Départements créés:', departements.length);

  // Créer les arrondissements
  const arrondissements = [
    // Département de Ziguinchor
    { nom: 'Niaguis', code: 'ZG-NIAGUIS', departementCode: 'ZG' },
    { nom: 'Niassia', code: 'ZG-NIASSIA', departementCode: 'ZG' },
    // Département de Bignona
    { nom: 'Kataba 1', code: 'BN-KATABA1', departementCode: 'BN' },
    { nom: 'Tenghory', code: 'BN-TENGHORY', departementCode: 'BN' },
    { nom: 'Tendouck', code: 'BN-TENDOUCK', departementCode: 'BN' },
    { nom: 'Sindian', code: 'BN-SINDIAN', departementCode: 'BN' },
    // Département d'Oussouye
    { nom: 'Cabrousse', code: 'OY-CABROUSSE', departementCode: 'OY' },
    { nom: 'Loudia Ouoloff', code: 'OY-LOUDIA', departementCode: 'OY' },
  ];

  const arrondissementIds: Record<string, string> = {};
  for (const arr of arrondissements) {
    const created = await prisma.arrondissement.upsert({
      where: { code: arr.code },
      update: {},
      create: {
        nom: arr.nom,
        code: arr.code,
        departementId: departementIds[arr.departementCode],
      },
    });
    arrondissementIds[arr.code] = created.id;
  }
  console.log('Arrondissements créés:', arrondissements.length);

  // Créer les communes avec leur hiérarchie
  const communes: {
    nom: string;
    code: string;
    departementCode: string;
    arrondissementCode: string | null;
    superficie?: number;
    population?: number;
    description?: string;
  }[] = [
    // Département de Ziguinchor
    {
      nom: 'Ziguinchor',
      code: 'ZG-COM-ZG',
      departementCode: 'ZG',
      arrondissementCode: null,
      superficie: 156.8,
      population: 214874,
      description:
        "Ziguinchor est le chef-lieu de la région de Ziguinchor et du département du même nom. Située sur la rive gauche (nord) du fleuve Casamance, c'est la capitale historique de la Basse-Casamance. La ville est un important centre économique et administratif.\n\n## Situation géographique\nZiguinchor est située à environ 60 km de l'océan Atlantique, sur la rive gauche (nord) du fleuve Casamance, à environ 450 km au sud de Dakar.\n\n## Population\nLa ville compte environ 205 294 habitants (estimation ANSD 2023), majoritairement issus des ethnies diola, mandingue et peule.\n\n## Économie\nL'économie repose principalement sur le commerce, la pêche, l'agriculture (arachide, coton, riz) et le tourisme.",
    },
    {
      nom: 'Adéane',
      code: 'ZG-COM-ADEANE',
      departementCode: 'ZG',
      arrondissementCode: 'ZG-NIAGUIS',
      superficie: 182.4,
      population: 19728,
      description:
        "Adéane est une commune du département de Ziguinchor, située dans l'arrondissement de Niaguis. La commune est essentiellement agricole, avec une forte production de riz, de fruits et de légumes.\n\n## Situation\nAdéane est située à environ 60 km à l'est de Ziguinchor, le long de la route nationale 6 (RN6) reliant Ziguinchor à Kolda, sur la rive gauche du fleuve Casamance.\n\n## Économie\nL'agriculture est la principale activité économique, avec la culture du riz, des agrumes et des fruits tropicaux.",
    },
    {
      nom: 'Boutoupa-Camaracounda',
      code: 'ZG-COM-BOUTOUPA',
      departementCode: 'ZG',
      arrondissementCode: 'ZG-NIAGUIS',
      superficie: 154.7,
      population: 8682,
      description:
        "Boutoupa-Camaracounda est une commune du département de Ziguinchor, située dans l'arrondissement de Niaguis. La commune est connue pour ses vastes rizières et son patrimoine culturel diola.\n\n## Situation\nLa commune est située à environ 45 km à l'est de Ziguinchor, sur la route nationale 6 (RN6).\n\n## Économie\nLa riziculture est l'activité économique dominante, complétée par l'élevage et l'exploitation forestière.",
    },
    {
      nom: 'Enampore',
      code: 'ZG-COM-ENAMPORE',
      departementCode: 'ZG',
      arrondissementCode: 'ZG-NIASSIA',
      superficie: 78.3,
      population: 4877,
      description:
        "Enampore est une commune du département de Ziguinchor, située dans l'arrondissement de Niassia. Célèbre pour son fromager (arbre emblématique), Enampore est un site touristique important de la Casamance.\n\n## Patrimoine\nLe fromager d'Enampore est un arbre majestueux, lieu de rassemblement des populations.\n\n## Tourisme\nLa commune attire de nombreux visiteurs grâce à son patrimoine culturel et naturel exceptionnel.",
    },
    {
      nom: 'Niaguis',
      code: 'ZG-COM-NIAGUIS',
      departementCode: 'ZG',
      arrondissementCode: 'ZG-NIAGUIS',
      superficie: 98.5,
      population: 21671,
      description:
        "Niaguis est une commune du département de Ziguinchor, chef-lieu de l'arrondissement du même nom. La commune est située sur la rive gauche du fleuve Casamance.\n\n## Situation\nLa commune est traversée par la route nationale 6 (RN6) qui relie Ziguinchor à Kolda, à environ 18 km à l'est de la ville de Ziguinchor.\n\n## Activités\nLa pêche et l'agriculture sont les principales activités économiques.",
    },
    {
      nom: 'Niassia',
      code: 'ZG-COM-NIASSIA',
      departementCode: 'ZG',
      arrondissementCode: 'ZG-NIASSIA',
      superficie: 112.6,
      population: 5669,
      description:
        "Niassia est une commune du département de Ziguinchor, chef-lieu de l'arrondissement du même nom. La commune est située en zone rurale, dans une région de forêts et de rizières.\n\n## Situation\nNiassia est située dans la partie orientale du département de Ziguinchor.\n\n## Économie\nLa riziculture et la culture du mil dominent l'économie locale.",
    },
    // Département de Bignona
    {
      nom: 'Bignona',
      code: 'BN-COM-BIGNONA',
      departementCode: 'BN',
      arrondissementCode: null,
      superficie: 213.2,
      population: 28642,
      description:
        "Bignona est le chef-lieu du département de Bignona. C'est la deuxième ville de la région de Ziguinchor. La ville est un important carrefour économique entre la Gambie et la Guinée-Bissau.\n\n## Situation\nBignona est située à environ 70 km au nord de Ziguinchor.\n\n## Économie\nLa ville est un centre commercial actif, avec un important marché hebdomadaire et des activités agricoles diversifiées.\n\n## Culture\nBignona est connue pour sa tradition culturelle diola et ses fêtes traditionnelles.",
    },
    {
      nom: 'Balinghore',
      code: 'BN-COM-BALINGHORE',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENDOUCK',
      superficie: 145.3,
      population: 5513,
      description:
        "Balinghore est une commune du département de Bignona, située dans l'arrondissement de Tendouck. La commune est connue pour ses vergers d'agrumes.\n\n## Situation\nBalinghore est située dans la partie septentrionale du département de Bignona.\n\n## Économie\nLa culture des agrumes (oranges, mandarines, citrons) est l'activité principale.",
    },
    {
      nom: 'Coubalan',
      code: 'BN-COM-COUBALAN',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENGHORY',
      superficie: 168.9,
      population: 12156,
      description:
        "Coubalan est une commune du département de Bignona, située dans l'arrondissement de Tenghory. La commune est un important bassin agricole de la région.\n\n## Économie\nLa culture du riz, de l'arachide et du maïs constitue l'essentiel des activités économiques.",
    },
    {
      nom: 'Diégoune',
      code: 'BN-COM-DIEGOUNE',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENDOUCK',
      superficie: 132.4,
      population: 7534,
      description:
        "Diégoune est une commune du département de Bignona, située dans l'arrondissement de Tendouck. Commune rurale, elle est essentiellement tournée vers l'agriculture.\n\n## Situation\nDiégoune est située dans la zone de transition entre la mangrove et les plateaux continentaux.",
    },
    {
      nom: 'Diouloulou',
      code: 'BN-COM-DIOULOULOU',
      departementCode: 'BN',
      arrondissementCode: 'BN-KATABA1',
      superficie: 187.6,
      population: 8109,
      description:
        "Diouloulou est une commune du département de Bignona, située dans l'arrondissement de Kataba 1. La commune est connue pour sa production de sel et sa proximité avec la Gambie.\n\n## Situation\nDiouloulou est située à environ 15 km de la frontière gambienne.\n\n## Économie\nLa production de sel, la pêche et le commerce transfrontalier sont les principales activités.",
    },
    {
      nom: 'Djibidione',
      code: 'BN-COM-DJIBIDIONE',
      departementCode: 'BN',
      arrondissementCode: 'BN-SINDIAN',
      superficie: 125.8,
      population: 8859,
      description:
        "Djibidione est une commune du département de Bignona, située dans l'arrondissement de Sindian. La commune est un centre agricole important.\n\n## Économie\nLa culture du riz, des céréales et des fruits tropicaux domine l'économie locale.",
    },
    {
      nom: 'Djinaky',
      code: 'BN-COM-DJINAKY',
      departementCode: 'BN',
      arrondissementCode: 'BN-KATABA1',
      superficie: 142.3,
      population: 19580,
      description:
        "Djinaky est une commune du département de Bignona, située dans l'arrondissement de Kataba 1. Commune essentiellement rurale, elle vit principalement de l'agriculture traditionnelle.\n\n## Activités\nL'agriculture vivrière (riz, mil, arachide) est la principale activité économique.",
    },
    {
      nom: 'Kafountine',
      code: 'BN-COM-KAFOUNTINE',
      departementCode: 'BN',
      arrondissementCode: 'BN-KATABA1',
      superficie: 198.5,
      population: 41590,
      description:
        "Kafountine est une commune du département de Bignona, située dans l'arrondissement de Kataba 1. C'est un important port de pêche et un site touristique prisé de la Basse-Casamance.\n\n## Situation\nKafountine est située sur la côte atlantique, à proximité de la frontière gambienne, au nord-ouest de la Basse-Casamance.\n\n## Économie\nLa pêche est l'activité économique dominante, complétée par le tourisme, le commerce et l'horticulture.\n\n## Tourisme\nLa commune est réputée pour ses plages, ses hôtels et sa vie nocturne animée.",
    },
    {
      nom: 'Kartiack',
      code: 'BN-COM-KARTIACK',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENDOUCK',
      superficie: 156.2,
      population: 7962,
      description:
        "Kartiack est une commune du département de Bignona, située dans l'arrondissement de Tendouck. La commune est connue pour sa production de riz et de fruits.\n\n## Situation\nKartiack est située dans une zone de bas-fonds propice à la riziculture.\n\n## Économie\nLa riziculture et l'arboriculture fruitière sont les principales activités.",
    },
    {
      nom: 'Kataba 1',
      code: 'BN-COM-KATABA1',
      departementCode: 'BN',
      arrondissementCode: 'BN-KATABA1',
      superficie: 226.4,
      population: 31996,
      description:
        "Kataba 1 est une commune du département de Bignona, chef-lieu de l'arrondissement du même nom. La commune est située dans l'intérieur des terres, à proximité de la zone côtière de l'arrondissement (Kafountine).\n\n## Situation\nKataba 1 se trouve dans la partie ouest du département de Bignona, entre les plaines de l'intérieur et la côte atlantique.\n\n## Économie\nL'agriculture (riz, mil, arachide), l'arboriculture et la pêche constituent les piliers de l'économie locale.",
    },
    {
      nom: 'Mangagoulack',
      code: 'BN-COM-MANGAGOULACK',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENDOUCK',
      superficie: 112.5,
      population: 8503,
      description:
        "Mangagoulack est une commune du département de Bignona, située dans l'arrondissement de Tendouck. Commune paisible de Basse-Casamance.\n\n## Situation\nMangagoulack est située dans une zone de mangrove et de rizières.",
    },
    {
      nom: 'Mlomp',
      code: 'BN-COM-MLOMP',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENGHORY',
      superficie: 96.7,
      population: 3128,
      description:
        'Mlomp (arrondissement de Tenghory) est une commune du département de Bignona. Village historique de Basse-Casamance.\n\n## Patrimoine\nMlomp est connue pour ses cases à impluvium et son patrimoine culturel diola.',
    },
    {
      nom: 'Niamone',
      code: 'BN-COM-NIAMONE',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENGHORY',
      superficie: 165.8,
      population: 8785,
      description:
        "Niamone est une commune du département de Bignona, située dans l'arrondissement de Tenghory. La commune est connue pour sa production de fruits tropicaux.\n\n## Économie\nLa culture des fruits tropicaux (mangues, ananas, bananes) et du riz est l'activité principale.",
    },
    {
      nom: 'Oulampane',
      code: 'BN-COM-OULAMPANE',
      departementCode: 'BN',
      arrondissementCode: 'BN-SINDIAN',
      superficie: 138.6,
      population: 14909,
      description:
        "Oulampane est une commune du département de Bignona, située dans l'arrondissement de Sindian. Commune rurale, elle vit essentiellement de l'agriculture.\n\n## Situation\nOulampane est située dans la partie nord du département de Bignona.",
    },
    {
      nom: 'Ouonck',
      code: 'BN-COM-OUONCK',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENGHORY',
      superficie: 125.4,
      population: 10914,
      description:
        "Ouonck est une commune du département de Bignona, située dans l'arrondissement de Tenghory. La commune est connue pour son patrimoine culturel et ses activités agricoles.\n\n## Économie\nL'agriculture vivrière et l'arboriculture sont les principales activités.",
    },
    {
      nom: 'Sindian',
      code: 'BN-COM-SINDIAN',
      departementCode: 'BN',
      arrondissementCode: 'BN-SINDIAN',
      superficie: 148.4,
      population: 11676,
      description:
        "Sindian est une commune du département de Bignona, chef-lieu de l'arrondissement du même nom. La commune est un important centre agricole de la région.\n\n## Situation\nSindian est située dans la partie septentrionale du département de Bignona.\n\n## Économie\nL'agriculture, notamment la culture du riz et de l'arachide, est l'activité dominante.\n\n## Culture\nLa commune est réputée pour ses cérémonies traditionnelles diolas.",
    },
    {
      nom: 'Suelle',
      code: 'BN-COM-SUELLE',
      departementCode: 'BN',
      arrondissementCode: 'BN-SINDIAN',
      superficie: 118.9,
      population: 9174,
      description:
        "Suelle est une commune du département de Bignona, située dans l'arrondissement de Sindian. Petite commune rurale de Basse-Casamance.\n\n## Situation\nSuelle est située dans une zone de plateaux et de rizières.",
    },
    {
      nom: 'Tenghory',
      code: 'BN-COM-TENGHORY',
      departementCode: 'BN',
      arrondissementCode: 'BN-TENGHORY',
      superficie: 172.3,
      population: 39509,
      description:
        "Tenghory est une commune du département de Bignona, chef-lieu de l'arrondissement du même nom. C'est l'un des plus grands centres de production agricole du département.\n\n## Situation\nTenghory est située au centre du département de Bignona.\n\n## Économie\nLa production de riz, d'arachide et de coton constitue l'essentiel des activités économiques.",
    },
    {
      nom: 'Thionck-Essyl',
      code: 'BN-COM-THIONCK',
      departementCode: 'BN',
      arrondissementCode: null,
      superficie: 182.7,
      population: 8961,
      description:
        "Thionck-Essyl est une commune du département de Bignona, rattachée directement au département. Le village est célèbre pour son patrimoine culturel unique et son fromager sacré.\n\n## Patrimoine\nThionck-Essyl est réputé pour ses cases à impluvium, ses bois sacrés et ses traditions diolas préservées.\n\n## Culture\nLe village est un haut lieu du tourisme culturel en Casamance.\n\n## Situation\nLa commune est située à 71 km au Nord-Ouest de la région de Ziguinchor.",
    },
    // Département d'Oussouye
    {
      nom: 'Oussouye',
      code: 'OY-COM-OUSSOUYE',
      departementCode: 'OY',
      arrondissementCode: null,
      superficie: 145.6,
      population: 5705,
      description:
        "Oussouye est une commune de la Basse-Casamance et le chef-lieu du département d'Oussouye. C'est le cœur du pays diola, connu pour sa culture traditionnelle exceptionnelle.\n\n## Situation\nOussouye est située dans la partie sud-ouest de la région de Ziguinchor, à environ 40 km de la ville de Ziguinchor.\n\n## Culture\nOussouye est célèbre pour ses traditions royales, ses cérémonies d'initiation et ses bois sacrés.\n\n## Tourisme\nLa commune attire de nombreux touristes intéressés par la culture diola authentique.",
    },
    {
      nom: 'Diembéring',
      code: 'OY-COM-DIEMBERING',
      departementCode: 'OY',
      arrondissementCode: 'OY-CABROUSSE',
      superficie: 98.3,
      population: 25902,
      description:
        "Diembéring est un village du Sénégal situé en Basse-Casamance, à environ 10 km au nord de Cap Skirring et à 60 km de Ziguinchor. C'est le chef-lieu de la commune de Diembéring, dans l'arrondissement de Kabrousse.\n\n## Situation\nDiembéring est située entre l'océan Atlantique et la forêt de Basse-Casamance.\n\n## Économie\nLa pêche, l'agriculture et le tourisme sont les principales activités économiques.",
    },
    {
      nom: 'Mlomp',
      code: 'OY-COM-MLOMP',
      departementCode: 'OY',
      arrondissementCode: 'OY-LOUDIA',
      superficie: 72.5,
      population: 11426,
      description:
        "Mlomp (arrondissement de Loudia Ouoloff) est une commune du département d'Oussouye. Village traditionnel diola, Mlomp est célèbre pour son architecture et ses cases à impluvium.\n\n## Patrimoine\nMlomp est l'un des derniers villages à avoir conservé l'architecture traditionnelle diola avec ses cases à impluvium.\n\n## Tourisme\nLe village est une destination prisée pour découvrir la culture diola authentique.",
    },
    {
      nom: 'Oukout',
      code: 'OY-COM-OUKOUT',
      departementCode: 'OY',
      arrondissementCode: 'OY-LOUDIA',
      superficie: 64.8,
      population: 8493,
      description:
        "Oukout est une commune du département d'Oussouye, située dans l'arrondissement de Loudia Ouoloff. Commune rurale de Basse-Casamance.\n\n## Situation\nOukout est située dans une zone de forêts et de rizières propices à l'agriculture.",
    },
    {
      nom: 'Santhiaba Manjacque',
      code: 'OY-COM-SANTHIABA',
      departementCode: 'OY',
      arrondissementCode: 'OY-CABROUSSE',
      superficie: 85.2,
      population: 3041,
      description:
        "Santhiaba Manjacque est une commune du département d'Oussouye, située dans l'arrondissement de Cabrousse. La commune tire son nom de l'ethnie manjacque présente dans la région.\n\n## Situation\nSanthiaba Manjacque est située dans la partie sud du département d'Oussouye, à proximité de la Guinée-Bissau.\n\n## Économie\nL'agriculture vivrière et la pêche sont les principales activités de la population.",
    },
  ];

  for (const com of communes) {
    const existing = await prisma.commune.findFirst({
      where: { code: com.code },
    });
    if (!existing) {
      await prisma.commune.create({
        data: {
          nom: com.nom,
          code: com.code,
          departementId: departementIds[com.departementCode],
          arrondissementId: com.arrondissementCode
            ? arrondissementIds[com.arrondissementCode]
            : null,
          superficie: com.superficie ?? null,
          population: com.population ?? null,
          description: com.description ?? null,
        },
      });
    } else {
      await prisma.commune.update({
        where: { id: existing.id },
        data: {
          nom: com.nom,
          code: com.code,
          departementId: departementIds[com.departementCode],
          arrondissementId: com.arrondissementCode
            ? arrondissementIds[com.arrondissementCode]
            : null,
          superficie: com.superficie ?? null,
          population: com.population ?? null,
          description: com.description ?? null,
        },
      });
    }
  }
  console.log('Communes créées:', communes.length);

  // Créer les types de partenaires
  const typesPartenaire = [
    { nom: 'PTF', description: 'Partenaire technique et financier' },
    { nom: 'ONG', description: 'Organisation non gouvernementale' },
    { nom: 'Institutionnel', description: 'Partenaire institutionnel' },
    { nom: 'Privé', description: 'Partenaire privé' },
  ];

  const typePartenaireIds: Record<string, string> = {};
  for (const type of typesPartenaire) {
    const created = await prisma.typePartenaire.upsert({
      where: { nom: type.nom },
      update: {},
      create: type,
    });
    typePartenaireIds[type.nom] = created.id;
  }
  console.log('Types de partenaires créés:', typesPartenaire.length);

  // Créer les partenaires de l'ARD
  const partenaires: {
    nom: string;
    sigle?: string;
    slug: string;
    description: string;
    typeNom: string;
    pays?: string;
    ville?: string;
    siteWeb?: string;
    email?: string;
    statut: string;
  }[] = [
    {
      nom: 'Union Européenne',
      sigle: 'UE',
      slug: 'union-europeenne',
      typeNom: 'PTF',
      pays: 'Union Européenne',
      ville: 'Dakar',
      siteWeb: 'https://www.eeas.europa.eu/delegations/senegal_fr',
      email: 'delegation-senegal@eeas.europa.eu',
      description:
        "L'Union Européenne, via sa délégation au Sénégal, est un partenaire technique et financier majeur de l'ARD de Ziguinchor. Elle accompagne les programmes de développement régional, la gouvernance locale et la croissance durable en Basse-Casamance.",
      statut: 'actif',
    },
    {
      nom: 'Agence Française de Développement',
      sigle: 'AFD',
      slug: 'afd',
      typeNom: 'PTF',
      pays: 'France',
      ville: 'Dakar',
      siteWeb: 'https://www.afd.fr/fr/page-region-pays/senegal',
      email: 'senegal@afd.fr',
      description:
        "L'Agence Française de Développement finance des projets structurants pour l'ARD de Ziguinchor : infrastructures, eau et assainissement, agriculture, développement territorial et renforcement des capacités locales.",
      statut: 'actif',
    },
    {
      nom: 'PNUD Sénégal',
      sigle: 'PNUD',
      slug: 'pnud-senegal',
      typeNom: 'PTF',
      pays: 'Sénégal',
      ville: 'Dakar',
      siteWeb: 'https://www.undp.org/fr/senegal',
      email: 'comms.reg.africa@undp.org',
      description:
        "Le Programme des Nations Unies pour le Développement (PNUD) appuie l'ARD de Ziguinchor dans l'atteinte des Objectifs de Développement Durable, la planification régionale et la résilience climatique.",
      statut: 'actif',
    },
    {
      nom: 'Banque Mondiale',
      sigle: 'BM',
      slug: 'banque-mondiale',
      typeNom: 'PTF',
      pays: 'États-Unis / Sénégal',
      ville: 'Dakar',
      siteWeb: 'https://www.banquemondiale.org/fr/country/senegal',
      description:
        "La Banque Mondiale accompagne l'ARD de Ziguinchor à travers des financements et assistances techniques pour les projets d'infrastructures, d'agriculture et de développement du secteur privé régional.",
      statut: 'actif',
    },
    {
      nom: 'GIZ Sénégal',
      sigle: 'GIZ',
      slug: 'giz-senegal',
      typeNom: 'PTF',
      pays: 'Allemagne / Sénégal',
      ville: 'Dakar',
      siteWeb: 'https://www.giz.de/fr-fr/worldwide/philosophie/senegal',
      description:
        "La coopération technique allemande (GIZ) accompagne l'ARD de Ziguinchor sur les thématiques du développement économique local, de la formation professionnelle et de la gestion durable des ressources naturelles.",
      statut: 'actif',
    },
    {
      nom: 'USAID Sénégal',
      sigle: 'USAID',
      slug: 'usaid-senegal',
      typeNom: 'PTF',
      pays: 'États-Unis / Sénégal',
      ville: 'Dakar',
      siteWeb: 'https://www.usaid.gov/senegal',
      description:
        "L'USAID soutient l'ARD de Ziguinchor dans les domaines de la croissance économique, de la santé, de la gouvernance et de l'adaptation au changement climatique en Casamance.",
      statut: 'actif',
    },
    {
      nom: 'Région Bretagne',
      sigle: 'Bretagne',
      slug: 'region-bretagne',
      typeNom: 'Institutionnel',
      pays: 'France',
      ville: 'Rennes',
      siteWeb: 'https://www.bretagne.bzh',
      description:
        "Dans le cadre de la coopération décentralisée, la Région Bretagne soutient l'ARD de Ziguinchor dans ses projets de développement territorial, culturel et économique interrégionaux.",
      statut: 'actif',
    },
    {
      nom: 'ANSD',
      sigle: 'ANSD',
      slug: 'ansd',
      typeNom: 'Institutionnel',
      pays: 'Sénégal',
      ville: 'Dakar',
      siteWeb: 'https://www.ansd.sn',
      description:
        "L'Agence Nationale de la Statistique et de la Démographie (ANSD) fournit des données et appuis techniques à l'ARD de Ziguinchor pour éclairer ses outils de planification territoriale.",
      statut: 'actif',
    },
  ];

  for (const p of partenaires) {
    const typeId = typePartenaireIds[p.typeNom];
    if (!typeId) {
      console.log(`✗ Type de partenaire inconnu pour ${p.nom}: ${p.typeNom}`);
      continue;
    }
    const { typeNom, ...data } = p;
    await prisma.partenaire.upsert({
      where: { slug: data.slug },
      update: { ...data, typeId },
      create: { ...data, typeId },
    });
  }
  console.log('Partenaires créés:', partenaires.length);

  // Créer les catégories de contenu
  const categoriesActualite = [
    {
      nom: 'Actualité',
      slug: 'actualite',
      description: 'Actualités générales',
    },
    {
      nom: 'Communiqué',
      slug: 'communique',
      description: 'Communiqués officiels',
    },
    { nom: 'Événement', slug: 'evenement', description: 'Événements' },
  ];

  for (const cat of categoriesActualite) {
    await prisma.categorieActualite.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Catégories d'actualités créées:", categoriesActualite.length);

  // Créer les catégories de documents
  const categoriesDocument = [
    { nom: 'Rapport', slug: 'rapport', description: "Rapports d'activité" },
    { nom: 'Étude', slug: 'etude', description: 'Études et diagnostics' },
    { nom: 'Plan', slug: 'plan', description: 'Plans de développement' },
    { nom: 'Guide', slug: 'guide', description: 'Guides méthodologiques' },
  ];

  for (const cat of categoriesDocument) {
    await prisma.categorieDocument.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Catégories de documents créées:', categoriesDocument.length);

  // Créer les types d'opportunités
  const typesOpportunite = [
    { nom: "Appel d'offres" },
    { nom: 'Appel à projets' },
    { nom: 'Recrutement' },
    { nom: 'Stage' },
    { nom: 'Formation' },
  ];

  for (const type of typesOpportunite) {
    const existingType = await prisma.typeOpportunite.findFirst({
      where: { nom: type.nom },
    });
    if (!existingType) {
      await prisma.typeOpportunite.create({ data: type });
    }
  }
  console.log("Types d'opportunités créés:", typesOpportunite.length);

  // Créer les secteurs d'intervention
  const secteurs = [
    {
      nom: 'Agriculture',
      slug: 'agriculture',
      description: 'Secteur agricole et développement rural',
    },
    {
      nom: 'Éducation',
      slug: 'education',
      description: "Secteur de l'éducation",
    },
    { nom: 'Santé', slug: 'sante', description: 'Secteur de la santé' },
    {
      nom: 'Infrastructures',
      slug: 'infrastructures',
      description: 'Infrastructures et équipements',
    },
    {
      nom: 'Environnement',
      slug: 'environnement',
      description: 'Environnement et climat',
    },
    {
      nom: 'Économie',
      slug: 'economie',
      description: 'Développement économique',
    },
    {
      nom: 'Gouvernance',
      slug: 'gouvernance',
      description: 'Gouvernance locale, décentralisation et renforcement des capacités des collectivités',
    },
    {
      nom: 'Tourisme',
      slug: 'tourisme',
      description: 'Tourisme, écotourisme et mise en valeur du patrimoine',
    },
    {
      nom: 'Eau et Assainissement',
      slug: 'eau-assainissement',
      description: 'Accès à l’eau potable, hydraulique et assainissement',
    },
    {
      nom: 'Transport et Mobilité',
      slug: 'transport-mobilite',
      description: 'Pistes, routes, transport et mobilité régionale',
    },
    {
      nom: 'Élevage',
      slug: 'elevage',
      description: 'Élevage et filières pastorales',
    },
    {
      nom: 'Pêche',
      slug: 'peche',
      description: 'Pêche artisanale et économie maritime',
    },
    {
      nom: 'Énergie',
      slug: 'energie',
      description: 'Énergie et électrification',
    },
    {
      nom: 'Jeunesse et Insertion professionnelle',
      slug: 'jeunesse-insertion',
      description: 'Insertion professionnelle des jeunes et des femmes (PAIJEF, PATIP-JF)',
    },
    {
      nom: 'Culture et Patrimoine',
      slug: 'culture-patrimoine',
      description: 'Culture, patrimoine et cohésion sociale',
    },
    {
      nom: 'Urbanisme et Aménagement',
      slug: 'urbanisme-amenagement',
      description: 'Urbanisme, aménagement du territoire et foncier',
    },
  ];

  for (const secteur of secteurs) {
    const existingSecteur = await prisma.secteur.findFirst({
      where: { slug: secteur.slug },
    });
    if (!existingSecteur) {
      await prisma.secteur.create({ data: secteur });
    }
  }
  console.log('Secteurs créés:', secteurs.length);

  // Créer les catégories FAQ
  const categoriesFAQ = [
    { nom: 'Général', description: 'Questions générales' },
    { nom: 'Projets', description: 'Questions sur les projets' },
    { nom: 'Documentation', description: 'Questions sur les documents' },
    { nom: 'Contact', description: 'Questions sur le contact' },
  ];

  for (const cat of categoriesFAQ) {
    const existingCat = await prisma.categorieFaq.findFirst({
      where: { nom: cat.nom },
    });
    if (!existingCat) {
      await prisma.categorieFaq.create({ data: cat });
    }
  }
  console.log('Catégories FAQ créées:', categoriesFAQ.length);

  // Créer les FAQ (basées sur les missions et actions de l'ARD Ziguinchor) — partie 1
  const catIdFor = async (nom: string) => {
    const found = await prisma.categorieFaq.findFirst({ where: { nom } });
    return found?.id ?? null;
  };
  const faqsData1 = async () => [
    {
      question: "Qu'est-ce que l'ARD Ziguinchor ?",
      reponse:
        "L'Agence Régionale de Développement (ARD) de Ziguinchor est un établissement public chargé de promouvoir et de coordonner le développement économique, social et culturel de la région de Ziguinchor. Elle accompagne les collectivités locales, les porteurs de projets et les partenaires au développement dans la mise en œuvre des politiques territoriales.",
      categorieId: await catIdFor('Général'),
      ordre: 1,
    },
    {
      question: 'Quelles sont les missions principales de l\'ARD ?',
      reponse:
        "L'ARD Ziguinchor a pour missions : l'élaboration et le suivi du plan régional de développement intégré (PRDI), l'appui technique aux collectivités locales, la promotion des investissements et de l'entrepreneuriat local, la mise en œuvre de programmes de développement dans les secteurs clés (agriculture, pêche, tourisme, éducation, santé, infrastructures) et la valorisation des potentialités de la région.",
      categorieId: await catIdFor('Général'),
      ordre: 2,
    },
    {
      question: 'Quels sont les départements couverts par l\'ARD Ziguinchor ?',
      reponse:
        "L'ARD Ziguinchor couvre les trois départements de la région : Ziguinchor, Bignona et Oussouye, ainsi que l'ensemble de leurs communes et communautés rurales.",
      categorieId: await catIdFor('Général'),
      ordre: 3,
    },
    {
      question: 'Comment l\'ARD soutient-elle les porteurs de projets ?',
      reponse:
        "L'ARD accompagne les porteurs de projets à travers : l'orientation et le conseil technique, la mise en réseau avec les partenaires financiers et techniques, l'appui à la structuration des dossiers de financement, et le suivi-évaluation des initiatives locales. Les opportunités de financement et appels à candidatures en cours sont publiées régulièrement dans la section Opportunités du site.",
      categorieId: await catIdFor('Projets'),
      ordre: 4,
    },
    {
      question: 'Quels types de projets l\'ARD met-elle en œuvre dans la région ?',
      reponse:
        "Les projets portés ou appuyés par l'ARD couvrent plusieurs secteurs : développement agricole et agro-industriel, valorisation des filières locales (mangue, riz, pêche), promotion du tourisme durable, accès à l'eau et à l'électricité, développement des infrastructures socio-économiques, insertion professionnelle des jeunes et autonomisation des femmes.",
      categorieId: await catIdFor('Projets'),
      ordre: 5,
    },
    {
      question: 'Comment puis-je suivre les projets en cours dans la région ?',
      reponse:
        "La section « Projets » du site présente les projets et programmes en cours ou réalisés, avec leurs fiches descriptives. La rubrique « Observatoire » permet également de consulter les indicateurs de développement territorial de la région par secteur, département et commune.",
      categorieId: await catIdFor('Projets'),
      ordre: 6,
    },
  ];


  // Créer les FAQ (basées sur les missions et actions de l'ARD Ziguinchor) — partie 2
  const faqsData2 = async (catId: (nom: string) => Promise<string | null>) => [
    {
      question: 'Comment candidater à une opportunité publiée par l\'ARD ?',
      reponse:
        "Rendez-vous dans la section « Opportunités » du site, ouvrez l'opportunité qui vous intéresse et consultez les conditions d'éligibilité. Le dossier de candidature détaillé est disponible en téléchargement sur la fiche de l'opportunité. Les candidatures se font généralement auprès de l'organisme indiqué, dans le respect de la date limite mentionnée.",
      categorieId: await catId('Projets'),
      ordre: 7,
    },
    {
      question: 'Quels documents sont disponibles en téléchargement sur le site ?',
      reponse:
        "La section « Documentation » met à disposition les documents officiels de l'ARD : plans régionaux de développement, rapports d'activités, études sectorielles, guides et fiches techniques, ainsi que les dossiers de présentation des projets et programmes.",
      categorieId: await catId('Documentation'),
      ordre: 8,
    },
    {
      question: 'L\'observatoire territorial est-il accessible au public ?',
      reponse:
        "Oui. La page « Observatoire » du site donne accès aux indicateurs statistiques de la région (éducation, santé, infrastructures, environnement, économie), filtrables par secteur, département, commune et année. Ces données sont alimentées par l'ARD et ses partenaires techniques.",
      categorieId: await catId('Documentation'),
      ordre: 9,
    },
    {
      question: 'Comment contacter l\'ARD Ziguinchor ?',
      reponse:
        "Vous pouvez joindre l'ARD Ziguinchor via le formulaire de contact disponible sur la page « Contact » du site, par téléphone ou par email aux coordonnées indiquées en bas de page (footer). Vous pouvez également vous rendre à nos bureaux situés à Ziguinchor.",
      categorieId: await catId('Contact'),
      ordre: 10,
    },
    {
      question: 'Comment devenir partenaire de l\'ARD ?',
      reponse:
        "Les organisations (ONG, coopérations, secteur privé, institutions) souhaitant collaborer avec l'ARD peuvent prendre contact via la page Contact ou se rapprocher directement de la Direction. L'ARD signe des conventions de partenariat et coordonne les interventions des partenaires au développement sur le territoire régional.",
      categorieId: await catId('Contact'),
      ordre: 11,
    },
    {
      question: 'Les collectivités locales peuvent-elles solliciter l\'ARD ?',
      reponse:
        "Oui. L'appui aux collectivités locales (région, communes, communautés rurales) est au cœur des missions de l'ARD : appui à la planification locale, assistance technique pour la formulation de projets, recherche de financements et suivi-évaluation des investissements publics locaux.",
      categorieId: await catId('Contact'),
      ordre: 12,
    },
  ];


  // ─────────────────────────────────────────────────────────────────────────────
  // CONTENUS : programmes, projets, actualités, opportunités
  // Les programmes ci-dessous sont des programmes nationaux réels et documentés
  // du développement territorial au Sénégal. Les descriptions sont volontairement
  // génériques et prudentes : l'ARD de Ziguinchor est un acteur d'appui au
  // développement local, mais les détails précis (montants, partenaires, dates)
  // doivent être confirmés/corrigés par l'équipe de l'ARD.
  // ─────────────────────────────────────────────────────────────────────────────

  // Récupérer les IDs des référentiels créés précédemment.
  const secteurIds: Record<string, string> = {};
  for (const s of secteurs) {
    const found = await prisma.secteur.findFirst({ where: { slug: s.slug } });
    if (found) secteurIds[s.slug] = found.id;
  }

  const typeOpportuniteIds: Record<string, string> = {};
  for (const t of typesOpportunite) {
    const found = await prisma.typeOpportunite.findFirst({
      where: { nom: t.nom },
    });
    if (found) typeOpportuniteIds[t.nom] = found.id;
  }

  // Exécution : créer les 12 FAQ si absentes
  const allFaqs = [...(await faqsData1()), ...(await faqsData2(catIdFor))]
    .filter((f) => f.categorieId !== null)
    .map((f) => ({ ...f, categorieId: f.categorieId as string }));
  for (const faq of allFaqs) {
    const existingFaq = await prisma.faq.findFirst({
      where: { question: faq.question },
    });
    if (!existingFaq) {
      await prisma.faq.create({ data: faq });
    }
  }
  console.log('FAQ créées:', allFaqs.length);

  const categorieActualite = async (slug: string) => {
    const found = await prisma.categorieActualite.findFirst({
      where: { slug },
    });
    return found?.id ?? null;
  };

  // Purge des anciens enregistrements "d'exemple" du seed précédent pour
  // garantir une base propre lorsque le seed est relancé. (Seuls ces slugs de
  // démonstration sont supprimés ; les contenus réels et édités sont conservés.)
  await prisma.programme.deleteMany({
    where: { slug: { in: ['pndl', 'pronat', 'pdidac', 'pudc', 'bioclima-finance'] } },
  });
  await prisma.projet.deleteMany({
    where: {
      slug: {
        in: [
          'pistes-production-basse-casamance',
          'appui-riziculture-securite-alimentaire',
          'rehabilitation-infrastructures-communautaires',
          'ecotourisme-ressources-naturelles',
          'autonomisation-femmes-jeunes',
        ],
      },
    },
  });
  await prisma.actualite.deleteMany({
    where: {
      slug: {
        in: [
          'ard-ziguinchor-developpement-local',
          'partenaires-techniques-financiers',
          'planification-territoriale-projets',
        ],
      },
    },
  });
  await prisma.opportunite.deleteMany({
    where: {
      slug: {
        in: [
          'appel-offres-amenagement',
          'appel-a-projets-initiatives-locales',
          'recrutement-ingenieur-projet',
        ],
      },
    },
  });
// Programmes nationaux de développement territorial
  const programmes = [
    {
      nom: 'Projet de Développement Économique de la Casamance',
      acronyme: 'PDEC',
      slug: 'pdec',
      resume:
        "Projet phare de développement économique et local en Casamance (Ziguinchor, Sédhiou, Kolda).",
      description:
        "Le PDEC intervient dans les régions de Ziguinchor, Sédhiou et Kolda (60 communes) pour renforcer la gouvernance locale inclusive, la connectivité, les infrastructures résilientes au climat, l'inclusion sociale et la cohésion communautaire. L'ARD de Ziguinchor est agence partenaire de mise en œuvre : élaboration et actualisation des PDC et suivi des sous-projets communautaires. Financement : Banque mondiale (IDA).",
      organismePilote: 'PDEC',
      statut: 'actif',
    },
    {
      nom: "Projet d'Appui à l'Insertion Professionnelle des Jeunes et des Femmes formés",
      acronyme: 'PAIJEF',
      slug: 'paijef',
      resume:
        "Insertion professionnelle des jeunes diplômés et des femmes de la région de Ziguinchor.",
      description:
        "Le PAIJEF vise l'insertion professionnelle des jeunes diplômés et des femmes. L'ARD de Ziguinchor pilote des missions de suivi des stagiaires, des actions auprès des entreprises, et le Dispositif Territorial de Premier Emploi, avec une démarche d'inclusion (personnes en situation de handicap).",
      organismePilote: 'ARD Ziguinchor',
      statut: 'actif',
    },
    {
      nom: 'Programme d’Appui aux Communes et agglomérations du Sénégal',
      acronyme: 'PACASEN',
      slug: 'pacasen',
      resume:
        "Programme d'appui aux infrastructures et à la gestion des communes et agglomérations.",
      description:
        "Le PACASEN finance des infrastructures de base et renforce les capacités de gestion des communes et agglomérations. L'ARD de Ziguinchor contribue à son déploiement dans la région de Ziguinchor.",
      organismePilote: 'PACASEN',
      statut: 'actif',
    },
    {
      nom: 'Projet d’Appui à la Territorialisation des politiques d’Insertion Professionnelle des Jeunes et des Femmes',
      acronyme: 'PATIP-JF',
      slug: 'patip-jf',
      resume:
        "Territorialisation des politiques d'insertion professionnelle des jeunes et des femmes.",
      description:
        "Le PATIP-JF déploie des politiques d'insertion professionnelle à l'échelle territoriale à travers les communes de la région de Ziguinchor (18 communes cibles en 2026). L'ARD en coordonne localement la mise en œuvre.",
      organismePilote: 'ARD Ziguinchor',
      statut: 'actif',
    },
    {
      nom: 'Programme pour la gouvernance concertée du littoral',
      acronyme: 'GCL',
      slug: 'gouvernance-littoral',
      resume:
        "Gouvernance concertée des ressources naturelles littorales (avec l'AFD).",
      description:
        "Programme porté avec l'AFD sur la gouvernance des ressources naturelles, les territoires ruraux et urbains, la gestion durable et la participation des acteurs. L'ARD de Ziguinchor figure parmi les institutions et services déconcentrés partenaires du programme.",
      organismePilote: 'AFD',
      statut: 'actif',
    },
    {
      nom: 'BIOCLIMATE Finance',
      acronyme: 'BIOCLIMATE',
      slug: 'bioclimate-finance',
      resume:
        "Restauration de la biodiversité et technologies bas carbone (Ziguinchor, Kafountine).",
      description:
        "Programme d'appui à la résilience des écosystèmes et des communautés par la restauration de la biodiversité et le déploiement de technologies bas carbone, avec ENDA ENERGIE, les ARD, les collectivités, Eaux et Forêts, les aires marines protégées et les IMF. Zone : Ziguinchor et Kafountine.",
      organismePilote: 'ENDA ENERGIE',
      statut: 'actif',
    },
  ];

  const programmeIds: Record<string, string> = {};
  for (const prog of programmes) {
    const created = await prisma.programme.upsert({
      where: { slug: prog.slug },
      update: { ...prog },
      create: prog,
    });
    programmeIds[prog.slug] = created.id;
  }
  console.log('Programmes créés:', programmes.length);

  // Projets réels liés aux programmes de l'ARD (sources : PDEC, PACASEN).
  const projets = [
    {
      titre: 'Aménagement de la vallée de Mpack',
      slug: 'amenagement-vallee-mpack',
      resume:
        "Aménagement hydro-agricole de la vallée de Mpack (Ziguinchor, PDEC).",
      description:
        "Travaux d'aménagement de la vallée de Mpack dans le cadre du PDEC, visant à valoriser les bas-fonds, améliorer la production agricole et renforcer la sécurité alimentaire. Le PDEC prévoit la réhabilitation de 23 vallées rizicoles couvrant 3 300 hectares en Casamance.",
      objectifs:
        "Valoriser les bas-fonds ; améliorer la production rizicole ; renforcer la sécurité alimentaire.",
      secteurSlug: 'agriculture',
      programmeSlug: 'pdec',
      statut: 'encours',
      niveauAvancement: 40,
      budget: 300000000,
      beneficiaires: 15000,
    },
    {
      titre: 'Réhabilitation de 23 vallées rizicoles',
      slug: 'rehabilitation-vallees-rizicoles',
      resume:
        "Réhabilitation de 23 vallées rizicoles (dont 11 dans la région de Ziguinchor) sur 3 300 ha.",
      description:
        "Le PDEC suit la réhabilitation de 23 vallées rizicoles pour renforcer la sécurité alimentaire en Casamance ; 11 de ces vallées se trouvent dans la région de Ziguinchor.",
      objectifs:
        "Augmenter les superficies emblavées ; améliorer les rendements ; sécuriser les productions.",
      secteurSlug: 'agriculture',
      programmeSlug: 'pdec',
      statut: 'encours',
      niveauAvancement: 50,
      budget: 500000000,
      beneficiaires: 20000,
    },
    {
      titre: 'Pistes rurales de désenclavement',
      slug: 'pistes-rurales-desenclavement',
      resume:
        "Construction et réhabilitation de pistes rurales (PDEC, notamment pistes Mpack–Soukouta).",
      description:
        "Le programme PDEC prévoit la réalisation de pistes rurales (quant 131 km réalisés à l'échelle régionale) pour désenclaver les zones de production de la Basse-Casamance et améliorer la mobilité rurale.",
      objectifs:
        "Désenclaver les terroirs ; faciliter l'accès aux marchés ; améliorer la mobilité rurale.",
      secteurSlug: 'infrastructures',
      programmeSlug: 'pdec',
      statut: 'encours',
      niveauAvancement: 55,
      budget: 450000000,
      beneficiaires: 25000,
    },
    {
      titre: 'Infrastructures sociales de base à Ziguinchor',
      slug: 'infrastructures-sociales-ziguinchor',
      resume:
        "Construction de sous-projets d'infrastructures sociales de base dans les communes (PDEC).",
      description:
        "Dans le cadre du PDEC, réception de sous-projets de construction d'infrastructures sociales de base dans plusieurs communes de la région (Suelle, Sindian, Ouonck, Nyassia, Niaguis, Niamone, Boutoupa, Mlomp, Djiniacky, Kartiack, Mangagoulack, Oukout, Kataba 1, Enampore...).",
      objectifs:
        "Renforcer l'accès aux services sociaux de base ; améliorer les conditions de vie des communautés.",
      secteurSlug: 'education',
      programmeSlug: 'pdec',
      statut: 'encours',
      niveauAvancement: 70,
      budget: 400000000,
      beneficiaires: 30000,
    },
    {
      titre: 'Construction de la nouvelle gare routière de Ziguinchor',
      slug: 'gare-routiere-ziguinchor',
      resume:
        "Investissement structurant PACASEN : construction de la nouvelle gare routière de Ziguinchor.",
      description:
        "Investissement structurant financé dans le cadre du PACASEN (plus de 5 milliards FCFA investis dans la région de Ziguinchor via les collectivités de Ziguinchor, Bignona, Oussouye et Thionck-Essyl). L'ARD a accompagné les collectivités dans la planification et la réalisation de l'ouvrage.",
      objectifs:
        "Améliorer la mobilité urbaine ; dynamiser le transport et le commerce local.",
      secteurSlug: 'infrastructures',
      programmeSlug: 'pacasen',
      statut: 'planifie',
      niveauAvancement: 15,
      budget: 600000000,
      beneficiaires: 50000,
    },
  ];

  const projetIds: Record<string, string> = {};
  for (const proj of projets) {
    const secteurId = secteurIds[proj.secteurSlug];
    if (!secteurId) {
      console.log(`✗ Secteur inconnu pour ${proj.titre}: ${proj.secteurSlug}`);
      continue;
    }
    const programmeId = proj.programmeSlug
      ? programmeIds[proj.programmeSlug]
      : null;
    const { secteurSlug, programmeSlug, ...data } = proj;
    const created = await prisma.projet.upsert({
      where: { slug: data.slug },
      update: { ...data, secteurId, ...(programmeId ? { programmeId } : {}) },
      create: { ...data, secteurId, ...(programmeId ? { programmeId } : {}) },
    });
    projetIds[data.slug] = created.id;
  }
  console.log('Projets créés:', projets.length);

  // Actualités récentes de l'ARD de Ziguinchor (sources : publications officielles).
  const actualites = [
    {
      titre: "Atelier de renforcement des capacités sur l'insertion professionnelle des personnes en situation de handicap",
      slug: 'insertion-professionnelle-handicap-atelier',
      resume:
        "Atelier de renforcement des capacités dans le cadre de l'Initiative FIT ! / PAIJEF (21 juillet 2026).",
      contenu:
        "L'ARD de Ziguinchor a organisé un atelier de renforcement des capacités sur l'insertion professionnelle des personnes en situation de handicap, dans le cadre de l'Initiative FIT ! / PAIJEF. Ce contenu porte sur l'inclusion et l'accès à l'emploi.",
      categorieSlug: 'evenement',
      statut: 'publie',
      tags: ['PAIJEF', 'Handicap', 'Insertion'],
    },
    {
      titre: 'Mission de suivi des stagiaires du PAIJEF – Phase 2',
      slug: 'suivi-stagiaires-paijef-phase2',
      resume:
        "Suivi des stagiaires du PAIJEF dans les entreprises d'accueil des départements de Ziguinchor, Bignona et Oussouye (6 juillet 2026).",
      contenu:
        "Dans le cadre du PAIJEF, l'ARD de Ziguinchor a mené des missions de suivi des stagiaires de la Phase 2, auprès des entreprises d'accueil des départements de Ziguinchor, Bignona et Oussouye, afin d'apprécier leur progression et de consolider l'insertion professionnelle.",
      categorieSlug: 'actualite',
      statut: 'publie',
      tags: ['PAIJEF', 'Stages', 'Ziguinchor'],
    },
    {
      titre: 'Liste des candidats présélectionnés PATIP-JF',
      slug: 'preselection-candidats-patip-jf',
      resume:
        "Publication de la liste des candidats présélectionnés du PATIP-JF dans la région de Ziguinchor (22 avril 2026).",
      contenu:
        "La liste des candidats présélectionnés dans le cadre du Projet d'Appui à la Territorialisation des politiques d'Insertion Professionnelle des Jeunes et des Femmes (PATIP-JF) a été publiée pour la région de Ziguinchor.",
      categorieSlug: 'communique',
      statut: 'publie',
      tags: ['PATIP-JF', 'Présélection', 'Jeunes'],
    },
  ];

  for (const act of actualites) {
    const categorieId = await categorieActualite(act.categorieSlug);
    const { categorieSlug, ...data } = act;
    await prisma.actualite.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        ...(categorieId ? { categorieId } : {}),
        tags: data.tags,
      },
      create: {
        ...data,
        ...(categorieId ? { categorieId } : {}),
        tags: data.tags,
      },
    });
  }
  console.log('Actualités créées:', actualites.length);

  // Opportunités publiées par l'ARD de Ziguinchor (sources : PAIJEF, PATIP-JF).
  const opportunites = [
    {
      titre: "Appel à candidatures pour la sélection de jeunes diplômés stagiaires (PAIJEF)",
      slug: 'appel-candidatures-paijef-2024',
      resume:
        "Sélection de jeunes diplômés stagiaires au profit du secteur privé de la région de Ziguinchor (1er août 2024).",
      description:
        "Dans le cadre du Projet d'Appui à l'Insertion des Jeunes et des Femmes Formés (PAIJEF), l'ARD de Ziguinchor lance une sélection de jeunes diplômés stagiaires au profit du secteur privé de la région de Ziguinchor.",
      typeNom: 'Stage',
      organisme: 'ARD Ziguinchor / PAIJEF',
      secteur: 'Insertion professionnelle',
      statut: 'ouvert',
      conditions:
        "Dossier de candidature à déposer selon les modalités indiquées dans l'appel à candidature officiel (PDF). Public : jeunes diplômés de la région de Ziguinchor.",
    },
    {
      titre: "Appel concernant 113 stages professionnels (PAIJEF – PATIP-JF)",
      slug: 'appel-113-stages-paijef-patip-jf',
      resume:
        "Offre de 113 stages professionnels (mars 2026) : jeunes diplômés, 18-35 ans, allocation de 80 000 à 110 000 FCFA/mois.",
      description:
        "L'ARD de Ziguinchor publie un appel concernant 113 stages professionnels dans le cadre du PAIJEF et du PATIP-JF. Stages de 9 mois, allocation de 80 000 à 110 000 FCFA/mois, ouverts aux jeunes diplômés de 18 à 35 ans (18 à 40 ans pour les personnes en situation de handicap).",
      typeNom: 'Stage',
      organisme: 'ARD Ziguinchor / PAIJEF / PATIP-JF',
      secteur: 'Insertion professionnelle',
      statut: 'ouvert',
      conditions:
        "Être un jeune diplômé de 18 à 35 ans (18-40 pour les personnes handicapées). Durée : 9 mois. Allocation mensuelle : 80 000 à 110 000 FCFA.",
    },
    {
      titre: "Appel à candidatures PATIP-JF (36 postes de stage dans 18 communes)",
      slug: 'appel-candidatures-patip-jf-36-stages',
      resume:
        "Appel à candidatures du PATIP-JF pour 36 postes de stage dans 18 communes de la région (avril 2026).",
      description:
        "Appel à candidatures du PATIP-JF pour 36 postes de stage dans 18 communes de la région de Ziguinchor (Bignona, Kataba 1, Djinaki, Kafountine, Tenghory, Djibidione, Oulampane, Oussouye, Diembéring, Santhiaba Manjack, Oukout, Mlomp, Ziguinchor, Niaguis, Adéane, Boutoupa Camaracounda, Niassia, Enampore).",
      typeNom: 'Appel à projets',
      organisme: 'ARD Ziguinchor / PATIP-JF',
      secteur: 'Insertion professionnelle',
      statut: 'ouvert',
      conditions:
        "Candidature à déposer via le Guichet Jeunesse et selon les modalités de l'appel à candidatures.",
    },
  ];

  for (const opp of opportunites) {
    const typeId = typeOpportuniteIds[opp.typeNom];
    if (!typeId) {
      console.log(`✗ Type d'opportunité inconnu: ${opp.typeNom}`);
      continue;
    }
    const { typeNom, ...data } = opp;
    await prisma.opportunite.upsert({
      where: { slug: data.slug },
      update: { ...data, typeId },
      create: { ...data, typeId },
    });
  }
  console.log('Opportunités créées:', opportunites.length);

  // Créer les paramètres du site
  const existingParams = await prisma.parametreSite.findFirst();
  if (existingParams) {
    await prisma.parametreSite.update({
      where: { id: existingParams.id },
      data: {
        nomSite: 'ARD Ziguinchor',
        description: 'Agence Régionale de Développement de Ziguinchor',
        adresse: 'Ziguinchor, Sénégal',
        telephone: '+221 33 123 45 67',
        email: 'contact@ard-ziguinchor.com',
        facebook: 'https://facebook.com/ardziguinchor',
        linkedin: 'https://linkedin.com/company/ardziguinchor',
      },
    });
  } else {
    await prisma.parametreSite.create({
      data: {
        nomSite: 'ARD Ziguinchor',
        description: 'Agence Régionale de Développement de Ziguinchor',
        adresse: 'Ziguinchor, Sénégal',
        telephone: '+221 33 123 45 67',
        email: 'contact@ard-ziguinchor.com',
        facebook: 'https://facebook.com/ardziguinchor',
        linkedin: 'https://linkedin.com/company/ardziguinchor',
      },
    });
  }
  console.log('Paramètres du site créés');

  console.log('\n✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
