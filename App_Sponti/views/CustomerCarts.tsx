import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface Props {
  onBrowse: () => void;
}

export default function CustomerCarts({ onBrowse }: Props) {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center font-sf text-white pt-20 animate-fade-in">
      <div className="w-32 h-32 bg-gradient-to-tr from-white/5 to-white/0 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.05)] border border-white/10 relative">
        <div className="absolute inset-0 bg-neon-blue/20 blur-2xl rounded-full"></div>
        <ShoppingBag size={48} className="text-white/40 relative z-10" />
      </div>
      <h2 className="text-3xl font-bold mb-3 tracking-tight">Your Cart is Empty</h2>
      <p className="text-white/50 mb-10 max-w-[260px] leading-relaxed text-sm">
        You haven't added any items yet. Explore local flash deals to fill your table!
      </p>
      <button
        onClick={onBrowse}
        className="bg-gradient-to-r from-neon-blue to-neon-violet text-white font-bold py-4 px-10 rounded-2xl shadow-[0_0_20px_rgba(76,122,244,0.4)] flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 border border-white/20"
      >
        <span>Browse Deals</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}