
import React from 'react';
import { User, QRRedemption, Restaurant, Deal } from '../types';
import { Settings, Heart, History, ChevronRight, LogOut } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  user: User;
  redemptions: QRRedemption[];
  restaurants: Restaurant[];
  deals: Deal[];
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export default function Profile({ user, redemptions, restaurants, deals, onLogout, onNavigate }: Props) {
  return (
    <div className="p-6 pb-32 text-white font-sf">
       <div className="flex flex-col items-center mb-8 mt-4">
         <div className="w-28 h-28 rounded-full p-1 border-2 border-neon-blue mb-4 shadow-[0_0_30px_rgba(76,122,244,0.3)]">
            <img src={user.profilePicture} className="w-full h-full rounded-full object-cover" alt="Profile" />
         </div>
         <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
         <p className="text-white/50 text-sm bg-white/5 px-3 py-1 rounded-full">{user.email}</p>
       </div>

       <div className="glass rounded-3xl overflow-hidden mb-8 border border-white/10">
         <div 
           onClick={() => onNavigate('account-settings')}
           className="p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5"
         >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-neon-violet/10 rounded-xl text-neon-violet">
                 <Settings size={20} />
              </div>
              <span className="font-medium text-white">Account Settings</span>
            </div>
            <ChevronRight size={16} className="text-white/30" />
         </div>
         <div 
           onClick={() => onNavigate('favorites')}
           className="p-5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
         >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                 <Heart size={20} />
              </div>
              <span className="font-medium text-white">Favorites Management</span>
            </div>
            <ChevronRight size={16} className="text-white/30" />
         </div>
       </div>

       {user.role === 'customer' && (
         <>
           <h3 className="font-bold text-white mb-4 flex items-center gap-2 ml-2 text-sm uppercase tracking-wider opacity-60">
             <History size={16} /> Past Orders
           </h3>
           <div className="space-y-3">
             {redemptions.length === 0 ? (
               <div className="text-center py-12 text-white/30 border border-dashed border-white/10 rounded-3xl">
                 No deals redeemed yet.
               </div>
             ) : (
               redemptions.map(r => {
                 const deal = deals.find(d => d.id === r.dealId);
                 const rest = restaurants.find(res => res.id === r.restaurantId);
                 if (!deal || !rest) return null;
                 return (
                   <div key={r.id} className="glass p-4 rounded-2xl flex justify-between items-center border border-white/5 hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden">
                           <img src={rest.photos[0]} className="w-full h-full object-cover opacity-80 grayscale" alt="" />
                        </div>
                        <div>
                           <div className="font-bold text-white">{rest.name}</div>
                           <div className="text-xs text-neon-blue">{deal.title}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="block text-[10px] font-bold uppercase text-white/40 mb-1">{r.status}</span>
                        <div className="text-[10px] text-white/30">{format(new Date(r.createdAt), 'MMM dd')}</div>
                     </div>
                   </div>
                 );
               })
             )}
           </div>
         </>
       )}

       <button 
         onClick={onLogout}
         className="w-full glass p-5 rounded-3xl flex items-center justify-center gap-3 text-red-400 font-bold mt-8 hover:bg-red-500/10 transition-colors border border-red-500/20 active:scale-[0.98]"
       >
          <LogOut size={20} />
          Log Out
       </button>
    </div>
  );
}
