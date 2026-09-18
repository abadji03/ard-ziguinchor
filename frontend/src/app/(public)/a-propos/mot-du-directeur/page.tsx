import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, ArrowLeft, Building2, Target, CheckCircle2, Phone, Mail, Compass, Award, FileText } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContenuStatiqueRenderer } from '@/components/shared/ContenuStatiqueRenderer';

export const metadata: Metadata = {
  title: 'Mot du Directeur Général',
  description:
    "Message du Directeur Général de l'ARD Ziguinchor — vision, engagements et perspectives de l'Agence Régionale de Développement.",
  openGraph: {
    title: "Mot du Directeur Général | ARD Ziguinchor",
    description:
      "Message du Directeur Général de l'ARD Ziguinchor — vision et engagements de l'Agence.",
    type: 'profile',
  },
};

export default function MotDuDirecteurPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb
              items={[
                { label: "L'ARD", href: '/a-propos' },
                { label: 'Mot du Directeur Général' },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Direction Générale & Leadership
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Mot du Directeur Général
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Vision stratégique, engagements partenariaux et perspectives de développement durable
              pour la région de Ziguinchor.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Colonne latérale : Profil officiel & Carte d'identité */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Carte Portrait */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs text-center">
                <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-slate-100 border-2 border-emerald-500/20 shadow-inner mb-4 flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-emerald-800/40" />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white py-1 text-[10px] uppercase font-bold tracking-wider">
                    ARD Ziguinchor
                  </div>
                </div>

                <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
                  M. le Directeur Général
                </h2>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mt-1">
                  Agence Régionale de Développement
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                  <span>Ziguinchor, République du Sénégal</span>
                </p>

                <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Mandat</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">Coordination & Appui</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Échelle</p>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">Régionale (3 Départements)</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Écrire à la Direction
                  </Link>
                  <Link
                    href="/a-propos"
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    Découvrir l&apos;institution
                  </Link>
                </div>
              </div>

              {/* Piliers stratégiques */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-emerald-600" />
                  Piliers de l'Action Régionale
                </h3>
                <ul className="space-y-3">
                  {[
                    { titre: 'Planification stratégique', desc: 'Cohérence territoriale SRAT, PRD et PCD' },
                    { titre: 'Mobilisation des ressources', desc: 'Partenariats avec l’État, PTF et diaspora' },
                    { titre: 'Résilience écologique', desc: 'Valorisation durable des patrimoines naturels' },
                    { titre: 'Insertion & Emploi', desc: 'Opportunités économiques pour les jeunes et femmes' },
                  ].map((pilier, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{pilier.titre}</span>
                        <span className="text-slate-500">{pilier.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Colonne principale : Discours & Vision — priorite au contenu externalise */}
          <ContenuStatiqueRenderer cle="mot-du-directeur">
            <article className="lg:col-span-8 space-y-8">
            {/* Citation solennelle */}
            <div className="relative bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm overflow-hidden">
              <Quote className="absolute -bottom-4 -right-4 h-32 w-32 text-emerald-800/30 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/20 mb-3">
                  Message Clé
                </span>
                <blockquote className="text-lg sm:text-xl font-medium italic leading-relaxed text-emerald-50">
                  &laquo;&nbsp;Le développement durable de notre région passe par la mobilisation
                  collective de toutes ses forces vives, la valorisation de ses richesses naturelles
                  et humaines, et un partenariat fort avec l&apos;État et la coopération
                  internationale.&nbsp;&raquo;
                </blockquote>
                <p className="mt-4 text-xs font-semibold text-emerald-300">
                  — Direction Générale, Agence Régionale de Développement de Ziguinchor
                </p>
              </div>
            </div>

            {/* Corps du message */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed">
                C&apos;est avec un profond sentiment de responsabilité et d&apos;engagement que je
                m&apos;adresse à vous au nom de l&apos;Agence Régionale de Développement (ARD) de Ziguinchor.
                Notre région, berceau de dynamismes culturels et richesses naturelles exceptionnelles,
                mérite une impulsion collective à la hauteur de son potentiel.
              </p>

              <div className="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200/70 my-6">
                <h3 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-emerald-600" />
                  Notre Mandat Républicain
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  L&apos;ARD est le bras technique des collectivités territoriales de la région de Ziguinchor.
                  Créée pour harmoniser les interventions de développement, elle coordonne les schémas
                  d&apos;aménagement, appuie la maîtrise d&apos;ouvrage communale et facilite la convergence
                  des investissements publics et privés.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Une Vision Territoriale Partagée</h3>
                <p>
                  Nous voulons faire de Ziguinchor une région émergente, compétitive, résiliente et solidaire,
                  où chaque habitant bénéficie directement des retombées du progrès. Cela repose sur une
                  agriculture modernisée, la valorisation des filières aquacoles et horticoles, un écotourisme
                  responsable et un réseau d&apos;infrastructures désenclavant durablement nos terroirs.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Nos 5 Engagements Prioritaires</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {[
                    'Planification territoriale rigoureuse (SRAT, PRD, PCD)',
                    'Mobilisation accrue des financements auprès des PTF',
                    'Suivi-évaluation via l’Observatoire territorial',
                    'Accompagnement de l’entrepreneuriat des jeunes et femmes',
                    'Coopération décentralisée et partenariats transfrontaliers',
                  ].map((engagement, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{engagement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Un Appel à la Synergie Partenariale</h3>
                <p>
                  Aux partenaires techniques et financiers, aux investisseurs, aux universitaires et à la
                  diaspora casamançaise, nous tendons la main. La région de Ziguinchor réunit des atouts
                  comparatifs majeurs. Avec l&apos;ARD comme interlocuteur technique rigoureux et transparent,
                  vos initiatives trouveront un cadre de réalisation sécurisé et efficace.
                </p>
                <p className="mt-4">
                  À nos concitoyens et élus locaux, sachez que l&apos;ARD demeure votre maison commune.
                  Ensemble, avec courage, méthode et détermination, construisons le futur prospère de la Casamance.
                </p>
              </div>

              {/* Bloc de signature */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-extrabold text-slate-900 text-lg">La Direction Générale</p>
                  <p className="text-xs font-semibold text-emerald-700">
                    Agence Régionale de Développement (ARD) de Ziguinchor
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Bâtir un territoire d'avenir</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs">
                    Ziguinchor, Sénégal
                  </span>
                </div>
              </div>
            </div>

            {/* Liens de navigation complémentaires */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/a-propos"
                className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600/60 transition-colors shadow-xs group"
              >
                <Building2 className="h-5 w-5 text-emerald-700 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  L&apos;Agence ARD
                </h4>
                <p className="text-xs text-slate-500 mt-1">Missions, statuts et organes de gouvernance</p>
              </Link>
              <Link
                href="/projets"
                className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600/60 transition-colors shadow-xs group"
              >
                <Target className="h-5 w-5 text-emerald-700 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  Nos Projets
                </h4>
                <p className="text-xs text-slate-500 mt-1">Portefeuille des projets territoriaux en cours</p>
              </Link>
              <Link
                href="/documentation"
                className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600/60 transition-colors shadow-xs group"
              >
                <FileText className="h-5 w-5 text-emerald-700 mb-2" />
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  Publications
                </h4>
                <p className="text-xs text-slate-500 mt-1">Plans de développement, études et rapports</p>
              </Link>
            </div>
          </article>
          </ContenuStatiqueRenderer>
        </div>
      </div>
    </div>
  );
}

