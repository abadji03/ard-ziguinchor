'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Compass,
  FileCheck2,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { ActualitesTicker } from '@/components/shared/ActualitesTicker';

export function HeroSection() {
  return (
    <div className="relative bg-slate-900 text-white">
      <section className="relative overflow-hidden" aria-label="Bannière principale">
        {/* Fond d'image avec dégradé institutionnel profond */}
        <div className="absolute inset-0">
          <Image
            src="/img_banniere.jpg"
            alt="Paysage et développement territorial de Ziguinchor Casamance"
            fill
            className="object-cover object-center brightness-[0.35] scale-105 transition-transform duration-1000"
            priority
            sizes="100vw"
          />
          {/* Dégradé d'ombrage uniquement à gauche pour préserver la lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            {/* Tag officiel d'identification territoriale */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Région de Ziguinchor • Casamance Naturelle</span>
              <span className="text-emerald-500">•</span>
              <span className="text-amber-300 font-bold">Portail Officiel</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              L'accélérateur du{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                développement
              </span>{' '}
              territorial de Ziguinchor
            </h1>

            <p className="text-slate-200 text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-2xl font-normal">
              Bras technique des collectivités locales de Casamance : nous accompagnons la planification
              stratégique, structurons les projets d'investissement, mobilisons les financements et
              mesurons la transformation socio-économique régionale.
            </p>

            {/* Boutons d'action prioritaires */}
            <div className="flex flex-wrap gap-3.5 mb-10">
              <Link
                href="/projets"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm sm:text-base hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-600/30"
              >
                <span>Consulter les projets</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/opportunites"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-semibold text-sm sm:text-base hover:bg-amber-500/30 transition-all backdrop-blur-xs"
              >
                <FileCheck2 className="h-4 w-4 text-amber-400" />
                <span>Appels d'offres ouverts</span>
              </Link>
              <Link
                href="/la-region/cartographie"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 font-semibold text-sm sm:text-base hover:bg-white/20 transition-all backdrop-blur-xs"
              >
                <Compass className="h-4 w-4 text-emerald-400" />
                <span>Cartographie SIG</span>
              </Link>
            </div>

            {/* Micro-piliers rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">3 Départements</div>
                  <div className="text-[11px] text-slate-400">Ziguinchor, Bignona, Oussouye</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">30 Communes</div>
                  <div className="text-[11px] text-slate-400">Assistance technique</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">Observatoire</div>
                  <div className="text-[11px] text-slate-400">Indicateurs & Données</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">Concertation</div>
                  <div className="text-[11px] text-slate-400">Comités régionaux</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fil d'actualité en continu */}
      <ActualitesTicker />
    </div>
  );
}
