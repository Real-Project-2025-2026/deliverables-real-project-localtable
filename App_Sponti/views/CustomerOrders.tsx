
import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, History, Clock, QrCode, X, Zap, ChevronRight } from 'lucide-react';
import { QRRedemption, Restaurant, Deal } from '../types';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

interface Props {
  onBrowse: () => void;
  redemptions: QRRedemption[];
  restaurants: Restaurant[];
  deals: Deal[];
}

export default function CustomerOrders({ onBrowse, redemptions, restaurants, deals }: Props) {
  const [selectedRedemption, setSelectedRedemption] = useState<QRRedemption | null>(null);

  // Filter redemptions based on the provided logic
  // status = pending for Active
  // status = redeemed for Past (as per prompt)
  const activeOrders = redemptions.filter(r => r.status === 'pending');
  const completedOrders = redemptions.filter(r => r.status === 'redeemed');

  // Sort completed by date descending
  const sortedCompleted = [...completedOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-6 h-full flex flex-col font-sf text-white pt-20 animate-fade-in pb-32">
      
      {/* 1. Active Orders Section (TOP) */}
      <div className="w-full mb-10">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-xs uppercase tracking-widest opacity-50">
            <Zap size={14} className="text-neon-blue" /> Active Orders
        </h3>

        {activeOrders.length === 0 ? (
          /* Empty State Logic: Only show if NO pending orders exist */
          <div className="flex flex-col items-center justify-center text-center py-12 glass rounded-[32px] border-dashed border-white/10 px-8">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                <ShoppingBag size={40} className="text-white/10" />
            </div>
            <h2 className="text-2xl font-bold mb-2 tracking-tight">No Active Orders</h2>
            <p className="text-white/40 mb-8 max-w-[240px] leading-relaxed text-sm">
                You don't have any pending pickup orders right now. Explore deals to fill your table!
            </p>
            <button
                onClick={onBrowse}
                className="bg-white text-black font-bold py-4 px-8 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-white/5 text-sm"
            >
                <span>Browse Deals</span>
                <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map(r => {
              const deal = deals.find(d => d.id === r.dealId);
              const rest = restaurants.find(res => res.id === r.restaurantId);
              if (!deal || !rest) return null;

              return (
                /* Active Card: Highlighted, Clickable, Subtle Glow */
                <div 
                  key={r.id} 
                  onClick={() => setSelectedRedemption(r)}
                  className="relative group cursor-pointer overflow-hidden rounded-[28px] border border-neon-blue/40 bg-neon-blue/5 backdrop-blur-xl p-6 transition-all hover:border-neon-blue/80 active:scale-[0.97] shadow-[0_0_30px_rgba(76,122,244,0.15)]"
                >
                  {/* Glowing Accent */}
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-neon-blue/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-neon-blue/20 transition-colors"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-black/40 overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
                        <img src={rest.photos[0]} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xl leading-tight mb-1">{rest.name}</div>
                        <div className="text-sm text-neon-blue font-bold tracking-tight mb-2">{deal.title}</div>
                        <div className="text-[11px] text-white/40 flex items-center gap-1.5 font-medium">
                          <Clock size={12} className="text-neon-blue/60" />
                          Expires {format(new Date(r.expiresAt), 'HH:mm')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neon-blue/20 p-4 rounded-2xl text-neon-blue group-hover:bg-neon-blue/30 transition-all group-hover:scale-110 shadow-lg">
                      <QrCode size={28} />
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                        <span className="text-[11px] font-bold text-neon-blue uppercase tracking-widest">Awaiting Pickup</span>
                     </div>
                     <div className="flex items-center gap-1 text-[11px] text-white/40 font-medium">
                        View QR <ChevronRight size={14} />
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Past Orders Section (BOTTOM) */}
      <div className="w-full">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2 text-xs uppercase tracking-widest opacity-40">
            <History size={14} /> Past Orders
        </h3>
        
        <div className="space-y-3">
            {sortedCompleted.length === 0 ? (
                 <div className="text-center py-10 text-white/20 border border-dashed border-white/5 rounded-[32px] text-xs font-medium">
                    No order history yet.
                 </div>
            ) : (
                sortedCompleted.map(r => {
                    const deal = deals.find(d => d.id === r.dealId);
                    const rest = restaurants.find(res => res.id === r.restaurantId);
                    if (!deal || !rest) return null;

                    return (
                        /* Completed Card: Muted styling, Not clickable */
                        <div key={r.id} className="glass p-5 rounded-2xl flex justify-between items-center border border-white/5 opacity-50 grayscale-[0.5]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                                    <img src={rest.photos[0]} className="w-full h-full object-cover grayscale" alt="" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-base leading-tight mb-1">{rest.name}</div>
                                    <div className="text-xs text-white/40 font-medium mb-2">{deal.title}</div>
                                    <div className="text-[10px] text-white/30 flex items-center gap-1 font-medium">
                                       <Clock size={10} />
                                       {format(new Date(r.createdAt), 'MMM dd, HH:mm')}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-bold uppercase mb-1 px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                                    {r.status}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* QR Code Modal for Active Orders */}
      {selectedRedemption && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-fade-in" onClick={() => setSelectedRedemption(null)}></div>
           
           {/* Modal Content */}
           <div className="bg-[#0b0b1a] w-full max-w-sm rounded-[48px] p-10 text-center relative border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-popIn">
             <button 
               onClick={() => setSelectedRedemption(null)}
               className="absolute top-8 right-8 p-3 bg-white/5 rounded-full text-white/40 hover:text-white transition-colors border border-white/5"
             >
               <X size={20} />
             </button>
             
             <div className="mb-10">
               <div className="w-20 h-20 bg-gradient-to-tr from-[#4C7AF4] to-[#A37CFF] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-[0_10px_40px_rgba(76,122,244,0.4)] rotate-6">
                 <QrCode className="text-white" size={40} />
               </div>
               
               {(() => {
                 const rest = restaurants.find(res => res.id === selectedRedemption.restaurantId);
                 const deal = deals.find(d => d.id === selectedRedemption.dealId);
                 return (
                   <>
                     <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{rest?.name}</h3>
                     <p className="text-neon-blue font-bold text-sm uppercase tracking-widest">{deal?.title}</p>
                   </>
                 );
               })()}
             </div>

             {/* Scannable QR */}
             <div className="bg-white p-6 rounded-[40px] inline-block mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative">
                {/* Visual corners for aesthetics */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-neon-blue rounded-tl-2xl"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-neon-blue rounded-br-2xl"></div>
                
                <QRCode 
                  value={selectedRedemption.qrUuid} 
                  size={200}
                  level="H"
                  className="rounded-lg"
                />
             </div>

             <div className="space-y-4">
               <div className="bg-white/5 text-white/40 font-mono text-[10px] py-3 px-6 rounded-2xl inline-block border border-white/5">
                  REF: {selectedRedemption.qrUuid.toUpperCase().substring(0, 13)}...
               </div>
               <p className="text-white/30 text-xs max-w-[220px] mx-auto leading-relaxed">
                 Present this code at the counter. The staff will scan it to complete your order.
               </p>
             </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-popIn {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}
