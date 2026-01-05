
import React, { useState } from 'react';
import { User } from '../types';
import { 
  ChevronLeft, 
  User as UserIcon, 
  Mail, 
  Bell, 
  Shield, 
  Trash2, 
  Check, 
  AlertTriangle,
  X
} from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser: (updated: User) => void;
  onBack: () => void;
}

export default function AccountSettings({ user, onUpdateUser, onBack }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pushEnabled, setPushEnabled] = useState(user.pushEnabled);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      pushEnabled
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 pb-32 text-white animate-fade-in min-h-full font-sf">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Profile Information Section */}
        <section>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2 mb-4 flex items-center gap-2">
            <UserIcon size={14} className="text-neon-blue" /> Profile Information
          </h3>
          <div className="glass p-6 rounded-[30px] border border-white/10 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Full Name</label>
              <div className="relative">
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white outline-none focus:border-neon-blue transition-colors placeholder:text-white/10"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase ml-1">Email Address</label>
              <div className="relative">
                <input 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white/50 outline-none cursor-not-allowed"
                  placeholder="email@example.com"
                  value={email}
                  readOnly
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
              </div>
              <p className="text-[10px] text-white/20 ml-1 italic">Email is currently read-only for security reasons.</p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2 mb-4 flex items-center gap-2">
            <Shield size={14} className="text-neon-violet" /> Security
          </h3>
          <div className="glass rounded-[30px] border border-white/10 overflow-hidden divide-y divide-white/5">
            <button type="button" className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <span className="text-sm font-medium text-white/80 group-hover:text-white">Change Password</span>
              <Shield size={16} className="text-white/20" />
            </button>
            <button type="button" className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors group text-left">
              <span className="text-sm font-medium text-white/80 group-hover:text-white">Logout from all devices</span>
              <AlertTriangle size={16} className="text-white/20" />
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2 mb-4 flex items-center gap-2">
            <Bell size={14} className="text-neon-blue" /> Preferences
          </h3>
          <div className="glass p-6 rounded-[30px] border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-white/40" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <button 
                type="button"
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${pushEnabled ? 'bg-neon-blue' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${pushEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-4">
          <div className="glass p-6 rounded-[30px] border border-red-500/20 bg-red-500/5">
            <h3 className="text-xs font-bold text-red-500/60 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trash2 size={14} /> Danger Zone
            </h3>
            <p className="text-xs text-white/40 mb-5 leading-relaxed">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              type="button" 
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-4 border border-red-500/40 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              Delete My Account
            </button>
          </div>
        </section>

        {/* Floating Save Button */}
        <div className="fixed bottom-6 left-[20px] right-[20px] z-[50]">
          <button 
            type="submit"
            className={`w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 ${
              isSaved 
              ? 'bg-green-500 text-white animate-pulse' 
              : 'bg-white text-black active:scale-[0.98]'
            }`}
          >
            {isSaved ? <Check size={20} /> : null}
            {isSaved ? 'Settings Updated' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />
          <div className="glass p-8 rounded-[40px] border border-red-500/30 w-full max-w-sm relative z-10 text-center animate-popIn">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Are you sure?</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              This action is permanent and will delete all your order history, favorites, and profile data.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                type="button" 
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors"
                onClick={() => {
                   alert('Account deletion is simulated.');
                   setShowDeleteModal(false);
                }}
              >
                Yes, Delete Account
              </button>
              <button 
                type="button" 
                className="w-full py-4 bg-white/5 text-white/60 rounded-2xl font-bold hover:bg-white/10 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-6 right-6 text-white/20 hover:text-white">
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-popIn {
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
}
