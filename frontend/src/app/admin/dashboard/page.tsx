'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Newspaper, FolderOpen, FileText, Users,
  Handshake, Briefcase, TrendingUp, Eye,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/Spinner';
import { actualitesService } from '@/services/actualites.service';
import { projetsService } from '@/services/projets.service';
import { documentsService } from '@/services/documents.service';
import { partenairesService } from '@/services/partenaires.service';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

function StatCard({
  label, value, icon: Icon, href, color,
}: {
  label: string; value: number | string; icon: React.ElementType;
  href: string; color: string;
}) {
  return (
    <Link href={href}>
      <Card hover className="p-5 flex items-center gap-4 cursor-pointer">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        <TrendingUp className="h-4 w-4 text-gray-300 ml-auto" />
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: actualites } = useQuery({
    queryKey: ['admin-actualites-count'],
    queryFn:  () => actualitesService.getAll({ page: 1, limit: 1 }),
  });
  const { data: projets } = useQuery({
    queryKey: ['admin-projets-count'],
    queryFn:  () => projetsService.getAll({ page: 1, limit: 1 }),
  });
  const { data: documents } = useQuery({
    queryKey: ['admin-documents-count'],
    queryFn:  () => documentsService.getAll({ page: 1, limit: 1 }),
  });
  const { data: partenaires } = useQuery({
    queryKey: ['admin-partenaires-count'],
    queryFn:  () => partenairesService.getAll({ page: 1, limit: 1 }),
  });

  // Récentes actualités
  const { data: recentActus, isLoading: loadingActus } = useQuery({
    queryKey: ['admin-recent-actualites'],
    queryFn:  () => actualitesService.getAll({ page: 1, limit: 5 }),
  });
  const { data: recentProjets, isLoading: loadingProjets } = useQuery({
    queryKey: ['admin-recent-projets'],
    queryFn:  () => projetsService.getAll({ page: 1, limit: 5 }),
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenue, {user?.prenom} — {formatDate(new Date())}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Actualités"
          value={actualites?.total ?? '—'}
          icon={Newspaper}
          href="/admin/actualites"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Projets"
          value={projets?.total ?? '—'}
          icon={FolderOpen}
          href="/admin/projets"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          label="Documents"
          value={documents?.total ?? '—'}
          icon={FileText}
          href="/admin/documents"
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          label="Partenaires"
          value={partenaires?.total ?? '—'}
          icon={Handshake}
          href="/admin/partenaires"
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actualités récentes */}
        <Card>
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Dernières actualités</h2>
            <Link href="/admin/actualites" className="text-xs text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loadingActus ? (
              <div className="p-5"><LoadingState /></div>
            ) : recentActus?.data?.length ? (
              recentActus.data.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.titre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.datePublication ? formatDate(a.datePublication) : 'Non publié'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    a.statut === 'publie' ? 'bg-green-100 text-green-700' :
                    a.statut === 'brouillon' ? 'bg-gray-100 text-gray-600' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {a.statut}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-5 text-sm text-gray-400 text-center">Aucune actualité</p>
            )}
          </div>
        </Card>

        {/* Projets récents */}
        <Card>
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Derniers projets</h2>
            <Link href="/admin/projets" className="text-xs text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loadingProjets ? (
              <div className="p-5"><LoadingState /></div>
            ) : recentProjets?.data?.length ? (
              recentProjets.data.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.titre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.departement?.nom ?? '—'} • {p.secteur?.nom}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{p.niveauAvancement}%</p>
                    <p className="text-xs text-gray-400">{p.statut}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-5 text-sm text-gray-400 text-center">Aucun projet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Liens rapides */}
      <Card>
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Accès rapides</h2>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/actualites',   label: 'Nouvelle actualité',  icon: Newspaper  },
            { href: '/admin/projets',      label: 'Nouveau projet',      icon: FolderOpen },
            { href: '/admin/documents',    label: 'Ajouter document',    icon: FileText   },
            { href: '/admin/opportunites', label: 'Ajouter opportunité', icon: Briefcase  },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-center"
            >
              <item.icon className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
