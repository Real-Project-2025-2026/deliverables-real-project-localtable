
import React, { useState } from 'react';
import { Restaurant, Deal } from '../types';
import { generateMagicDeal } from '../services/geminiService';
import { Sparkles, Wand2, X, Check, Loader2, MapPin } from 'lucide-react';
import { addMinutes } from 'date-fns';

interface Props {
  ownerId: string;
  restaurants: Restaurant[];
  onCancel: () => void;
  onSave: (deal: Deal) => void;
}

export default function DealCreator({ ownerId, restaurants, onCancel, onSave }: Props) {
  const [mode, setMode] = useState<'manual' | 'magic'>('manual');
  
  // Magic State
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(restaurants[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState(0);
  const [duration, setDuration] = useState(60);
  const [quantity, setQuantity] = useState(20);

  const handleMagicGenerate = async () => {
    if (!situation) return;
    setLoading(true);
    const cuisine = restaurants.find(r => r.id === selectedRestaurantId)?.cuisineType || 'General';
    const suggestion = await generateMagicDeal(situation, cuisine);
    
    if (suggestion) {
      setTitle(suggestion.title);
      setDescription(suggestion.description);
      setDiscountType(suggestion.discountType);
      setDiscountValue(suggestion.discountValue);
      setDuration(suggestion.durationMinutes);
      setQuantity(suggestion.maxRedemptions);
      setMode('manual');
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal: Deal = {
      id: `deal_${Date.now()}`,
      restaurantId: selectedRestaurantId,
      title,
      description,
      discountType,
      discountValue,
      startTime: new Date().toISOString(),
      endTime: addMinutes(new Date(), duration).toISOString(),
      createdByAi: loading,
      maxRedemptions: quantity,
      redemptionsCount: 0,
      isActive: true
    };
    onSave(newDeal);
  };

  if (mode === 'magic') {
    return (
      <div className="p-6 h-full flex flex-col bg-cyber-dark text-white">
        <div className="flex justify-between items-center mb-6 pt-4">
           <h2 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-neon-violet fill-neon-violet" /> Magic Creator</h2>
           <button onClick={() => setMode('manual')} className="text-white/50 hover:text-white"><X /></button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
           <p className="text-2xl font-light text-white mb-8 text-center leading-relaxed">
             Tell us what's happening. <br/>
             <span className="text-white/40 text-base font-normal">e.g. "It's pouring rain and I have too much soup."</span>
           </p>
           
           <textarea 
             className="w-full bg-white/5 p-6 rounded-3xl border border-white/10 outline-none focus:border-neon-blue text-lg text-white placeholder:text-white/20 min-h-[200px]"
             placeholder="Describe the situation..."
             value={situation}
             onChange={e => setSituation(e.target.value)}
           />

           <button 
             onClick={handleMagicGenerate}
             disabled={loading || !situation}
             className="mt-8 w-full bg-gradient-to-r from-neon-blue via-neon-violet to-neon-pink text-white font-bold py-5 rounded-3xl shadow-[0_0_30px_rgba(76,122,244,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] transition-transform"
           >
             {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
             {loading ? 'Conjuring Deal...' : 'Generate Magic Deal'}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 text-white">
       <div className="flex justify-between items-center mb-6 pt-4">
           <h1 className="text-2xl font-bold">New Flash Deal</h1>
           <button onClick={onCancel} className="p-2 bg-white/5 rounded-full text-white/40 hover:text-white"><X size={20} /></button>
       </div>

       {/* Magic Banner */}
       <div 
         onClick={() => setMode('magic')}
         className="bg-gradient-to-r from-neon-blue to-neon-violet rounded-2xl p-5 text-white mb-8 flex items-center justify-between cursor-pointer shadow-lg shadow-neon-blue/20 active:scale-[0.98] transition-transform border border-white/10"
       >
         <div>
            <div className="font-bold flex items-center gap-2 text-lg"><Sparkles size={18} className="fill-white/50" /> Magic Creator</div>
            <div className="text-xs text-white/80 mt-1">AI generates the perfect offer instantly.</div>
         </div>
         <div className="bg-white/20 p-2 rounded-full">
           <Wand2 size={24} />
         </div>
       </div>

       {/* Form Section - White Box requested */}
       <div className="bg-white rounded-[32px] p-6 text-black shadow-2xl relative overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold tracking-tight mb-1">Create your flash deal here</h2>
            <p className="text-black/40 text-[10px] font-bold uppercase tracking-wider">Fill in the details to launch instantly</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-black/40 uppercase mb-1 ml-1">Restaurant Location</label>
              <div className="relative">
                <input 
                  readOnly
                  className="w-full p-4 bg-black/5 border border-black/10 rounded-2xl outline-none text-sm font-medium cursor-default"
                  value="HM - Lothstraße"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-black/40 uppercase mb-1 ml-1">Deal Title</label>
              <input 
                required
                className="w-full p-4 bg-black/5 border border-black/10 rounded-2xl outline-none focus:ring-2 focus:ring-neon-blue/20 text-sm placeholder:text-black/20" 
                placeholder="e.g. 50% Off Pizza"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-black/40 uppercase mb-1 ml-1">Description</label>
              <textarea 
                required
                className="w-full p-4 bg-black/5 border border-black/10 rounded-2xl outline-none focus:ring-2 focus:ring-neon-blue/20 text-sm placeholder:text-black/20" 
                placeholder="Short details about the offer..."
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-bold text-black/40 uppercase mb-1 ml-1">Discount</label>
                  <div className="flex">
                     <input 
                       type="number" 
                       className="w-full p-4 bg-black/5 border border-black/10 rounded-l-2xl outline-none focus:ring-2 focus:ring-neon-blue/20 text-sm"
                       value={discountValue}
                       onChange={e => setDiscountValue(Number(e.target.value))}
                     />
                     <select 
                       className="bg-black/10 border border-black/10 border-l-0 rounded-r-2xl px-2 outline-none text-xs font-bold"
                       value={discountType}
                       onChange={e => setDiscountType(e.target.value as any)}
                     >
                       <option value="fixed">€</option>
                       <option value="percent">%</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-black/40 uppercase mb-1 ml-1">Quantity</label>
                  <input 
                     type="number" 
                     className="w-full p-4 bg-black/5 border border-black/10 rounded-2xl outline-none focus:ring-2 focus:ring-neon-blue/20 text-sm"
                     value={quantity}
                     onChange={e => setQuantity(Number(e.target.value))}
                   />
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-black/40 uppercase mb-1 ml-1">Time Limit (Minutes)</label>
              <div className="bg-black/5 p-4 rounded-2xl border border-black/10">
                <input 
                  type="range" 
                  min="15" 
                  max="240" 
                  step="15" 
                  className="w-full accent-neon-blue h-1 bg-black/10 rounded-lg appearance-none cursor-pointer"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                />
                <div className="text-right text-xs font-bold text-neon-blue mt-2">{duration} minutes</div>
              </div>
            </div>

            <button 
               type="submit"
               className="w-full bg-black text-white font-extrabold py-5 rounded-2xl shadow-xl mt-4 flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-[0.98] transition-all"
             >
               <Check size={20} /> Save/Create
             </button>
          </form>
       </div>
    </div>
  );
}
