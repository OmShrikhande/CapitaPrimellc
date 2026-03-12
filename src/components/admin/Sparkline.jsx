import React from 'react';

const Sparkline = ({ color }) => {
  const points = [10, 40, 30, 60, 40, 80, 50, 90, 70, 100];
  const path = points.map((p, i) => `${i * 10},${100 - p}`).join(' L ');
  
  return (
    <svg className="w-24 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-700" viewBox="0 0 90 100">
      <path
        d={`M ${path}`}
        fill="none"
        stroke={color === 'gold' ? '#c5a059' : color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-[dash_2s_ease-in-out_infinite]"
      />
    </svg>
  );
};

export default Sparkline;
