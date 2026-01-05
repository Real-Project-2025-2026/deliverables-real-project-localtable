
import React, { useState } from 'react';
import { User } from '../types';
import { 
  X, 
  User as UserIcon, 
  History, 
  Wallet as WalletIcon, 
  Heart, 
  Users, 
  Settings, 
  HelpCircle, 
  CheckCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onNavigate: (view: string) => void;
}

export const Sidebar = ({ isOpen, onClose, user, onNavigate }: SidebarProps): React.ReactElement => {
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return <></>;

  const handleInviteFriends = () => {
    const appLink = "https://sponti-879131163810.us-west1.run.app/";
    navigator.clipboard.writeText(appLink).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className="relative w-[85%] max-w-[320px] h-full bg-[#0b1224]/95 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 shadow-2xl animate-slide-in-left">
        
        {/* Top Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-lg"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 px-2">
            <div className="relative w-[70px] h-[70px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#009DFF] to-[#0E132B] blur-sm opacity-60" />
              <img 
                className="relative w-full h-full rounded-full object-cover border-2 border-white/10" 
                alt="Avatar" 
                src={user?.profilePicture || 'https://picsum.photos/200'} 
              />
            </div>
            <div className="flex flex-col">
               <span className="text-white text-lg font-medium font-sf">{user?.name || 'Guest User'}</span>
               <span className="text-white/50 text-xs">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="w-[220px] h-[1px] bg-gradient-to-r from-white/20 to-transparent mb-6" />

        {/* Menu Section */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
          <div className="text-white/70 text-[13px] font-medium tracking-wide mb-2 px-4 font-sf">MENU</div>

          <MenuItem 
            icon={<UserIcon size={20} />} 
            label="Profile" 
            onClick={() => { onNavigate('profile'); onClose(); }} 
          />
          <MenuItem 
            icon={<History size={20} />} 
            label="History" 
            onClick={() => { onNavigate('orders'); onClose(); }}
          />
          <MenuItem 
            icon={<WalletIcon size={20} />} 
            label="Wallet" 
            onClick={() => { onNavigate('wallet'); onClose(); }}
          />
          <MenuItem 
            icon={<Heart size={20} />} 
            label="Favourite" 
            onClick={() => { onNavigate('favorites'); onClose(); }}
          />
          <MenuItem 
            icon={<Users size={20} />} 
            label="Invite Friends" 
            onClick={handleInviteFriends}
          />
          
        </div>

        {/* Bottom Section */}
        <div className="mt-auto pt-4">
           <div className="w-[220px] h-[1px] bg-gradient-to-r from-white/20 to-transparent mb-6" />
           
           <div className="text-white/70 text-[13px] font-medium tracking-wide mb-2 px-4 font-sf">SETTINGS AND SUPPORT</div>
           
           <MenuItem 
             icon={<Settings size={20} />} 
             label="Settings and Privacy" 
             onClick={() => { onNavigate('account-settings'); onClose(); }}
           />
           <MenuItem 
             icon={<HelpCircle size={20} />} 
             label="Help center" 
             onClick={() => { onNavigate('help-center'); onClose(); }}
           />
        </div>

      </div>

      {/* Copy Link Toast Confirmation */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-fade-up px-6 w-full max-w-[350px]">
          <div className="glass-high p-4 rounded-2xl border border-neon-blue/50 shadow-[0_0_30px_rgba(76,122,244,0.3)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue shrink-0">
               <CheckCircle size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">Link copied!</span>
              <span className="text-white/60 text-xs">Share Sponti with your friends 🚀</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, active = false }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden w-full
      ${active ? 'bg-gradient-to-r from-[#2670e9]/30 to-transparent border-l-2 border-[#2670e9]' : 'hover:bg-white/5 border-l-2 border-transparent'}
    `}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2670e9] blur-[5px]" />}
    <div className={`text-white ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
      {icon}
    </div>
    <span className={`text-[16px] font-sf ${active ? 'font-medium text-white' : 'font-normal text-white/80 group-hover:text-white'}`}>
      {label}
    </span>
  </button>
);
