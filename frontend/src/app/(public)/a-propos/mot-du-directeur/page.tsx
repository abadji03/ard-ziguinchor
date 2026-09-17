import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Mot du Directeur',
  description:
    "Message du Directeur Général de l'ARD Ziguinchor — vision, engagements et perspectives de l'Agence Régionale de Développement.",
  openGraph: {
    title: "Mot du Directeur | ARD Ziguinchor",
    description: "Message du Directeur Général de l'ARD Ziguinchor — vision et engagements de l'Agence.",
    type: 'profile',
  },
};

export default function MotDuDirecteurPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: "L'ARD", href: '/a-propos' },
              { label: 'Mot du Directeur' },
            ]}
          />
          <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-white">
            Mot du Directeur Général
          </h1>
          <p className="mt-3 text-blue-100 max-w-xl">
            Vision, engagements et perspectives de l'ARD Ziguinchor
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <aside className="md:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] mb-4 flex items-center justify-center">
                <div className="text-center p-6 text-gray-300">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400 italic">Photo à venir</p>
                </div>
              </div>
              <div className="text-center">
                <h2 className="font-bold text-gray-900 text-lg">M. le Directeur Général</h2>
                <p className="text-sm text-primary font-medium mt-1">Agence Régionale de Développement</p>
                <p className="text-xs text-gray-500 mt-0.5">Ziguinchor, Sénégal</p>
              </div>

              <div className="mt-6 bg-primary/5 border border-primary/10 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Liens utiles</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/a-propos" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                      <ArrowLeft className="h-3.5 w-3.5" /> Présentation de l'ARD
                    </Link>
                  </li>
                  <li>
                    <Link href="/a-propos#equipe" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                      <ArrowLeft className="h-3.5 w-3.5" /> Notre équipe
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-primary hover:underline flex items-center gap-1.5">
                      <ArrowLeft className="h-3.5 w-3.5" /> Nous contacter
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <article className="md:col-span-2 space-y-8">
            <blockquote className="relative bg-primary/5 border-l-4 border-primary rounded-r-2xl px-6 py-5">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" aria-hidden="true" />
              <p className="text-lg text-gray-800 font-medium italic leading-relaxed">
                &laquo;&nbsp;Le développement durable de notre région passe par la mobilisation
                collective de toutes ses forces vives, la valorisation de ses richesses naturelles
                et humaines, et un partenariat fort avec l'État et la coopération
                internationale.&nbsp;&raquo;
              </p>
            </blockquote>

            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                C'est avec un profond sentiment de responsabilité et d'engagement que je
                prends la parole en tant que Directeur Général de l'Agence Régionale de
                Développement de Ziguinchor. Notre région, aux richesses naturelles et
                culturelles exceptionnelles, mérite une institution à la hauteur de ses ambitions
                et de ses potentiels.
              </p>

              <p>
                Depuis sa création, l'ARD Ziguinchor s'est positionnée comme l'outil
                stratégique de planification et de coordination du développement territorial. Notre
                mission est claire : faciliter la mise en œuvre des politiques publiques de
                développement, appuyer les collectivités territoriales dans l'exercice de leurs
                compétences et mobiliser les ressources pour financer les projets structurants de
                notre région.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">Notre vision</h3>
              <p>
                Nous voulons faire de Ziguinchor une région émergente, compétitive et solidaire,
                où chaque habitant bénéficie des retombées du développement. Cela passe par une
                agriculture modernisée et résiliente, un tourisme durable valorisant notre
                patrimoine exceptionnel, des infrastructures de qualité et une jeunesse qualifiée
                et épanouie.
              </p>

              <h3 className="font-bold text-gray-900 text-base mt-6">Nos priorités d'action</h3>
              <ul className="space-y-3">
                {[
                  'Renforcer la planification territoriale et la coordination des interventions de développement',
                  'Appuyer la mobilisation de ressources auprès des partenaires techniques et financiers',
                  "Accompagner la mise en œuvre du Plan de Développement Régional (PDR)",
                  "Promouvoir l'économie locale et soutenir l'entrepreneuriat des jeunes et des femmes",
                  "Favoriser la coopération décentralisée et les échanges d'expériences",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-bold text-gray-900 text-base mt-6">Un appel au partenariat</h3>
              <p>
                Je lance un appel vibrant à tous nos partenaires — bailleurs de fonds
                internationaux, ONG, secteur privé, diaspora — pour qu'ils rejoignent notre
                dynamique. La région de Ziguinchor offre des opportunités immenses. Ensemble, nous
                pouvons les saisir au profit de nos populations.
              </p>

              <p>
                À nos citoyens, je dis que l'ARD est votre institution. Elle est là pour vous
                servir, pour porter vos aspirations et pour construire avec vous le Ziguinchor de
                demain. N'hésitez pas à nous contacter, à nous soumettre vos idées, à
                participer aux concertations que nous organisons régulièrement.
              </p>

              <p>
                Ensemble, bâtissons le Ziguinchor de nos rêves.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="font-bold text-gray-900">Le Directeur Général</p>
              <p className="text-sm text-primary mt-0.5">Agence Régionale de Développement de Ziguinchor</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Nous contacter
              </Link>
              <Link href="/a-propos" className="inline-flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
                En savoir plus sur l'ARD
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
