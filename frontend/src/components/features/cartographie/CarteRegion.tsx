'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Satellite, Wallet, Users, MapPin } from 'lucide-react';

// Fix icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createColorIcon = (color: string, selected = false) =>
  L.divIcon({
    className: '',
    html: `
      <div class="map-pin ${selected ? 'is-active' : ''}" style="--pin:${color}">
        <span class="map-pin__pulse"></span>
        <span class="map-pin__core"></span>
        <span class="map-pin__ring"></span>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });

const STATUT_COLORS: Record<string, string> = {
  encours: '#F59E0B',
  realise: '#16A34A',
  planifie: '#F4B400',
  suspendu: '#DC2626',
};
const STATUT_LABELS: Record<string, string> = {
  encours: 'En cours',
  realise: 'Réalisé',
  planifie: 'Planifié',
  suspendu: 'Suspendu',
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

const ZIGUINCHOR_CENTER: [number, number] = [12.5657, -16.2736];

const formatBudget = (n?: number) => {
  if (!n) return '—';
  if (n >= 1_000_000_000) return `${(n/1000000000).toLocaleString('fr-FR',{maximumFractionDigits:1})} Md FCFA`;
  if (n >= 1_000_000) return `${(n/1000000).toLocaleString('fr-FR',{maximumFractionDigits:1})} M FCFA`;
  return `${n.toLocaleString('fr-FR')} FCFA`;
};

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 11, { duration: 0.9, easeLinearity: 0.25 });
  }, [position, map]);
  return null;
}

interface CarteRegionProps {
  projets: ProjetGeo[];
  height?: string;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function CarteRegion({ projets, height = '500px', selectedId, onSelect }: CarteRegionProps) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'route' | 'satellite'>('route');
  const [active, setActive] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const currentId = selectedId ?? active;
  const activeProj = projets.find((p) => p.id === currentId) ?? null;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (currentId && markerRefs.current[currentId]) {
      const p = projets.find((x) => x.id === currentId);
      if (p) (markerRefs.current[currentId] as L.Marker).openPopup();
    }
  }, [currentId, projets]);

  if (!mounted) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-slate-900 rounded-2xl">
        <div className="text-center text-slate-300">
          <div className="w-9 h-9 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Chargement de la carte interactive…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/10" style={{ height }}>
      <MapContainer center={ZIGUINCHOR_CENTER} zoom={9} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          url={mode === 'route'
            ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'}
          attribution={mode === 'route' ? '&copy; OpenStreetMap &copy; CARTO' : 'Tiles &copy; Esri'}
          maxZoom={20}
        />
        <FlyTo position={activeProj ? [activeProj.latitude, activeProj.longitude] : null} />

        {/* Zone d'influence autour du centre */}
        <Circle center={ZIGUINCHOR_CENTER} radius={45000} pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.05, weight: 1, dashArray: '6 6' }} />

        {projets.map((projet, i) => {
          const color = STATUT_COLORS[projet.statut] || '#6B7280';
          const isActive = projet.id === currentId;
          return (
            <Marker
              key={projet.id}
              position={[projet.latitude, projet.longitude]}
              icon={createColorIcon(color, isActive)}
              ref={(r) => { markerRefs.current[projet.id] = r; }}
              eventHandlers={{ click: () => { setActive(projet.id); onSelect?.(projet.id); } }}
              zIndexOffset={isActive ? 1000 : 300}
            >
              <Tooltip>
                <div className="text-xs font-semibold">{projet.titre}</div>
              </Tooltip>
              <Popup>
                <div className="carte-pop" style={{ minWidth: 240, fontFamily: 'var(--font-sans)' }}>
                  <div className="carte-pop__head inline-flex items-center gap-2">
                    <span className="carte-pop__num" style={{ background: color }}>{i + 1}</span>
                    <span className="text-xs" style={{ fontWeight: 800, color }}>{STATUT_LABELS[projet.statut] ?? projet.statut}</span>
                  </div>
                  <div className="carte-pop__body">
                    <div className="text-[13px] font-bold text-slate-900 leading-snug">{projet.titre}</div>
                    <div className="mt-2 space-y-1.5">
                      {projet.secteur && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={12} /> {projet.secteur}</div>
                      )}
                      {projet.commune && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={12} /> {projet.commune}</div>
                      )}
                      {projet.budget !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700"><Wallet size={12} /> {formatBudget(projet.budget)}</div>
                      )}
                      {projet.beneficiaires !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Users size={12} /> {projet.beneficiaires.toLocaleString('fr-FR')} bénéficiaires</div>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Sélecteur de vue */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1 bg-white/90 backdrop-blur rounded-xl p-1 shadow-lg shadow-slate-900/10">
        {([['route','Carte'],['satellite','Satellite']] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === key ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {key === 'route' ? <Map size={13} /> : <Satellite size={13} />}
            {label}
          </button>
        ))}
      </div>

      {/* Compteur */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/80 backdrop-blur text-white rounded-xl px-3.5 py-2 shadow-lg">
        <div className="text-lg font-black leading-none">{projets.length}</div>
        <div className="text-[10px] font-medium opacity-80">projets</div>
      </div>

      {/* Légende */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur rounded-xl shadow-lg px-3 py-2.5 text-xs">
        <div className="font-bold text-slate-500 mb-1.5 text-[11px] uppercase tracking-wide">Légende</div>
        {Object.entries(STATUT_LABELS).map(([k, label]) => (
          <div key={k} className="flex items-center gap-2 py-0.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUT_COLORS[k], boxShadow: `0 0 0 3px ${STATUT_COLORS[k]}33` }} />
            <span className="text-slate-600 capitalize">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
