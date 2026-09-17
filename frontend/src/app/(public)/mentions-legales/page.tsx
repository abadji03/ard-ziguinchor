import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ShieldCheck, Building2, Server, FileText, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales | ARD Ziguinchor',
  description: 'Mentions légales et informations juridiques officielles relatives au portail de l’Agence Régionale de Développement de Ziguinchor.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Mentions Légales' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Informations Juridiques
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Mentions Légales
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Cadre réglementaire, éditeur du service public territorial et conditions d&apos;hébergement.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Éditeur du site</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                <strong className="text-slate-900">Agence Régionale de Développement de Ziguinchor (ARD Ziguinchor)</strong>
              </p>
              <p>Établissement public local au service des collectivités territoriales de la région de Ziguinchor.</p>
              <div className="pt-2 text-xs sm:text-sm text-slate-700 space-y-1 font-mono">
                <p>Siège : Boulevard des 54m, BP 115, Ziguinchor, République du Sénégal</p>
                <p>Téléphone : +221 33 991 16 75 / +221 33 991 00 00</p>
                <p>Courriel : contact@ard-ziguinchor.sn</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Server className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Hébergement & Infrastructure</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                Ce site web est hébergé sur une infrastructure cloud sécurisée conforme aux standards de haute disponibilité
                et de résilience des services publics.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Maintenance technique et infogérance assurées en coordination avec la Division des Systèmes d'Information.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Propriété intellectuelle</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                L&apos;ensemble des contenus (textes, graphiques, cartographies, plans de développement, documents téléchargeables, logos et photographies)
                est la propriété exclusive de l&apos;ARD Ziguinchor, sauf mention explicite de source tierce.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Toute reproduction, diffusion ou réutilisation à des fins commerciales est interdite sans accord préalable écrit de l&apos;ARD Ziguinchor.
                L'utilisation des documents publics pour des travaux académiques ou de recherche est autorisée sous réserve de citation de la source.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Données Personnelles & Droits</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                Les informations recueillies via les formulaires de contact ou de candidature sont strictement destinées au traitement
                administratif de vos requêtes par les agents habilités de l&apos;ARD.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Conformément à la loi n° 2008-12 relative à la protection des données à caractère personnel au Sénégal,
                vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles sur simple demande à{' '}
                <a href="mailto:contact@ard-ziguinchor.sn" className="text-emerald-700 font-bold hover:underline">
                  contact@ard-ziguinchor.sn
                </a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
