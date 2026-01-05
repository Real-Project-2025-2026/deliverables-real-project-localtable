import React, { useState, useEffect } from 'react';
import { Restaurant, Deal } from '../types';
import { Sparkles, Navigation, Menu } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

interface Props {
  restaurants: Restaurant[];
  deals: Deal[];
  onNavigateRestaurant: (id: string) => void;
  onMenuClick: () => void;
  currentUserProfile: string;
}

// Munich Center
const MAP_CENTER = { lat: 48.137154, lng: 11.576124 };
const DEFAULT_ZOOM = 13;

// SVG Constants for creating Custom Icons
const SVG_ZAP = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
const SVG_PIN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;

export default function CustomerMap({ restaurants, deals, onNavigateRestaurant, onMenuClick, currentUserProfile }: Props) {
  const [aiOpen, setAiOpen] = useState(false);

  // Custom component to handle map interactions if needed (e.g., FlyTo)
  const MapController = () => {
    const map = useMap();
    useEffect(() => {
        // Optional: Add logic to fit bounds of all restaurants
    }, [map]);
    return null;
  };

  const createIcon = (restaurant: Restaurant, activeDeal?: Deal) => {
     if (activeDeal) {
        // Active Deal Pin: Glowing Gradient Circle with Zap
        const badgeText = activeDeal.discountType === 'percent' ? `-${activeDeal.discountValue}%` : `-${activeDeal.discountValue}€`;
        
        const html = `
          <div class="relative group" style="transform: translate(-50%, -100%); width: 40px; height: 40px;">
             <!-- Glow Effect -->
             <div class="absolute inset-0 bg-neon-violet blur-md opacity-60 animate-pulse rounded-full"></div>
             
             <!-- Main Circle -->
             <div class="w-10 h-10 bg-gradient-to-tr from-[#4C7AF4] to-[#A37CFF] rounded-full flex items-center justify-center border-2 border-white shadow-lg relative z-10 transition-transform duration-300 hover:scale-110">
                ${SVG_ZAP}
             </div>
             
             <!-- Badge -->
             <div class="absolute -top-2 -right-6 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#0b1224] z-20 whitespace-nowrap shadow-sm">
                ${badgeText}
             </div>
             
             <!-- Stem -->
             <div class="absolute left-1/2 -translate-x-1/2 top-full h-2 w-0.5 bg-white/20"></div>
          </div>
        `;

        return L.divIcon({
          html,
          className: '', // Disable default Leaflet styles
          iconSize: [0, 0], // CSS handles size
          iconAnchor: [0, 0] // Centered via translate transform in CSS
        });
     } else {
        // Normal Pin: Dark Circle
        const html = `
          <div class="relative group" style="transform: translate(-50%, -100%); width: 32px; height: 32px;">
             <div class="w-8 h-8 bg-[#1a0b2e] rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg relative z-10 transition-transform duration-300 hover:scale-110 hover:border-white">
                ${SVG_PIN}
             </div>
             <div class="absolute left-1/2 -translate-x-1/2 top-full h-2 w-0.5 bg-white/20"></div>
          </div>
        `;

        return L.divIcon({
            html,
            className: '',
            iconSize: [0, 0],
            iconAnchor: [0, 0]
        });
     }
  };

  const userIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-4 h-4" style="transform: translate(-50%, -50%)">
             <div class="w-full h-full bg-neon-blue border-2 border-white rounded-full shadow-[0_0_20px_#4C7AF4] animate-ping absolute opacity-75"></div>
             <div class="w-full h-full bg-neon-blue border-2 border-white rounded-full shadow-lg relative z-10"></div>
        </div>
      `,
      className: '',
      iconSize: [0, 0],
      iconAnchor: [0, 0]
  });

  return (
    <div className="w-full h-full relative bg-[#0f1525] overflow-hidden font-sf isolate">
       
       {/* Map Header Overlay */}
       <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pt-12 flex justify-between items-center bg-gradient-to-b from-[#0b1224] via-[#0b1224]/80 to-transparent pointer-events-none">
          <button 
            onClick={onMenuClick} 
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 pointer-events-auto transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-white/90 pointer-events-auto">
             <Navigation size={14} className="text-neon-blue fill-neon-blue" />
             Munich, DE
          </div>

          <button onClick={() => {}} className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-lg pointer-events-auto">
             <img src={currentUserProfile} className="w-full h-full object-cover" alt="Profile" />
          </button>
       </div>

       {/* Interactive Map */}
       <div className="absolute inset-0 z-0">
         <MapContainer 
            center={[MAP_CENTER.lat, MAP_CENTER.lng]} 
            zoom={DEFAULT_ZOOM} 
            scrollWheelZoom={true} 
            className="w-full h-full outline-none"
            zoomControl={false}
         >
            {/* CartoDB Dark Matter Tile Layer */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <MapController />

            {/* User Location Marker */}
            <Marker position={[MAP_CENTER.lat, MAP_CENTER.lng]} icon={userIcon} />

            {/* Restaurant Markers */}
            {restaurants.map(r => {
                const activeDeal = deals.find(d => d.restaurantId === r.id && d.isActive);
                const icon = createIcon(r, activeDeal);
                
                return (
                    <Marker 
                        key={r.id} 
                        position={[r.location.lat, r.location.lng]} 
                        icon={icon}
                        eventHandlers={{
                            click: () => onNavigateRestaurant(r.id)
                        }}
                    />
                );
            })}
         </MapContainer>
       </div>

       {/* Floating AI Button Overlay */}
       <div className="absolute bottom-[110px] right-[20px] z-[1000] pointer-events-auto">
        <button 
           onClick={() => setAiOpen(true)}
           className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-[#4C7AF4] to-[#A37CFF] flex items-center justify-center shadow-[0_0_20px_rgba(76,122,244,0.6)] border border-white/20 hover:scale-110 transition-transform duration-300"
        >
           <Sparkles className="text-white w-7 h-7" />
        </button>
      </div>

       {/* AI Overlay */}
      {aiOpen && (
        <div className="absolute inset-0 z-[2000] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setAiOpen(false)}></div>
           <div className="bg-[#1a0b2e] w-full max-w-[400px] rounded-t-[40px] border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-10 p-6 animate-fade-up">
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                 <Sparkles className="text-neon-blue fill-neon-blue" /> 
                 Sponti AI
              </h2>
              <p className="text-white/50 text-sm mb-6">Looking for lunch in Munich?</p>
              
              <div className="relative">
                <input 
                   className="w-full bg-white/5 border border-white/10 rounded-[20px] p-5 pr-12 text-white outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                   placeholder="Show me cheap pizza near me..."
                   autoFocus
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-neon-blue/20 rounded-full text-neon-blue">
                    <Sparkles size={16} />
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}