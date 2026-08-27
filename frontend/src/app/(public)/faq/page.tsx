'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Faq } from '@/types';

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-primary shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
          <div className="pt-3 prose-content" dangerouslySetInnerHTML={{ __html: faq.reponse }} />
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { data: faqs, isLoading } = useQueryData(['faqs'], () => referencesService.getFaqs());

  // Grouper par catégorie
  const grouped = faqs?.reduce((acc, faq) => {
    const cat = faq.categorie?.nom ?? 'Général';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'FAQ' }]} />
          <SectionTitle
            title="Questions fréquentes"
            subtitle="Retrouvez les réponses aux questions les plus posées"
            className="mt-4 mb-0 [&_h2]:text-white [&_p]:text-blue-100"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {isLoading ? (
          <LoadingState />
        ) : !faqs?.length ? (
          <EmptyState title="Aucune question" description="Les questions fréquentes seront disponibles prochainement." />
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped ?? {}).map(([cat, items]) => (
              <section key={cat}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{cat}</h2>
                <div className="space-y-3">
                  {items.map((faq) => <FaqItem key={faq.id} faq={faq} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
