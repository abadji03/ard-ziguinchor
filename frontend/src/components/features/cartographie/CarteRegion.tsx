'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createColorIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });

const STATUT_COLORS: Record<string, string> = {
  encours: '#059669',
  realise: '#2563EB',
  planifie: '#D97706',
  suspendu: '#DC2626',
};

export interface ProjetGeo {
  id: string;
  titre: string;
  statut: string;
  latitude: number;
  longitude: number;
  secteur?: string;
  budget?: number;
  beneficiaires?: number;
  commune?: string;
  localisationSource?: 'projet' | 'commune' | 'departement';
}

interface CarteRegionProps {
  projets: ProjetGeo[];
  height?: string;
}

const ZIGUINCHOR_CENTER: [number, number] = [12.5657, -16.2736];

export function CarteRegion({ projets, height = '500px' }: CarteRegionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200"
      >
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Chargement de la carte interactive…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        center={ZIGUINCHOR_CENTER}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Point central ARD */}
        <Marker position={ZIGUINCHOR_CENTER}>
          <Popup>
            <div className="p-1 min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                Siège Régional
              </span>
              <div className="font-bold text-sm text-slate-900">ARD Ziguinchor</div>
              <div className="text-xs text-slate-500 mt-0.5">Agence Régionale de Développement</div>
            </div>
          </Popup>
        </Marker>

        {/* Projets géolocalisés */}
        {projets.map((projet) => {
          const color = STATUT_COLORS[projet.statut] || '#64748B';
          return (
            <Marker
              key={projet.id}
              position={[projet.latitude, projet.longitude]}
              icon={createColorIcon(color)}
            >
              <Popup>
                <div className="min-w-[220px] p-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {projet.secteur || 'Projet'}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{ background: color + '20', color }}
                    >
                      {projet.statut}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900 leading-snug">{projet.titre}</div>

                  <div className="text-xs text-slate-600 space-y-0.5 pt-1 border-t border-slate-100">
                    {projet.commune && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Commune :</span>
                        <span className="font-medium text-slate-800">{projet.commune}</span>
                      </div>
                    )}
                    {projet.localisationSource === 'commune' && (
                      <div className="text-[10px] italic text-slate-400">
                        Position indicative de la commune
                      </div>
                    )}
                    {projet.localisationSource === 'departement' && (
                      <div className="text-[10px] italic text-slate-400">
                        Position indicative du département
                      </div>
                    )}
                    {projet.beneficiaires && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bénéficiaires :</span>
                        <span className="font-medium text-slate-800">{projet.beneficiaires.toLocaleString('fr-FR')}</span>
                      </div>
                    )}
                    {projet.budget && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Budget :</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {(projet.budget / 1000000).toLocaleString('fr-FR')} M FCFA
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
