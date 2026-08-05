import React, { useRef, useEffect } from 'react';
import { GameLog } from '../types';
import { ScrollText } from 'lucide-react';

interface CombatLogProps {
  logs: GameLog[];
}

export const CombatLog: React.FC<CombatLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type: GameLog['type']) => {
    switch (type) {
      case 'combat':
        return 'text-red-400';
      case 'loot':
        return 'text-amber-300 font-semibold';
      case 'danger':
        return 'text-rose-400 font-bold';
      case 'level':
        return 'text-purple-300 font-bold';
      case 'shrine':
        return 'text-cyan-300';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="w-full bg-slate-950/90 rounded-2xl border border-slate-800 p-3 h-36 flex flex-col shadow-inner backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2 border-b border-slate-800 pb-1 shrink-0">
        <ScrollText className="w-3.5 h-3.5 text-amber-500" />
        <span>Dungeon Chronicles & Combat Log</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs pr-2">
        {logs.map((log) => (
          <div key={log.id} className={`flex items-start gap-2 ${getLogColor(log.type)}`}>
            <span className="text-[10px] text-slate-600 select-none shrink-0">[{log.timestamp}]</span>
            <span className="leading-tight">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
