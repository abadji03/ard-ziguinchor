import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const metadata: Metadata = {
  title: 'Accessibilité',
  description:
    "Déclaration d'accessibilité numérique du site de l'ARD Ziguinchor conformément au RGAA.",
};

export default function AccessibilitePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Accessibilité' }]} />
          <SectionTitle
            title="Accessibilité"
            subtitle="Déclaration d'accessibilité numérique"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-10 prose prose-gray max-w-none space-y-8 text-gray-700">

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
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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
    </div>
  );
}
