import React from 'react';
import { Merchant, HeroState } from '../types';
import { RARITY_COLORS } from '../data/artifacts';
import { X, Coins, ShoppingBag, Heart, Zap } from 'lucide-react';

interface MerchantModalProps {
  merchant: Merchant;
  hero: HeroState;
  onBuyItem: (index: number) => void;
  onBuyPotion: (type: 'hp' | 'mp', price: number) => void;
  onClose: () => void;
}

export const MerchantModal: React.FC<MerchantModalProps> = ({
  merchant,
  hero,
  onBuyItem,
  onBuyPotion,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-900/60 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧙‍♂️</span>
            <h2 className="text-lg font-bold text-emerald-300">
              Gimble's Wandering Dungeon Market
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{hero.gold} Gold</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Potions Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-red-300">Healing Elixir</div>
                  <div className="text-xs text-slate-400">Instantly restores +50 HP.</div>
                </div>
              </div>

              <button
                disabled={hero.gold < 25}
                onClick={() => onBuyPotion('hp', 25)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  hero.gold >= 25
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Coins className="w-3.5 h-3.5" /> 25g
              </button>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-300">Mana Potion</div>
                  <div className="text-xs text-slate-400">Instantly restores +40 MP.</div>
                </div>
              </div>

              <button
                disabled={hero.gold < 20}
                onClick={() => onBuyPotion('mp', 20)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  hero.gold >= 20
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Coins className="w-3.5 h-3.5" /> 20g
              </button>
            </div>
          </div>

          {/* Merchant Artifacts Catalog */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Rare Dungeon Wares
            </h3>

            {merchant.items.map((item, idx) => {
              const art = item.artifact;
              const rarityStyle = RARITY_COLORS[art.rarity];
              const canAfford = hero.gold >= item.price;

              return (
                <div
                  key={art.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
                    item.purchased
                      ? 'bg-slate-950/40 border-slate-800/50 opacity-40'
                      : `${rarityStyle.bg} ${rarityStyle.border}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <ShoppingBag className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${rarityStyle.text}`}>
                        {art.name}
                      </div>
                      <div className="text-xs text-slate-400 italic">"{art.lore}"</div>
                    </div>
                  </div>

                  <button
                    disabled={item.purchased || !canAfford}
                    onClick={() => onBuyItem(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                      item.purchased
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-default'
                        : canAfford
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {item.purchased ? (
                      'SOLD OUT'
                    ) : (
                      <>
                        <Coins className="w-4 h-4" /> {item.price}g
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
