
import React, { useState } from 'react';
import { 
  MOCK_USER_CUSTOMER, 
  MOCK_USER_OWNER, 
  MOCK_RESTAURANTS, 
  MOCK_DEALS 
} from './constants';
import { 
  User, 
  UserRole, 
  Restaurant, 
  Deal, 
  QRRedemption 
} from './types';
import { 
  Map as MapIcon, 
  Home, 
  User as UserIcon, 
  LayoutDashboard, 
  ScanLine, 
  LogOut,
  Zap,
  ShoppingBag
} from 'lucide-react';

// Views
import CustomerHome from './views/CustomerHome';
import CustomerMap from './views/CustomerMap';
import CustomerOrders from './views/CustomerOrders';
import OwnerDashboard from './views/OwnerDashboard';
import RestaurantDetail from './views/RestaurantDetail';
import DealCreator from './views/DealCreator';
import QRScanner from './views/QRScanner';
import Profile from './views/Profile';
import Wallet from './views/Wallet';
import Favorites from './views/Favorites';
import AccountSettings from './views/AccountSettings';
import HelpCenter from './views/HelpCenter';
import { Sidebar } from './components/Sidebar';

export default function App() {
  // --- Global State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [redemptions, setRedemptions] = useState<QRRedemption[]>([]);
  
  // --- Navigation State (History Stack) ---
  const [viewHistory, setViewHistory] = useState<string[]>(['auth']);
  const currentView = viewHistory[viewHistory.length - 1];

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Navigation Helpers ---

  // Use this for drilling down (e.g. Home -> Restaurant)
  const pushView = (view: string) => {
    setViewHistory(prev => [...prev, view]);
  };

  // Use this for "Back" buttons
  const popView = () => {
    setViewHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  // Use this for Tab switching (resets stack)
  const switchTab = (view: string) => {
    setViewHistory([view]);
  };

  // --- Actions ---

  const handleLogin = (role: UserRole) => {
    if (role === UserRole.CUSTOMER) {
      setCurrentUser(MOCK_USER_CUSTOMER);
      switchTab('home');
    } else {
      setCurrentUser(MOCK_USER_OWNER);
      switchTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    switchTab('auth');
    setIsSidebarOpen(false);
  };

  const addDeal = (deal: Deal) => {
    setDeals(prev => [deal, ...prev]);
    popView(); // Return to dashboard after creating deal
  };

  const redeemDeal = (qrUuid: string): boolean => {
    const redemption = redemptions.find(r => r.qrUuid === qrUuid);
    if (redemption && redemption.status === 'pending') {
      const updatedRedemptions = redemptions.map(r => 
        r.id === redemption.id ? { ...r, status: 'redeemed' as const } : r
      );
      setRedemptions(updatedRedemptions);
      setDeals(prev => prev.map(d => 
        d.id === redemption.dealId ? { ...d, redemptionsCount: d.redemptionsCount + 1 } : d
      ));
      return true;
    }
    return false;
  };

  const createRedemption = (deal: Deal) => {
    const newRedemption: QRRedemption = {
      id: `red_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser!.id,
      dealId: deal.id,
      restaurantId: deal.restaurantId,
      qrUuid: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60000).toISOString(), // +30 mins
      status: 'pending'
    };
    setRedemptions(prev => [newRedemption, ...prev]);
    return newRedemption;
  };

  const toggleFavorite = (restaurantId: string) => {
    if (!currentUser) return;
    const isFav = currentUser.favorites.includes(restaurantId);
    const newFavs = isFav 
      ? currentUser.favorites.filter(id => id !== restaurantId)
      : [...currentUser.favorites, restaurantId];
    
    setCurrentUser({ ...currentUser, favorites: newFavs });
  };

  const navigateToRestaurant = (id: string) => {
    setSelectedRestaurantId(id);
    pushView(`restaurant:${id}`);
  };

  // --- Render Helpers ---

  const renderContent = () => {
    if (!currentUser) return null;

    if (currentUser.role === UserRole.CUSTOMER) {
      if (currentView === 'home') return (
        <CustomerHome 
          restaurants={restaurants} 
          deals={deals} 
          onNavigateRestaurant={navigateToRestaurant}
          currentUser={currentUser}
          setCurrentView={switchTab} // Tabs use switch behavior
          onMenuClick={() => setIsSidebarOpen(true)}
        />
      );
      if (currentView === 'map') return (
        <CustomerMap 
          restaurants={restaurants}
          deals={deals}
          onNavigateRestaurant={navigateToRestaurant}
          onMenuClick={() => setIsSidebarOpen(true)}
          currentUserProfile={currentUser.profilePicture}
        />
      );
      if (currentView === 'orders') return (
        <CustomerOrders 
          onBrowse={() => switchTab('home')}
          redemptions={redemptions.filter(r => r.userId === currentUser.id)}
          restaurants={restaurants}
          deals={deals}
        />
      );
      if (currentView.startsWith('restaurant:')) {
        const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
        if (!restaurant) return <div>Not Found</div>;
        return (
          <RestaurantDetail 
            restaurant={restaurant}
            deals={deals.filter(d => d.restaurantId === restaurant.id && d.isActive)}
            onBack={popView} // Use popView for Back button
            onCreateRedemption={createRedemption}
            isFavorite={currentUser.favorites.includes(restaurant.id)}
            onToggleFavorite={() => toggleFavorite(restaurant.id)}
            existingRedemptions={redemptions.filter(r => r.restaurantId === restaurant.id && r.userId === currentUser.id)}
          />
        );
      }
      if (currentView === 'profile') return (
        <Profile 
          user={currentUser} 
          redemptions={redemptions}
          restaurants={restaurants}
          deals={deals}
          onLogout={handleLogout}
          onNavigate={pushView}
        />
      );
      if (currentView === 'account-settings') return (
        <AccountSettings
          user={currentUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onBack={popView}
        />
      );
      if (currentView === 'help-center') return (
        <HelpCenter onBack={popView} />
      );
      if (currentView === 'wallet') return (
        <Wallet onBack={popView} />
      );
      if (currentView === 'favorites') return (
        <Favorites 
          restaurants={restaurants}
          currentUser={currentUser}
          onNavigateRestaurant={navigateToRestaurant}
          onBack={popView}
        />
      );
    }

    if (currentUser.role === UserRole.OWNER) {
      if (currentView === 'dashboard') return (
        <OwnerDashboard 
          user={currentUser}
          restaurants={restaurants}
          deals={deals}
          redemptions={redemptions}
          onCreateDealClick={() => pushView('create-deal')} // Push to stack
        />
      );
      if (currentView === 'create-deal') return (
        <DealCreator 
          ownerId={currentUser.id}
          restaurants={restaurants.filter(r => r.ownerId === currentUser.id)}
          onCancel={popView} // Back
          onSave={addDeal}   // Saves and goes Back
        />
      );
      if (currentView === 'scanner') return (
        <QRScanner 
          onValidate={redeemDeal}
          onBack={popView} // Back
        />
      );
      if (currentView === 'profile') return (
        <Profile 
          user={currentUser} 
          redemptions={[]} 
          restaurants={[]} 
          deals={[]} 
          onLogout={handleLogout}
          onNavigate={pushView}
        />
      );
      if (currentView === 'account-settings') return (
        <AccountSettings
          user={currentUser}
          onUpdateUser={(updated) => setCurrentUser(updated)}
          onBack={popView}
        />
      );
      if (currentView === 'help-center') return (
        <HelpCenter onBack={popView} />
      );
      if (currentView === 'wallet') return (
        <Wallet onBack={popView} />
      );
    }

    return <div>Unknown View</div>;
  };

  // --- Auth Screen ---
  if (currentView === 'auth') {
    return (
      <div className="w-full max-w-[400px] h-screen max-h-[900px] flex flex-col items-center justify-center p-6 text-white text-center bg-[#0b1224] relative overflow-hidden shadow-2xl md:rounded-[40px] md:border-[8px] md:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Sponti Logo */}
          <div className="relative w-32 h-32 mb-6 group">
             <div className="absolute inset-0 bg-neon-blue blur-[50px] rounded-full opacity-30 animate-pulse"></div>
             <div className="relative w-full h-full bg-gradient-to-tr from-neon-blue to-neon-violet rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
               <div className="absolute inset-1 rounded-full border border-white/10"></div>
               <Zap className="w-16 h-16 text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
             </div>
          </div>

          <h1 className="text-5xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-white to-neon-violet">
            Sponti
          </h1>
          <p className="text-lg text-gray-300 font-medium tracking-wide">Cyber Flash Deals</p>
        </div>
        
        <div className="space-y-4 w-full max-w-xs mt-12 relative z-10">
          <button 
            onClick={() => handleLogin(UserRole.CUSTOMER)}
            className="w-full bg-gradient-to-r from-neon-blue to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-neon-blue/30 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10"
          >
            <UserIcon size={20} />
            <span className="tracking-wide">Customer Access</span>
          </button>
          <button 
            onClick={() => handleLogin(UserRole.OWNER)}
            className="w-full glass text-white font-bold py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/5 hover:bg-white/10"
          >
            <LayoutDashboard size={20} />
            <span className="tracking-wide">Owner Portal</span>
          </button>
        </div>
      </div>
    );
  }

  // --- Main Layout ---
  const isRestaurantView = currentView.startsWith('restaurant:');
  const isWalletView = currentView === 'wallet';
  const isFavoritesView = currentView === 'favorites';
  const isSettingsView = currentView === 'account-settings';
  const isHelpView = currentView === 'help-center';
  const isCreateDealView = currentView === 'create-deal';

  return (
    <div className="w-full md:max-w-[393px] h-screen md:h-[852px] bg-[#0b1224] md:rounded-[40px] md:border-[8px] md:border-slate-800 relative overflow-hidden shadow-2xl flex flex-col font-sf">
      {/* Sidebar Overlay */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={currentUser}
        onNavigate={pushView} // Use pushView so back works
      />

      {/* Background Image Effect matching Figma */}
      <img
        className="absolute top-0 left-0 w-full h-[600px] object-cover opacity-60 pointer-events-none"
        alt=""
        src="https://api.builder.io/api/v1/image/assets/TEMP/e26123cab98669ded1fa41d9e98e7af9cdaca8ea?width=3680"
      />
      <div className="absolute top-[150px] inset-x-0 bottom-0 bg-[#00000080] backdrop-blur-[50px] backdrop-brightness-100 pointer-events-none" />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar relative z-10 scroll-smooth ${(isRestaurantView || isWalletView || isFavoritesView || isSettingsView || isHelpView || isCreateDealView) ? 'pb-0' : 'pb-[100px]'}`}>
        {renderContent()}
      </main>

      {/* Tab Bar - Render only if NOT in special sub-views */}
      {!isRestaurantView && !isWalletView && !isFavoritesView && !isSettingsView && !isHelpView && !isCreateDealView && (
        <nav className="absolute bottom-[20px] left-[10px] right-[10px] z-50">
          <div className="tab-bar-glass h-[77px] flex justify-between items-center px-4 relative overflow-hidden">
            {/* Active Tab Glow Effect */}
            {currentUser?.role === UserRole.CUSTOMER && currentView === 'home' && (
              <div className="absolute top-[-26px] left-[20px] w-[334px] h-[38px] bg-[#403AA2] blur-[23px] rounded-[334px] pointer-events-none opacity-100 transition-opacity duration-300"></div>
            )}
            {currentUser?.role === UserRole.CUSTOMER && currentView === 'map' && (
              <div className="absolute top-[-26px] left-[115px] w-[334px] h-[38px] bg-[#403AA2] blur-[23px] rounded-[334px] pointer-events-none opacity-100 transition-opacity duration-300"></div>
            )}
            {currentUser?.role === UserRole.CUSTOMER && currentView === 'orders' && (
              <div className="absolute top-[-26px] left-[210px] w-[334px] h-[38px] bg-[#403AA2] blur-[23px] rounded-[334px] pointer-events-none opacity-100 transition-opacity duration-300"></div>
            )}
            {currentUser?.role === UserRole.CUSTOMER && currentView === 'profile' && (
              <div className="absolute top-[-26px] left-[305px] w-[334px] h-[38px] bg-[#403AA2] blur-[23px] rounded-[334px] pointer-events-none opacity-100 transition-opacity duration-300"></div>
            )}

            {currentUser?.role === UserRole.CUSTOMER ? (
              <>
                <NavBtn 
                  icon={<Home />} 
                  active={currentView === 'home'} 
                  onClick={() => switchTab('home')}
                  label="Home"
                />
                 <NavBtn 
                  icon={<MapIcon />} 
                  active={currentView === 'map'}
                  onClick={() => switchTab('map')}
                  label="Map"
                />
                <NavBtn 
                  icon={<ShoppingBag />} 
                  active={currentView === 'orders'}
                  onClick={() => switchTab('orders')}
                  label="Orders"
                />
                <NavBtn 
                  icon={<UserIcon />} 
                  active={currentView === 'profile'} 
                  onClick={() => switchTab('profile')}
                  label="Account"
                />
              </>
            ) : (
              <>
                <NavBtn 
                  icon={<LayoutDashboard />} 
                  active={currentView === 'dashboard'} 
                  onClick={() => switchTab('dashboard')}
                  label="Dash"
                />
                <NavBtn 
                  icon={<ScanLine />} 
                  active={currentView === 'scanner'} 
                  onClick={() => pushView('scanner')}
                  label="Scan"
                />
                <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-white/40 hover:text-red-400 transition-colors pt-1">
                   <LogOut size={24} />
                   <span className="text-[10px] font-medium font-sf">Exit</span>
                </button>
              </>
            )}
          </div>
        </nav>
      )}
      
      {/* Home Indicator */}
      <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2 w-[139px] h-[5px] bg-white rounded-[100px] z-50"></div>
    </div>
  );
}

const NavBtn = ({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-[2px] transition-all duration-300 relative z-10 w-[49px] h-[49px]`}
  >
    <div className={`w-[29px] h-[24px] flex items-center justify-center ${active ? 'text-white' : 'text-white/60'}`}>
        {icon}
    </div>
    <span className={`text-[10px] font-medium font-sf leading-normal ${active ? 'text-white' : 'text-[#ebebf599]'}`}>{label}</span>
  </button>
);
