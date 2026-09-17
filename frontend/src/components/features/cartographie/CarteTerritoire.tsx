'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const REGION_CENTER: [number, number] = [12.62, -16.35];

// Fonds de carte gratuits (sans clé API)
export const BASEMAPS = {
  plan: {
    label: 'Plan',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagerie &copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics',
  },
  relief: {
    label: 'Relief',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
  },
} as const;

export type BasemapId = keyof typeof BASEMAPS;

export interface CommuneGeo {
  id: string;
  nom: string;
  code?: string;
  latitude?: number;
  longitude?: number;
  population?: number;
  departement?: { nom?: string } | null;
}

interface CarteTerritoireProps {
  communes: CommuneGeo[];
  height?: string;
}

// Charge et filtre les limites administratives depuis GeoBoundaries (données libres)
function BoundariesLayer({ showDepartements }: { showDepartements: boolean }) {
  const map = useMap();
  const [region, setRegion] = useState<GeoJSON.FeatureCollection | null>(null);
  const [departements, setDepartements] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const meta = await (await fetch('https://www.geoboundaries.org/api/current/gbOpen/SEN/ADM1/')).json();
        const gj = await (await fetch(meta.gjDownloadURL)).json();
        if (cancelled) return;
        const feats = (gj.features || []).filter((f: GeoJSON.Feature) => {
          const n = String((f.properties as Record<string, unknown>)?.shapeName ?? '').toLowerCase();
          return n === 'ziguinchor';
        });
        if (feats.length) setRegion({ type: 'FeatureCollection', features: feats } as GeoJSON.FeatureCollection);
        map.fitBounds(L.geoJSON({ type: 'FeatureCollection', features: feats } as GeoJSON.FeatureCollection).getBounds(), { padding: [20, 20] });
      } catch {
        /* limites indisponibles : la carte reste utilisable */
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [map]);

  useEffect(() => {
    if (!showDepartements) { setDepartements(null); return; }
    let cancelled = false;
    async function load() {
      try {
        const meta = await (await fetch('https://www.geoboundaries.org/api/current/gbOpen/SEN/ADM2/')).json();
        const gj = await (await fetch(meta.gjDownloadURL)).json();
        if (cancelled) return;
        const feats = (gj.features || []).filter((f: GeoJSON.Feature) => {
          const n = String((f.properties as Record<string, unknown>)?.shapeName ?? '').toLowerCase();
          return ['ziguinchor', 'bignona', 'oussouye'].includes(n);
        });
        if (feats.length) setDepartements({ type: 'FeatureCollection', features: feats } as GeoJSON.FeatureCollection);
      } catch {
        /* indisponible */
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [showDepartements]);

  const regionStyle = useMemo(
    () => ({ color: '#047857', weight: 3, fillColor: '#059669', fillOpacity: 0.05 }),
    [],
  );
  const deptStyle = useMemo(
    () => ({ color: '#D97706', weight: 2, dashArray: '6 4', fillOpacity: 0 }),
    [],
  );

  return (
    <>
      {region && <GeoJSON key={`reg-${showDepartements}`} data={region} style={regionStyle} />}
      {departements && <GeoJSON key="deps" data={departements} style={deptStyle} />}
    </>
  );
}

export function CarteTerritoire({ communes, height = '560px' }: CarteTerritoireProps) {
  const [mounted, setMounted] = useState(false);
  const [basemap, setBasemap] = useState<BasemapId>('plan');
  const [showDepartements, setShowDepartements] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const communesPositionnees = communes.filter(
    (c) => Number.isFinite(c.latitude) && Number.isFinite(c.longitude),
  );

  if (!mounted) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Chargement de la carte interactive…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        center={REGION_CENTER}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          key={basemap}
          attribution={BASEMAPS[basemap].attribution}
          url={BASEMAPS[basemap].url}
        />

        {/* Limites administratives (GeoBoundaries — données ouvertes) */}
        <BoundariesLayer showDepartements={showDepartements} />

        {/* Communes de la région */}
        {communesPositionnees.map((c) => (
          <Marker key={c.id} position={[c.latitude as number, c.longitude as number]}>
            <Popup>
              <div className="min-w-[200px] p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  {c.departement?.nom ? `Département de ${c.departement.nom}` : 'Commune'}
                </span>
                <div className="font-bold text-sm text-slate-900">Commune de {c.nom}</div>
                {c.population && (
                  <div className="text-xs text-slate-600 mt-0.5">
                    Population (RGPH-5 2023) :{' '}
                    <span className="font-semibold">{c.population.toLocaleString('fr-FR')} hab.</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Sélecteur de fond de carte + options */}
      <div className="absolute top-3 right-3 z-[500] flex flex-col items-end gap-2">
        <div className="flex rounded-xl overflow-hidden border border-slate-300 bg-white shadow-md">
          {(Object.keys(BASEMAPS) as BasemapId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setBasemap(id)}
              className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                basemap === id ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-emerald-50'
              }`}
            >
              {BASEMAPS[id].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowDepartements((v) => !v)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl border shadow-md transition-colors ${
            showDepartements
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50'
          }`}
        >
          {showDepartements ? 'Masquer les départements' : 'Afficher les départements'}
        </button>
      </div>
    </div>
  );
}