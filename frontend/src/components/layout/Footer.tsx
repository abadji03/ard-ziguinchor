'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useSiteParams } from '@/contexts/SiteParamsContext';
import { useNavigation } from '@/hooks/useContenus';
import { buildNavigationTree } from '@/lib/contenus';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
  </svg>
);

// Repli silencieux si aucune navigation « footer » n'est définie en base.
const FALLBACK_COLONNES = [
  {
    title: "L'Institution",
    links: [
      { href: '/', label: 'Accueil' },
      { href: '/a-propos', label: 'Présentation & Missions' },
      { href: '/a-propos/mot-du-directeur', label: 'Mot du Directeur' },
      { href: '/la-region', label: 'La Région Ziguinchor' },
      { href: '/la-region/departements', label: 'Départements' },
      { href: '/la-region/communes', label: 'Communes' },
      { href: '/la-region/cartographie', label: 'Cartographie SIG' },
    ],
  },
  {
    title: 'Actions & Ressources',
    links: [
      { href: '/programmes', label: 'Programmes de Développement' },
      { href: '/projets', label: 'Projets Territoriaux' },
      { href: '/actualites', label: 'Actualités & Communiqués' },
      { href: '/documentation', label: 'Documentation & Plans' },
      { href: '/opportunites', label: "Appels d'offres & Recrutement" },
      { href: '/observatoire', label: 'Observatoire Territorial' },
      { href: '/agenda', label: 'Agenda des Rencontres' },
      { href: '/galerie', label: 'Médiathèque & Réalisations' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  const {
    telephone,
    email,
    adresse,
    villes: ville,
    horaires,
    facebook,
    twitter,
    linkedin,
    params,
  } = useSiteParams();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const { data: navFooter } = useNavigation('footer');
  const { data: navLegal } = useNavigation('legal');

  // Colonnes du pied de page lues en priorité depuis la base.
  const footerLinks = useMemo(() => {
    if (navFooter && navFooter.length > 0) {
      try {
        const tree = buildNavigationTree(navFooter, 'footer');
        // Regroupe les enfants sous le label de leur item parent (colonne).
        const cols = tree.slice(0, 3).map((node) => ({
          title: node.label,
          links: (node.children ?? []).map((c) => ({ href: c.href, label: c.label })),
        }));
        if (cols.some((c) => c.links.length > 0)) return cols;
      } catch {
        // Repli silencieux sur les colonnes codées en dur
      }
    }
    return null;
  }, [navFooter]);

  const legalLinks = useMemo(() => {
    if (navLegal && navLegal.length > 0) {
      try {
        const tree = buildNavigationTree(navLegal, 'legal');
        if (tree.length > 0) return tree;
      } catch {
        // Repli silencieux
      }
    }
    return null;
  }, [navLegal]);

  const socials = useMemo(
    () =>
      [
        { key: 'facebook', href: facebook, Icon: FacebookIcon, label: 'Facebook' },
        { key: 'twitter', href: twitter, Icon: TwitterIcon, label: 'Twitter' },
        { key: 'linkedin', href: linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
      ].filter((s) => s.href && s.href.trim()),
    [facebook, twitter, linkedin],
  );
  const adresseComplete =
    [adresse, ville].filter(Boolean).join(', ') || 'Boulevard des 54m, BP 321, Ziguinchor, Sénégal';

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Ruban d'actualité & Newsletter institutionnelle */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Lettre d'information territoriale
            </span>
            <h3 className="text-xl font-bold text-white">
              Suivez l'avancement des projets en Casamance
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Recevez les avis d'appels d'offres, publications d'études et bilans du développement de Ziguinchor.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Merci pour votre inscription à la lettre de l'ARD.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre adresse courriel..."
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shrink-0"
                >
                  <span>S'abonner</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer Principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Colonne 1 – Identité officielle (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl p-1.5 flex items-center justify-center w-12 h-12 shadow-sm shrink-0">
                <Image
                  src="/logo_ardz.png"
                  alt="ARD Ziguinchor"
                  width={96}
                  height={96}
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg block leading-tight">
                  ARD Ziguinchor
                </span>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  République du Sénégal
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              L'Agence Régionale de Développement de Ziguinchor est le bras technique des collectivités
              territoriales de la Casamance, au service de la planification stratégique, de la mobilisation
              des financements et de l'essor durable.
            </p>

            <div className="pt-1">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Rayonnement Territorial
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300">
                  Département de Ziguinchor
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300">
                  Département de Bignona
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300">
                  Département d'Oussouye
                </span>
              </div>
            </div>

            {/* Reseaux sociaux : DB prioritaire, repli constantes */}
            <div className="flex items-center gap-2 pt-2">
              {socials.map(({ key, href, Icon, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} ARD Ziguinchor`}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                >
                  <Icon />
                </a>
              ))}
              {params.youtube && (
                <a
                  href={params.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube ARD Ziguinchor"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                >
                  <YoutubeIcon />
                </a>
              )}
          </div>

            </div>
          {/* Colonnes 2 & 3 – Navigation depuis la base (repli : constantes) */}
          {(footerLinks ?? FALLBACK_COLONNES).map((col, i) => (
            <div
              key={col.title}
              className={i === 0 ? 'lg:col-span-2 sm:pl-4' : 'lg:col-span-3'}
            >
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-emerald-400">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-slate-600">›</span>
                      <span>{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Colonne 4 – Contact & Accès (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 text-emerald-400">
              Coordonnées
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
                <span className="text-slate-300">{adresseComplete}</span>
              </li>
              {telephone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                  <a href={`tel:${telephone}`} className="hover:text-white font-medium text-slate-300">
                    {telephone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                  <a href={`mailto:${email}`} className="hover:text-white break-all text-slate-300">
                    {email}
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <div className="font-bold text-slate-200 mb-1">Permanence administrative</div>
              <div>{horaires || 'Lundi au Vendredi : 08h00 – 17h00'}</div>
              <div className="text-[11px] text-emerald-400 mt-1">Accueil collectivités sur rendez-vous</div>
            </div>
          </div>
        </div>

        {/* Bas de page officiel */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>© {year} Agence Régionale de Développement (ARD) de Ziguinchor.</span>
            <span className="hidden sm:inline">•</span>
            <span className="italic text-slate-400 hidden sm:inline">« Un Peuple - Un But - Une Foi »</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            {(legalLinks ?? [
              { href: '/mentions-legales', label: 'Mentions légales' },
              { href: '/confidentialite', label: 'Confidentialité' },
              { href: '/accessibilite', label: 'Accessibilité' },
              { href: '/plan-du-site', label: 'Plan du site' },
            ]).map((item, idx, arr) => (
              <span key={item.href} className="flex items-center gap-4">
                <Link href={item.href} className="hover:text-slate-200 transition-colors">
                  {item.label}
                </Link>
                {idx < arr.length - 1 && <span>•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
