import { Skill } from '../types';

export const ALL_SKILLS: Record<string, Skill> = {
  shield_bash: {
    id: 'shield_bash',
    name: 'Shield Bash',
    mpCost: 10,
    cooldown: 3,
    currentCooldown: 0,
    range: 1,
    targetType: 'single_enemy',
    damageMultiplier: 1.4,
    effectType: 'stun',
    description: 'Slams target with shield for 140% damage and stuns them for 1 turn.',
    icon: 'ShieldAlert'
  },
  whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind Blade',
    mpCost: 20,
    cooldown: 4,
    currentCooldown: 0,
    range: 1,
    targetType: 'area_enemy',
    damageMultiplier: 1.2,
    description: 'Spins around dealing 120% weapon damage to all adjacent enemies.',
    icon: 'Swords'
  },
  fireball: {
    id: 'fireball',
    name: 'Flame Blast',
    mpCost: 18,
    cooldown: 2,
    currentCooldown: 0,
    range: 4,
    targetType: 'single_enemy',
    damageMultiplier: 2.1,
    effectType: 'burn',
    description: 'Hurls a fiery orb inflicting 210% magic damage and ignites target.',
    icon: 'Flame'
  },
  teleport: {
    id: 'teleport',
    name: 'Arcane Shift',
    mpCost: 25,
    cooldown: 5,
    currentCooldown: 0,
    range: 3,
    targetType: 'self',
    damageMultiplier: 0,
    effectType: 'teleport',
    description: 'Teleports hero up to 3 tiles in targeted walkable direction.',
    icon: 'Sparkles'
  },
  poison_strike: {
    id: 'poison_strike',
    name: 'Viper Blade',
    mpCost: 12,
    cooldown: 2,
    currentCooldown: 0,
    range: 1,
    targetType: 'single_enemy',
    damageMultiplier: 1.6,
    effectType: 'poison',
    description: 'Coats dagger in venom, dealing 160% damage and applying 3 turns of poison.',
    icon: 'Skull'
  },
  shadow_step: {
    id: 'shadow_step',
    name: 'Shadow Dash',
    mpCost: 15,
    cooldown: 4,
    currentCooldown: 0,
    range: 3,
    targetType: 'self',
    damageMultiplier: 0,
    effectType: 'dash',
    description: 'Dashes forward, gaining 50% extra evasion for 2 turns.',
    icon: 'Zap'
  },
  holy_smite: {
    id: 'holy_smite',
    name: 'Radiant Smite',
    mpCost: 15,
    cooldown: 3,
    currentCooldown: 0,
    range: 2,
    targetType: 'single_enemy',
    damageMultiplier: 1.8,
    healAmount: 15,
    description: 'Strikes target with holy light for 180% damage and heals self for 15 HP.',
    icon: 'Sun'
  },
  divine_shield: {
    id: 'divine_shield',
    name: 'Aegis of Light',
    mpCost: 30,
    cooldown: 6,
    currentCooldown: 0,
    range: 0,
    targetType: 'self',
    damageMultiplier: 0,
    effectType: 'shield',
    description: 'Erects a holy barrier absorbing up to 50 damage for 3 turns.',
    icon: 'ShieldCheck'
  }
};
