'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { ActualitesTicker } from '@/components/shared/ActualitesTicker';

export function HeroSection() {
  return (
    <div>
      <section className="relative overflow-hidden" aria-label="Bannière principale">
        {/* Fond image bannière */}
        <div className="absolute inset-0">
          <Image
            src="/img_banniere.jpg"
            alt="Bannière ARD Ziguinchor"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay sombre pour la lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-secondary text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              <span>Région de Ziguinchor, Sénégal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Au service du{' '}
              <span className="text-secondary">développement</span>{' '}
              de la région
            </h1>

            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {"L'Agence Régionale de Développement de Ziguinchor accompagne les collectivités locales, mobilise les financements et pilote les projets de développement territorial."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/projets"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-gray-900 font-semibold text-base hover:bg-secondary/90 transition-colors"
              >
                Découvrir nos projets
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white text-white font-semibold text-base hover:bg-white hover:text-gray-900 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>

        {/* Vague bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Ticker fil d'info sous la bannière */}
      <ActualitesTicker />
    </div>
  );
}