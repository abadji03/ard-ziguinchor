'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Building2, Banknote, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { programmesService } from '@/services/programmes.service';

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

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Programmes', href: '/programmes' }, { label: prog.nom }]} />
          {prog.acronyme && <Badge variant="info" className="mt-4">{prog.acronyme}</Badge>}
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-white leading-tight max-w-3xl">{prog.nom}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {prog.image && (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <Image src={prog.image} alt={prog.nom} fill className="object-cover" />
              </div>
            )}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: prog.description }} />
            </div>
            {prog.objectifs && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">Objectifs</h2>
                <div className="prose-content text-sm" dangerouslySetInnerHTML={{ __html: prog.objectifs }} />
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-900">Informations</h3>
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
              {prog.budget && (
                <div className="flex gap-3 text-sm">
                  <Banknote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="font-medium">{prog.budget.toLocaleString('fr-FR')} FCFA</p>
                  </div>
                </div>
              )}
            </div>

            {prog.partenaires && prog.partenaires.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Partenaires</h3>
                <ul className="space-y-2">
                  {prog.partenaires.map((pp: { partenaire: { slug: string; nom: string }; role?: string }, i: number) => (
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

            {prog.documents && prog.documents.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-100">
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
      </div>
    </div>
  );
}
