
import React from 'react';
import { Restaurant, User } from '../types';
import { ChevronLeft, Heart, Star } from 'lucide-react';

interface FavoritesProps {
  restaurants: Restaurant[];
  currentUser: User;
  onNavigateRestaurant: (id: string) => void;
  onBack: () => void;
}

export default function Favorites({ restaurants, currentUser, onNavigateRestaurant, onBack }: FavoritesProps) {
  const favoriteRestaurants = restaurants.filter(r => currentUser.favorites.includes(r.id));

  return (
    <div className="p-6 pb-32 text-white animate-fade-in min-h-full">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">My Favorites</h1>
      </div>

      {favoriteRestaurants.length > 0 ? (
        <div className="flex flex-col gap-6">
          {favoriteRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              onClick={() => onNavigateRestaurant(restaurant.id)} 
              className="flex flex-col h-[220px] justify-center items-center rounded-[24px] border border-white/10 relative overflow-hidden bg-cover bg-center cursor-pointer transform transition-all hover:scale-[1.02] shadow-xl group" 
              style={{ backgroundImage: `url(${restaurant.photos[0]})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              {/* Floating Heart Icon for context */}
              <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-red-500">
                 <Heart size={18} fill="currentColor" />
              </div>

              <div className="flex w-full justify-between items-end absolute left-0 bottom-0 p-6">
                 <div className="flex flex-col items-start gap-1">
                     <div className="text-white font-sf text-2xl font-bold leading-tight drop-shadow-md">{restaurant.name}</div>
                     <div className="text-white/70 font-sf text-base font-normal">{restaurant.cuisineType}</div>
                 </div>
                 
                 <div className="flex justify-center items-center gap-1 rounded-xl border border-white/10 bg-white/10 backdrop-blur-md px-3 py-1.5">
                    <span className="text-white font-sf text-sm font-bold">{restaurant.rating}</span>
                    <Star size={14} fill="currentColor" className="text-yellow-400" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Heart size={40} className="text-white/20" />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">No Favorites Yet</h3>
           <p className="text-white/40 max-w-[240px] text-sm leading-relaxed">
              You haven’t added any favorites yet. Start exploring and save your top spots!
           </p>
           <button 
             onClick={onBack}
             className="mt-8 bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-neon-blue/20 active:scale-95 transition-all"
           >
             Explore Restaurants
           </button>
        </div>
      )}
    </div>
  );
}
