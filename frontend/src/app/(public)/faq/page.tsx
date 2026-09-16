'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { useQueryData } from '@/hooks/useQueryData';
import { referencesService } from '@/services/references.service';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoadingState } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Faq } from '@/types';

function FaqItem({ faq }: { faq: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-slate-50/80 transition-colors"
      >
        <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
          {faq.question}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
          <div
            className="prose-content text-slate-700 text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: faq.reponse }}
          />
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const { data: faqs, isLoading } = useQueryData(['faqs'], () => referencesService.getFaqs());

  const grouped = faqs?.reduce((acc, faq) => {
    const cat = faq.categorie?.nom ?? 'Questions Générales';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* En-tête Institutionnel */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-14 md:pt-12 md:pb-16">
          <div className="text-slate-400 mb-4">
            <Breadcrumb items={[{ label: 'Foire Aux Questions' }]} />
          </div>

          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              Assistance & Réponses
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Questions Fréquentes
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Trouvez rapidement les réponses à vos questions concernant les compétences de l'ARD,
              l'accompagnement des communes, l'accès aux financements et les marchés publics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {isLoading ? (
          <div className="py-16">
            <LoadingState message="Chargement des questions fréquentes…" />
          </div>
        ) : !faqs?.length ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <EmptyState
              title="Aucune question répertoriée"
              description="La foire aux questions est en cours d'enrichissement."
              icon={<HelpCircle className="h-12 w-12 text-slate-300" />}
            />
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped ?? {}).map(([categorie, items]) => (
              <section key={categorie}>
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    {categorie}
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <FaqItem key={faq.id} faq={faq} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bloc assistance directe */}
        <div className="mt-14 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Vous ne trouvez pas votre réponse ?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Nos conseillers et spécialistes territoriaux sont joignables directement.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-700 text-xs sm:text-sm font-bold transition-colors shrink-0"
          >
            <span>Poser une question</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
