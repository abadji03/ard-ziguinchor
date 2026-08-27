'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/constants';
import { useSiteParams } from '@/contexts/SiteParamsContext';

export function Header() {
  const { telephone } = useSiteParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Ferme les sous-menus quand on clique en dehors du header de navigation
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      {/* Barre supérieure */}
      <div className="bg-primary text-white py-1.5 px-4 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between">
          <span>Agence Régionale de Développement de Ziguinchor</span>
          <a href={`tel:${telephone}`} className="hover:underline">{telephone}</a>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo_ardz.png"
              alt="ARD Ziguinchor"
              width={505}
              height={396}
              className="h-10 w-auto"
              priority
            />
            <span className="font-bold text-primary text-lg hidden sm:block leading-tight">
              ARD<br /><span className="text-xs font-normal text-gray-500">Ziguinchor</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map((link) =>
              'children' in link ? (
                <div
                  key={link.href}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      pathname.startsWith(link.href)
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    )}
                    aria-expanded={openDropdown === link.href}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openDropdown === link.href && 'rotate-180')} />
                  </button>
                  {openDropdown === link.href && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            {/* Recherche */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher…"
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Recherche"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 p-1.5 text-gray-400 hover:text-gray-600"
                    aria-label="Fermer la recherche"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"
                  aria-label="Ouvrir la recherche"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Hamburger mobile */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1" aria-label="Navigation mobile">
            {NAV_LINKS.map((link) =>
              'children' in link ? (
                <div key={link.href}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-lg"
                  >
                    {link.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', openDropdown === link.href && 'rotate-180')} />
                  </button>
                  {openDropdown === link.href && (
                    <div className="ml-4 flex flex-col gap-1 mt-1">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href} className="px-3 py-1.5 text-sm text-gray-600 hover:text-primary">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-lg',
                    pathname === link.href ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
