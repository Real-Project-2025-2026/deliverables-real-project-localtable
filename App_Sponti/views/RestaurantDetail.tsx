
import React, { useState, useEffect } from 'react';
import { Restaurant, Deal, QRRedemption } from '../types';
import { ChevronLeft, MoreHorizontal, Heart, ChevronRight, Zap, Search, Star, Utensils, Coffee, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';

interface Props {
  restaurant: Restaurant;
  deals: Deal[];
  onBack: () => void;
  onCreateRedemption: (deal: Deal) => QRRedemption;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  existingRedemptions: QRRedemption[];
}

export default function RestaurantDetail({ 
  restaurant, 
  deals, 
  onBack, 
  onCreateRedemption,
  isFavorite,
  onToggleFavorite,
  existingRedemptions
}: Props) {
  const [activeRedemption, setActiveRedemption] = useState<QRRedemption | null>(null);

  // Get the primary flash deal (Single Deal Requirement)
  const activeDeal = deals.length > 0 ? deals[0] : null;
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const recent = existingRedemptions.find(r => r.status === 'pending');
    if (recent) setActiveRedemption(recent);
  }, [existingRedemptions]);

  // Countdown Logic
  useEffect(() => {
    if (!activeDeal) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(activeDeal.endTime).getTime();
      const diff = Math.floor((end - now) / 1000);
      return Math.max(0, diff);
    };

    // Initial set
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      // Optional: If you strictly want to stop the interval when it hits 0
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDeal]);

  // Helper to format HH:MM:SS
  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGetDeal = (deal: Deal) => {
    const redemption = onCreateRedemption(deal);
    setActiveRedemption(redemption);
  };

  const getCuisineIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pizza')) return <Utensils size={24} className="text-white" />;
    if (t.includes('coffee') || t.includes('cafe')) return <Coffee size={24} className="text-white" />;
    return <Star size={24} className="text-white" />;
  };

  // Determine if the deal should be visible
  const showDeal = activeDeal && timeLeft > 0;

  return (
    <div className="min-h-screen bg-[#0b1224] text-white font-sf pb-24 relative">
      
      {/* 1. Hero Section (Top 35%) */}
      <div className="relative w-full h-[350px]">
        {/* Hero Image */}
        <img 
            src={restaurant.photos[0]} 
            className="w-full h-full object-cover" 
            alt={restaurant.name} 
        />
        
        {/* Gradient Overlay for Status Bar readability */}
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>

        {/* Navigation Buttons */}
        <div className="absolute top-[50px] left-[20px] right-[20px] flex justify-between items-center z-20">
            <button 
                onClick={onBack} 
                className="w-[40px] h-[40px] rounded-[12px] bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
            >
                <ChevronLeft size={24} className="text-white" />
            </button>
            <div className="flex gap-[10px]">
                <button 
                    onClick={onToggleFavorite}
                    className="w-[40px] h-[40px] rounded-[12px] bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                    <Heart size={20} className={isFavorite ? "text-red-500 fill-red-500" : "text-white"} />
                </button>
                <button className="w-[40px] h-[40px] rounded-[12px] bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors">
                    <MoreHorizontal size={20} className="text-white" />
                </button>
            </div>
        </div>

        {/* Restaurant Info Card (Glassmorphism) */}
        <div className="absolute bottom-0 left-[20px] right-[20px] translate-y-1/2 z-20">
            <div className="bg-[#0b1224]/80 backdrop-blur-[20px] border-t border-white/10 rounded-[20px] p-[15px] flex items-center gap-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {/* Logo */}
                <div className="w-[50px] h-[50px] rounded-full bg-black flex items-center justify-center border border-white/10 flex-shrink-0">
                    {getCuisineIcon(restaurant.cuisineType)}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h1 className="text-white text-[20px] font-bold leading-tight truncate">{restaurant.name}</h1>
                    <p className="text-[#8b8b93] text-[12px] font-normal truncate mt-0.5">
                        {restaurant.address || 'Lothstraße 66, 80335 - München'}
                    </p>
                </div>
                {/* Chevron */}
                <ChevronRight size={20} className="text-white/40" />
            </div>
        </div>
      </div>

      {/* Spacer for the overlapping card */}
      <div className="h-[50px]"></div>

      {/* 2. Flash Deal Section (Conditional) */}
      {showDeal && (
        <div className="mx-[20px] mt-[20px] bg-[#0b1224] border border-[#333] rounded-[16px] p-[15px] shadow-lg relative overflow-hidden">
           {/* Subtle Glow Effect */}
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-blue/10 blur-[40px] rounded-full pointer-events-none"></div>

           {/* Row 1: Header */}
           <div className="flex items-center gap-2 mb-3 relative z-10">
              <Zap size={16} className="text-neon-blue fill-neon-blue" />
              <span className="text-[#A0A0C0] text-[12px] font-medium">Flash Deal</span>
              <div className="w-[1px] h-[12px] bg-white/20"></div>
              <span className="text-white text-[14px] font-medium truncate flex-1">
                 {activeDeal.description || activeDeal.title}
              </span>
           </div>

           {/* Row 2: Timer & Button */}
           <div className="flex justify-between items-center relative z-10">
              <button 
                className="px-4 py-2 bg-gradient-to-r from-[#3b59df] to-[#6a85b6] rounded-full text-white text-[12px] font-bold tracking-wide shadow-lg shadow-blue-500/20 italic"
              >
                Hurry Up!
              </button>
              
              <div className="font-mono text-white text-[14px] flex items-center gap-2">
                 <span className="text-[#A0A0C0] font-sans text-[12px]">Time left:</span>
                 {formatCountdown(timeLeft)}
              </div>
           </div>
        </div>
      )}

      {/* 3. Menu Navigation (Tabs) */}
      <div className="mx-[20px] mt-[25px] flex items-center gap-6 border-b border-white/10 pb-1">
         <Search size={20} className="text-white/40 mb-2" />
         
         <div className="relative pb-3 cursor-pointer">
            <span className="text-white font-bold text-[15px]">Featured items</span>
            <div className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-neon-blue shadow-[0_0_10px_#4C7AF4]"></div>
         </div>
         
         <div className="pb-3 cursor-pointer">
            <span className="text-[#8b8b93] font-medium text-[15px]">Desserts</span>
         </div>
         
         <div className="pb-3 cursor-pointer">
            <span className="text-[#8b8b93] font-medium text-[15px]">Drinks</span>
         </div>
      </div>

      {/* 4. Featured Items List */}
      <div className="mx-[20px] mt-[20px] space-y-4">
         <h2 className="text-white font-bold text-[16px] mb-2">Featured Items</h2>
         
         {restaurant.menu && restaurant.menu.map((item) => (
            <div key={item.id} className="bg-[#151525] rounded-[20px] p-[15px] flex justify-between relative overflow-hidden min-h-[110px]">
               <div className="flex flex-col justify-between z-10 w-[65%] pr-2">
                  <div>
                     <div className="text-white font-bold text-[15px] mb-1 leading-tight">{item.name}</div>
                     <p className="text-[#8b8b93] text-[12px] leading-[1.4] line-clamp-2">
                        {item.description}
                     </p>
                  </div>
                  <div className="text-white font-bold text-[16px] mt-2">{item.price.toFixed(2)}€</div>
               </div>
               
               {/* Image */}
               <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-[110px] h-[110px]">
                   {/* Masking the image to circle or just fit right */}
                   <img 
                     src={item.image} 
                     className="w-full h-full object-cover rounded-full border-4 border-[#151525]"
                     alt={item.name} 
                   />
               </div>
            </div>
         ))}
         
         {(!restaurant.menu || restaurant.menu.length === 0) && (
            <div className="text-white/30 text-center py-10">Menu unavailable</div>
         )}
      </div>

      {/* 5. Sticky Footer (Conditional) */}
      {showDeal && (
        <div className="fixed bottom-0 left-0 right-0 p-[20px] bg-gradient-to-t from-[#0b1224] via-[#0b1224] to-transparent z-40 pb-[30px]">
           <button 
             onClick={() => handleGetDeal(activeDeal)}
             className="w-full h-[50px] bg-gradient-to-r from-[#3b59df] to-[#6a85b6] rounded-[15px] text-white font-bold text-[16px] shadow-[0_4px_20px_rgba(59,89,223,0.4)] flex items-center justify-center active:scale-[0.98] transition-transform"
           >
             Get the Offer
           </button>
        </div>
      )}

      {/* QR Code Modal (Redemption) */}
      {activeRedemption && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveRedemption(null)}></div>
           
           <div className="bg-[#1a0b2e] w-full max-w-sm rounded-[32px] p-8 text-center relative border border-white/10 shadow-2xl animate-popIn">
             <button 
               onClick={() => setActiveRedemption(null)}
               className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
             >
               <X size={24} />
             </button>
             
             <div className="mb-8">
               <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                 <Zap className="text-white fill-white" size={32} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-1">Deal Claimed!</h3>
               <p className="text-sm text-white/50">Show this code to the staff.</p>
             </div>

             <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-inner shadow-black/20">
                <QRCode 
                  value={activeRedemption.qrUuid} 
                  size={200}
                  level="H"
                />
             </div>

             <div className="bg-white/5 text-neon-blue font-mono text-xs py-2 px-4 rounded-lg inline-block border border-white/5 mb-6">
                Valid until {format(new Date(activeRedemption.expiresAt), 'HH:mm')}
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
