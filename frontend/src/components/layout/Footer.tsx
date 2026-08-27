'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSiteParams } from '@/contexts/SiteParamsContext';

// Icônes réseaux sociaux (SVG inline car lucide-react v1+ a renommé ces icônes)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
  </svg>
);
import { SOCIAL_LINKS } from '@/constants';

export function Footer() {
  const year = new Date().getFullYear();
  const { telephone, email, adresse, villes: ville } = useSiteParams();

  // Adresse complète : ville si renseignée, sinon adresse (ou les deux)
  const adresseComplete = [adresse, ville].filter(Boolean).join(', ');

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Colonne 1 – Identité */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white rounded-xl p-1 flex items-center justify-center">
                <Image src="/logo_ardz.png" alt="ARD Ziguinchor" width={505} height={396} className="h-10 w-auto" />
              </div>
              <span className="font-bold text-white text-lg">ARD Ziguinchor</span>
            </div>
            <p className="text-sm leading-relaxed">
              Agence Régionale de Développement de Ziguinchor — acteur du développement
              territorial et de l'appui aux collectivités locales.
            </p>
            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.facebook && (
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook" className="hover:text-white transition-colors">
                  <FacebookIcon />
                </a>
              )}
              {SOCIAL_LINKS.twitter && (
                <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer"
                  aria-label="Twitter / X" className="hover:text-white transition-colors">
                  <TwitterIcon />
                </a>
              )}
              {SOCIAL_LINKS.linkedin && (
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn" className="hover:text-white transition-colors">
                  <LinkedinIcon />
                </a>
              )}
              {SOCIAL_LINKS.youtube && (
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
                  aria-label="YouTube" className="hover:text-white transition-colors">
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>

          {/* Colonne 2 – Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/',             label: 'Accueil' },
                { href: '/a-propos',     label: "L'ARD" },
                { href: '/programmes',   label: 'Programmes' },
                { href: '/projets',      label: 'Projets' },
                { href: '/actualites',   label: 'Actualités' },
                { href: '/documentation',label: 'Documentation' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 – Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/partenaires',  label: 'Partenaires' },
                { href: '/opportunites', label: 'Opportunités' },
                { href: '/galerie',      label: 'Galerie' },
                { href: '/agenda',       label: 'Agenda' },
                { href: '/observatoire', label: 'Observatoire' },
                { href: '/contact',      label: 'Contact' },
                { href: '/faq',          label: 'FAQ' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 – Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                <span>{adresseComplete}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                <a href={`tel:${telephone}`} className="hover:text-white">{telephone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                <a href={`mailto:${email}`} className="hover:text-white break-all">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas de footer */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} ARD Ziguinchor. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
