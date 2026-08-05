import React, { useState } from 'react';
import { CHARACTER_CLASSES } from '../data/classes';
import { CharacterClassId, MetaUpgrades } from '../types';
import { Shield, Wand2, Zap, Sun, Sparkles, Play, Trophy, Server } from 'lucide-react';

interface ClassSelectModalProps {
  onStartGame: (classId: CharacterClassId, name: string) => void;
  onOpenLeaderboard: () => void;
  onOpenMetaUpgrades: () => void;
  metaUpgrades: MetaUpgrades;
  soulShards: number;
}

export const ClassSelectModal: React.FC<ClassSelectModalProps> = ({
  onStartGame,
  onOpenLeaderboard,
  onOpenMetaUpgrades,
  metaUpgrades,
  soulShards
}) => {
  const [selectedClass, setSelectedClass] = useState<CharacterClassId>('warrior');
  const [playerName, setPlayerName] = useState<string>('Valerius');

  const icons: Record<CharacterClassId, React.ReactNode> = {
    warrior: <Shield className="w-6 h-6 text-amber-400" />,
    mage: <Wand2 className="w-6 h-6 text-cyan-400" />,
    rogue: <Zap className="w-6 h-6 text-emerald-400" />,
    paladin: <Sun className="w-6 h-6 text-yellow-400" />,
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    onStartGame(selectedClass, playerName.trim());
  };

  const currentClassInfo = CHARACTER_CLASSES[selectedClass];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-900/60 rounded-3xl w-full max-w-4xl p-6 shadow-2xl flex flex-col gap-6 my-auto">
        {/* Banner Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-950/80 border border-amber-800/80 px-4 py-1 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" /> Procedural Roguelike Dungeon Crawler
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
            Dungeon Artifacts: Roguelike Explorer
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
            Choose your hero class, brave procedural catacombs, defeat formidable monsters, and extract mythic artifacts for everlasting glory.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Player Name Input */}
          <div className="max-w-md mx-auto">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 text-center">
              Adventurer Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Hero Name..."
              maxLength={20}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-center font-bold text-amber-300 text-sm outline-none transition"
            />
          </div>

          {/* Class Selection Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Select Character Class
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.values(CHARACTER_CLASSES).map((cls) => {
                const isSelected = selectedClass === cls.id;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-950/80 to-slate-900 border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          {icons[cls.id]}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-100 text-sm mb-1">{cls.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">{cls.description}</p>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono border-t border-slate-800/80 pt-2 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">HP / MP:</span>
                        <span className="text-red-400 font-bold">{cls.baseHp + metaUpgrades.healthLevel * 15}</span> / <span className="text-blue-400 font-bold">{cls.baseMp + metaUpgrades.manaLevel * 10}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Attack:</span>
                        <span className="text-amber-400 font-bold">{cls.baseAttack + metaUpgrades.attackLevel * 2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Defense:</span>
                        <span className="text-emerald-400 font-bold">{cls.baseDefense}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Bar & Meta Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenMetaUpgrades}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Meta Upgrades ({soulShards} Shards)</span>
              </button>

              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold flex items-center gap-2 transition"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Leaderboard</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Dungeon Floor 1</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
