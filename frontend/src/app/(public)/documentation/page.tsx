'use client';

import Link from 'next/link';
import { Map, Building2, FolderOpen, ArrowRight, FileText, DownloadCloud, ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const CATEGORIES = [
  {
    title: 'Planification Régionale (SRAT / PRD)',
    description:
      'Documents cadres et schémas régionaux d’aménagement du territoire, diagnostics prospectifs et plans directeurs sectoriels.',
    href: '/documentation/planification-regionale',
    icon: Map,
    badge: 'Niveau Régional',
    color: 'emerald',
  },
  {
    title: 'Planification Territoriale (PCD / PDD)',
    description:
      'Plans Communaux de Développement (PCD) des 30 communes et Plans Départementaux de Développement (PDD) de Ziguinchor, Bignona et Oussouye.',
    href: '/documentation/planification-territoriale',
    icon: Building2,
    badge: '30 Communes & 3 Départements',
    color: 'amber',
  },
  {
    title: 'Rapports, Études & Guides Techniques',
    description:
      'Études socio-économiques, bilans d’exécution, guides méthodologiques de gestion municipale et manuels de procédures.',
    href: '/documentation/autres',
    icon: FolderOpen,
    badge: 'Publications Spécialisées',
    color: 'blue',
  },
];

export default function DocumentationPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Documentation & Bibliothèque' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
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
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.href} href={cat.href} className="group">
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {cat.badge}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
                      {cat.title}
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 shadow-xs">
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
