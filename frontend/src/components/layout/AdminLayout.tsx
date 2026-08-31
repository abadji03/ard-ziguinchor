'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard, Newspaper, FolderOpen, FileText,
  Image as ImageIcon, Users, Handshake, Briefcase,
  HelpCircle, Settings, LogOut, ChevronRight, BarChart3,
  Calendar, BookOpen, MapPin, UserCog, History,
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

  // Ne pas appliquer l'auth sur la page de login
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, isLoginPage]);

  // La page de login s'affiche sans le layout admin
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirection en cours (useEffect s'en charge) — afficher un spinner
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-30 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Image src="/logo_ardz.png" alt="ARD" width={505} height={396} className="h-9 w-auto" />
          <div>
            <p className="font-bold text-primary text-sm leading-tight">ARD Ziguinchor</p>
            <p className="text-xs text-gray-400">Administration</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3" aria-label="Navigation admin">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5',
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}

          {isAdminRole(user?.role) && (
            <>
              <div className="border-t border-gray-100 my-2 mx-1" />
              {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5',
                    pathname === href || pathname.startsWith(href + '/')
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="p-6 min-h-screen" id="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
