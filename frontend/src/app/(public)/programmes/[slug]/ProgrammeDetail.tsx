'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Building2, Banknote, ArrowLeft, Download, ExternalLink, FolderGit2, MapPin, CheckCircle2, Rocket, Target, Clock } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { programmesService } from '@/services/programmes.service';

const PROGRAMME_STATUT: Record<string, { label: string; color: string; bg: string }> = {
  actif: { label: 'Actif', color: '#16A34A', bg: 'bg-green-100 text-green-700' },
  termine: { label: 'Terminé', color: '#64748B', bg: 'bg-slate-100 text-slate-700' },
  suspendu: { label: 'Suspendu', color: '#DC2626', bg: 'bg-red-100 text-red-700' },
};

const formatBudget = (n?: number) => {
  if (!n) return '—';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Md FCFA`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M FCFA`;
  return `${n.toLocaleString('fr-FR')} FCFA`;
};

export function ProgrammeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: prog, isLoading, error } = useQuery({
    queryKey: ['programme', slug],
    queryFn: () => programmesService.getBySlug(slug),
  });

  if (isLoading) return <div className="py-20"><LoadingState /></div>;
  if (error || !prog) return (
    <div className="py-20 text-center">
      <p className="text-gray-500">Programme introuvable.</p>
      <Link href="/programmes" className="text-primary mt-2 inline-block hover:underline">← Retour</Link>
    </div>
  );

  const statut = PROGRAMME_STATUT[prog.statut] ?? { label: prog.statut, color: '#64748B', bg: 'bg-slate-100 text-slate-700' };

  return (
    <div className="bg-background min-h-screen">
      {/* Héros vitrine */}
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Breadcrumb items={[{ label: 'Programmes', href: '/programmes' }, { label: prog.nom }]} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {prog.acronyme && <Badge variant="info">{prog.acronyme}</Badge>}
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${statut.bg}`}>
              {statut.label}
            </span>
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl">{prog.nom}</h1>
          {prog.resume && (
            <p className="mt-4 max-w-2xl text-slate-200 text-base leading-relaxed">{prog.resume}</p>
          )}
        </div>
      </div>

      {/* Bandeau de métriques clés */}
      {prog.dateDebut || prog.budget !== undefined || prog.dateFin || prog.projets?.length ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="vitrine-card hover-lift p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1"><Clock size={13} /> Période</div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                {prog.dateDebut ? formatDate(prog.dateDebut) : '—'}{prog.dateFin ? ` → ${formatDate(prog.dateFin)}` : ''}
              </div>
            </div>
            <div className="vitrine-card hover-lift p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1"><Banknote size={13} /> Budget</div>
              <div className="text-sm font-bold text-emerald-700">{formatBudget(prog.budget)}</div>
            </div>
            <div className="vitrine-card hover-lift p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1"><FolderGit2 size={13} /> Projets</div>
              <div className="text-2xl font-black text-primary">{prog.projets?.length ?? 0}</div>
            </div>
            <div className="vitrine-card hover-lift p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 mb-1"><Building2 size={13} /> Pilote</div>
              <div className="text-sm font-bold text-slate-900 leading-tight">{prog.organismePilote || 'ARD'}</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {prog.image && (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image src={prog.image} alt={prog.nom} fill className="object-cover" />
              </div>
            )}
            <div className="vitrine-card rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Rocket size={18} className="text-primary" /> Description</h2>
              <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: prog.description }} />
            </div>
            {prog.objectifs && (
              <div className="vitrine-card rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Target size={18} className="text-primary" /> Objectifs</h2>
                <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: prog.objectifs }} />
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="vitrine-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Informations</h3>
              {prog.dateDebut && (
                <div className="flex gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Période</p>
                    <p className="font-medium">{formatDate(prog.dateDebut)}{prog.dateFin ? ` → ${formatDate(prog.dateFin)}` : ''}</p>
                  </div>
                </div>
              )}
              {prog.organismePilote && (
                <div className="flex gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Organisme pilote</p>
                    <p className="font-medium">{prog.organismePilote}</p>
                  </div>
                </div>
              )}
              {prog.budget !== undefined && (
                <div className="flex gap-3 text-sm">
                  <Banknote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="font-medium">{formatBudget(prog.budget)}</p>
                  </div>
                </div>
              )}
            </div>

            {prog.documents && prog.documents.length > 0 && (
              <div className="vitrine-card rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
                <ul className="space-y-3">
                  {prog.documents.map((doc) => (
                    <li key={doc.id}>
                      <p className="text-sm font-medium text-gray-800 mb-2 truncate">{doc.titre || 'Document'}</p>
                      <div className="flex gap-2">
                        <a
                          href={doc.fichier}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" /> Voir
                        </a>
                        <a
                          href={doc.fichier}
                          download
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                        >
                          <Download className="h-4 w-4" /> Télécharger
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/programmes" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Retour aux programmes
            </Link>
          </aside>
        </div>

        {/* Projets rattachés au programme (données fournies par l'API) */}
        {prog.projets && prog.projets.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderGit2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">Portefeuille</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">Projets rattachés à ce programme</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {prog.projets.map((projet) => (
                <Link
                  key={projet.id}
                  href={`/projets/${projet.slug}`}
                  className="vitrine-card hover-lift p-5 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                        {projet.titre}
                      </h3>
                      {projet.departement && (
                        <p className="text-xs text-slate-500 mt-1">
                          {projet.departement.nom}{projet.commune ? ` — ${projet.commune.nom}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                    <span>Voir le projet</span>
                    <ExternalLink size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
