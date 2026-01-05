
import React, { useState } from 'react';
import { ChevronLeft, HelpCircle, Mail, MessageSquare, ExternalLink, ChevronDown } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function HelpCenter({ onBack }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const commonQuestions = [
    {
      question: "How do I redeem a deal?",
      answer: "To redeem a deal, Find your favorite Restaurant. Claim the Deal. Show the QR code or deal details to the restaurant staff before the deal expires. Once scanned or confirmed, the deal is applied."
    },
    {
      question: "Why did my QR code expire?",
      answer: "Each deal has a specific validity period. If your QR code expired, it means the deal was not used within the allowed time. Check the deal’s expiration date before visiting the restaurant."
    },
    {
      question: "Restaurant staff can't scan my code?",
      answer: "If your QR code isn’t working, try:\n\n• Updating the app to the latest version.\n• Ensuring your internet connection is stable.\n• Confirming the deal hasn’t already been used or expired."
    }
  ];

  return (
    <div className="p-6 pb-32 text-white animate-fade-in min-h-full font-sf">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
      </div>

      <div className="space-y-8">
        {/* Intro Section */}
        <section className="text-center py-6 px-4">
          <div className="w-20 h-20 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-blue/20 shadow-[0_0_30px_rgba(76,122,244,0.15)]">
             <HelpCircle size={40} className="text-neon-blue" />
          </div>
          <h2 className="text-xl font-bold mb-2 tracking-tight">How can we help?</h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-[260px] mx-auto">
            Our team is here to assist you with any questions about Sponti flash deals.
          </p>
        </section>

        {/* Contact Support Section */}
        <section>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2 mb-4 flex items-center gap-2">
            <MessageSquare size={14} className="text-neon-violet" /> Contact Support
          </h3>
          <div className="glass p-6 rounded-[30px] border border-white/10 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="p-3 bg-neon-blue/10 rounded-xl text-neon-blue">
                <Mail size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Email Support</p>
                <a 
                  href="mailto:hossam.ali@hm.edu" 
                  className="text-white font-medium hover:text-neon-blue transition-colors flex items-center gap-2"
                >
                  hossam.ali@hm.edu
                  <ExternalLink size={12} className="opacity-40" />
                </a>
              </div>
            </div>

            <p className="text-xs text-white/20 text-center px-4 leading-relaxed italic">
              Expected response time: Within 24 hours.
            </p>
          </div>
        </section>

        {/* Common Topics */}
        <section>
           <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2 mb-4">Common Questions</h3>
           <div className="space-y-3">
              {commonQuestions.map((item, index) => (
                <div key={index} className="glass rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => toggleQuestion(index)}
                    className="w-full p-5 text-sm flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                  >
                    <span className={`font-semibold ${openIndex === index ? 'text-neon-blue' : 'text-white/80'}`}>
                      {item.question}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`text-white/30 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-neon-blue' : ''}`} 
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-5 pb-5 animate-fade-in">
                       <p className="text-xs text-white/50 leading-relaxed whitespace-pre-line">
                         {item.answer}
                       </p>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </section>
      </div>

      {/* Footer Branding */}
      <div className="mt-16 text-center opacity-[0.05]">
         <h1 className="text-4xl font-black italic tracking-tighter">SPONTI</h1>
         <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Technical Support</p>
      </div>
    </div>
  );
}
