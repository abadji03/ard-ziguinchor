'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import {
  Target,
  Users,
  BarChart3,
  Handshake,
  Landmark,
  Network,
  Cog,
  FileText,
  Building,
  ShieldCheck,
  ChevronRight,
  Mail,
} from 'lucide-react';

const ORGANISATION = [
  {
    icon: <Landmark className="h-6 w-6" />,
    titre: "Conseil d'Administration",
    desc: "Organe de délibération et de gouvernance suprême réunissant les représentants des départements et communes de Ziguinchor.",
    role: 'Orientation & Contrôle',
  },
  {
    icon: <Network className="h-6 w-6" />,
    titre: 'Direction Générale',
    desc: "Assure le management opérationnel, la coordination des pôles d'ingénierie et la représentation légale de l'Agence.",
    role: 'Pilotage Opérationnel',
  },
  {
    icon: <Cog className="h-6 w-6" />,
    titre: 'Division Planification & Projets',
    desc: "Assistance technique aux collectivités, élaboration des PCD/PDD/SRAT et suivi-évaluation des investissements physiques.",
    role: 'Ingénierie de Développement',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    titre: 'Division Administrative & Financière',
    desc: "Supervision budgétaire, gestion des procédures de passation des marchés publics et ressources humaines.",
    role: 'Gestion & Conformité',
  },
];

const MISSIONS = [
  {
    icon: <Target className="h-6 w-6" />,
    num: '01',
    titre: 'Planification Territoriale',
    desc: "Appui à l'élaboration et à la révision des Schémas Régionaux (SRAT), Plans Départementaux (PDD) et Plans Communaux de Développement (PCD).",
  },
  {
    icon: <Users className="h-6 w-6" />,
    num: '02',
    titre: 'Renforcement des Capacités',
    desc: 'Sessions de formation des élus locaux, perfectionnement des secrétaires municipaux et appui aux commissions techniques.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    num: '03',
    titre: 'Mobilisation des Ressources',
    desc: 'Structuration de dossiers bancables, négociation de financements avec les bailleurs et coopération décentralisée.',
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    num: '04',
    titre: 'Coordination & Concertation',
    desc: 'Animation des cadres territoriaux de concertation, mise en réseau des acteurs et harmonisation des interventions en Casamance.',
  },
];

const TIMELINE = [
  {
    annee: '2001',
    titre: "Décret Fondateur de l'ARD",
    desc: "Création des Agences Régionales de Développement au Sénégal pour opérationnaliser la décentralisation en Casamance.",
  },
  {
    annee: '2008',
    titre: 'Généralisation des PCD',
    desc: 'Accompagnement de l’ensemble des communes de la région dans l’adoption de leurs premiers plans de développement.',
  },
  {
    annee: '2014',
    titre: 'Mise en œuvre de l’Acte III',
    desc: 'Refonte institutionnelle suite à la communalisation intégrale et à la départementalisation au Sénégal.',
  },
  {
    annee: '2019',
    titre: 'Observatoire Territorial & SIG',
    desc: 'Mise en place d’un Système d’Information Géographique régional et publication des premières banques de données.',
  },
  {
    annee: '2024',
    titre: 'Cap Vision Sénégal 2050',
    desc: 'Alignement stratégique sur les pôles territoriaux de développement et l’industrialisation agro-écologique de la Casamance.',
  },
];

