import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/useCMS';
import { adminAPI } from '../context/api';
import SystemClock from './admin/SystemClock';
import CommandPalette from './admin/CommandPalette';
import DashboardView from './admin/DashboardView';
import AssetsView from './admin/AssetsView';
import ContentView from './admin/ContentView';
import ServicesView from './admin/ServicesView';
import TestimonialsView from './admin/TestimonialsView';
import OffersView from './admin/OffersView';
import ThemeView from './admin/ThemeView';

const SidebarItem = ({ id, label, icon, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all relative group mb-1 ${
      activeTab === id 
        ? 'bg-gold/10 text-gold border border-gold/20' 
        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
    }`}
  >
    <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[11px] font-bold tracking-widest uppercase">{label}</span>
    {activeTab === id && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gold rounded-r-full shadow-lg shadow-gold/50" />
    )}
  </button>
);

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return adminAPI.isAuthenticated();
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(false);
  const [initLogs, setInitLogs] = useState([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { 
    data, 
    updateData, 
    addProperty, 
    updateProperty, 
    deleteProperty,
    addOffer,
    updateOffer,
    deleteOffer,
    addService,
    updateService,
    deleteService,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateTheme,
    updatePopupSettings
  } = useCMS();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsCommandOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login(email, password);

      if (response.success) {
        setIsInitializing(true);
        const logSequence = [
          'Establishing encrypted connection...',
          'Verifying admin credentials...',
          'Accessing secure database...',
          'Decrypting property assets...',
          'Syncing global presence...',
          'Admin session verified. Welcome, Capita Prime.'
        ];

        logSequence.forEach((log, i) => {
          setTimeout(() => {
            setInitLogs(prev => [...prev, log]);
            if (i === logSequence.length - 1) {
              setTimeout(() => {
                setIsAuthenticated(true);
                setIsInitializing(false);
              }, 800);
            }
          }, (i + 1) * 600);
        });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setPassword('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminAPI.logout();
    setIsAuthenticated(false);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
            <h2 className="text-gold font-bold tracking-[0.2em] uppercase">System Initializing</h2>
          </div>
          <div className="space-y-2 bg-black/50 p-6 rounded-xl border border-gold/10 backdrop-blur-md">
            {initLogs.map((log, i) => (
              <div key={i} className="text-xs flex gap-3">
                <span className="text-gold/40">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                <span className="text-gray-300">{log}</span>
              </div>
            ))}
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-4">
              <div className="bg-gold h-full animate-[loading_4s_ease-in-out]" style={{width: `${(initLogs.length / 5) * 100}%`}} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-12 relative overflow-hidden font-sans">
        {/* Night City Floating Particles */}
        <div className="absolute inset-0 z-0">
          <div className="particle-field" />
          <div className="particle-field" style={{ animationDelay: '-10s', backgroundSize: '400px 400px', opacity: 0.4 }} />
          <div className="night-city-overlay" />
          
          {/* Distant City Blooms */}
          <div className="absolute top-1/4 left-1/3 w-[40%] h-[40%] bg-gold/5 blur-[160px] rounded-full animate-city-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-[50%] h-[50%] bg-white/5 blur-[180px] rounded-full animate-city-pulse" style={{ animationDelay: '-8s' }} />
        </div>
        
        <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {/* Centered Content with Extreme Spacing */}
          <div className="text-center mb-24">
            <div className="relative mb-20 inline-block animate-logo">
              <div className="w-40 lg:w-56 h-40 lg:h-56 mx-auto relative group">
                <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full group-hover:bg-gold/20 transition-all duration-1000" />
                <img 
                  src="/logo.png" 
                  alt="Capita Prime" 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(197,160,89,0.3)]"
                />
              </div>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-white mb-8 tracking-tighter">Secure Terminal</h2>
            <div className="flex items-center justify-center gap-8">
              <div className="h-[1px] w-20 bg-white/10" />
              <p className="text-gold/50 text-[11px] lg:text-[12px] font-black tracking-[0.6em] uppercase">Private Encryption Node</p>
              <div className="h-[1px] w-20 bg-white/10" />
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-12">
            <div className="group relative px-4">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[12px] text-gray-500 font-black tracking-[0.4em] uppercase group-focus-within:text-gold transition-colors">
                  Admin Email
                </label>
                <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">ID: NEX-742</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white border-b-2 border-white/10 focus:border-gold/40 focus:outline-none transition-all py-6 text-center tracking-[0.8em] font-mono text-2xl"
                placeholder="admin@capitaprimellc.com"
                required
              />
            </div>

            <div className="group relative px-4">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[12px] text-gray-500 font-black tracking-[0.4em] uppercase group-focus-within:text-gold transition-colors">
                  Access Key
                </label>
                <span className="text-[10px] text-gray-700 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">SECURE</span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white border-b-2 border-white/10 focus:border-gold/40 focus:outline-none transition-all py-6 text-center tracking-[1.2em] font-mono text-3xl"
                placeholder="••••••••"
                required
              />
            </div>
            
            {error && (
              <div className="py-8 animate-[shake_0.4s_ease-in-out] px-4">
                <p className="text-red-500/80 text-[11px] text-center font-black tracking-[0.3em] uppercase border border-red-500/20 py-4 rounded-2xl bg-red-500/5">
                  Link Error: {error}
                </p>
              </div>
            )}
            
            <div className="px-4 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-gold disabled:bg-gray-400 disabled:cursor-not-allowed font-black py-10 px-8 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-6 group"
              >
                <span className="tracking-[0.6em] uppercase text-[12px] lg:text-sm">
                  {loading ? 'Authenticating...' : 'Initiate Handshake'}
                </span>
                {!loading && <span className="group-hover:translate-x-4 transition-transform duration-700 text-2xl">→</span>}
              </button>
            </div>
          </form>
          
          <div className="mt-32 flex flex-col items-center gap-4 opacity-20">
            <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-white to-transparent" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen nexus-dashboard-root flex overflow-hidden">
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        data={data} 
        setActiveTab={setActiveTab} 
      />
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col relative shrink-0">
        <div className="p-10 mb-2">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-black font-black text-sm">CP</div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-white">Capita Prime</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gold/40 rounded-full animate-pulse" />
            <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Admin Terminal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="px-6 mb-4 text-[9px] text-gray-600 font-black tracking-widest uppercase opacity-40">Main Menu</p>
          <SidebarItem id="dashboard" label="Nexus Overview" icon="🛰️" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="assets" label="Asset Inventory" icon="📦" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="offers" label="Offers Matrix" icon="🏷️" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="content" label="Site Architect" icon="🏗️" activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="h-[1px] bg-white/5 my-8 mx-6" />
          
          <p className="px-6 mb-4 text-[9px] text-gray-600 font-black tracking-widest uppercase opacity-40">Relays</p>
          <SidebarItem id="services" label="Matrix Node" icon="⚙️" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="testimonials" label="Echo Streams" icon="📡" activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarItem id="theme" label="Theme Pulsar" icon="🎨" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl mb-4">
            <SystemClock />
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-4 text-[10px] font-black text-red-500/60 hover:text-white hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest border border-red-500/5"
          >
            System Logoff
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Superior Header */}
        <header className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-black">
          <div>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-white mb-1">
              {activeTab === 'dashboard' ? 'Nexus Console' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gold font-bold tracking-widest uppercase bg-gold/5 px-3 py-0.5 rounded-full border border-gold/10">Live Production Node</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center bg-white/[0.03] border border-white/5 rounded-full px-6 py-2.5 w-72 focus-within:border-gold/20 transition-all">
              <span className="text-gray-500 mr-3 text-sm">🔍</span>
              <input 
                placeholder="Global Node Search..." 
                className="bg-transparent border-none outline-none text-[11px] font-bold w-full text-white placeholder:text-gray-700"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 hover:bg-white/5 rounded-xl transition-all group">
                <span className="text-xl">🔔</span>
                <span className="absolute top-3 right-3 w-2 h-2 bg-gold rounded-full border-2 border-black" />
              </button>
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-black text-gray-500">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="w-full">
            {activeTab === 'dashboard' && <DashboardView data={data} setActiveTab={setActiveTab} />}
            {activeTab === 'assets' && <AssetsView />}
            {activeTab === 'offers' && (
              <OffersView
                offers={data.offers}
                popupSettings={data.popupSettings}
                addOffer={addOffer}
                updateOffer={updateOffer}
                deleteOffer={deleteOffer}
                updatePopupSettings={updatePopupSettings}
              />
            )}
            {activeTab === 'content' && <ContentView data={data} updateData={updateData} />}
            {activeTab === 'services' && (
              <ServicesView 
                services={data.services} 
                addService={addService}
                updateService={updateService}
                deleteService={deleteService}
              />
            )}
            {activeTab === 'testimonials' && (
              <TestimonialsView 
                testimonials={data.testimonials} 
                addTestimonial={addTestimonial}
                updateTestimonial={updateTestimonial}
                deleteTestimonial={deleteTestimonial}
              />
            )}
            {activeTab === 'theme' && <ThemeView />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
