/**
 * Peuplement des `contenus_statiques` et `navigation_items`.
 *
 * Ces deux tables externalisent ce qui était auparavant codé en dur dans le
 * code front (pages légales, confidentialité, accessibilité, mot du directeur,
 * navigation du header / pied de page). Ils sont désormais modifiables depuis
 * Admin → Paramètres → Contenus & textes / Navigation, sans redéploiement.
 *
 * Idempotent : un enregistrement déjà présent (clé unique / même label+href+section)
 * n'est PAS écrasé, afin de préserver toute édition faite depuis l'administration.
 * Exécution : npx ts-node prisma/seed-contenus-statiques.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Contenus statiques (HTML) ─────────────────────────────────────────────────
// Le HTML ci-dessous est le texte institutionnel réel, transcrit depuis les
// pages publiques. Rendu via `dangerouslySetInnerHTML` avec repli codé en dur.
const CONTENUS_STATIQUES_SEED: {
  cle: string;
  titre: string;
  contenu: string;
}[] = [
  {
    cle: 'mentions-legales',
    titre: 'Mentions légales',
    contenu: `<section>
<h2>Éditeur du site</h2>
<p><strong>Agence Régionale de Développement de Ziguinchor (ARD Ziguinchor)</strong></p>
<p>Établissement public local au service des collectivités territoriales de la région de Ziguinchor.</p>
<ul><li>Siège : Boulevard des 54m, BP 115, Ziguinchor, République du Sénégal</li><li>Téléphone : +221 33 991 16 75 / +221 33 991 00 00</li><li>Courriel : <a href="mailto:contact@ard-ziguinchor.sn">contact@ard-ziguinchor.sn</a></li></ul>
</section>
<section>
<h2>Hébergement &amp; Infrastructure</h2>
<p>Ce site web est hébergé sur une infrastructure cloud sécurisée conformément aux standards de haute disponibilité et de résilience des services publics.</p>
<p class="text-xs sm:text-sm text-slate-500">Maintenance technique et infogérance assurées en coordination avec la Division des Systèmes d'Information.</p>
</section>
<section>
<h2>Propriété intellectuelle</h2>
<p>L'ensemble des contenus (textes, graphismes, cartographies, plans de développement, documents téléchargeables, logos et photographies) est la propriété exclusive de l'ARD Ziguinchor, sauf mention explicite de source tierce.</p>
<p class="text-xs sm:text-sm text-slate-500">Toute reproduction, diffusion ou réutilisation à des fins commerciales est interdite sans accord préalable écrit de l'ARD Ziguinchor. L'utilisation des documents publics pour des travaux académiques ou de recherche est autorisée sous réserve de citation de la source.</p>
</section>
<section>
<h2>Données Personnelles &amp; Droits</h2>
<p>Les informations recueillies via les formulaires de contact ou de candidature sont strictement destinées au traitement administratif de vos requêtes par les agents habilités de l'ARD.</p>
<p class="text-xs sm:text-sm text-slate-500">Conformément à la loi n° 2008-12 relative à la protection des données à caractère personnel au Sénégal, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles sur simple demande à <a href="mailto:contact@ard-ziguinchor.sn">contact@ard-ziguinchor.sn</a>.</p>
</section>`,
  },
  {
    cle: 'confidentialite',
    titre: 'Politique de Confidentialité',
    contenu: `<section>
<h2>Données collectées</h2>
<p>Nous collectons uniquement les informations nécessaires au traitement de vos requêtes administratives ou de partenariats via nos formulaires :</p>
<ul><li>Identité : nom et prénom</li><li>Coordonnées : adresse électronique et numéro de téléphone</li><li>Objet et contenu de votre message ou dossier déposé</li></ul>
</section>
<section>
<h2>Utilisation et finalités des données</h2>
<p>Vos informations sont exclusivement exploitées par les services techniques de l'ARD Ziguinchor dans le cadre de nos missions d'appui au développement local.</p>
<p class="text-xs sm:text-sm text-slate-500">Elles ne sont en aucun cas vendues, cédées, louées ou partagées avec des tiers à des fins commerciales ou publicitaires.</p>
</section>
<section>
<h2>Cookies &amp; Traçabilité</h2>
<p>Ce portail institutionnel n'utilise que des cookies techniques indispensables à la session, à la sécurité et à la navigation fluide.</p>
<p class="text-xs sm:text-sm text-slate-500">Aucun traceur publicitaire intrusif n'est déposé sur votre terminal lors de votre consultation.</p>
</section>
<section>
<h2>Vos droits d'accès et de rectification</h2>
<p>Conformément aux dispositions de la loi sénégalaise sur la protection des données personnelles, vous bénéficiez d'un droit d'accès, d'opposition, de mise à jour et d'effacement des données vous concernant.</p>
<p class="text-xs sm:text-sm text-slate-700">Pour faire valoir ce droit, adressez un message électronique à : <a href="mailto:contact@ard-ziguinchor.sn" class="text-emerald-700 font-bold hover:underline">contact@ard-ziguinchor.sn</a>.</p>
</section>`,
  },
  {
    cle: 'accessibilite',
    titre: 'Accessibilité Numérique',
    contenu: `<section>
<h2>État de conformité</h2>
<p>Le site internet de l'Agence Régionale de Développement (ARD) de Ziguinchor est partiellement conforme aux normes d'accessibilité numérique (WCAG 2.1, niveau AA). Des efforts continus sont déployés pour améliorer l'accessibilité de ce portail.</p>
</section>
<section>
<h2>Qu'est-ce que l'accessibilité numérique ?</h2>
<p>Un site web accessible est un site qui permet à tous les internautes d'accéder à ses contenus et fonctionnalités, quelle que soit leur façon de naviguer. Cela concerne notamment les personnes en situation de handicap (visuel, auditif, moteur, cognitif) mais aussi les personnes âgées, ou celles ayant un accès limité à Internet.</p>
</section>
<section>
<h2>Fonctionnalités d'accessibilité mises en place</h2>
<ul>
<li>Lien d'évitement vers le contenu principal ("Aller au contenu principal")</li>
<li>Navigation au clavier possible sur tous les éléments interactifs</li>
<li>Attributs aria-label et aria-expanded sur les boutons et menus</li>
<li>Textes alternatifs (alt) sur toutes les images</li>
<li>Structure sémantique HTML5 (landmarks : header, nav, main, footer)</li>
<li>Contraste des couleurs respectant les ratios WCAG AA</li>
<li>Taille de police adaptative et mise en page responsive</li>
<li>Attribut lang="fr" sur la balise html</li>
<li>Feedback visuel sur tous les éléments au focus (focus-visible)</li>
<li>Formulaires avec labels associés et messages d'erreur explicites</li>
</ul>
</section>
<section>
<h2>Limitations connues</h2>
<ul>
<li>La cartographie interactive (Leaflet) peut ne pas être entièrement accessible aux lecteurs d'écran. Les mêmes informations sont disponibles sous forme de liste textuelle sur les pages Départements et Communes.</li>
<li>Certains documents PDF téléchargeables peuvent ne pas être accessibles. Nous recommandons de nous contacter si vous avez besoin d'un document dans un format alternatif.</li>
<li>Les graphiques de l'observatoire (Recharts) peuvent manquer de descriptions textuelles détaillées pour les utilisateurs malvoyants.</li>
</ul>
</section>
<section>
<h2>Technologies assistives testées</h2>
<p>Ce site a été testé avec les combinaisons suivantes :</p>
<ul><li>NVDA + Firefox (Windows)</li><li>JAWS + Chrome (Windows)</li><li>VoiceOver + Safari (macOS / iOS)</li><li>Navigation clavier seule</li></ul>
</section>
<section>
<h2>Signaler un problème d'accessibilité</h2>
<p>Si vous rencontrez un obstacle à l'accès à un contenu ou une fonctionnalité de ce site, veuillez nous le signaler afin que nous puissions apporter les corrections nécessaires.</p>
<p><a href="/contact" class="inline-block mt-4 bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-800">Nous contacter</a></p>
</section>
<section>
<h2>Voies de recours</h2>
<p>Si vous n'obtenez pas de réponse satisfaisante, vous pouvez contacter les autorités compétentes en matière d'accessibilité numérique dans votre pays.</p>
</section>
<p class="text-xs text-gray-400 pt-4 border-t border-gray-100">Déclaration établie le 1er janvier 2025. Dernière révision : août 2026.</p>`,
  },
  {
    cle: 'mot-du-directeur',
    titre: 'Mot du Directeur Général',
    contenu: `<blockquote class="text-lg sm:text-xl font-medium italic leading-relaxed text-emerald-50">
« Le développement durable de notre région passe par la mobilisation collective de toutes ses forces vives, la valorisation de ses richesses naturelles et humaines, et un partenariat fort avec l'État et la coopération internationale. »
</blockquote>
<p class="mt-4 text-xs font-semibold text-emerald-300">— Direction Générale, Agence Régionale de Développement de Ziguinchor</p>

<h3>Notre Mandat Républicain</h3>
<p>L'ARD est le bras technique des collectivités territoriales de la région de Ziguinchor. Créée pour harmoniser les interventions de développement, elle coordonne les schémas d'aménagement, appuie la maîtrise d'ouvrage communale et facilite la convergence des investissements publics et privés.</p>

<h3>Une Vision Territoriale Partagée</h3>
<p>Nous voulons faire de Ziguinchor une région émergente, compétitive, résiliente et solidaire, où chaque habitant bénéficie directement des retombées du progrès. Cela repose sur une agriculture modernisée, la valorisation des filières aquacoles et horticoles, un écotourisme responsable et un réseau d'infrastructures désenclavant durablement nos terroirs.</p>

<h3>Nos 5 Engagements Prioritaires</h3>
<ul>
<li>Planification territoriale rigoureuse (SRAT, PRD, PCD)</li>
<li>Mobilisation accrue des financements auprès des PTF</li>
<li>Suivi-évaluation via l'Observatoire territorial</li>
<li>Accompagnement de l'entrepreneuriat des jeunes et femmes</li>
<li>Coopération décentralisée et partenariats transfrontaliers</li>
</ul>

<h3>Un Appel à la Synergie Partenariale</h3>
<p>Aux partenaires techniques et financiers, aux investisseurs, aux universitaires et à la diaspora casamançaise, nous tendons la main. La région de Ziguinchor réunit des atouts comparatifs majeurs. Avec l'ARD comme interlocuteur technique rigoureux et transparent, vos initiatives trouveront un cadre de réalisation sécurisé et efficace.</p>
<p>À nos concitoyens et élus locaux, sachez que l'ARD demeure votre maison commune. Ensemble, avec courage, méthode et détermination, construisons le futur prospère de la Casamance.</p>

<p class="font-extrabold">La Direction Générale<br /><span class="font-semibold text-emerald-700">Agence Régionale de Développement (ARD) de Ziguinchor</span></p>`,
  },
];

/**
 * Reprodudit NAV_LINKS + les liens du pied de page. Hiérarchie via parentId.
 * Les enfants du header (sous-menus) sont rattachés via parentId.
 */
