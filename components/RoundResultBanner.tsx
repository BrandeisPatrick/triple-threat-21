import React from 'react';
import type { RoundWinner } from '../types';

interface RoundResultBannerProps {
  winner: Exclude<RoundWinner, null>;
}

const bannerConfig = {
  Player: {
    text: "You Win The Round!",
    gradient: "from-amber-400 to-yellow-500",
    shadow: "shadow-yellow-500/40",
    icon: "🏆"
  },
  AI: {
    text: "AI Wins The Round",
    gradient: "from-red-600 to-rose-800",
    shadow: "shadow-rose-500/40",
    icon: "🤖"
  },
  Draw: {
    text: "It's a Draw!",
    gradient: "from-slate-500 to-slate-700",
    shadow: "shadow-slate-500/40",
    icon: "🤝"
  }
};

export const RoundResultBanner: React.FC<RoundResultBannerProps> = ({ winner }) => {
  const config = bannerConfig[winner];

  return (
    <div className="my-8 text-center animate-fade-in-scale">
      <div className={`inline-block px-8 py-4 rounded-xl bg-gradient-to-br ${config.gradient} shadow-2xl ${config.shadow}`}>
        <h2 className="text-3xl font-black text-white tracking-wider">
          <span className="mr-4">{config.icon}</span>
          {config.text}
        </h2>
      </div>
    </div>
  );
};
