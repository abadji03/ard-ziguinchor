'use client';

import Link from 'next/link';
import { ArrowRight, DownloadCloud } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useContenusSection } from '@/hooks/useContenus';
import { blocsOu, type BlocVue } from '@/lib/contenus';
import { ContenuIcon, resolveContenuCouleur } from '@/lib/contenu-icons';

/**
 * Repli utilisé uniquement si aucun bloc `CATEGORIE_DOC` n'est défini en base
 * (Admin → Paramètres → Contenus & textes → Catégorie documentaire).
 */
const CATEGORIES: BlocVue[] = [
  {
    titre: 'Planification Régionale (SRAT / PRD)',
    description:
      'Documents cadres et schémas régionaux d’aménagement du territoire, diagnostics prospectifs et plans directeurs sectoriels.',
    lien: '/documentation/planification-regionale',
    icone: 'Map',
    sousTitre: 'Niveau Régional',
    couleur: 'emerald',
  },
  {
    titre: 'Planification Territoriale (PDC / PDD / SDADT)',
    description:
      'Plans de Développement Communaux (PDC) des 30 communes, Plans Départementaux de Développement (PDD) et schémas d’aménagement (SDADT/SCADT).',
    lien: '/documentation/planification-territoriale',
    icone: 'Building2',
    sousTitre: '30 Communes & 3 Départements',
    couleur: 'amber',
  },
  {
    titre: 'Urbanisme & Aménagement',
    description:
      'PCU/PCUI, PUPA, PAZ, plans de lotissement et POAS : documents d’urbanisme issus du Code de l’urbanisme de 2023.',
    lien: '/documentation/urbanisme-amenagement',
    icone: 'Map',
    sousTitre: 'Code de l’urbanisme 2023',
    couleur: 'blue',
  },
  {
    titre: 'Archives Historiques de Planification',
    description:
      'SRAT, PRDI, PIC, PLD, PAR, PVD, PZD : les instruments antérieurs à l’Acte III, conservés à titre d’archive.',
    lien: '/documentation/archives-historiques',
    icone: 'FolderOpen',
    sousTitre: 'Instruments antérieurs',
    couleur: 'slate',
  },
  {
    titre: 'Rapports, Études & Guides Techniques',
    description:
      'Études socio-économiques, bilans d’exécution, guides méthodologiques de gestion municipale et manuels de procédures.',
    lien: '/documentation/autres',
    icone: 'FileText',
    sousTitre: 'Publications Spécialisées',
    couleur: 'blue',
  },
];

export default function DocumentationPage() {
  const { data } = useContenusSection('documentation');
  const categories = blocsOu(CATEGORIES, data?.CATEGORIE_DOC);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="relative bg-primary-dark text-white border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Documentation & Bibliothèque' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-400/30 mb-3">
              Ressources & Publications Officielles
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Centre de Documentation Territoriale
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Accédez aux documents de planification stratégique, diagnostics territoriaux et rapports
              d'études validés par l'Agence Régionale de Développement de Ziguinchor.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((cat, i) => {
            const coul = resolveContenuCouleur(cat.couleur);
            return (
              <Link key={cat.lien || i} href={cat.lien || '#'} className="group">
                <div className="vitrine-card hover-lift rounded-2xl p-6 sm:p-7 border-slate-200/90 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl ${coul.bg} ${coul.text} flex items-center justify-center transition-colors`}
                      >
                        <ContenuIcon nom={cat.icone} className="h-6 w-6" />
                      </div>
                      {cat.sousTitre ? (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {cat.sousTitre}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
                      {cat.titre}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>Consulter les archives</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bloc d'aide d'accès aux données */}
        <div className="vitrine-card rounded-2xl border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            <DownloadCloud className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-base">
                Transparence & Accès aux Données Publiques
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Libre consultation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Tous les documents téléchargeables sur ce portail sont des documents publics élaborés en
              concertation avec les collectivités et partenaires. Si vous recherchez une archive
              antérieure ou un document spécifique non répertorié, n'hésitez pas à solliciter la division
              planification via la page Contact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
