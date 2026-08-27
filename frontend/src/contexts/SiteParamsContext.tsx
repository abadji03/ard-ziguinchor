'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import type { ParametreSite } from '@/types';
import { CONTACT_INFO } from '@/constants';

interface SiteParamsContextValue {
  params: ParametreSite;
  /** Téléphone avec la prière de fallback sur la constante par défaut */
  telephone: string;
  email: string;
  adresse: string;
  villes: string;
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
