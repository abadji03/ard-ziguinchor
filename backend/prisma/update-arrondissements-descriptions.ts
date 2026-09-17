import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DESCRIPTIONS: Record<string, string> = {
  'ZG-NIAGUIS': `## Présentation

L'arrondissement de Niaguis est l'un des deux arrondissements du département de Ziguinchor. Situé à l'est de la ville de Ziguinchor, il s'étend le long du fleuve Casamance et de la Route nationale 6 (RN6). Son chef-lieu est la commune de Niaguis.

## Communes

L'arrondissement de Niaguis comprend les communes suivantes :

- Adéane
- Boutoupa-Camaracounda
- Niaguis (chef-lieu)

## Situation géographique

L'arrondissement est situé sur la rive gauche du fleuve Casamance, à environ 30 km à l'est de Ziguinchor. Il est traversé par la RN6, axe stratégique reliant Ziguinchor à Kolda. Le territoire comprend des plaines rizicoles, des savanes arborées et des zones forestières, ainsi que la forêt classée de Bissine.

## Population

La population est composée principalement de Diolas, de Baïnounks, de Mandingues et de Peuls. Les communautés vivent de l'agriculture, du commerce et de l'exploitation des ressources forestières.

## Économie

L'économie repose sur :

- la riziculture et le maraîchage ;
- l'arboriculture (anacardiers, manguiers) ;
- le commerce de transit sur la RN6 ;
- l'exploitation forestière ;
- l'élevage.

## Infrastructures

L'arrondissement dispose de :

- structures administratives (sous-préfecture à Niaguis) ;
- établissements scolaires (écoles, collège) ;
- poste de santé ;
- marchés ;
- gare routière sur la RN6.`,

  'ZG-NIASSIA': `## Présentation

L'arrondissement de Niassia est le deuxième arrondissement du département de Ziguinchor. Situé à l'est du département, il s'étend le long du fleuve Casamance. Son chef-lieu est la commune de Niassia.

## Communes

L'arrondissement de Niassia comprend les communes suivantes :

- Enampore
- Niassia (chef-lieu)

## Situation géographique

L'arrondissement est situé à l'est du département de Ziguinchor, le long du fleuve Casamance. Le territoire est caractérisé par des plaines rizicoles, des forêts et des bolongs. L'accès se fait par la RN6 et les routes départementales.

## Population

La population est principalement composée de Diolas et de Baïnounks, avec une tradition agricole forte liée à la riziculture et à l'exploitation des ressources naturelles.

## Économie

L'économie repose sur :

- la riziculture ;
- l'arboriculture ;
- la pêche dans le fleuve Casamance ;
- l'exploitation forestière ;
- le petit commerce.

## Infrastructures

L'arrondissement dispose de :

- structures administratives ;
- établissements scolaires ;
- poste de santé ;
- marchés hebdomadaires.`,

  'BN-KATABA1': `## Présentation

L'arrondissement de Kataba 1 est l'un des quatre arrondissements du département de Bignona. Situé dans la partie ouest du département, il regroupe des communes côtières et de l'intérieur. Son chef-lieu est la commune de Kataba 1.

## Communes

L'arrondissement de Kataba 1 comprend les communes suivantes :

- Diouloulou
- Djinaky
- Kafountine
- Kataba 1 (chef-lieu)

## Situation géographique

L'arrondissement est situé dans une zone de transition entre la côte atlantique et l'intérieur des terres. Il comprend des plages (Kafountine), des mangroves, des bolongs et des forêts classées. L'accès se fait par des routes départementales reliant Bignona à la côte.

## Population

La population est principalement composée de Diolas, de pêcheurs et de communautés liées au tourisme. La saisonnalité touristique influence la dynamique démographique de l'arrondissement.

## Économie

L'économie repose sur :

- la pêche artisanale et maritime (Kafountine) ;
- le tourisme balnéaire (Kafountine) ;
- l'agriculture (riziculture, mil, arachide) ;
- l'exploitation forestière ;
- le commerce local.

## Infrastructures

L'arrondissement dispose de :

- campements et lodges touristiques ;
- débarcadère de pêche à Kafountine ;
- établissements scolaires ;
- postes de santé ;
- marchés ;
- routes reliant Bignona et la côte.`,

  'BN-TENGHORY': `## Présentation

L'arrondissement de Tenghory est l'un des quatre arrondissements du département de Bignona. Situé dans la partie centrale du département, il regroupe des communes de l'intérieur des terres. Son chef-lieu est la commune de Tenghory.

## Communes

L'arrondissement de Tenghory comprend les communes suivantes :

- Coubalan
- Niamone
- Ouonck
- Tenghory (chef-lieu)

## Situation géographique

L'arrondissement est situé dans une zone de plaines et de forêts, à l'intérieur du département de Bignona. Le territoire est caractérisé par des rizières, des savanes arborées et des zones forestières.

## Population

La population est majoritairement diola, avec une tradition agricole et pastorale forte. Les communautés vivent de l'agriculture, de l'élevage et du commerce local.

## Économie

L'économie repose sur :

- la riziculture et le maraîchage ;
- l'arboriculture (anacardiers) ;
- l'élevage ;
- l'exploitation forestière ;
- le commerce local.

## Infrastructures

L'arrondissement dispose de :

- structures administratives ;
- établissements scolaires ;
- postes de santé ;
- marchés hebdomadaires.`,

  'BN-TENDOUCK': `## Présentation

L'arrondissement de Tendouck est l'un des quatre arrondissements du département de Bignona. Situé dans la partie sud du département, il regroupe plusieurs communes de l'intérieur. Son chef-lieu est la commune de Tendouck.

## Communes

L'arrondissement de Tendouck comprend les communes suivantes :

- Balinghore
- Diégoune
- Kartiack
- Mangagoulack
- Mlomp

## Situation géographique

L'arrondissement est situé dans une zone de plaines et de plateaux, entourée de forêts et de zones agricoles. Il est relié aux autres centres du département par des routes départementales.

## Population

La population est majoritairement diola, avec une tradition agricole et pastorale forte. Les activités communautaires sont organisées autour des villages et des quartiers.

## Économie

L'économie repose sur :

- l'agriculture (riziculture, mil, arachide) ;
- l'arboriculture (anacardiers) ;
- l'élevage ;
- le commerce local ;
- l'artisanat.

## Infrastructures

L'arrondissement dispose de :

- établissements scolaires ;
- postes de santé ;
- marchés hebdomadaires ;
- structures administratives.`,

  'BN-SINDIAN': `## Présentation

L'arrondissement de Sindian est l'un des quatre arrondissements du département de Bignona. Situé dans la partie nord du département, près de la frontière gambienne, il regroupe plusieurs communes. Son chef-lieu est la commune de Sindian.

## Communes

L'arrondissement de Sindian comprend les communes suivantes :

- Djibidione
- Oulampane
- Sindian (chef-lieu)
- Suelle

## Situation géographique

L'arrondissement est situé dans la partie nord du département de Bignona, à proximité de la frontière avec la Gambie. Le territoire est caractérisé par des plaines, des forêts et des zones agricoles. Il est traversé par la RN4 reliant Ziguinchor à la Gambie.

## Population

La population est composée de Diolas, de Mandingues et d'autres communautés. La proximité de la Gambie influence les activités commerciales et culturelles de l'arrondissement.

## Économie

L'économie repose sur :

- l'agriculture (riziculture, arachide, mil) ;
- le commerce transfrontalier avec la Gambie ;
- l'élevage ;
- l'exploitation forestière ;
- le petit commerce.

## Infrastructures

L'arrondissement dispose de :

- structures administratives (sous-préfecture à Sindian) ;
- établissements scolaires ;
- postes de santé ;
- marchés ;
- routes reliant Bignona et la Gambie.`,

  'OY-CABROUSSE': `## Présentation

L'arrondissement de Cabrousse est l'un des deux arrondissements du département d'Oussouye. Situé dans la partie côtière du département, il regroupe des communes du littoral et de l'intérieur. Son chef-lieu est la commune de Cabrousse.

## Communes

L'arrondissement de Cabrousse comprend les communes suivantes :

- Diembéring
- Santhiaba Manjacque

## Situation géographique

L'arrondissement est situé dans une zone côtière, entre la forêt de mangroves et l'océan Atlantique. Son territoire comprend des plages, des bolongs, des mangroves et des forêts classées. La proximité de Cap Skirring en fait une zone stratégique pour le tourisme.

## Population

La population est majoritairement diola, avec une forte tradition agricole et halieutique. Les communautés vivent en harmonie avec leur environnement, préservant les traditions tout en s'adaptant au développement touristique.

## Économie

L'économie repose sur :

- le tourisme balnéaire et écotouristique ;
- la pêche artisanale ;
- la riziculture ;
- l'artisanat ;
- le petit commerce.

## Infrastructures

L'arrondissement dispose de :

- campements et lodges touristiques ;
- établissements scolaires ;
- poste de santé ;
- routes reliant Cap Skirring et Oussouye.`,

  'OY-LOUDIA': `## Présentation

L'arrondissement de Loudia Ouoloff est le deuxième arrondissement du département d'Oussouye. Situé dans la partie est du département, il regroupe des communes de l'intérieur. Son chef-lieu est la commune de Loudia Ouoloff.

## Communes

L'arrondissement de Loudia Ouoloff comprend les communes suivantes :

- Mlomp
- Oukout

## Situation géographique

L'arrondissement est situé à l'est du département d'Oussouye, dans une zone de mangroves, de bolongs et de forêts. Le territoire est traversé par des cours d'eau caractéristiques de la Basse-Casamance.

## Population

La population est majoritairement diola, avec une forte préservation des traditions et de l'organisation sociale. La culture diola, avec ses rites et ses cérémonies, constitue un patrimoine vivant remarquable.

## Économie

L'économie repose sur :

- la riziculture de mangrove ;
- la pêche dans les bolongs ;
- l'artisanat (vannerie, sculpture) ;
- le petit commerce ;
- l'arboriculture (anacardiers).

## Infrastructures

L'arrondissement dispose de :

- établissements scolaires ;
- poste de santé ;
- marchés ;
- routes reliant Oussouye et l'intérieur.`,
};

async function main() {
  for (const [code, description] of Object.entries(DESCRIPTIONS)) {
    const arr = await prisma.arrondissement.findUnique({
      where: { code },
    });
    if (arr) {
      await prisma.arrondissement.update({
        where: { id: arr.id },
        data: { description },
      });
      console.log(`✓ Description mise à jour pour ${arr.nom}`);
    } else {
      console.log(`✗ Arrondissement ${code} non trouvé`);
    }
  }
  console.log(
    '\n✅ Mise à jour des descriptions des arrondissements terminée !',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
