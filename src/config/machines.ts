import type { MachineDefinition } from '../types';

/**
 * Data-driven machine definitions.
 * Add new machines here without touching any engine or UI code.
 */
export const MACHINE_DEFINITIONS: MachineDefinition[] = [
  {
    id: 'iron_mine',
    name: 'Iron Mine',
    description: 'Automatically excavates iron ore each tick.',
    inputs: [],
    outputs: [{ resourceId: 'iron_ore', amount: 2 }],
    unlockId: undefined,
    maxCount: 10,
    baseCost: [{ resourceId: 'iron_ore', amount: 20 }],
  },
  {
    id: 'coal_mine',
    name: 'Coal Mine',
    description: 'Automatically extracts coal each tick.',
    inputs: [],
    outputs: [{ resourceId: 'coal', amount: 1 }],
    unlockId: undefined,
    maxCount: 10,
    baseCost: [{ resourceId: 'iron_ore', amount: 30 }],
  },
  {
    id: 'smelter',
    name: 'Iron Smelter',
    description: 'Converts iron ore + coal into iron ingots each tick.',
    inputs: [
      { resourceId: 'iron_ore', amount: 2 },
      { resourceId: 'coal', amount: 1 },
    ],
    outputs: [{ resourceId: 'iron_ingot', amount: 1 }],
    unlockId: 'unlock_smelter',
    maxCount: 5,
    baseCost: [
      { resourceId: 'iron_ore', amount: 100 },
      { resourceId: 'coal', amount: 50 },
    ],
  },
  {
    id: 'forge',
    name: 'Steel Forge',
    description: 'Converts iron ingots + coal into steel plates each tick.',
    inputs: [
      { resourceId: 'iron_ingot', amount: 3 },
      { resourceId: 'coal', amount: 2 },
    ],
    outputs: [{ resourceId: 'steel_plate', amount: 1 }],
    unlockId: 'unlock_forge',
    maxCount: 3,
    baseCost: [
      { resourceId: 'iron_ingot', amount: 50 },
      { resourceId: 'coal', amount: 100 },
    ],
  },
  {
    id: 'gold_mine',
    name: 'Gold Mine',
    description: 'Extracts precious gold ore each tick.',
    inputs: [],
    outputs: [{ resourceId: 'gold', amount: 1 }],
    unlockId: 'unlock_gold_mine',
    maxCount: 5,
    baseCost: [
      { resourceId: 'steel_plate', amount: 20 },
      { resourceId: 'iron_ingot', amount: 30 },
    ],
  },
];
