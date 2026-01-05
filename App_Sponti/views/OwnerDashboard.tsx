
import React from 'react';
import { User, Restaurant, Deal, QRRedemption } from '../types';
import { Plus, Users, Wallet, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  user: User;
  restaurants: Restaurant[];
  deals: Deal[];
  redemptions: QRRedemption[];
  onCreateDealClick: () => void;
}

export default function OwnerDashboard({ user, restaurants, deals, redemptions, onCreateDealClick }: Props) {
  // Filter for owner
  const myRestaurants = restaurants.filter(r => r.ownerId === user.id);
  const myRestaurantIds = myRestaurants.map(r => r.id);
  const myDeals = deals.filter(d => myRestaurantIds.includes(d.restaurantId));

  // Stats - Hardcoded as per user request
  const totalRedemptions = 47;
  const hardcodedRevenue = "1125€";

  // Chart Data - Distributing 47 redemptions over the week
  const chartData = [
    { name: 'Mon', redemptions: 4 },
    { name: 'Tue', redemptions: 5 },
    { name: 'Wed', redemptions: 6 },
    { name: 'Thu', redemptions: 5 },
    { name: 'Fri', redemptions: 9 },
    { name: 'Sat', redemptions: 11 },
    { name: 'Sun', redemptions: 7 },
  ];

  return (
    <div className="p-6 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-white">Dashboard</h1>
           <p className="text-white/50 text-sm">Overview</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/20 p-0.5">
           <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass p-5 rounded-3xl">
           <div className="flex items-center gap-2 text-white/50 mb-3">
             <Users size={16} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Redemptions</span>
           </div>
           <div className="text-3xl font-bold text-white mb-1">{totalRedemptions}</div>
           <div className="text-xs text-green-400 font-medium">+12% vs last week</div>
        </div>
        <div className="glass p-5 rounded-3xl">
           <div className="flex items-center gap-2 text-white/50 mb-3">
             <Wallet size={16} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Revenue</span>
           </div>
           <div className="text-3xl font-bold text-white mb-1">{hardcodedRevenue}</div>
           <div className="text-xs text-white/30 font-medium">Estimated</div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onCreateDealClick}
        className="w-full bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold py-5 rounded-3xl shadow-lg shadow-neon-blue/20 flex items-center justify-center gap-2 mb-8 active:scale-[0.98] transition-transform border border-white/10"
      >
        <Plus size={24} />
        <span className="text-lg">Create Flash Deal ⚡</span>
      </button>

      {/* Chart */}
      <div className="glass p-6 rounded-3xl mb-8">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wide opacity-80">
          <TrendingUp size={16} className="text-neon-pink" /> Weekly Activity
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'rgba(255,255,255,0.4)'}} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{backgroundColor: '#1a0b2e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}} 
              />
              <Bar dataKey="redemptions" fill="#4C7AF4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Deals List */}
      <h3 className="font-bold text-white mb-4 ml-1">Active Deals</h3>
      <div className="space-y-4">
        {myDeals.filter(d => d.isActive).length === 0 ? (
          <div className="text-center py-8 text-white/30 border border-dashed border-white/10 rounded-3xl">
             No active deals. Start one now!
          </div>
        ) : (
          myDeals.filter(d => d.isActive).map(deal => (
            <div key={deal.id} className="glass p-5 rounded-3xl flex justify-between items-center border border-white/5">
               <div>
                  <h4 className="font-bold text-white text-lg">{deal.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-2">
                     <span className="flex items-center gap-1"><Clock size={12} /> {new Date(deal.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                     <span className="bg-white/10 text-white px-2 py-0.5 rounded-full">{deal.redemptionsCount}/{deal.maxRedemptions} claimed</span>
                  </div>
               </div>
               <div className="text-right">
                  <span className="block font-extrabold text-neon-blue text-xl">
                    {deal.discountType === 'fixed' ? `-${deal.discountValue}€` : `-${deal.discountValue}%`}
                  </span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
