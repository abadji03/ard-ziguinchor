'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, Banknote, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { STATUT_PROJET } from '@/constants';
import { projetsService } from '@/services/projets.service';

export function ProjetDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: projet, isLoading, error } = useQuery({
    queryKey: ['projet', slug],
    queryFn: () => projetsService.getBySlug(slug),
  });

  if (isLoading) return <div className="py-20"><LoadingState message="Chargement du projet…" /></div>;
  if (error || !projet) return (
    <div className="py-20 text-center">
      <p className="text-gray-500">Projet introuvable.</p>
      <Link href="/projets" className="text-primary mt-2 inline-block hover:underline">← Retour aux projets</Link>
    </div>
  );

  const statut = STATUT_PROJET[projet.statut] ?? { label: projet.statut, color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="bg-background min-h-screen">
      <div className="relative bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-80" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/80" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Breadcrumb items={[{ label: 'Projets', href: '/projets' }, { label: projet.titre }]} />
          <h1 className="mt-4 text-2xl md:text-4xl font-extrabold text-white leading-tight max-w-3xl">
            {projet.titre}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statut.color}`}>
              {statut.label}
            </span>
            {projet.secteur && <Badge variant="info">{projet.secteur.nom}</Badge>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {projet.imagePrincipale && (
              <div className="relative h-72 rounded-xl overflow-hidden">
                <Image src={projet.imagePrincipale} alt={projet.titre} fill className="object-cover" />
              </div>
            )}

            <div className="vitrine-card rounded-xl p-6">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span className="text-gray-700">Niveau d&apos;avancement</span>
                <span className="text-primary">{projet.niveauAvancement}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${projet.niveauAvancement}%` }}
                />
              </div>
            </div>

            <div className="vitrine-card rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: projet.description }} />
            </div>

            {projet.objectifs && (
              <div className="vitrine-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Objectifs</h2>
                <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: projet.objectifs }} />
              </div>
            )}

            {projet.resultats && (
              <div className="vitrine-card rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultats</h2>
                <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: projet.resultats }} />
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="vitrine-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Informations clés</h3>

              {projet.departement && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Localisation</p>
                    <p className="font-medium">{projet.departement.nom}{projet.commune ? `, ${projet.commune.nom}` : ''}</p>
                  </div>
                </div>
              )}

              {projet.dateDebut && (
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Dates</p>
                    <p className="font-medium">{formatDate(projet.dateDebut)}{projet.dateFin ? ` → ${formatDate(projet.dateFin)}` : ''}</p>
                  </div>
                </div>
              )}

              {projet.beneficiaires && (
                <div className="flex items-start gap-3 text-sm">
                  <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Bénéficiaires</p>
                    <p className="font-medium">{projet.beneficiaires.toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              )}

              {projet.budget && (
                <div className="flex items-start gap-3 text-sm">
                  <Banknote className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Budget</p>
                    <p className="font-medium">
                      {projet.budget.toLocaleString('fr-FR')} {projet.devise}
                    </p>
                    {projet.budgetExecute && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Exécuté : {projet.budgetExecute.toLocaleString('fr-FR')} {projet.devise}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {projet.partenaires && projet.partenaires.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Partenaires</h3>
                <ul className="space-y-2">
                  {projet.partenaires.map((pp, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <Link href={`/partenaires/${pp.partenaire.slug}`} className="text-primary hover:underline">
                        {pp.partenaire.nom}
                      </Link>
                      {pp.role && <span className="text-xs text-gray-400">{pp.role}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {projet.documents && projet.documents.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Documents</h3>
                <ul className="space-y-3">
                  {projet.documents.map((doc) => (
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

            <Link href="/projets" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Retour aux projets
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
