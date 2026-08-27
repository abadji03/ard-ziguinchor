'use client';

import Link from 'next/link';
import { Map, Building2, FolderOpen, ArrowRight, FileText } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';

const CATEGORIES = [
  {
    title: 'Planification régionale',
    description: 'Documents de planification au niveau de la région de Ziguinchor (PRD, SRADDT, schémas régionaux…)',
    href: '/documentation/planification-regionale',
    icon: Map,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Planification territoriale',
    description: 'Plans de Développement Communaux (PDC) par commune et Plans Départementaux de Développement (PDD) par département',
    href: '/documentation/planification-territoriale',
    icon: Building2,
    color: 'bg-green-100 text-green-700',
  },
  {
    title: 'Autres documents',
    description: 'Rapports, études, guides et ressources diverses qui ne concernent pas les planifications',
    href: '/documentation/autres',
    icon: FolderOpen,
    color: 'bg-purple-100 text-purple-700',
  },
];

export default function DocumentationPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Documentation' }]} />
          <SectionTitle
            title="Documentation"
            subtitle="Rapports, études, guides et ressources disponibles"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.href} href={cat.href} className="group">
              <Card hover className="h-full">
                <div className="p-6 flex flex-col gap-4 h-full">
                  <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center shrink-0`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 text-primary text-sm font-medium">
                    Parcourir
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Bibliothèque de documents</h3>
            <p className="text-sm text-gray-500 mt-1">
              Les documents sont classés par catégorie pour faciliter votre recherche.
              Utilisez le menu « Documentation » pour accéder directement à chaque catégorie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}