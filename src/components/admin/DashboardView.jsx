import React from 'react';
import Globe from './Globe';
import StatCard from './StatCard';
import FeedItem from './FeedItem';

const DashboardView = ({ data, setActiveTab }) => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
    {/* Key Matrix */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      <StatCard label="Global Assets" value={data.properties.length} color="gold" icon="🏗️" trend="+12.4%" />
      <StatCard label="Matrix Nodes" value={data.services.length} color="blue" icon="⚡" trend="Optimal" />
      <StatCard label="Echo Base" value={data.testimonials.length} color="purple" icon="💎" trend="+5.2%" />
      <StatCard label="System Integrity" value="ENCRYPTED" color="green" icon="🛡️" trend="99.9%" isStatus />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Globe Section */}
      <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden group hover:border-white/10 transition-colors shadow-2xl">
        <div className="absolute top-0 right-0 p-12 z-10 text-right">
          <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-tighter uppercase">Nexus Network</h3>
          <p className="text-gold/60 text-[11px] font-black tracking-[0.4em] uppercase opacity-80">Global Node Infrastructure</p>
          <div className="mt-10 flex justify-end items-center gap-4">
            <span className="text-[11px] text-gray-600 font-black uppercase tracking-widest">Active Relay: Dubai</span>
            <div className="w-3 h-3 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#c5a059]" />
          </div>
        </div>
        
        <div className="flex items-center justify-center -my-32 -mx-10 scale-[1.1] pointer-events-none group-hover:scale-[1.15] transition-transform duration-1000">
          <Globe />
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-10">
          <div className="flex gap-8">
            <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 opacity-60">Active Visitors</p>
              <p className="text-3xl font-bold font-mono tracking-tighter text-white">1,284</p>
            </div>
            <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 opacity-60">Node Latency</p>
              <p className="text-3xl font-bold font-mono tracking-tighter text-gold">24ms</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('properties')}
            className="bg-gold text-black px-10 py-5 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl font-sans"
          >
            Access Asset Registry
          </button>
        </div>
      </div>

      {/* System Feed */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 flex flex-col h-full hover:border-white/10 transition-colors shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-2xl font-serif font-bold tracking-tight text-white">Intelligence Feed</h3>
          <span className="text-[10px] font-black text-gold bg-gold/5 px-4 py-2 rounded-full tracking-widest uppercase border border-gold/10">Live Node</span>
        </div>
        
        <div className="flex-1 space-y-8 font-mono text-[11px] opacity-80 text-gray-300">
          <FeedItem time="14:22:01" msg="Asset 'L-01' metadata synchronized" type="info" />
          <FeedItem time="14:15:44" msg="New Testimonial - Verification pending" type="warn" />
          <FeedItem time="13:58:12" msg="Nexus Database handshake established" type="success" />
          <FeedItem time="13:45:30" msg="Visitor session spike - UAE Node" type="info" />
          <FeedItem time="13:12:05" msg="SSL Certificate verified - Core Secure" type="success" />
        </div>

        <div className="mt-12 pt-10 border-t border-white/5">
          <div className="flex justify-between items-center mb-5">
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

export default DashboardView;
