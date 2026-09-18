import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContenuStatiqueRenderer } from '@/components/shared/ContenuStatiqueRenderer';

export const metadata: Metadata = {
  title: 'Accessibilité',
  description:
    "Déclaration d'accessibilité numérique du site de l'ARD Ziguinchor conformément au RGAA.",
};

export default function AccessibilitePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Accessibilité' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Standards & Inclusion Numérique
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Accessibilité Numérique
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Déclaration de conformité et mesures déployées pour garantir un accès équitable aux services publics en ligne.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu : priorite au contenu externalise en base → fallback JSX dur */}
      <ContenuStatiqueRenderer cle="accessibilite">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">État de conformité</h2>
            <p>
              Le site internet de l&apos;Agence Régionale de Développement (ARD) de Ziguinchor est
              partiellement conforme aux normes d&apos;accessibilité numérique (WCAG 2.1, niveau AA).
              Des efforts continus sont déployés pour améliorer l&apos;accessibilité de ce portail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Qu&apos;est-ce que l&apos;accessibilité numérique ?</h2>
            <p>
              Un site web accessible est un site qui permet à tous les internautes d&apos;accéder à ses
              contenus et fonctionnalités, quelle que soit leur façon de naviguer. Cela concerne
              notamment les personnes en situation de handicap (visuel, auditif, moteur, cognitif)
              mais aussi les personnes âgées, ou celles ayant un accès limité à Internet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Fonctionnalités d&apos;accessibilité mises en place</h2>
            <ul className="space-y-2 list-disc pl-6">
              <li>Lien d&apos;évitement vers le contenu principal (&quot;Aller au contenu principal&quot;)</li>
              <li>Navigation au clavier possible sur tous les éléments interactifs</li>
              <li>Attributs <code>aria-label</code> et <code>aria-expanded</code> sur les boutons et menus</li>
              <li>Textes alternatifs (<code>alt</code>) sur toutes les images</li>
              <li>Structure sémantique HTML5 (landmarks : <code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code>)</li>
              <li>Contraste des couleurs respectant les ratios WCAG AA</li>
              <li>Taille de police adaptative et mise en page responsive</li>
              <li>Attributs <code>lang=&quot;fr&quot;</code> sur la balise <code>html</code></li>
              <li>Feedback visuel sur tous les éléments au focus (<code>focus-visible</code>)</li>
              <li>Formulaires avec labels associés et messages d&apos;erreur explicites</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Limitations connues</h2>
            <p>Malgré nos efforts, certaines fonctionnalités peuvent présenter des limitations :</p>
            <ul className="space-y-2 list-disc pl-6">
              <li>
                La <strong>cartographie interactive</strong> (Leaflet) peut ne pas être entièrement
                accessible aux lecteurs d&apos;écran. Les mêmes informations sont disponibles sous forme
                de liste textuelle sur les pages Départements et Communes.
              </li>
              <li>
                Certains <strong>documents PDF</strong> téléchargeables peuvent ne pas être accessibles.
                Nous recommandons de nous contacter si vous avez besoin d&apos;un document dans un format
                alternatif.
              </li>
              <li>
                Les <strong>graphiques de l&apos;observatoire</strong> (Recharts) peuvent manquer de
                descriptions textuelles détaillées pour les utilisateurs malvoyants.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Technologies assistives testées</h2>
            <p>Ce site a été testé avec les combinaisons suivantes :</p>
            <ul className="space-y-1 list-disc pl-6">
              <li>NVDA + Firefox (Windows)</li>
              <li>JAWS + Chrome (Windows)</li>
              <li>VoiceOver + Safari (macOS / iOS)</li>
              <li>Navigation clavier seule</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Signaler un problème d&apos;accessibilité</h2>
            <p>
              Si vous rencontrez un obstacle à l&apos;accès à un contenu ou une fonctionnalité de ce
              site, veuillez nous le signaler afin que nous puissions apporter les corrections
              nécessaires.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-2xs"
              >
                Nous contacter
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Voies de recours</h2>
            <p>
              Si vous n&apos;obtenez pas de réponse satisfaisante, vous pouvez contacter les autorités
              compétentes en matière d&apos;accessibilité numérique dans votre pays.
            </p>
          </section>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            Déclaration établie le 1er janvier 2025. Dernière révision : août 2026.
          </p>
        </div>
      </div>
      </ContenuStatiqueRenderer>
    </div>
  );
}