export default function AProposPage() {
  const { data: membres, isLoading: loadingMembres } = useQueryData(
    ['membres'],
    () => referencesService.getMembres()
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="relative bg-primary-dark text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: "L'ARD Ziguinchor" }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Institution Publique Territoriale
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              L'Agence Régionale de Développement de Ziguinchor
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Outil technique commun des collectivités territoriales de la région, l'ARD impulse la
              planification harmonieuse, la synergie des interventions et la valorisation du potentiel
              casamançais.
            </p>
          </div>

          {/* Sous-navigation rapide d'ancres */}
          <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-slate-700/60">
            {[
              { href: '#presentation', label: 'Présentation' },
              { href: '#missions', label: 'Nos Missions' },
              { href: '#organisation', label: 'Organisation' },
              { href: '#histoire', label: 'Historique' },
              { href: '#equipe', label: "L'Équipe" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-slate-100 hover:bg-emerald-600 hover:text-white transition-colors border border-white/15"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1 : Présentation & Cadre Légal */}
      <section id="presentation" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Origine & Statut Juridique
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Un interlocuteur privilégié au service de la décentralisation
              </h2>
              <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Créée par décret présidentiel en application du Code Général des Collectivités
                  Territoriales, l'<strong>Agence Régionale de Développement (ARD) de Ziguinchor</strong> est
                  un établissement public doté de la personnalité morale et de l'autonomie financière.
                </p>
                <p>
                  Elle mutualise l’expertise d'ingénieurs, d'urbanistes, d'économistes et de sociologues du
                  développement pour doter les <strong>30 communes</strong> et les{' '}
                  <strong>3 conseils départementaux</strong> (Ziguinchor, Bignona, Oussouye) des outils
                  décisionnels indispensables à l'attractivité territoriale.
                </p>
                <p>
                  Son action s'articule étroitement avec les services déconcentrés de l'État sous la
                  tutelle du Gouverneur de Région, garantissant la cohérence des politiques sectorielles
                  nationales avec les spécificités bioclimatiques et socioculturelles de la Casamance.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Établissement Public à Caractère Professionnel</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold">
                  <Building className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>3 Départements • 30 Communes</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/10">
                <div className="relative h-80 sm:h-96">
                  <Image
                    src="/img_banniere.jpg"
                    alt="ARD Ziguinchor siège et territoire"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Siège Régional</div>
                    <div className="text-sm font-semibold">Boulevard des 54m, Ziguinchor, Sénégal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : Missions Stratégiques */}
      <section id="missions" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Missions Réglementaires
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Quatre Piliers Fondamentaux
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Le champ de compétences légal confié à l'ARD pour dynamiser l'écosystème territorial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MISSIONS.map((m) => (
              <div
                key={m.num}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      {m.icon}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-amber-500 transition-colors">
                      {m.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-emerald-800 transition-colors">
                    {m.titre}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 : Gouvernance & Organigramme */}
      <section id="organisation" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Gouvernance Régionale
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Structure & Organisation de l'Agence
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Une gouvernance participative associant décideurs politiques, administration et équipes techniques.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ORGANISATION.map((org) => (
              <div
                key={org.titre}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
                  {org.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  {org.role}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{org.titre}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{org.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 : Chronologie historique */}
      <section id="histoire" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Repères Temporels
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Deux Décennies au Service de la Casamance
            </h2>
          </div>

          <div className="relative border-l-2 border-emerald-300/60 ml-4 sm:ml-8 space-y-10 pl-6 sm:pl-8">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-emerald-600 shadow-sm group-hover:scale-125 transition-transform" />
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">
                    {item.annee}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 mb-1">
                    {item.titre}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 : Équipe & Experts */}
      <section id="equipe" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Capital Humain
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                L'Équipe Technique & Administrative
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                Des professionnels pluridisciplinaires engagés chaque jour pour la réussite des politiques
                de décentralisation à Ziguinchor.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-colors self-start md:self-auto"
            >
              <span>Prendre contact avec un pôle</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingMembres ? (
            <LoadingState />
          ) : membres && membres.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {membres.map((m) => (
                <div
                  key={m.id}
                  className="vitrine-card hover-lift rounded-2xl p-6 border-slate-200/90 text-center flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 overflow-hidden border-2 border-slate-200 group-hover:border-emerald-500 transition-colors">
                      {m.photo ? (
                        <Image
                          src={m.photo}
                          alt={`${m.prenom} ${m.nom}`}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-slate-400 bg-slate-100">
                          {m.prenom.charAt(0)}
                          {m.nom.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                      {m.prenom} {m.nom}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">{m.fonction}</p>
                    {m.direction && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.direction}</p>
                    )}
                  </div>

                  {m.email && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={`mailto:${m.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-medium truncate max-w-full"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{m.email}</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-sm">
              L'organigramme nominatif est en cours d'actualisation administrative.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
