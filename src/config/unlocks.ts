import type { UnlockDefinition } from '../types';

/**
 * Data-driven unlock definitions.
 * Add new unlock gates here without touching any engine or UI code.
 */
export const UNLOCK_DEFINITIONS: UnlockDefinition[] = [
  {
    id: 'unlock_smelter',
    name: 'Basic Metallurgy',
    description: 'Unlocks the Iron Smelter machine and Iron Ingots.',
    conditions: [
      { type: 'resource_gte', resourceId: 'iron_ore', value: 50 },
      { type: 'resource_gte', resourceId: 'coal', value: 25 },
    ],
  },
  {
    id: 'unlock_forge',
    name: 'Advanced Forging',
    description: 'Unlocks the Steel Forge and Steel Plates.',
    conditions: [
      { type: 'resource_gte', resourceId: 'iron_ingot', value: 20 },
    ],
  },
  {
    id: 'unlock_gold_mine',
    name: 'Precious Metals',
    description: 'Unlocks the Gold Mine and Gold resource.',
    conditions: [
      { type: 'resource_gte', resourceId: 'steel_plate', value: 10 },
    ],
  },
];
