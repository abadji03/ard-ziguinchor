import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DESCRIPTIONS: Record<string, { description: string; image?: string }> = {
  ZG: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Ziguinchor_294A4530_Casamance.jpg/500px-Ziguinchor_294A4530_Casamance.jpg',
    description: `## Présentation

Le département de Ziguinchor est l'un des trois départements de la région de Ziguinchor, dans le sud du Sénégal. Il tire son nom de la ville de Ziguinchor, chef-lieu du département et capitale régionale. Situé au cœur de la Casamance, il s'étend sur environ 1 153 km² et compte environ 275 000 habitants.

## Histoire

Le département de Ziguinchor a été créé en 1960, au moment de l'indépendance du Sénégal. Son histoire est intimement liée à celle de la ville de Ziguinchor, ancien comptoir portugais fondé au XVIIe siècle, puis colonie française à partir de 1886. Le département a été au centre de la crise casamançaise qui a marqué la région de 1982 à 2004.

## Situation géographique

Le département est situé sur les rives du fleuve Casamance, à environ 450 km au sud de Dakar. Il est limité au nord par le département de Bignona, à l'est par la région de Sédhiou, et au sud par la Guinée-Bissau. Le territoire est caractérisé par des plaines rizicoles, des mangroves et des bolongs typiques de la Casamance.

## Découpage administratif

Le département de Ziguinchor comprend :

- 2 arrondissements : Niaguis et Niassia
- 6 communes : Ziguinchor (chef-lieu), Adéane, Boutoupa-Camaracounda, Enampore, Niaguis et Niassia

## Population

La population est cosmopolite, composée principalement de Diolas, de Baïnounks, de Mandingues, de Peuls et de Wolofs. Cette diversité ethnique se reflète dans la richesse culturelle du département, avec une cohabitation harmonieuse des traditions et des religions (islam, christianisme, animisme).

## Économie

L'économie du département repose sur :

- le commerce, grâce au port fluvial de Ziguinchor ;
- l'agriculture (riziculture, arboriculture, maraîchage) ;
- la pêche artisanale sur le fleuve Casamance ;
- le transport fluvial et routier ;
- le tourisme ;
- l'artisanat (vannerie, sculpture, tissage) ;
- les services administratifs et l'Université Assane Seck.

## Patrimoine et environnement

Le département dispose d'un patrimoine colonial remarquable, de marchés animés, et constitue la porte d'entrée vers les sites touristiques de la Basse-Casamance. Les mangroves, bolongs et forêts classées enrichissent son environnement naturel.

## Infrastructures

Le département dispose de :

- un port fluvial reliant Dakar et la Guinée-Bissau ;
- un aéroport international ;
- l'Université Assane Seck de Ziguinchor (UASZ) ;
- des établissements scolaires et de formation ;
- un centre hospitalier régional ;
- des marchés et centres commerciaux ;
- la Route nationale 6 reliant Ziguinchor à Kolda.`,
  },

  BN: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Bignona_Casamance_294A4458_Emile_Badiane.jpg/500px-Bignona_Casamance_294A4458_Emile_Badiane.jpg',
    description: `## Présentation

Le département de Bignona est le plus vaste des trois départements de la région de Ziguinchor, avec une superficie d'environ 5 295 km². Il tire son nom de la ville de Bignona, chef-lieu du département. Situé en Basse-Casamance, il est caractérisé par ses vastes forêts, ses rizières et sa façade maritime touristique (Kafountine).

## Histoire

Le département de Bignona a été créé en 1984 par scission de l'ancien département de Ziguinchor. Son histoire est marquée par la tradition diola, l'organisation sociale en villages et la résistance culturelle. Le département a également été affecté par la crise casamançaise, particulièrement dans les zones frontalières avec la Gambie.

## Situation géographique

Le département est situé entre la frontière gambienne au nord et le fleuve Casamance au sud. Il s'étend de la côte atlantique à l'ouest (Kafountine) jusqu'aux zones forestières de l'intérieur. Le territoire comprend des plaines, des forêts classées, des rizières, des bolongs et une façade maritime avec des plages de sable fin.

## Découpage administratif

Le département de Bignona comprend :

- 4 arrondissements : Kataba 1, Tenghory, Tendouck et Sindian
- 19 communes : Bignona (chef-lieu), Balinghore, Coubalan, Diégoune, Diouloulou, Djibidione, Djinaky, Kafountine, Kartiack, Kataba 1, Mangagoulack, Mlomp, Niamone, Oulampane, Ouonck, Sindian, Suelle, Tenghory et Thionck-Essyl

## Population

La population est majoritairement composée de Diolas, de Baïnounks, de Mandingues et de Mancagnes. Les communautés vivent principalement de l'agriculture, de la pêche et du commerce. La culture diola, avec ses traditions et son organisation sociale, y est profondément ancrée.

## Économie

L'économie du département repose sur :

- l'agriculture (riziculture, maraîchage, arboriculture avec anacardiers et manguiers) ;
- la pêche artisanale et maritime (Kafountine) ;
- le tourisme balnéaire (Kafountine) ;
- le commerce transfrontalier avec la Gambie ;
- l'exploitation forestière ;
- l'artisanat ;
- l'élevage.

## Patrimoine et environnement

Le département abrite des sites naturels remarquables : les forêts classées, les plages de Kafountine, les mangroves et bolongs de la côte, ainsi que les rizières de l'intérieur. La culture diola y est préservée avec ses cases à impluvium, ses cérémonies et son organisation traditionnelle.

## Infrastructures

Le département dispose de :

- la Route nationale 4 reliant Ziguinchor à la Gambie ;
- des routes départementales vers la côte et l'intérieur ;
- des structures administratives (sous-préfecture) ;
- des établissements scolaires (écoles, collèges, lycée) ;
- des centres et postes de santé ;
- des marchés animés ;
- des débarcadères de pêche (Kafountine) ;
- des campements et lodges touristiques.`,
  },

  OY: {
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Oussouye1.JPG/500px-Oussouye1.JPG',
    description: `## Présentation

Le département d'Oussouye est le moins peuplé mais l'un des plus riches en biodiversité des trois départements de la région de Ziguinchor. Il tire son nom de la ville d'Oussouye, chef-lieu du département. C'est le fief de la culture diola, connu pour ses bolongs, ses mangroves et son écotourisme. Il s'étend sur environ 891 km².

## Histoire

Le département d'Oussouye a été créé en 2008 par scission du département de Bignona. Son histoire est profondément ancrée dans celle de la Casamance, avec la préservation du royaume diola d'Oussouye, dont le roi (le "Awa") joue un rôle symbolique et culturel majeur. La localité a conservé une organisation traditionnelle forte, unique au Sénégal.

## Situation géographique

Le département est situé au sud-ouest de la région de Ziguinchor, à environ 50 km de la ville de Ziguinchor. Il est limité au nord par le département de Bignona, à l'est par la Guinée-Bissau, et au sud par l'océan Atlantique. Le territoire est caractérisé par ses mangroves, ses bolongs, ses forêts et son littoral.

## Découpage administratif

Le département d'Oussouye comprend :

- 2 arrondissements : Cabrousse et Loudia Ouoloff
- 5 communes : Oussouye (chef-lieu), Diembéring, Mlomp, Oukout et Santhiaba Manjacque

## Population

La population est majoritairement diola, avec une forte préservation des traditions et de l'organisation sociale. La culture diola, avec ses rites, ses cérémonies et son mode de vie, constitue un patrimoine vivant remarquable. Le royaume traditionnel d'Oussouye y joue un rôle central.

## Économie

L'économie du département repose sur :

- la riziculture de mangrove ;
- la pêche dans les bolongs et sur le littoral ;
- l'écotourisme et le tourisme balnéaire (Diembéring, proximité de Cap Skirring) ;
- l'artisanat (vannerie, sculpture) ;
- le petit commerce ;
- l'arboriculture (anacardiers).

## Patrimoine et environnement

Oussouye est réputée pour sa réserve de Pointe Saint-Georges, ses mangroves et ses bolongs. La culture diola y est préservée, avec le royaume traditionnel, les cases à impluvium et les cérémonies rituelles. L'écotourisme y est développé, en harmonie avec l'environnement. Les plages de Diembéring et la proximité de Cap Skirring en font une destination prisée.

## Infrastructures

Le département dispose de :

- des routes reliant Oussouye à Ziguinchor et à Cap Skirring ;
- des structures administratives (sous-préfecture) ;
- des établissements scolaires ;
- un centre de santé ;
- des campements et lodges écotouristiques ;
- des marchés ;
- un aéroport à proximité (Cap Skirring).`,
  },
};

async function main() {
  for (const [code, { description, image }] of Object.entries(DESCRIPTIONS)) {
    const dept = await prisma.departement.findUnique({
      where: { code },
    });
    if (dept) {
      await prisma.departement.update({
        where: { id: dept.id },
        data: { description, image },
      });
      console.log(`✓ Description mise à jour pour ${dept.nom}`);
    } else {
      console.log(`✗ Département ${code} non trouvé`);
    }
  }
  console.log('\n✅ Mise à jour des descriptions des départements terminée !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
