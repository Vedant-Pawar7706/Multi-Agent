import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { TravelGuide } from '../../types';
import { MapPin, Navigation } from 'lucide-react';

interface Props {
  guide: TravelGuide;
}

// Fix default Leaflet icon issues in React
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Destination Coordinates Map Fallback lookup
const DESTINATION_COORDS: Record<string, [number, number]> = {
  'Tokyo, Japan': [35.6762, 139.6503],
  'Paris, France': [48.8566, 2.3522],
  'Dubai, UAE': [25.2048, 55.2708],
  'Manali, India': [32.2432, 77.1892],
  'Switzerland': [46.8182, 8.2275],
  'Bali, Indonesia': [-8.4095, 115.1889],
  'Rome, Italy': [41.9028, 12.4964],
};

export const MapView: React.FC<Props> = ({ guide }) => {
  const destName = guide.meta.destination;
  const centerCoords: [number, number] = DESTINATION_COORDS[destName] || [35.6762, 139.6503];

  // Extract points from itinerary for route display
  const points: Array<{ name: string; location: string; coords: [number, number] }> = [];
  const days = guide.itinerary || [];
  
  days.forEach((day, dIdx) => {
    const activities = [...day.morning, ...day.afternoon, ...day.evening];
    activities.forEach((act, aIdx) => {
      // Add slight offset for visualization
      const latOffset = (dIdx * 0.015) + (aIdx * 0.008);
      const lngOffset = (dIdx * 0.01) - (aIdx * 0.006);
      points.push({
        name: act.activity,
        location: act.location,
        coords: [centerCoords[0] + latOffset, centerCoords[1] + lngOffset]
      });
    });
  });

  const polylineCoords = points.map((p) => p.coords);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-400" />
            Interactive Route & Destination Map
          </h3>
          <p className="text-xs text-slate-400">OpenStreetMap view displaying itinerary route nodes and key attraction markers.</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          {points.length} Locations Plotted
        </span>
      </div>

      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative z-10">
        <MapContainer
          center={centerCoords}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {polylineCoords.length > 1 && (
            <Polyline
              positions={polylineCoords}
              pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.8, dashArray: '6, 8' }}
            />
          )}

          {points.map((pt, i) => (
            <Marker key={i} position={pt.coords} icon={customIcon}>
              <Popup>
                <div className="p-1 text-slate-900">
                  <p className="font-bold text-xs">{pt.name}</p>
                  <p className="text-[10px] text-slate-600">{pt.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {points.slice(0, 3).map((pt, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center space-x-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              {idx + 1}
            </div>
            <div className="truncate">
              <p className="font-bold text-slate-200 truncate">{pt.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{pt.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
