'use client';

import Image from 'next/image';
import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { Target, Users, BarChart3, Handshake, ChevronDown, Landmark, Network, Cog, FileText } from 'lucide-react';
import Link from 'next/link';

const ORGANISATION = [
  {
    icon: <Landmark className="h-5 w-5" />,
    titre: "Conseil d'administration",
    desc: "Organe de gouvernance qui définit les orientations stratégiques et valide les programmes de l'Agence.",
  },
  {
    icon: <Network className="h-5 w-5" />,
    titre: 'Direction',
    desc: "Le Directeur assure la mise en œuvre des décisions du Conseil, la coordination générale et la représentation de l'ARD.",
  },
  {
    icon: <Cog className="h-5 w-5" />,
    titre: 'Services techniques',
    desc: "Cellules en charge de la planification territoriale, du développement local, du suivi-évaluation et de l'appui aux collectivités.",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    titre: 'Services administratifs',
    desc: "Gestion administrative, financière et comptable ; ressources humaines et logistique au quotidien.",
  },
];

const MISSIONS = [
  { icon: <Target className="h-6 w-6" />, titre: 'Planification territoriale', desc: "Appui à l'élaboration et à la mise en œuvre des plans locaux de développement." },
  { icon: <Users className="h-6 w-6" />, titre: 'Renforcement des capacités', desc: "Formation et assistance technique aux élus, agents et acteurs locaux." },
  { icon: <BarChart3 className="h-6 w-6" />, titre: 'Mobilisation des ressources', desc: "Montage de projets pour mobiliser des financements nationaux et internationaux." },
  { icon: <Handshake className="h-6 w-6" />, titre: 'Coordination des acteurs', desc: "Facilitation du dialogue État / collectivités / société civile / partenaires." },
];

const TIMELINE = [
  { annee: '2001', titre: "Création de l'ARD", desc: "Création de l'Agence Régionale de Développement dans le cadre de la décentralisation." },
  { annee: '2005', titre: 'Premiers programmes', desc: "Lancement des premiers programmes d'appui aux collectivités locales." },
  { annee: '2010', titre: 'Expansion territoriale', desc: 'Extension des activités à tous les départements de la région.' },
  { annee: '2015', titre: 'Partenariats internationaux', desc: 'Renforcement des partenariats avec les bailleurs de fonds internationaux.' },
  { annee: '2020', titre: 'Transition digitale', desc: 'Modernisation des outils de suivi et de reporting des projets.' },
  { annee: '2024', titre: "Aujourd'hui", desc: 'Plus de 150 projets réalisés au service des 3 départements de la région.' },
];

export default function AProposPage() {
  const { data: membres, isLoading: loadingMembres } = useQueryData(
    ['membres'],
    () => referencesService.getMembres()
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: "L'ARD" }]} />
          <SectionTitle
            title="L'ARD Ziguinchor"
            subtitle="Présentation, missions, organisation et équipe"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      {/* Présentation */}
      <section id="presentation" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle title="Présentation" subtitle="L'Agence au service du développement territorial" />
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Créée en 2001, l'Agence Régionale de Développement (ARD) de Ziguinchor est un outil de
                  développement au service des collectivités locales et de l'État. Elle intervient dans la région
                  de Ziguinchor qui regroupe les départements de Ziguinchor, Bignona et Oussouye.
                </p>
                <p>
                  L'ARD est un établissement public à caractère professionnel dont la mission principale est
                  d'appuyer les collectivités locales dans leurs efforts de planification et de mise en œuvre
                  de plans de développement.
                </p>
                <p>
                  Au fil des années, l'ARD s'est imposée comme un acteur incontournable du développement local,
                  mobilisant des financements pour des centaines de projets qui ont amélioré les conditions de
                  vie des populations.
                </p>
              </div>
            </div>
            <div className="relative h-72 rounded-2xl overflow-hidden">
              <Image
                src="/img_banniere.jpg"
                alt="ARD Ziguinchor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missions */}
      <section id="missions" className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle title="Nos Missions" centered />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MISSIONS.map((m, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {m.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{m.titre}</h3>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chronologie */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionTitle title="Notre Histoire" centered />
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${i % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                    <span className="text-secondary font-bold text-lg">{item.annee}</span>
                    <h3 className="font-semibold text-gray-900">{item.titre}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow mt-1" />
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organisation */}
      <section id="organisation" className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title="Organisation"
            subtitle="Les organes de gouvernance et les services de l'Agence"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ORGANISATION.map((organe) => (
              <div
                key={organe.titre}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {organe.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{organe.titre}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{organe.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section id="equipe" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle title="Notre Équipe" subtitle="Les professionnels au service du développement" centered />
          {loadingMembres ? (
            <LoadingState />
          ) : membres?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {membres.map((m) => (
                <Link
                  key={m.id}
                  href={`/a-propos/equipe/${m.id}`}
                  className="bg-white rounded-xl p-5 border border-gray-100 text-center hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 overflow-hidden">
                    {m.photo ? (
                      <Image src={m.photo} alt={`${m.prenom} ${m.nom}`} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/40">
                        {m.prenom.charAt(0)}{m.nom.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{m.prenom} {m.nom}</h3>
                  <p className="text-xs text-primary mt-1">{m.fonction}</p>
                  {m.email && (
                    <span className="text-xs text-gray-400 hover:text-primary mt-1 block truncate" onClick={(e) => e.stopPropagation()}>
                      {m.email}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">Informations sur l'équipe à venir.</p>
          )}
        </div>
      </section>
    </div>
  );
}