const NAVIGATION_SEED: {
  label: string;
  href: string;
  ordre: number;
  parentId?: string;
  section: 'header' | 'footer' | 'legal';
}[] = [
  // Header
  { label: 'Accueil', href: '/', ordre: 0, section: 'header' },
  { label: "L'ARD", href: '/a-propos', ordre: 1, section: 'header' },
  { label: 'La Région', href: '/la-region', ordre: 2, section: 'header' },
  { label: 'Nos Actions', href: '/programmes', ordre: 3, section: 'header' },
  {
    label: 'Documentation',
    href: '/documentation',
    ordre: 4,
    section: 'header',
  },
  { label: 'Contact', href: '/contact', ordre: 6, section: 'header' },
  { label: 'Galerie', href: '/galerie', ordre: 7, section: 'header' },
  // Footer — L'Institution
  { label: 'Accueil', href: '/', ordre: 0, section: 'footer' },
  {
    label: 'Présentation & Missions',
    href: '/a-propos',
    ordre: 1,
    section: 'footer',
  },
  {
    label: 'Mot du Directeur',
    href: '/a-propos/mot-du-directeur',
    ordre: 2,
    section: 'footer',
  },
  {
    label: 'La Région Ziguinchor',
    href: '/la-region',
    ordre: 3,
    section: 'footer',
  },
  {
    label: 'Départements',
    href: '/la-region/departements',
    ordre: 4,
    section: 'footer',
  },
  {
    label: 'Communes',
    href: '/la-region/communes',
    ordre: 5,
    section: 'footer',
  },
  {
    label: 'Cartographie SIG',
    href: '/la-region/cartographie',
    ordre: 6,
    section: 'footer',
  },
  // Footer — Actions & Ressources
  {
    label: 'Programmes de Développement',
    href: '/programmes',
    ordre: 0,
    section: 'footer',
  },
  {
    label: 'Projets Territoriaux',
    href: '/projets',
    ordre: 1,
    section: 'footer',
  },
  {
    label: 'Actualités & Communiqués',
    href: '/actualites',
    ordre: 2,
    section: 'footer',
  },
  {
    label: 'Documentation & Plans',
    href: '/documentation',
    ordre: 3,
    section: 'footer',
  },
  {
    label: "Appels d'offres & Recrutement",
    href: '/opportunites',
    ordre: 4,
    section: 'footer',
  },
  {
    label: 'Observatoire Territorial',
    href: '/observatoire',
    ordre: 5,
    section: 'footer',
  },
  {
    label: 'Agenda des Rencontres',
    href: '/agenda',
    ordre: 6,
    section: 'footer',
  },
  {
    label: 'Médiathèque & Réalisations',
    href: '/galerie',
    ordre: 7,
    section: 'footer',
  },
  // Footer — juridique
  {
    label: 'Mentions légales',
    href: '/mentions-legales',
    ordre: 0,
    section: 'legal',
  },
  {
    label: 'Politique de confidentialité',
    href: '/confidentialite',
    ordre: 1,
    section: 'legal',
  },
  {
    label: 'Accessibilité',
    href: '/accessibilite',
    ordre: 2,
    section: 'legal',
  },
  { label: 'Plan du site', href: '/plan-du-site', ordre: 3, section: 'legal' },
];

