import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Map, Users, TreePine, Building2, ArrowRight } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { RegionDepartements } from '@/components/features/region/RegionDepartements';

export const metadata: Metadata = {
  title: 'La Région de Ziguinchor',
  description:
    'Découvrez la région de Ziguinchor : ses départements, communes, données géographiques et cartographie interactive.',
  openGraph: {
    title: 'La Région de Ziguinchor | ARD Ziguinchor',
    description:
      'Découvrez la région de Ziguinchor : ses départements, communes, données géographiques et cartographie interactive.',
    type: 'website',
  },
};

const CHIFFRES = [
  { valeur: '7 339', unite: 'km²', label: 'Superficie totale', icon: Map },
  { valeur: '612 343', unite: 'hab.', label: 'Population (2023)', icon: Users },
  { valeur: '3', unite: '', label: 'Départements', icon: Building2 },
  { valeur: '60%', unite: '', label: 'Couverture forestière', icon: TreePine },
];

const SOUS_PAGES = [
  {
    href: '/la-region/departements',
    titre: 'Départements',
    description: 'Explorez les 3 départements de la région de Ziguinchor avec leurs caractéristiques et données démographiques.',
    icon: Building2,
  },
  {
    href: '/la-region/communes',
    titre: 'Communes',
    description: "Retrouvez l'ensemble des communes de la région, leurs populations et informations administratives.",
    icon: Users,
  },
  {
    href: '/la-region/cartographie',
    titre: 'Cartographie interactive',
    description: 'Visualisez les projets de développement géolocalisés sur une carte interactive de la région.',
    icon: Map,
  },
];

export default function LaRegionPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary py-16 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <Breadcrumb items={[{ label: 'La Région' }]} />
          <div className="mt-6 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              La Région de Ziguinchor
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Porte d&apos;entrée de la Casamance naturelle, Ziguinchor est une région aux
              richesses naturelles et culturelles exceptionnelles, carrefour de peuples et de
              traditions.
            </p>
          </div>
        </div>
      </div>

      {/* Chiffres clés */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CHIFFRES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {c.valeur}
                    {c.unite && <span className="text-base font-normal ml-1">{c.unite}</span>}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{c.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Présentation */}
        <section>
          <SectionTitle
            title="Présentation de la région"
            subtitle="Une région stratégique au carrefour de l'Afrique de l'Ouest"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-6">
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                La région de Ziguinchor est située au sud du Sénégal, dans la partie
                occidentale de la Casamance. Elle est limitée au nord par la Gambie, à l&apos;est
                par la région de Sédhiou, au sud par la Guinée-Bissau et à l&apos;ouest par
                l&apos;océan Atlantique.
              </p>
              <p>
                Couvrant une superficie de 7 339 km², la région est divisée en trois
                départements : Ziguinchor (chef-lieu régional), Bignona et Oussouye. Elle
                abrite une population de 612 343 habitants (recensement 2023) représentant une grande
                diversité ethnique et culturelle.
              </p>
              <p>
                La région est caractérisée par un relief relativement plat, des rizières
                inondables, une végétation dense et luxuriante, des bolongs (bras de mer) et
                une façade maritime. Son climat subguiléen avec de fortes précipitations
                (1 200 à 1 800 mm/an) favorise une agriculture diversifiée.
              </p>
              <p>
                Ziguinchor est connue pour son patrimoine naturel exceptionnel, notamment la
                forêt de Cabrousse, la réserve naturelle de Pointe Saint-Georges et les
                nombreuses îles et bolongs qui constituent une richesse écologique
                inestimable.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-64 relative">
              <div className="text-center p-8 text-gray-400">
                <Map className="h-16 w-16 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Carte de la région de Ziguinchor</p>
                <Link
                  href="/la-region/cartographie"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                >
                  Voir la cartographie interactive
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Départements */}
        <section>
          <SectionTitle title="Les 3 Départements" />
          <RegionDepartements />
          <div className="mt-4 text-center">
            <Link
              href="/la-region/departements"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
            >
              Voir les détails des départements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Sous-pages */}
        <section>
          <SectionTitle
            title="Explorer la région"
            subtitle="Accédez aux informations détaillées par section"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {SOUS_PAGES.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group bg-white rounded-xl border border-gray-100 p-6 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {p.titre}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorer <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Potentiels */}
        <section>
          <SectionTitle
            title="Potentiels de développement"
            subtitle="Les secteurs porteurs de la région"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {[
              {
                titre: 'Agriculture & Pêche',
                description:
                  "Riziculture, maraîchage, arboriculture fruitière, pêche maritime et continentale constituent les piliers de l'économie locale.",
                emoji: '🌾',
              },
              {
                titre: 'Tourisme',
                description:
                  "Tourisme balnéaire, écotourisme et tourisme culturel grâce aux plages, aux forêts et au riche patrimoine diola et mandingue.",
                emoji: '🏖️',
              },
              {
                titre: 'Forêt & Biodiversité',
                description:
                  "60% du territoire recouvert de forêts tropicales, mangroves et zones humides classées d'importance internationale.",
                emoji: '🌿',
              },
              {
                titre: 'Commerce & Artisanat',
                description:
                  "Position frontalière avec la Guinée-Bissau et la Gambie, artisanat traditionnel (teinture, vannerie, sculpture).",
                emoji: '🏺',
              },
              {
                titre: 'Élevage',
                description:
                  "Élevage bovin, ovin et caprin présent dans toute la région, avec un potentiel de développement important.",
                emoji: '🐄',
              },
              {
                titre: 'Énergie renouvelable',
                description:
                  "Fort ensoleillement et potentiel hydroélectrique pour le développement des énergies renouvelables.",
                emoji: '☀️',
              },
            ].map((item) => (
              <Card key={item.titre} className="p-5">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.titre}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
