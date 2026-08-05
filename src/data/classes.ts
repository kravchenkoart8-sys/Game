import { CharacterClass } from '../types';

export const CHARACTER_CLASSES: Record<string, CharacterClass> = {
  warrior: {
    id: 'warrior',
    name: 'Ironclad Vanguard',
    description: 'A heavily armored warrior specialized in melee cleaves, high health, and crushing shield stuns.',
    baseHp: 120,
    baseMp: 40,
    baseAttack: 16,
    baseDefense: 8,
    baseSpeed: 10,
    baseCrit: 8,
    icon: 'Shield',
    primaryColor: 'from-amber-600 to-red-700',
    startingSkill: 'shield_bash'
  },
  mage: {
    id: 'mage',
    name: 'Arcane Pyromancer',
    description: 'Wielder of devastating elemental magic, area explosion spells, and emergency mana shields.',
    baseHp: 75,
    baseMp: 120,
    baseAttack: 8,
    baseDefense: 3,
    baseSpeed: 12,
    baseCrit: 12,
    icon: 'Wand2',
    primaryColor: 'from-cyan-600 to-blue-700',
    startingSkill: 'fireball'
  },
  rogue: {
    id: 'rogue',
    name: 'Shadow Stalker',
    description: 'A agile assassin with high critical strike chances, lethal poison blades, and shadow steps.',
    baseHp: 90,
    baseMp: 60,
    baseAttack: 18,
    baseDefense: 4,
    baseSpeed: 16,
    baseCrit: 22,
    icon: 'Dagger',
    primaryColor: 'from-emerald-600 to-teal-800',
    startingSkill: 'poison_strike'
  },
  paladin: {
    id: 'paladin',
    name: 'Dawnseeker Templar',
    description: 'A holy crusader balancing physical prowess with divine healing and radiant holy judgement.',
    baseHp: 110,
    baseMp: 70,
    baseAttack: 14,
    baseDefense: 7,
    baseSpeed: 11,
    baseCrit: 10,
    icon: 'Sun',
    primaryColor: 'from-amber-400 to-yellow-600',
    startingSkill: 'holy_smite'
  }
};
