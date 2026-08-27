'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/Spinner';
import { partenairesService } from '@/services/partenaires.service';

export function PartenaireDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: p, isLoading, error } = useQuery({
    queryKey: ['partenaire', slug],
    queryFn: () => partenairesService.getBySlug(slug),
  });

  if (isLoading) return <div className="py-20"><LoadingState /></div>;
  if (error || !p) return (
    <div className="py-20 text-center">
      <p className="text-gray-500">Partenaire introuvable.</p>
      <Link href="/partenaires" className="text-primary mt-2 inline-block hover:underline">← Retour</Link>
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Partenaires', href: '/partenaires' }, { label: p.nom }]} />
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-white">{p.nom}</h1>
          {p.sigle && <p className="text-blue-200 mt-1">{p.sigle}</p>}
          <Badge variant="info" className="mt-3">{p.type.nom}</Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 flex gap-6">
              {p.logo && (
                <div className="w-24 h-24 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                  <Image src={p.logo} alt={p.nom} width={96} height={96} className="object-contain p-2" />
                </div>
              )}
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Présentation</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-900">Coordonnées</h3>
              {(p.ville || p.pays) && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-gray-600">{[p.ville, p.pays].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {p.telephone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href={`tel:${p.telephone}`} className="text-primary hover:underline">{p.telephone}</a>
                </div>
              )}
              {p.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href={`mailto:${p.email}`} className="text-primary hover:underline break-all">{p.email}</a>
                </div>
              )}
              {p.siteWeb && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <a href={p.siteWeb} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                    {p.siteWeb.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {(p.facebook || p.linkedin || p.twitter) && (
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  {p.facebook && (
                    <a href={p.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <FacebookIcon />
                    </a>
                  )}
                  {p.linkedin && (
                    <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <LinkedinIcon />
                    </a>
                  )}
                  {p.twitter && (
                    <a href={p.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                      className="p-2 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
                      <TwitterIcon />
                    </a>
                  )}
                </div>
              )}
            </div>

            <Link href="/partenaires" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Retour aux partenaires
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
