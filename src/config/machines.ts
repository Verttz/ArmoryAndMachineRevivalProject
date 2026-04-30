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
      {
        id: 'energy_reactor',
        name: 'Energy Reactor',
        description: 'Converts gold into compact energy cells each tick.',
        inputs: [{ resourceId: 'gold', amount: 1 }],
        outputs: [{ resourceId: 'energy_cell', amount: 2 }],
        unlockId: 'unlock_energy_tech',
        maxCount: 4,
        baseCost: [
          { resourceId: 'gold', amount: 15 },
          { resourceId: 'steel_plate', amount: 25 },
        ],
      },
      {
        id: 'component_assembler',
        name: 'Component Assembler',
        description: 'Assembles steel + energy into tech component kits each tick.',
        inputs: [
          { resourceId: 'steel_plate', amount: 2 },
          { resourceId: 'energy_cell', amount: 1 },
        ],
        outputs: [{ resourceId: 'component_kit', amount: 1 }],
        unlockId: 'unlock_component_assembly',
        maxCount: 3,
        baseCost: [
          { resourceId: 'steel_plate', amount: 30 },
          { resourceId: 'energy_cell', amount: 20 },
        ],
      },
      {
        id: 'alloy_synthesizer',
        name: 'Alloy Synthesizer',
        description: 'Combines ingots with components to create advanced alloys each tick.',
        inputs: [
          { resourceId: 'iron_ingot', amount: 5 },
          { resourceId: 'component_kit', amount: 1 },
          { resourceId: 'energy_cell', amount: 1 },
        ],
        outputs: [{ resourceId: 'advanced_alloy', amount: 1 }],
        unlockId: 'unlock_advanced_materials',
        maxCount: 2,
        baseCost: [
          { resourceId: 'component_kit', amount: 10 },
          { resourceId: 'steel_plate', amount: 40 },
          { resourceId: 'energy_cell', amount: 30 },
        ],
      },
    ],
  },
];
