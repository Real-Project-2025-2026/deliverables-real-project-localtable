
import React, { useState } from 'react';
import { ChevronLeft, CreditCard, ShieldCheck, Save } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function Wallet({ onBack }: Props) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="p-6 pb-32 text-white animate-fade-in min-h-full">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">My Wallet</h1>
      </div>

      {/* Visual Card Preview */}
      <div className="relative w-full aspect-[1.58/1] rounded-[24px] overflow-hidden mb-10 shadow-2xl border border-white/20 group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        {/* Glowing Accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-blue/20 blur-[60px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-violet/20 blur-[60px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative h-full p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="w-12 h-10 bg-white/10 rounded-md border border-white/10 flex items-center justify-center">
                <div className="w-8 h-6 bg-yellow-500/40 rounded-sm"></div>
             </div>
             <div className="italic font-bold text-2xl text-white/90">VISA</div>
          </div>

          <div className="space-y-4">
             <div className="text-xl md:text-2xl font-mono tracking-[4px] text-white/90">
                {cardNumber ? formatCardNumber(cardNumber) : '**** **** **** ****'}
             </div>
             
             <div className="flex justify-between items-end">
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Card Holder</span>
                   <span className="text-sm font-medium tracking-wide uppercase">{cardName || 'Full Name'}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Expires</span>
                   <span className="text-sm font-medium tracking-wide">{expiry || 'MM/YY'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="glass p-6 rounded-[30px] border border-white/10">
        <div className="flex items-center gap-2 mb-6 text-neon-blue">
          <ShieldCheck size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Secure Payment Info</span>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
           <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Cardholder Name</label>
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-neon-blue transition-colors placeholder:text-white/20"
                placeholder="JOHN DOE"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
              />
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">Card Number</label>
              <input 
                required
                maxLength={19}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono outline-none focus:border-neon-blue transition-colors placeholder:text-white/20"
                placeholder="0000 0000 0000 0000"
                value={formatCardNumber(cardNumber)}
                onChange={e => setCardNumber(e.target.value)}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase ml-1">Expiry Date</label>
                <input 
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-neon-blue transition-colors placeholder:text-white/20 text-center"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase ml-1">CVV</label>
                <input 
                  required
                  placeholder="***"
                  maxLength={3}
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-neon-blue transition-colors placeholder:text-white/20 text-center"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                />
              </div>
           </div>

           <button 
             type="submit"
             disabled={isSaved}
             className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-4 ${
               isSaved 
               ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
               : 'bg-gradient-to-r from-neon-blue to-neon-violet text-white shadow-[0_0_20px_rgba(76,122,244,0.4)] hover:scale-[1.02] active:scale-95'
             }`}
           >
             {isSaved ? (
               <>
                 <ShieldCheck size={20} />
                 Card Saved Securely
               </>
             ) : (
               <>
                 <Save size={20} />
                 Save Card Details
               </>
             )}
           </button>
        </form>
      </div>

      <div className="mt-8 px-4 flex items-center gap-3 text-white/30">
        <CreditCard size={14} />
        <p className="text-[10px] leading-relaxed">
          Sponti uses 256-bit SSL encryption to ensure your payment information is stored safely in your local environment.
        </p>
      </div>
    </div>
  );
}
