'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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
  encours: '#F59E0B',
  realise: '#16A34A',
  planifie: '#F4B400',
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
        className="flex items-center justify-center bg-gray-100 rounded-xl"
      >
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm">Chargement de la carte…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
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
            <div className="font-semibold text-sm">ARD Ziguinchor</div>
            <div className="text-xs text-gray-500">Siège de l&apos;Agence Régionale de Développement</div>
          </Popup>
        </Marker>

        {/* Projets géolocalisés */}
        {projets.map((projet) => {
          const color = STATUT_COLORS[projet.statut] || '#6B7280';
          return (
            <Marker
              key={projet.id}
              position={[projet.latitude, projet.longitude]}
              icon={createColorIcon(color)}
            >
              <Popup>
                <div className="min-w-48">
                  <div className="font-semibold text-sm mb-1">{projet.titre}</div>
                  {projet.secteur && (
                    <div className="text-xs text-gray-500 mb-1">Secteur : {projet.secteur}</div>
                  )}
                  {projet.commune && (
                    <div className="text-xs text-gray-500 mb-1">Commune : {projet.commune}</div>
                  )}
                  {projet.beneficiaires && (
                    <div className="text-xs text-gray-500 mb-1">
                      Bénéficiaires : {projet.beneficiaires.toLocaleString('fr-FR')}
                    </div>
                  )}
                  <div
                    className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: color + '20', color }}
                  >
                    {projet.statut}
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
