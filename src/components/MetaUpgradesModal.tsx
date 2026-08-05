import React from 'react';
import { MetaUpgrades } from '../types';
import { X, Sparkles, Heart, Zap, Sword, Coins, Gem, ArrowUpCircle } from 'lucide-react';

interface MetaUpgradesModalProps {
  soulShards: number;
  upgrades: MetaUpgrades;
  onUpgrade: (type: keyof MetaUpgrades, cost: number) => void;
  onClose: () => void;
}

export const MetaUpgradesModal: React.FC<MetaUpgradesModalProps> = ({
  soulShards,
  upgrades,
  onUpgrade,
  onClose
}) => {
  const upgradeDefinitions = [
    {
      key: 'healthLevel' as keyof MetaUpgrades,
      name: 'Titan Vitality',
      description: '+15 Permanent Base Max HP for all future runs.',
      icon: <Heart className="w-5 h-5 text-red-400" />,
      currentBonus: `+${upgrades.healthLevel * 15} HP`,
      cost: (upgrades.healthLevel + 1) * 15,
    },
    {
      key: 'manaLevel' as keyof MetaUpgrades,
      name: 'Arcane Mastery',
      description: '+10 Permanent Base Max MP for all future runs.',
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      currentBonus: `+${upgrades.manaLevel * 10} MP`,
      cost: (upgrades.manaLevel + 1) * 15,
    },
    {
      key: 'attackLevel' as keyof MetaUpgrades,
      name: 'Demon Slayer Blade',
      description: '+2 Permanent Base Attack Damage.',
      icon: <Sword className="w-5 h-5 text-amber-400" />,
      currentBonus: `+${upgrades.attackLevel * 2} Attack`,
      cost: (upgrades.attackLevel + 1) * 20,
    },
    {
      key: 'startingGoldLevel' as keyof MetaUpgrades,
      name: 'Mercenary Purse',
      description: '+25 Starting Gold on new run spawns.',
      icon: <Coins className="w-5 h-5 text-yellow-400" />,
      currentBonus: `+${upgrades.startingGoldLevel * 25} Gold`,
      cost: (upgrades.startingGoldLevel + 1) * 10,
    },
    {
      key: 'luckLevel' as keyof MetaUpgrades,
      name: 'Fortune Aura',
      description: '+5% Rare & Epic Artifact Drop Rates from chests.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      currentBonus: `+${upgrades.luckLevel * 5}% Luck`,
      cost: (upgrades.luckLevel + 1) * 25,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-900/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-cyan-300">
              Soul Shards Meta Sanctuary
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-cyan-950 border border-cyan-800 px-3 py-1 rounded-full text-xs font-bold text-cyan-300">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span>{soulShards} Soul Shards</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upgrades List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {upgradeDefinitions.map((item) => {
            const currentLevel = upgrades[item.key];
            const canAfford = soulShards >= item.cost;

            return (
              <div
                key={item.key}
                className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      {item.name}
                      <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                        Lv. {currentLevel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      Current Effect: {item.currentBonus}
                    </div>
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => onUpgrade(item.key, item.cost)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                    canAfford
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-lg'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{item.cost} Shards</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
