import type { Metadata } from 'next';
import { HeroSection } from '@/components/shared/HeroSection';
import { ChiffresClés } from '@/components/shared/ChiffresClés';
import { MissionsSection } from '@/components/shared/MissionsSection';
import { ProjetsEtProgrammes } from '@/components/shared/ProjetsEtProgrammes';
import { OpportunitesOuvertes } from '@/components/shared/OpportunitesOuvertes';
import { ActualitesRecentes } from '@/components/shared/ActualitesRecentes';
import { PartenairesCarousel } from '@/components/shared/PartenairesCarousel';
import { SITE_DESCRIPTION } from '@/constants';

export const metadata: Metadata = {
  title: 'Accueil',
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'ARD Ziguinchor – Agence Régionale de Développement',
    description: SITE_DESCRIPTION,
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ChiffresClés />
      <MissionsSection />
      <ProjetsEtProgrammes />
      <OpportunitesOuvertes />
      <ActualitesRecentes />
      <PartenairesCarousel />
    </>
  );
}
