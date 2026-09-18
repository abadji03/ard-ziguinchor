'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import type { ParametreSite } from '@/types';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/constants';

interface SiteParamsContextValue {
  params: ParametreSite;
  /** Téléphone avec la prière de fallback sur la constante par défaut */
  telephone: string;
  email: string;
  adresse: string;
  villes: string;
  horaires: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  logo?: string;
}

const defaultParams: ParametreSite = {
  nomSite: 'ARD Ziguinchor',
  telephone: CONTACT_INFO.telephone,
  email: CONTACT_INFO.email,
  adresse: CONTACT_INFO.adresse,
  ville: '',
};

const SiteParamsContext = createContext<SiteParamsContextValue>({
  params: defaultParams,
  telephone: CONTACT_INFO.telephone,
  email: CONTACT_INFO.email,
  adresse: CONTACT_INFO.adresse,
  villes: '',
  horaires: CONTACT_INFO.horaires,
  facebook: SOCIAL_LINKS.facebook,
  twitter: SOCIAL_LINKS.twitter,
  linkedin: SOCIAL_LINKS.linkedin,
});

export function SiteParamsProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<ParametreSite>(defaultParams);

  useEffect(() => {
    api
      .get('/references/parametres-site')
      .then((res) => setParams(res.data ?? defaultParams))
      .catch(() => {
        /* garder les valeurs par défaut si l'API est indisponible */
      });
  }, []);

  const valeur = (v: string | null | undefined, fallback: string) =>
    v && v.trim() ? v : fallback;

  const value: SiteParamsContextValue = {
    params,
    telephone: valeur(params.telephone, CONTACT_INFO.telephone),
    email: valeur(params.email, CONTACT_INFO.email),
    adresse: valeur(params.adresse, CONTACT_INFO.adresse),
    villes: valeur(params.ville, ''),
    horaires: valeur(params.horaires, CONTACT_INFO.horaires),
    facebook: valeur(params.facebook, SOCIAL_LINKS.facebook),
    twitter: valeur(params.twitter, SOCIAL_LINKS.twitter),
    linkedin: valeur(params.linkedin, SOCIAL_LINKS.linkedin),
    logo: params.logo ?? undefined,
  };

  return (
    <SiteParamsContext.Provider value={value}>
      {children}
    </SiteParamsContext.Provider>
  );
}

export function useSiteParams() {
  return useContext(SiteParamsContext);
}
