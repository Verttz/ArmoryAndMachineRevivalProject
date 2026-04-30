import type { ResourceDefinition } from '../types';

/**
 * Data-driven resource definitions.
 * Add new resources here without touching any engine or UI code.
 */
export const RESOURCE_DEFINITIONS: ResourceDefinition[] = [
  {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'Raw iron ore mined from the earth.',
    initialAmount: 0,
    cap: 1000,
    baseRate: 1,
    unlockId: undefined,
  },
  {
    id: 'coal',
    name: 'Coal',
    description: 'Fuel used to smelt metals.',
    initialAmount: 0,
    cap: 500,
    baseRate: 0.5,
    unlockId: undefined,
  },
  {
    id: 'iron_ingot',
    name: 'Iron Ingot',
    description: 'Smelted iron bars ready for crafting.',
    initialAmount: 0,
    cap: 500,
    baseRate: 0,
    unlockId: 'unlock_smelter',
  },
  {
    id: 'steel_plate',
    name: 'Steel Plate',
    description: 'High-quality steel plates used for advanced machinery.',
    initialAmount: 0,
    cap: 200,
    baseRate: 0,
    unlockId: 'unlock_forge',
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Precious metal — currency and high-tier crafting material.',
    initialAmount: 0,
    cap: 9999,
    baseRate: 0,
    unlockId: 'unlock_gold_mine',
  },
];
