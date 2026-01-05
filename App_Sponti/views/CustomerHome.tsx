
import React, { useState, useRef } from 'react';
import { Restaurant, Deal, User } from '../types';
import { Search, Sparkles, Star, Menu, MapPin } from 'lucide-react';

interface CustomerHomeProps {
  restaurants: Restaurant[];
  deals: Deal[];
  onNavigateRestaurant: (id: string) => void;
  currentUser: User;
  setCurrentView: (view: string) => void;
  onMenuClick: () => void;
}

const CATEGORIES = [
  { name: 'Burgers', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/682425fc565b1ea420eadcdd2143ad9616bfa466?width=100' },
  { name: 'Dessert', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/e608d36bb405971540f73509adf63528b07669d9?width=133' },
  { name: 'Döner', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/db43892a5fd529ccc409c6b7cf177d0990e03504?width=120' },
  { name: 'Sushi', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/f9861a723418c6921861b8c8c93f7c21a1b6801c?width=160' },
  { name: 'Pizza', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=100' },
];

export default function CustomerHome({ restaurants, deals, onNavigateRestaurant, currentUser, setCurrentView, onMenuClick }: CustomerHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiOpen, setAiOpen] = useState(false);
  const [showHighDiscounts, setShowHighDiscounts] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter restaurants based on search query and optional high-discount filter
  const highDiscountRestaurantIds = deals
    .filter(d => d.isActive && d.discountType === 'percent' && d.discountValue >= 30)
    .map(d => d.restaurantId);

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.cuisineType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHighDiscount = showHighDiscounts ? highDiscountRestaurantIds.includes(r.id) : true;
    return matchesSearch && matchesHighDiscount;
  });

  const isSearching = searchQuery.length > 0 || showHighDiscounts;

  const handleOrderNow = () => {
    setShowHighDiscounts(true);
    setSearchQuery('');
    // Ensure the scroll happens after state update and render
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setShowHighDiscounts(false);
  };

  return (
    <div className="font-sf text-white">
      
      {/* 1. Top Section - Figma "Top" Group */}
      <div className="absolute top-0 left-0 w-full h-[150px] flex flex-col items-start backdrop-blur-[20px] z-40 bg-gradient-to-b from-[#0b1224]/80 to-transparent">
        
        {/* Status Bar Placeholder (40px) */}
        <div className="w-full h-[40px]"></div>

        {/* Navigation Bar */}
        <div className="flex flex-col items-center gap-[8px] flex-shrink-0 w-full">
            <div className="flex flex-col justify-center items-center gap-[16px] w-full relative">
                {/* Top Navigation Row */}
                <div className="flex justify-between items-center w-[353px] mx-auto mt-2">
                    <div className="flex items-center gap-[16px]">
                        {/* Menu Button */}
                        <button 
                          onClick={onMenuClick}
                          className="w-[44px] h-[44px] flex justify-center items-center gap-[10px] active:scale-95 transition-transform"
                        >
                            <Menu className="text-white" size={24} />
                        </button>
                        
                        {/* Location */}
                        <div className="flex flex-col items-start">
                            <div className="text-[rgba(255,255,255,0.70)] text-center font-sf text-[15px] font-normal leading-[20px] tracking-[-0.4px]">Location</div>
                            <div className="text-white text-center font-sf text-[20px] font-[590] leading-[25px] tracking-[-0.4px]">Lothstraße 64</div>
                        </div>
                    </div>

                    {/* Profile Toggle */}
                    <div onClick={() => setCurrentView('profile')} className="w-[44px] h-[44px] flex justify-center items-center gap-[4px] rounded-[10px] shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] border border-white/10 overflow-hidden cursor-pointer">
                        <img src={currentUser.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                </div>

                {/* Search Field */}
                <div className="flex flex-col justify-center items-center relative w-[353px] mx-auto">
                    {/* Highlight Top */}
                    <div className="w-[284px] h-[1px] bg-white/20 absolute top-0 left-1/2 transform -translate-x-1/2 z-10"></div>
                    
                    <div className="flex w-[353px] justify-center items-center gap-[12px] rounded-[10px] border border-[rgba(255,255,255,0.07)] shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.05),0_10px_10px_0_rgba(0,0,0,0.10)] backdrop-blur-[10px] bg-white/5 h-[36px] px-3">
                        <Search className="text-white w-[18px] h-[18px]" />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (showHighDiscounts) setShowHighDiscounts(false);
                          }}
                          className="flex-1 bg-transparent border-none outline-none text-[rgba(255,255,255,0.60)] font-sf text-[16px] font-normal leading-[21px] tracking-[-0.4px] placeholder:text-[rgba(255,255,255,0.60)]"
                          placeholder="Search restaurants, cuisines..."
                        />
                        {isSearching && (
                          <button onClick={handleClearFilters} className="flex justify-center items-center h-full pr-2 text-white/50">
                             <span className="text-xs font-bold">✕</span>
                          </button>
                        )}
                        <div className="flex justify-center items-center relative pl-3 border-l border-white/10 h-[24px]">
                            {/* AI Search Tool Button replacing ScanLine */}
                            <button 
                              onClick={() => setAiOpen(true)}
                              className="group flex items-center justify-center"
                              title="Ask AI Concierge"
                            >
                              <Sparkles className="text-neon-blue w-[20px] h-[20px] group-hover:text-neon-violet transition-colors animate-pulse" />
                            </button>
                        </div>
                    </div>
                    {/* Highlight Bottom */}
                    <div className="w-[284px] h-[1px] bg-white/20 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="pt-[150px] px-0 pb-24">
        
        {!isSearching && (
          <>
            {/* Categories Section */}
            <div className="inline-flex flex-col items-start gap-[16px] w-full pl-[20px] mb-8 animate-fade-in">
                <div className="flex w-[353px] justify-between items-center">
                    <div className="text-white text-center font-sf text-[17px] font-[590] leading-[22px] tracking-[-0.4px]">Categories</div>
                    <div className="text-[rgba(255,255,255,0.60)] text-center font-sf text-[12px] font-normal leading-[16px] tracking-[-0.4px]">See all</div>
                </div>
                
                <div className="flex items-start gap-[16px] overflow-x-auto no-scrollbar pr-5 w-full">
                    {CATEGORIES.map((cat, i) => (
                        <div key={i} onClick={() => { setSearchQuery(cat.name); setShowHighDiscounts(false); }} className="flex flex-col items-center gap-[8px] relative flex-shrink-0 cursor-pointer group">
                            <div className="w-[80px] h-[80px] shadow-container relative clay-category rounded-[10px] group-hover:scale-105 transition-transform duration-300">
                                <div className="w-[80px] h-[80px] rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-[#2b1a43]/50 absolute left-0 top-0"></div>
                                <img src={cat.icon} className="absolute left-[15px] top-[12px] w-[50px] h-[56px] object-contain drop-shadow-lg" alt={cat.name} />
                            </div>
                            <div className="text-white text-center font-sf text-[17px] font-[590] leading-[22px] tracking-[-0.4px]">{cat.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Flash Deal Card */}
            <div className="flex w-full flex-col justify-center items-center h-[210px] relative mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-[320px] h-[193px] rounded-[10px] border border-[rgba(255,255,255,0.07)] relative overflow-hidden bg-[#0f0518] shadow-container">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-black/40 z-0"></div>
                    {/* SVG Blur Circle from Figma */}
                    <svg className="absolute left-[207px] top-[66px] w-[144px] h-[144px] filter blur-[39px] z-0" viewBox="0 0 192 193" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="150.261" cy="138" r="72" fill="url(#paint0_linear_668_5513)" fillOpacity="0.6"/>
                        <defs>
                            <linearGradient id="paint0_linear_668_5513" x1="78.261" y1="66" x2="251.885" y2="131.632" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FF2020"/>
                                <stop offset="0.491467" stopColor="#EF325F"/>
                                <stop offset="1" stopColor="#59248A"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Content */}
                    <div className="inline-flex flex-col items-start gap-[8px] absolute left-[20px] top-[30px] w-[178px] h-[82px] z-10">
                        <div className="text-white font-sf text-[28px] font-bold leading-[34px] tracking-[-0.4px]">20% OFF</div>
                        <div className="w-[178px] text-[rgba(255,255,255,0.60)] font-sf text-[15px] font-normal leading-[20px] tracking-[-0.4px]">Discover discounts in favorite local restaurant</div>
                    </div>

                    {/* Button */}
                    <div 
                      onClick={handleOrderNow}
                      className="inline-flex h-[36px] justify-center items-center gap-[10px] rounded-[10px] border border-[rgba(39,55,207,0.40)] shadow-[inset_0_10px_30px_0_rgba(73,123,255,0.70)] backdrop-blur-[5px] absolute left-[20px] top-[127px] w-[136px] cursor-pointer hover:bg-white/10 transition-colors z-10 active:scale-95"
                    >
                        <div className="text-white text-center font-sf text-[15px] font-[590] leading-[20px] tracking-[-0.4px]">Order Now</div>
                    </div>

                    {/* Floating Image */}
                    <img 
                        className="w-[272px] h-[272px] absolute left-[127px] top-[-19px] object-contain z-10 pointer-events-none"
                        src="https://api.builder.io/api/v1/image/assets/TEMP/61e51a2f54f9baf1a0c8e49c5329b598817c7315?width=544" 
                        alt="Food" 
                    />
                </div>
            </div>
          </>
        )}

        {/* Near You / Search Results Section */}
        <div ref={resultsRef} className="inline-flex flex-col items-start gap-[16px] w-full pl-[20px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex w-[353px] items-center justify-between relative">
                <div className="text-white font-sf text-[17px] font-[590] leading-[22px] tracking-[-0.4px]">
                  {showHighDiscounts ? 'Hot Deals (30%+ OFF)' : isSearching ? `Results for "${searchQuery}"` : 'Near you'}
                </div>
                {showHighDiscounts && (
                  <button onClick={handleClearFilters} className="text-neon-blue text-xs font-medium">Reset</button>
                )}
            </div>

            {filteredRestaurants.length > 0 ? (
                <div className={`${isSearching ? 'flex flex-col gap-4 pr-5' : 'flex gap-4 overflow-x-auto no-scrollbar pr-5'} w-full pb-4`}>
                    {filteredRestaurants.map((restaurant, idx) => (
                        <div key={idx} onClick={() => onNavigateRestaurant(restaurant.id)} className="flex flex-shrink-0 w-[353px] pt-[87px] justify-center items-center rounded-[20px] border border-[rgba(255,255,255,0.07)] relative overflow-hidden bg-cover bg-center cursor-pointer transform transition-transform hover:scale-[1.01]" style={{ backgroundImage: `url(${restaurant.photos[0]})` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                            
                            <div className="flex w-[353px] height-[93px] justify-center items-end gap-[107px] flex-shrink-0 absolute left-0 bottom-0 pb-4">
                                 <div className="flex flex-col items-start gap-[4px] absolute left-[16px] bottom-[16px] w-[184px]">
                                     <div className="text-white font-sf text-[22px] font-bold leading-[28px] tracking-[-0.4px]">{restaurant.name}</div>
                                     <div className="text-[rgba(255,255,255,0.60)] font-sf text-[17px] font-normal leading-[22px] tracking-[-0.4px]">{restaurant.cuisineType}</div>
                                 </div>
                                 
                                 <div className="flex justify-center items-center gap-[10px] rounded-[6px] border border-[rgba(255,255,255,0.07)] bg-white/10 backdrop-blur-sm absolute right-[16px] top-[16px] w-[40px] h-[30px]">
                                    <div className="text-[rgba(255,255,255,0.80)] font-sf text-[13px] font-normal leading-[18px] tracking-[-0.4px] flex items-center gap-1">
                                        {restaurant.rating} <Star size={10} fill="currentColor" className="text-yellow-400" />
                                    </div>
                                 </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-[353px] h-[200px] flex flex-col justify-center items-center text-center text-white/50 border border-dashed border-white/10 rounded-2xl">
                    <Search className="w-10 h-10 mb-2 opacity-50" />
                    <p>No restaurants found</p>
                    <button onClick={handleClearFilters} className="mt-4 text-neon-blue text-sm">Show all restaurants</button>
                </div>
            )}
        </div>

      </div>

      {/* Floating Action Button for AI (kept as secondary/easy access) */}
      <div className="fixed bottom-[110px] right-[20px] z-40">
        <button 
           onClick={() => setAiOpen(true)}
           className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-[#4C7AF4] to-[#A37CFF] flex items-center justify-center shadow-[0_0_20px_rgba(76,122,244,0.6)] border border-white/20 hover:scale-110 transition-transform duration-300"
        >
           <Sparkles className="text-white w-7 h-7" />
        </button>
      </div>

       {/* AI Overlay Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setAiOpen(false)}></div>
           <div className="bg-[#1a0b2e] w-full max-w-[400px] rounded-t-[40px] border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-10 p-6 animate-fade-up">
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                 <Sparkles className="text-neon-blue fill-neon-blue" /> 
                 Sponti AI
              </h2>
              <p className="text-white/50 text-sm mb-6">Ask me about food, deals, or recommendations.</p>
              
              <div className="relative">
                <input 
                   className="w-full bg-white/5 border border-white/10 rounded-[20px] p-5 pr-12 text-white outline-none focus:border-neon-blue/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                   placeholder="What are you craving?"
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
