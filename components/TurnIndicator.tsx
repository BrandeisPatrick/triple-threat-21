import React from 'react';

interface TurnIndicatorProps {
  roundNumber: number;
  turnPhase: 'PLAYER' | 'AI' | 'ROUND_OVER' | 'PREPARING';
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ roundNumber, turnPhase }) => {
  const getTurnInfo = () => {
    switch (turnPhase) {
      case 'PLAYER':
        return { text: "Your Turn", className: "text-cyan-400 animate-pulse" };
      case 'AI':
        return { text: "AI's Turn", className: "text-fuchsia-400" };
      case 'ROUND_OVER':
        return { text: "Round Over", className: "text-amber-400" };
      case 'PREPARING':
        return { text: "Preparing round...", className: "text-slate-400" };
      default:
        return { text: "", className: "" };
    }
  };

  const turnInfo = getTurnInfo();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center px-2 sm:px-4">
             <div className="text-base sm:text-lg font-bold text-slate-300">
                Round <span className="text-white">{roundNumber}</span>
             </div>
             <div key={turnInfo.text} className={`text-lg sm:text-xl font-extrabold tracking-wider animate-fade-in-down ${turnInfo.className}`}>
                {turnInfo.text}
             </div>
        </div>
    </div>
  );
};