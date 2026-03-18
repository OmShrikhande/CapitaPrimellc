import React from 'react';
import Globe from './Globe';
import StatCard from './StatCard';
import FeedItem from './FeedItem';

const DashboardView = ({ data, setActiveTab }) => {
  const getLength = (val) => {
    if (!val) return 0;
    if (Array.isArray(val)) return val.length;
    if (val.items && Array.isArray(val.items)) return val.items.length;
    return 0;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 w-full">
      {/* Key Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-10">
        <StatCard label="Global Assets" value={getLength(data.properties)} color="gold" icon="🏗️" trend="+12.4%" />
        <StatCard label="Matrix Nodes" value={getLength(data.services)} color="gold" icon="⚡" trend="Optimal" />
        <StatCard label="Echo Base" value={getLength(data.testimonials)} color="gold" icon="💎" trend="+5.2%" />
        <StatCard label="System Integrity" value="ENCRYPTED" color="gold" icon="🛡️" trend="99.9%" isStatus />
      </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      {/* Globe Section */}
      <div className="xl:col-span-8 bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group hover:border-gold/20 transition-all shadow-2xl min-h-[600px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-0 right-0 p-12 z-20 text-right">
          <h3 className="text-4xl font-serif font-bold text-white mb-2 tracking-tighter uppercase">Nexus Network</h3>
          <p className="text-gold/60 text-[11px] font-black tracking-[0.4em] uppercase opacity-80">Global Node Infrastructure</p>
          <div className="mt-10 flex justify-end items-center gap-4">
            <span className="text-[11px] text-gray-600 font-black uppercase tracking-widest">Active Relay: Dubai</span>
            <div className="w-3 h-3 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#c5a059]" />
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center scale-[1.2] pointer-events-none group-hover:scale-[1.25] transition-transform duration-1000 z-0">
          <Globe />
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex flex-col sm:flex-row justify-between items-center gap-8 z-20">
          <div className="flex gap-6 w-full sm:w-auto">
            <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl flex-1 sm:flex-none min-w-[180px]">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 opacity-60">Active Visitors</p>
              <p className="text-3xl font-bold font-mono tracking-tighter text-white">1,284</p>
            </div>
            <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl flex-1 sm:flex-none min-w-[180px]">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 opacity-60">Node Latency</p>
              <p className="text-3xl font-bold font-mono tracking-tighter text-gold">24ms</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('properties')}
            className="w-full sm:w-auto bg-gold text-black px-12 py-6 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl font-sans"
          >
            Access Asset Registry
          </button>
        </div>
      </div>

      {/* System Feed */}
      <div className="xl:col-span-4 bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 flex flex-col h-full hover:border-gold/20 transition-all shadow-2xl">
        <div className="flex justify-between items-center mb-12">
          <h3 className="text-2xl font-serif font-bold tracking-tight text-white">Intelligence Feed</h3>
          <span className="text-[10px] font-black text-gold bg-gold/5 px-4 py-2 rounded-full tracking-widest uppercase border border-gold/10">Live Node</span>
        </div>
        
        <div className="flex-1 space-y-10 font-mono text-[11px] opacity-80 text-gray-300">
          <FeedItem time="14:22:01" msg="Asset 'L-01' metadata synchronized" type="info" />
          <FeedItem time="14:15:44" msg="New Testimonial - Verification pending" type="warn" />
          <FeedItem time="13:58:12" msg="Nexus Database handshake established" type="success" />
          <FeedItem time="13:45:30" msg="Visitor session spike - UAE Node" type="info" />
          <FeedItem time="13:12:05" msg="SSL Certificate verified - Core Secure" type="success" />
          <FeedItem time="12:45:10" msg="System architecture update deployed" type="success" />
        </div>

        <div className="mt-12 pt-10 border-t border-white/5">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest opacity-60">Resource Distribution</span>
            <span className="text-sm text-gold font-mono font-bold">24%</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-gold h-full w-[24%] rounded-full shadow-[0_0_20px_#c5a059]" />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardView;
