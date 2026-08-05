import React from 'react';
import { HeroState, Skill } from '../types';
import { CHARACTER_CLASSES } from '../data/classes';
import { soundFX } from '../utils/audio';
import { 
  Shield, Heart, Zap, Sparkles, Coins, Gem, 
  Backpack, BookOpen, Trophy, Volume2, VolumeX, Flame, Skull
} from 'lucide-react';

interface HUDProps {
  hero: HeroState;
  currentDepth: number;
  biome: string;
  onOpenInventory: () => void;
  onOpenCodex: () => void;
  onOpenLeaderboard: () => void;
  onOpenMetaUpgrades: () => void;
  onUseSkill: (skill: Skill) => void;
  selectedSkill: Skill | null;
  turnCount: number;
}

export const HUD: React.FC<HUDProps> = ({
  hero,
  currentDepth,
  biome,
  onOpenInventory,
  onOpenCodex,
  onOpenLeaderboard,
  onOpenMetaUpgrades,
  onUseSkill,
  selectedSkill,
  turnCount
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const heroClass = CHARACTER_CLASSES[hero.classId] || CHARACTER_CLASSES.warrior;

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
  };

  const hpPercent = Math.max(0, Math.min(100, (hero.hp / hero.maxHp) * 100));
  const mpPercent = Math.max(0, Math.min(100, (hero.mp / hero.maxMp) * 100));
  const xpPercent = Math.max(0, Math.min(100, (hero.exp / hero.maxExp) * 100));

  return (
    <div className="w-full bg-slate-950/90 border-b border-amber-900/40 text-slate-100 p-3 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Hero Stats & Class Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${heroClass.primaryColor} flex items-center justify-center font-bold text-lg shadow-lg border border-amber-400/30 shrink-0`}>
          Lv.{hero.level}
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-amber-300 flex items-center gap-1">
              {hero.name} <span className="text-slate-400 text-[10px]">({heroClass.name})</span>
            </span>
            <span className="text-slate-400 font-mono text-[10px]">Turn #{turnCount}</span>
          </div>

          {/* HP Bar */}
          <div className="w-full h-3.5 bg-slate-900 rounded-md overflow-hidden border border-red-900/50 mb-1 relative">
            <div 
              className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-300"
              style={{ width: `${hpPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
              HP: {hero.hp}/{hero.maxHp}
            </span>
          </div>

          {/* MP Bar */}
          <div className="w-full h-2.5 bg-slate-900 rounded-md overflow-hidden border border-blue-900/50 relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-700 to-cyan-500 transition-all duration-300"
              style={{ width: `${mpPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow">
              MP: {hero.mp}/{hero.maxMp}
            </span>
          </div>
        </div>
      </div>

      {/* EXP & Dungeon Location Info */}
      <div className="flex items-center justify-around md:justify-center gap-6 w-full md:w-auto text-xs bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
        <div className="text-center">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Depth / Biome</div>
          <div className="font-bold text-amber-400 flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Floor {currentDepth} • <span className="text-slate-200">{biome}</span>
          </div>
        </div>

        <div className="text-center border-x border-slate-800 px-4">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">EXP Progress</div>
          <div className="font-bold text-purple-400">{hero.exp}/{hero.maxExp}</div>
          <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 mx-auto">
            <div className="h-full bg-purple-500" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{hero.gold}</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-300 font-bold">
            <Gem className="w-4 h-4 text-cyan-400" />
            <span>{hero.soulShards}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons & Audio Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenInventory}
          className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition"
          title="Open Equipment & Inventory (I)"
        >
          <Backpack className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Inventory</span>
          {hero.inventory.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center">
              {hero.inventory.length}
            </span>
          )}
        </button>

        <button
          onClick={onOpenCodex}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition"
          title="Artifact Codex (C)"
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Codex</span>
        </button>

        <button
          onClick={onOpenMetaUpgrades}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition"
          title="Soul Shard Upgrades (U)"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Upgrades</span>
        </button>

        <button
          onClick={onOpenLeaderboard}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition"
          title="Leaderboards (L)"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={handleToggleSound}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>
    </div>
  );
};
