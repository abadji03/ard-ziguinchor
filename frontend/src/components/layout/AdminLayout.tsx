'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Newspaper, FolderOpen, FileText,
  Image as ImageIcon, Users, Handshake, Briefcase,
  HelpCircle, Settings, LogOut, ChevronRight, BarChart3,
  Calendar, BookOpen, MapPin, UserCog, History, Menu, X,
  ExternalLink, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/admin/dashboard',    label: 'Tableau de bord',  icon: LayoutDashboard },
  { href: '/admin/actualites',   label: 'Actualités',       icon: Newspaper       },
  { href: '/admin/projets',      label: 'Projets',          icon: FolderOpen      },
  { href: '/admin/programmes',   label: 'Programmes',       icon: BookOpen        },
  { href: '/admin/documents',    label: 'Documents',        icon: FileText        },
  { href: '/admin/galerie',      label: 'Galerie',          icon: ImageIcon       },
  { href: '/admin/partenaires',  label: 'Partenaires',      icon: Handshake       },
  { href: '/admin/opportunites', label: 'Opportunités',     icon: Briefcase       },
  { href: '/admin/evenements',   label: 'Événements',       icon: Calendar        },
  { href: '/admin/equipe',       label: 'Équipe',           icon: Users           },
  { href: '/admin/observatoire', label: 'Observatoire',     icon: BarChart3       },
  { href: '/admin/region',       label: 'Région',           icon: MapPin          },
  { href: '/admin/faq',          label: 'FAQ',              icon: HelpCircle      },
  { href: '/admin/parametres',   label: 'Paramètres',       icon: Settings        },
];

// Sections réservées aux ADMIN / SUPER_ADMIN (gérées aussi côté backend)
const ADMIN_NAV_ITEMS = [
  { href: '/admin/utilisateurs', label: 'Utilisateurs',     icon: UserCog },
  { href: '/admin/journaux',     label: 'Journaux',         icon: History },
];

const isAdminRole = (role?: string) => role === 'ADMIN' || role === 'SUPER_ADMIN';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ne pas appliquer l'auth sur la page de login
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, isLoginPage]);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // La page de login s'affiche sans le layout admin
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-9 w-9 rounded-full border-3 border-emerald-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">Chargement de l'administration...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirection en cours (useEffect s'en charge) — afficher un spinner
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-9 w-9 rounded-full border-3 border-emerald-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">Redirection...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const currentNav = [...NAV_ITEMS, ...(isAdminRole(user?.role) ? ADMIN_NAV_ITEMS : [])].find(
    (item) => pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'))
  );

  const renderNavLinks = () => (
    <>
      <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Gestion de Contenu
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href + '/'));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1',
              isActive
                ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                )}
              />
              <span className="truncate">{label}</span>
            </div>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </Link>
        );
      })}

      {isAdminRole(user?.role) && (
        <div className="pt-4 mt-3 border-t border-slate-200/70">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Administration Système</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1',
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold shadow-xs border border-emerald-200/60'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                    )}
                  />
                  <span className="truncate">{label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Barre supérieure permanente pour Desktop et Mobile */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 lg:pl-64">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Bouton Hamburger Mobile pour ouvrir le Menu */}
            <button
              type="button"
              id="admin-mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Titre ou fil d'Ariane de la section courante */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>Administration</span>
                <ChevronRight className="h-3 w-3 text-slate-300" />
                <span className="text-slate-700 font-medium">{currentNav?.label || 'Espace de gestion'}</span>
              </div>
              <h1 className="text-base font-bold text-slate-900 leading-tight hidden sm:block">
                {currentNav?.label || 'Tableau de bord'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lien rapide pour voir le site public */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200/60"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Voir le site public</span>
              <span className="sm:hidden">Site</span>
            </Link>

            {/* Profil utilisateur succinct */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-none">
                  {user?.prenom} {user?.nom}
                </p>
                <span className="inline-block mt-0.5 text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Desktop Fixe */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200/80 flex-col fixed inset-y-0 left-0 z-30 shadow-xs">
        {/* En-tête Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="w-9 h-9 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shadow-2xs">
            <Image src="/logo_ardz.png" alt="ARD" width={64} height={64} className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight tracking-tight">ARD Ziguinchor</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[11px] font-medium text-slate-500">Back-Office Officiel</p>
            </div>
          </div>
        </div>

        {/* Navigation défilante */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Navigation admin">
          {renderNavLinks()}
        </nav>

        {/* Pied de sidebar : Utilisateur & Déconnexion */}
        <div className="border-t border-slate-200/80 p-3 bg-slate-50/60">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-[10px] font-medium text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors border border-rose-200/60 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Drawer Mobile pour petit écran */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop sombre flouté */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Tiroir coulissant depuis la gauche */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col z-10 border-r border-slate-200 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <Image src="/logo_ardz.png" alt="ARD" width={32} height={32} className="h-8 w-auto object-contain" />
                <div>
                  <p className="font-bold text-slate-900 text-sm leading-tight">ARD Ziguinchor</p>
                  <p className="text-[10px] text-slate-500">Portail Administration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Navigation mobile">
              {renderNavLinks()}
            </nav>

            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5 px-3 py-2 mb-2 rounded-xl bg-white border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{user?.prenom} {user?.nom}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-3 py-2 w-full rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200/60 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area avec padding-left sur desktop */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto" id="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
