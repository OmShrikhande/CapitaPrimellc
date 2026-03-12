import React from 'react';
import Sparkline from './Sparkline';

const StatCard = ({ label, value, color, icon, trend, isStatus }) => {
  const colorMap = {
    gold: 'bg-[#c5a059]/10 text-[#c5a059]',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    green: 'bg-green-500/10 text-green-400'
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-8 hover:border-gold/30 transition-all group relative overflow-hidden shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10 ${colorMap[color] || colorMap.gold}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 uppercase tracking-[0.2em] border border-white/5">
            {trend}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <p className={`text-4xl font-serif font-bold tracking-tighter ${isStatus ? 'text-gold stat-value-glow-gold' : 'text-white stat-value-glow'}`}>{value}</p>
        <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.3em] opacity-40">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
