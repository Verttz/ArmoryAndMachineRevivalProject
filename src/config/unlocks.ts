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
  {
    id: 'unlock_automation',
    name: 'Automation Era',
    description: 'You\'ve been running the machines for a while — take a break!',
    conditions: [
      { type: 'time_gte', value: 1000 }, // ~100 seconds at 10 ticks/sec
      {
        id: 'unlock_energy_tech',
        name: 'Energy Technology',
        description: 'Unlocks Energy Reactors to generate power cells from precious materials.',
        conditions: [
          { type: 'resource_gte', resourceId: 'gold', value: 5 },
          { type: 'machine_count_gte', machineId: 'gold_mine', value: 1 },
        ],
      },
      {
        id: 'unlock_component_assembly',
        name: 'Component Engineering',
        description: 'Unlocks the Component Assembler to craft technical kits.',
        conditions: [
          { type: 'resource_gte', resourceId: 'energy_cell', value: 10 },
          { type: 'resource_gte', resourceId: 'steel_plate', value: 15 },
        ],
      },
      {
        id: 'unlock_advanced_materials',
        name: 'Materials Science',
        description: 'Unlocks the Alloy Synthesizer to create advanced materials.',
        conditions: [
          { type: 'resource_gte', resourceId: 'component_kit', value: 5 },
          { type: 'machine_count_gte', machineId: 'component_assembler', value: 1 },
          { type: 'time_gte', value: 5000 }, // ~500 seconds in
        ],
      },
    ],
  },
];

