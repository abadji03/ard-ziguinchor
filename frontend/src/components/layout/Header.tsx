'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Compass,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/constants';
import { useSiteParams } from '@/contexts/SiteParamsContext';
import { useNavigation } from '@/hooks/useContenus';
import { buildNavigationTree } from '@/lib/contenus';

export function Header() {
  const { telephone, email, adresse, villes: ville } = useSiteParams();
  const { data: navHeader } = useNavigation('header');
  // Navigation prioritaire depuis la base, repli sur les liens codés en dur.
  const navLinks = useMemo(() => {
    if (navHeader && navHeader.length > 0) {
      try {
        const tree = buildNavigationTree(navHeader, 'header');
        if (tree.length > 0) return tree;
      } catch {
        // Repli silencieux sur NAV_LINKS
      }
    }
    return NAV_LINKS as unknown as { label: string; href: string; children?: { label: string; href: string }[] }[];
  }, [navHeader]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  // Détection de défilement pour effet d'élévation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermer le menu mobile et les sous-menus lors du changement de page
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // Focus automatique sur le champ de recherche
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Fermer les dropdowns desktop au clic en dehors
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Verrouillage du défilement lorsque le drawer mobile est ouvert + touche Escape
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setSearchOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const adresseComplete = [adresse, ville].filter(Boolean).join(', ') || 'Boulevard des 54m, BP 321, Ziguinchor';

  return (
    <>
      {/* Ruban tricolore officiel du Sénégal (Vert, Jaune, Rouge) */}
      <div className="h-1.5 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#00853F]" />
        <div className="flex-1 bg-[#FDEF42]" />
        <div className="flex-1 bg-[#E31B23]" />
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-all duration-200 border-b border-slate-100',
          scrolled ? 'shadow-md shadow-slate-900/5' : 'shadow-none'
        )}
      >
        {/* Barre supérieure institutionnelle */}
        <div className="bg-slate-900 text-slate-200 py-1.5 px-4 text-xs hidden lg:block border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium tracking-wide flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                RÉPUBLIQUE DU SÉNÉGAL • Agence Régionale de Développement de Ziguinchor
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-amber-400" />
                Région Naturelle de Casamance
              </span>
            </div>
            <div className="flex items-center gap-4">
              {telephone && (
                <a
                  href={`tel:${telephone}`}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <Phone className="h-3 w-3 text-emerald-400" />
                  {telephone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Mail className="h-3 w-3 text-emerald-400" />
                  {email}
                </a>
              )}
              <Link
                href="/opportunites"
                className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
              >
                Appels d'offres
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo officiel */}
            <Link
              href="/"
              className="flex items-center gap-3.5 shrink-0 group py-1"
              aria-label="Accueil ARD Ziguinchor"
            >
              <div className="relative w-12 h-12 bg-white rounded-xl shadow-xs border border-slate-200/80 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/logo_ardz.png"
                  alt="Logo ARD Ziguinchor"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">
                    ARD
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 hidden sm:inline-block">
                    Ziguinchor
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5 line-clamp-1 max-w-[220px] sm:max-w-xs">
                  Développement Territorial & Régional
                </span>
              </div>
            </Link>

            {/* Navigation Desktop */}
            <nav
              ref={dropdownRef}
              className="hidden lg:flex items-center gap-1"
              aria-label="Navigation principale"
            >
              {/* Navigation dynamique (DB → fallback codé en dur) */}
              {navLinks.map((link) =>
                link.children && link.children.length > 0 ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all',
                        pathname.startsWith(link.href)
                          ? 'text-primary bg-emerald-50/80 font-bold'
                          : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                      )}
                      aria-expanded={openDropdown === link.href}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200 text-slate-400',
                          openDropdown === link.href && 'rotate-180 text-primary'
                        )}
                      />
                    </button>
                    {openDropdown === link.href && (
                      <div className="absolute top-full left-0 pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 py-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className={cn(
                                'flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                                pathname === child.href
                                  ? 'text-primary bg-emerald-50/60 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                              )}
                            >
                              <span>{child.label}</span>
                              <ChevronRight className="h-3 w-3 text-slate-300" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3.5 py-2 text-sm font-semibold rounded-lg transition-all',
                      pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                        ? 'text-primary bg-emerald-50/80 font-bold'
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Actions à droite : Recherche & Bouton Menu (Trois tirets) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Barre de recherche dynamique */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        ref={searchRef}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher projets, documents..."
                        className="border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-slate-50"
                        aria-label="Recherche sur le site"
                      />
                      <Search className="h-4 w-4 text-slate-400 absolute left-3 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="ml-1 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                      aria-label="Fermer la recherche"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                    aria-label="Ouvrir la recherche"
                    title="Recherche"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Bouton permanent "Espace Projets / Observatoire" sur grand écran */}
              <Link
                href="/la-region/cartographie"
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                Cartographie
              </Link>

              {/* LE BOUTON DES TROIS TIRETS (Menu Hamburger & Drawer) */}
              <button
                type="button"
                id="header-hamburger-button"
                className={cn(
                  'flex items-center gap-2 p-2.5 sm:px-3 sm:py-2.5 rounded-xl border font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                  mobileOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                )}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Fermer le panneau de navigation' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation-drawer"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-current" />
                ) : (
                  <Menu className="h-5 w-5 text-current" />
                )}
                <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
                  {mobileOpen ? 'Fermer' : 'Menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DRAWER LATÉRAL MODERNE (S'ouvre au clic sur les 3 tirets) */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Voile d'arrière-plan avec flou */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panneau tiroir depuis la droite */}
          <div
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-10 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300 ease-out"
          >
          {/* En-tête du tiroir */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex items-center justify-center">
                <Image
                  src="/logo_ardz.png"
                  alt="Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  ARD Ziguinchor
                </h3>
                <p className="text-xs text-slate-500">Navigation & Services Régionaux</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white transition-colors border border-transparent hover:border-slate-200"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Recherche intégrée au tiroir */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher sur le site..."
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            </form>
          </div>

          {/* Corps de navigation à défilement */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Raccourcis rapides */}
            <div className="grid grid-cols-2 gap-2 pb-2">
              <Link
                href="/opportunites"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <Briefcase className="h-4 w-4 text-amber-700 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold">Appels d'offres</div>
                  <div className="text-[10px] text-amber-700">Marchés & Recrutement</div>
                </div>
              </Link>
              <Link
                href="/observatoire"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-900 hover:bg-emerald-100 transition-colors"
              >
                <Compass className="h-4 w-4 text-emerald-700 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold">Observatoire</div>
                  <div className="text-[10px] text-emerald-700">Données régionales</div>
                </div>
              </Link>
            </div>

            {/* Menu hiérarchique principal */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Rubriques
              </div>
              {/* Navigation dynamique (DB → fallback codé en dur) */}
              {navLinks.map((link) => {
                const isGroup = !!link.children && link.children.length > 0;
                const isExpanded = mobileExpandedGroup === link.href;

                if (isGroup) {
                  return (
                    <div key={link.href} className="rounded-xl overflow-hidden border border-slate-100">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpandedGroup(isExpanded ? null : link.href)
                        }
                        className={cn(
                          'flex items-center justify-between w-full px-3.5 py-3 text-sm font-semibold transition-colors',
                          pathname.startsWith(link.href)
                            ? 'text-primary bg-emerald-50/50'
                            : 'text-slate-800 hover:bg-slate-50'
                        )}
                        aria-expanded={isExpanded}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 text-slate-400 transition-transform duration-200',
                            isExpanded && 'rotate-180 text-primary'
                          )}
                        />
                      </button>

                      {isExpanded && (
                        <div className="bg-slate-50/80 px-3 py-1.5 border-t border-slate-100 space-y-1">
                          {link.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                'flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors',
                                pathname === child.href
                                  ? 'text-primary bg-white font-bold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                              )}
                            >
                              <span>{child.label}</span>
                              <ChevronRight className="h-3 w-3 text-slate-400" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl transition-colors',
                      pathname === link.href
                        ? 'text-primary bg-emerald-50 font-bold'
                        : 'text-slate-800 hover:bg-slate-50'
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  </Link>
                );
              })}
            </div>

            {/* Liens secondaires et documentation */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Espace Pratique
              </div>
              <Link
                href="/agenda"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Agenda des Événements & Réunions</span>
              </Link>
              <Link
                href="/documentation"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Plans de Développement & Bibliothèque</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Mail className="h-4 w-4 text-slate-400" />
                <span>Guichet de Contact & Assistance</span>
              </Link>
            </div>

            {/* Carte de contact direct */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl space-y-2.5 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Contact ARD Ziguinchor
              </div>
              <div className="text-xs text-slate-300 flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{adresseComplete}</span>
              </div>
              {telephone && (
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <a href={`tel:${telephone}`} className="hover:underline font-semibold">
                    {telephone}
                  </a>
                </div>
              )}
              {email && (
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:underline break-all">
                    {email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Pied du tiroir */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-[11px] text-slate-500">
            Agence Régionale de Développement de Ziguinchor © {new Date().getFullYear()}
          </div>
        </div>
      </div>
      )}
    </>
  );
}
