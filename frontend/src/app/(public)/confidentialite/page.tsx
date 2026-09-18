import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Lock, Shield, Eye, Cookie, UserCheck } from 'lucide-react';
import { ContenuStatiqueRenderer } from '@/components/shared/ContenuStatiqueRenderer';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | ARD Ziguinchor',
  description: 'Engagement de protection de la vie privée et politique relative aux données personnelles de l’ARD Ziguinchor.',
};

export default function ConfidentialitePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Politique de Confidentialité' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Protection de la Vie Privée
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Découvrez comment l&apos;ARD protège vos données personnelles conformément aux lois sénégalaises en vigueur.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu : priorite au contenu externalise en base → fallback JSX dur */}
      <ContenuStatiqueRenderer cle="politique-confidentialite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Données collectées</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                Nous collectons uniquement les informations nécessaires au traitement de vos requêtes administratives ou de partenariats via nos formulaires :
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
                <li>Identité : nom et prénom</li>
                <li>Coordonnées : adresse électronique et numéro de téléphone</li>
                <li>Objet et contenu de votre message ou dossier déposé</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Utilisation et finalités des données</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                Vos informations sont exclusivement exploitées par les services techniques de l&apos;ARD Ziguinchor dans le cadre de nos missions d&apos;appui au développement local.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Elles ne sont en aucun cas vendues, cédées, louées ou partagées avec des tiers à des fins commerciales ou publicitaires.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Cookie className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Cookies & Traçabilité</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                Ce portail institutionnel n&apos;utilise que des cookies techniques indispensables à la session, à la sécurité et à la navigation fluide.
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Aucun traceur publicitaire intrusif n&apos;est déposé sur votre terminal lors de votre consultation.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Vos droits d&apos;accès et de rectification</h2>
            </div>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-2">
              <p>
                Conformément aux dispositions de la loi sénégalaise sur la protection des données personnelles, vous bénéficiez d&apos;un droit d&apos;accès, d&apos;opposition, de mise à jour et d&apos;effacement des données vous concernant.
              </p>
              <p className="text-xs sm:text-sm text-slate-700">
                Pour faire valoir ce droit, adressez un message électronique à :{' '}
                <a href="mailto:contact@ard-ziguinchor.sn" className="text-emerald-700 font-bold hover:underline">
                  contact@ard-ziguinchor.sn
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
      </ContenuStatiqueRenderer>
    </div>
  );
}
