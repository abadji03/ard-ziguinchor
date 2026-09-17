'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Newspaper, FolderOpen, FileText, Briefcase,
  Handshake, TrendingUp, ArrowRight, CheckCircle2,
  Clock, PlusCircle, Sparkles, Activity
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
  label, value, icon: Icon, href, color, tag,
}: {
  label: string; value: number | string; icon: React.ElementType;
  href: string; color: string; tag?: string;
}) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          {tag && (
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">{label}</p>
        </div>
      </div>
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
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête institutionnel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Session Administrative Active
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {formatDate(new Date())}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bonjour, {user?.prenom || 'Administrateur'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pilotage des publications territoriales, projets régionaux et ressources publiques de Ziguinchor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/actualites"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            Nouvelle Publication
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Actualités publiées"
          value={actualites?.total ?? '—'}
          icon={Newspaper}
          href="/admin/actualites"
          color="bg-blue-50 text-blue-700 border border-blue-200/60"
          tag="Articles & Communiqués"
        />
        <StatCard
          label="Projets de développement"
          value={projets?.total ?? '—'}
          icon={FolderOpen}
          href="/admin/projets"
          color="bg-emerald-50 text-emerald-700 border border-emerald-200/60"
          tag="3 Départements"
        />
        <StatCard
          label="Documents officiels"
          value={documents?.total ?? '—'}
          icon={FileText}
          href="/admin/documents"
          color="bg-purple-50 text-purple-700 border border-purple-200/60"
          tag="PDF & Rapports"
        />
        <StatCard
          label="Partenaires régionaux"
          value={partenaires?.total ?? '—'}
          icon={Handshake}
          href="/admin/partenaires"
          color="bg-amber-50 text-amber-700 border border-amber-200/60"
          tag="Coopération"
        />
      </div>

      {/* Dernières activités / Récents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actualités récentes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <Newspaper className="h-4 w-4 text-emerald-700" />
              <h2 className="font-bold text-slate-900 text-sm">Dernières actualités</h2>
            </div>
            <Link
              href="/admin/actualites"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
            >
              <span>Tout voir</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {loadingActus ? (
              <div className="p-8"><LoadingState /></div>
            ) : recentActus?.data?.length ? (
              recentActus.data.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{a.titre}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {a.datePublication ? formatDate(a.datePublication) : 'Non publié'}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    a.statut === 'publie' ? 'bg-emerald-100 text-emerald-800' :
                    a.statut === 'brouillon' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {a.statut === 'publie' ? 'Publié' : a.statut === 'brouillon' ? 'Brouillon' : a.statut}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                Aucune actualité enregistrée pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Projets récents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <Activity className="h-4 w-4 text-emerald-700" />
              <h2 className="font-bold text-slate-900 text-sm">Derniers projets enregistrés</h2>
            </div>
            <Link
              href="/admin/projets"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors"
            >
              <span>Tout voir</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 flex-1">
            {loadingProjets ? (
              <div className="p-8"><LoadingState /></div>
            ) : recentProjets?.data?.length ? (
              recentProjets.data.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.titre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.departement?.nom ?? 'Ziguinchor'} • <span className="text-emerald-700 font-medium">{p.secteur?.nom ?? 'Général'}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, p.niveauAvancement || 0))}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{p.niveauAvancement}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{p.statut}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                Aucun projet enregistré pour le moment.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Raccourcis d'actions rapides */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Raccourcis de gestion rapide</h2>
            <p className="text-xs text-slate-500 mt-0.5">Créez ou mettez à jour les informations en un clic</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/actualites',   label: 'Nouvelle Actualité',  desc: 'Articles & Médias', icon: Newspaper, color: 'text-blue-600 bg-blue-50' },
            { href: '/admin/projets',      label: 'Nouveau Projet',      desc: 'Suivi territorial', icon: FolderOpen, color: 'text-emerald-600 bg-emerald-50' },
            { href: '/admin/documents',    label: 'Ajouter Document',    desc: 'Bibliothèque PDF', icon: FileText, color: 'text-purple-600 bg-purple-50' },
            { href: '/admin/opportunites', label: 'Ajouter Offre',       desc: 'Appels & Recrutement', icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-4 rounded-xl border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-left flex flex-col justify-between"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${item.color} group-hover:scale-105 transition-transform`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
