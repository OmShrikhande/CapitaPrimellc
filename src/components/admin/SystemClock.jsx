import React, { useState, useEffect } from 'react';

const SystemClock = () => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const upTimer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => { clearInterval(timer); clearInterval(upTimer); };
  }, []);

  const formatUptime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div className="space-y-1 font-mono">
      <p className="text-xl font-bold text-white tracking-tighter">
        {time.toLocaleTimeString([], { hour12: false })}
      </p>
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 bg-gold rounded-full animate-ping" />
        <p className="text-[8px] text-gray-500 uppercase tracking-widest">Uptime: {formatUptime(uptime)}</p>
      </div>
    </div>
  );
};

export default SystemClock;
