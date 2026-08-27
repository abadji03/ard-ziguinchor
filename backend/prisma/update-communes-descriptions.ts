import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DESCRIPTIONS: Record<string, string> = {
  'ZG-COM-ZG': `## Présentation

Ziguinchor est une ville située dans le sud du Sénégal, chef-lieu de la région et du département éponymes. Elle se trouve au cœur de la région naturelle de la Casamance, sur les rives du fleuve Casamance. Avec plus de 160 000 habitants, c'est la troisième plus grande ville du sud du Sénégal et un carrefour économique et culturel majeur.

## Histoire

Fondée au XVIIe siècle par les Portugais, Ziguinchor a été un comptoir commercial important avant de passer sous contrôle français en 1886. Son nom viendrait de l'expression diola "Sigi Jikor", signifiant "le lieu où l'on se repose". La ville a joué un rôle central durant la crise casamançaise et demeure un symbole de la paix et de la réconciliation.

## Situation géographique

Ziguinchor est située sur la rive nord du fleuve Casamance, à environ 450 km au sud de Dakar. La ville est bordée par le fleuve qui la traverse d'est en ouest, offrant un paysage de mangroves et de bolongs. Elle bénéficie d'un climat de type soudano-guinéen avec une saison des pluies de juin à octobre.

## Population

La population est cosmopolite, composée principalement de Diolas, de Baïnounks, de Mandingues, de Peuls et de Wolofs. Cette diversité ethnique se reflète dans la richesse culturelle de la ville, avec une cohabitation harmonieuse des traditions et des religions.

## Économie

L'économie de Ziguinchor repose sur :

- le commerce, grâce à son port fluvial actif ;
- l'agriculture (riziculture, arboriculture) ;
- la pêche artisanale sur le fleuve Casamance ;
- le transport fluvial et routier ;
- le tourisme, avec des hôtels et infrastructures d'accueil ;
- l'artisanat (vannerie, sculpture, tissage).

## Patrimoine et environnement

La ville dispose d'un patrimoine colonial remarquable, de marchés animés (Marché Saint-Maur), et constitue la porte d'entrée vers les sites touristiques de la Basse-Casamance (Cap Skirring, îles de la Casamance). L'Université Assane Seck de Ziguinchor (UASZ) y est implantée depuis 2007.

## Infrastructures

La commune dispose notamment de :

- un port fluvial reliant Dakar et la Guinée-Bissau ;
- un aéroport international ;
- l'Université Assane Seck ;
- des établissements scolaires et de formation ;
- un centre hospitalier régional ;
- des marchés et centres commerciaux.`,

  'ZG-COM-ADEANE': `## Présentation

Adéane est une commune du département de Ziguinchor, située dans l'arrondissement de Niaguis, au sud-ouest du Sénégal, en Basse-Casamance. Elle se trouve à environ 35 kilomètres au nord-est de la ville de Ziguinchor, sur la Route nationale 6 (RN6) reliant Ziguinchor à Kolda. La commune est bordée par le fleuve Casamance et le Soungrougrou, ce qui lui confère d'importantes ressources en eau favorables à l'agriculture.

## Histoire

Adéane est une localité ancienne qui occupait, durant la période coloniale, le rôle de chef-lieu d'un important canton portant son nom. Après l'indépendance du Sénégal, ce statut administratif a été transféré à Niaguis, devenu chef-lieu de l'arrondissement. Malgré cette évolution, Adéane demeure un centre historique important de la Basse-Casamance.

## Situation géographique

La commune est implantée sur la rive gauche du fleuve Casamance, au confluent du Soungrougrou. Son territoire comprend des plaines rizicoles, des zones forestières et plusieurs bolongs caractéristiques de la Casamance. Elle est traversée par la RN6, axe stratégique reliant les régions de Ziguinchor, Sédhiou et Kolda. La proximité de la forêt classée de Bissine renforce son intérêt écologique.

## Population

La population est principalement composée de Baïnounks, de Diolas, de Mandingues, de Mancagnes et d'autres communautés vivant en harmonie. Les activités traditionnelles sont fortement liées à la riziculture, à l'arboriculture et au commerce local.

## Économie

L'économie repose essentiellement sur :

- la riziculture de bas-fonds ;
- le maraîchage ;
- l'arboriculture (mangues, agrumes, anacardiers) ;
- l'élevage ;
- le petit commerce ;
- les activités liées au transport grâce à la RN6.

## Patrimoine et environnement

Le territoire bénéficie d'importantes ressources naturelles, notamment des forêts classées, des zones humides et des terres agricoles fertiles. Les traditions culturelles diolas et baïnounks y occupent également une place importante.

## Infrastructures

La commune dispose notamment de :

- structures administratives ;
- établissements scolaires ;
- poste de santé ;
- marchés hebdomadaires ;
- réseau routier reliant Ziguinchor et Kolda.`,

  'ZG-COM-NIAGUIS': `## Présentation

Niaguis est une commune du département de Ziguinchor, chef-lieu de l'arrondissement éponyme. Située sur la rive gauche du fleuve Casamance, près de Ziguinchor et non loin de la frontière avec la Guinée-Bissau, elle joue un rôle administratif et économique important dans la Basse-Casamance.

## Histoire

Niaguis est devenu chef-lieu d'arrondissement après l'indépendance du Sénégal, succédant à Adéane dans ce rôle administratif. La localité s'est développée autour de ses fonctions administratives et commerciales, devenant un pôle important de l'arrière-pays ziguinchorois.

## Situation géographique

La commune est située sur la rive gauche du fleuve Casamance, à environ 30 km à l'est de Ziguinchor. Elle est traversée par la Route nationale 6 (RN6), axe majeur reliant Ziguinchor à Kolda. Le territoire est caractérisé par des plaines rizicoles, des savanes arborées et des zones forestières.

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

La commune dispose de :

- structures administratives (sous-préfecture) ;
- établissements scolaires (écoles, collège) ;
- poste de santé ;
- marchés ;
- gare routière sur la RN6.`,

  'BN-COM-BIGNONA': `## Présentation

Bignona est une commune du sud du Sénégal, chef-lieu du département éponyme, située en Basse-Casamance. Elle se trouve entre la frontière gambienne et le fleuve Casamance, à une trentaine de kilomètres au nord de Ziguinchor. Bignona est un centre administratif et commercial majeur de la région.

## Histoire

Bignona a longtemps été un carrefour commercial entre la Casamance et la Gambie voisine. Son développement s'est accentué avec la création du département de Bignona en 1984, faisant de la commune un pôle administratif important. La ville a également été un point névralgique lors de la crise casamançaise.

## Situation géographique

La commune est située sur la Route nationale 4 (RN4) reliant Ziguinchor à la Gambie. Le territoire est caractérisé par des plaines, des forêts et des zones humides. Le fleuve Casamance coule au sud de la commune, tandis que plusieurs bolongs traversent le département.

## Population

La population est majoritairement composée de Diolas, de Baïnounks, de Mandingues et de Mancagnes. La cohabitation entre ces différentes communautés confère à Bignona une richesse culturelle remarquable.

## Économie

L'économie de Bignona repose sur :

- l'agriculture (riziculture, maraîchage, arboriculture) ;
- le commerce transfrontalier avec la Gambie ;
- l'artisanat ;
- la transformation de produits agricoles ;
- l'élevage.

## Patrimoine et environnement

Le département de Bignona abrite des sites naturels remarquables, notamment les forêts classées, les rizières et les bolongs. La culture diola, avec ses traditions et son organisation sociale, y est profondément ancrée.

## Infrastructures

La commune dispose de :

- structures administratives (sous-préfecture, services départementaux) ;
- établissements scolaires (écoles, collèges, lycée) ;
- centre de santé ;
- marchés animés ;
- gare routière sur la RN4.`,

  'BN-COM-DIOULOULOU': `## Présentation

Diouloulou est une commune du Sénégal située à environ 80 km au nord-ouest de Ziguinchor, en Basse-Casamance, dans le sud du pays. Chef-lieu d'arrondissement du département de Bignona, elle constitue un relais important entre la côte atlantique et l'intérieur des terres.

## Histoire

Diouloulou s'est développé comme carrefour commercial entre les zones côtières (Kafountine) et l'intérieur du département de Bignona. La localité a gagné en importance avec la création de l'arrondissement, devenant un centre administratif et économique local.

## Situation géographique

La commune est située dans une zone de transition entre la côte et l'intérieur, à proximité des forêts classées et des zones humides de Basse-Casamance. Elle est reliée à Ziguinchor et à la côte par des routes départementales.

## Population

La population est principalement composée de Diolas et de groupes apparentés, avec une tradition agricole et forestière forte.

## Économie

L'économie repose sur :

- l'agriculture (riziculture, mil, arachide) ;
- l'exploitation forestière ;
- le commerce local ;
- l'artisanat ;
- le petit élevage.

## Infrastructures

La commune dispose de :

- structures administratives (sous-préfecture) ;
- établissements scolaires ;
- poste de santé ;
- marchés hebdomadaires.`,

  'BN-COM-KAFOUNTINE': `## Présentation

Kafountine est une commune du Sénégal située en Basse-Casamance, dans le département de Bignona. C'est un village côtier réputé pour ses plages, sa pêche artisanale et son tourisme balnéaire. Il se trouve à proximité de la frontière avec la Guinée-Bissau et constitue une destination prisée des visiteurs.

## Histoire

Kafountine s'est développé comme village de pêcheurs avant de devenir une destination touristique importante de la Basse-Casamance. Son littoral et ses ressources halieutiques en font un pôle économique local majeur.

## Situation géographique

La commune est située sur le littoral atlantique du département de Bignona, près de l'embouchure de la Casamance et de la frontière gambienne. Son territoire comprend des plages de sable fin, des mangroves et des bolongs. L'accès se fait par route depuis Bignona et Diouloulou.

## Population

La population est composée principalement de Diolas, de pêcheurs et de communautés liées au tourisme. La saisonnalité touristique influence la dynamique démographique de la localité.

## Économie

L'économie repose sur :

- la pêche artisanale et maritime ;
- le tourisme balnéaire ;
- le commerce ;
- l'agriculture vivrière ;
- l'artisanat.

## Patrimoine et environnement

Kafountine bénéficie d'un environnement naturel exceptionnel : plages, mangroves, bolongs et forêts. La réserve naturelle de Kalissaye et les îles de la Basse-Casamance sont accessibles depuis la commune.

## Infrastructures

La commune dispose de :

- campements et lodges touristiques ;
- débarcadère de pêche ;
- établissements scolaires ;
- poste de santé ;
- marchés.`,

  'BN-COM-THIONCK': `## Présentation

Thionck-Essyl est une localité de Basse-Casamance, située dans le département de Bignona, à 71 km au nord-ouest de la région de Ziguinchor. Elle constitue un centre rural dynamique de l'arrière-pays bignonois.

## Histoire

Thionck-Essyl est une localité ancienne de la Basse-Casamance, dont le développement s'est fait autour de l'agriculture et du commerce local. Elle a gagné en importance avec la création d'infrastructures administratives et scolaires.

## Situation géographique

La localité est située dans une zone de plaines et de plateaux, entourée de forêts et de zones agricoles. Elle est reliée aux autres centres du département par des routes départementales.

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

La localité dispose de :

- établissements scolaires ;
- poste de santé ;
- marchés hebdomadaires ;
- structures administratives.`,

  'BN-COM-KATABA1': `## Présentation

Kataba 1 est une commune du Sénégal située dans le département de Bignona, en Basse-Casamance, et chef-lieu de l'arrondissement du même nom.

## Situation géographique

La commune est située à l'intérieur des terres, dans la partie ouest du département de Bignona, entre les plaines de l'intérieur et la zone côtière de l'arrondissement (Kafountine). Le territoire est caractérisé par des plaines, des forêts et des zones agricoles.

## Population

La population est majoritairement diola, avec une tradition agricole forte.

## Économie

L'économie repose sur :

- l'agriculture (riz, mil, arachide) ;
- l'arboriculture (anacardiers, manguiers) ;
- la pêche ;
- le commerce local.

## Infrastructures

La commune dispose de :

- structures administratives (sous-préfecture) ;
- établissements scolaires ;
- poste de santé ;
- marchés.`,

  'OY-COM-OUSSOUYE': `## Présentation

Oussouye est une commune du sud du Sénégal, chef-lieu du département éponyme, située en Basse-Casamance. C'est le fief de la culture diola, connue pour ses bolongs, ses mangroves et son écotourisme. La commune est un centre administratif et culturel important de la région de Ziguinchor.

## Histoire

Oussouye est une localité profondément ancrée dans l'histoire de la Casamance. Elle a conservé une organisation traditionnelle forte, avec le royaume diola d'Oussouye, dont le roi (le "Awa") joue un rôle symbolique et culturel majeur. La commune a été érigée en département en 2008.

## Situation géographique

La commune est située à environ 50 km au sud-ouest de Ziguinchor, dans une zone de mangroves, de bolongs et de forêts. Le territoire est traversé par des cours d'eau caractéristiques de la Basse-Casamance, offrant un paysage unique.

## Population

La population est majoritairement diola, avec une forte préservation des traditions et de l'organisation sociale. La culture diola, avec ses rites, ses cérémonies et son mode de vie, constitue un patrimoine vivant remarquable.

## Économie

L'économie repose sur :

- la riziculture de mangrove ;
- la pêche dans les bolongs ;
- l'écotourisme ;
- l'artisanat (vannerie, sculpture) ;
- le petit commerce.

## Patrimoine et environnement

Oussouye est réputée pour sa réserve de Pointe Saint-Georges, ses mangroves et ses bolongs. La culture diola y est préservée, avec le royaume traditionnel, les cases à impluvium et les cérémonies rituelles. L'écotourisme y est développé, en harmonie avec l'environnement.

## Infrastructures

La commune dispose de :

- structures administratives (sous-préfecture, services départementaux) ;
- établissements scolaires ;
- centre de santé ;
- campements et lodges écotouristiques ;
- marchés.`,

  'OY-COM-DIEMBERING': `## Présentation

Diembéring est une commune du Sénégal située en Basse-Casamance, à environ 10 km au nord de Cap Skirring et à 60 km de Ziguinchor. C'est le chef-lieu de la communauté rurale de Diembéring, dans l'arrondissement de Cabrousse, le département d'Oussouye et la région de Ziguinchor.

## Histoire

Diembéring est un village ancien de la Basse-Casamance, dont l'histoire est liée à celle du royaume diola d'Oussouye. La localité a conservé ses traditions et son organisation sociale, tout en s'ouvrant au tourisme balnéaire grâce à sa proximité avec Cap Skirring.

## Situation géographique

La commune est située dans une zone côtière, entre la forêt de mangroves et l'océan Atlantique. Son territoire comprend des plages, des bolongs, des mangroves et des forêts classées. La proximité de Cap Skirring en fait une zone stratégique pour le tourisme.

## Population

La population est majoritairement diola, avec une forte tradition agricole et halieutique. Les communautés vivent en harmonie avec leur environnement, préservant les traditions tout en s'adaptant au développement touristique.

## Économie

L'économie repose sur :

- le tourisme balnéaire et écotouristique ;
- la pêche artisanale ;
- la riziculture ;
- l'artisanat ;
- le petit commerce.

## Patrimoine et environnement

Diembéring bénéficie d'un environnement naturel exceptionnel : plages, mangroves, bolongs et forêts. La culture diola y est préservée, avec ses cases à impluvium, ses cérémonies et son organisation traditionnelle.

## Infrastructures

La commune dispose de :

- campements et lodges touristiques ;
- établissements scolaires ;
- poste de santé ;
- routes reliant Cap Skirring et Oussouye.`,
};

async function main() {
  for (const [code, description] of Object.entries(DESCRIPTIONS)) {
    const commune = await prisma.commune.findFirst({
      where: { code },
    });
    if (commune) {
      await prisma.commune.update({
        where: { id: commune.id },
        data: { description },
      });
      console.log(`✓ Description mise à jour pour ${commune.nom}`);
    } else {
      console.log(`✗ Commune ${code} non trouvée`);
    }
  }
  console.log('\n✅ Mise à jour des descriptions terminée !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
