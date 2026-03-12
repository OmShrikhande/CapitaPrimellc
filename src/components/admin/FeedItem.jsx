import React from 'react';

const FeedItem = ({ time, msg, type }) => (
  <div className="flex gap-5 group items-start">
    <span className="text-gray-700 shrink-0 font-bold opacity-60">{time}</span>
    <span className={`
      ${type === 'success' ? 'text-green-500/90' : ''}
      ${type === 'warn' ? 'text-gold/90' : ''}
      ${type === 'info' ? 'text-blue-400/90' : ''}
      group-hover:text-white transition-colors leading-relaxed
    `}>
      {msg}
    </span>
  </div>
);

export default FeedItem;