async function seedContenusStatiques() {
  console.log('Peuplement des contenus statiques…');
  let created = 0;
  for (const c of CONTENUS_STATIQUES_SEED) {
    const existing = await prisma.contenuStatique.findUnique({
      where: { cle: c.cle },
    });
    if (existing) continue; // ne jamais écraser une édition admin
    await prisma.contenuStatique.create({
      data: { cle: c.cle, titre: c.titre, contenu: c.contenu, actif: true },
    });
    created += 1;
  }
  const total = await prisma.contenuStatique.count();
  console.log(
    `OK  ${created} contenu(s) statique(s) créé(s) — total en base : ${total}`,
  );
}

async function seedNavigation() {
  console.log('Peuplement de la navigation…');
  let created = 0;
  for (const n of NAVIGATION_SEED) {
    const existing = await prisma.navigationItem.findFirst({
      where: { label: n.label, href: n.href, section: n.section },
    });
    if (existing) continue;
    await prisma.navigationItem.create({
      data: {
        label: n.label,
        href: n.href,
        section: n.section,
        ordre: n.ordre,
        parentId: n.parentId ?? null,
        actif: true,
      },
    });
    created += 1;
  }
  const total = await prisma.navigationItem.count();
  console.log(
    `OK  ${created} item(s) de navigation créé(s) — total en base : ${total}`,
  );
}

async function main() {
  await seedContenusStatiques();
  await seedNavigation();
}

main()
  .catch((error) => {
    console.error(
      'Échec du peuplement des contenus statiques / navigation',
      error,
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
