/**
 * Narrative entry definitions.
 * These are story beats that trigger based on game conditions.
 * Each can unlock mechanics or be purely for flavor.
 */

export interface NarrativeDefinition {
  id: string;
  /** Story text to display. */
  text: string;
  /** Optional title/header. */
  title?: string;
  /** Conditions that must be met for this narrative to trigger. */
  conditions: Array<{
    type: 'resource_gte' | 'machine_count_gte' | 'time_gte' | 'unlock_acquired' | 'always';
    resourceId?: string;
    machineId?: string;
    unlockId?: string;
    value?: number;
  }>;
  /** Only show once if true. Otherwise can trigger repeatedly. */
  triggerOnce: boolean;
}

export const NARRATIVE_DEFINITIONS: NarrativeDefinition[] = [
  {
    id: 'narr_intro',
    title: 'The Beginning',
    text: `You awaken in an ancient armory. Dusty equipment covers the shelves.
Your first task: gather iron ore from the nearby mines. The fate of this workshop depends on it.`,
    conditions: [{ type: 'always' }],
    triggerOnce: true,
  },

  {
    id: 'narr_first_coal',
    title: 'Discovery',
    text: `You've found coal deposits! A precious fuel source.
Combined with iron ore, you can smelt stronger materials. The workshop's potential begins to show.`,
    conditions: [
      { type: 'resource_gte', resourceId: 'coal', value: 10 },
      { type: 'resource_gte', resourceId: 'iron_ore', value: 20 },
    ],
    triggerOnce: true,
  },

  {
    id: 'narr_smelted_first_ingot',
    title: 'Breakthrough',
    text: `Your first iron ingot! The orange glow of molten metal fills your workshop.
With this metallurgical knowledge, advanced forging becomes possible.
The path forward grows clearer.`,
    conditions: [{ type: 'resource_gte', resourceId: 'iron_ingot', value: 1 }],
    triggerOnce: true,
  },

  {
    id: 'narr_forge_unlocked',
    title: 'Advancement',
    text: `You've mastered the forge! Steel plates now fill your inventory.
With this superior material, you sense the presence of even greater treasures nearby...`,
    conditions: [{ type: 'unlock_acquired', unlockId: 'unlock_forge' }],
    triggerOnce: true,
  },

  {
    id: 'narr_gold_discovered',
    title: 'Riches',
    text: `Gold! A glimmer of precious metal catches your eye.
This legendary material will change everything. New possibilities await.`,
    conditions: [{ type: 'resource_gte', resourceId: 'gold', value: 1 }],
    triggerOnce: true,
  },

  {
    id: 'narr_machines_flourish',
    title: 'Industrial Age',
    text: `Your machines hum in perfect harmony. Iron, coal, and steel flow through the workshop
like a well-oiled engine. The armory is no longer a ruin—it has become a factory.`,
    conditions: [
      { type: 'machine_count_gte', machineId: 'iron_mine', value: 3 },
      { type: 'machine_count_gte', machineId: 'smelter', value: 2 },
    ],
    triggerOnce: true,
  },

  {
    id: 'narr_wealth_milestone',
    title: 'Prosperity',
    text: `Fifty gold bars rest in your vault. You have become wealthy beyond measure.
The workshop thrums with activity. What next for this industrial empire?`,
    conditions: [{ type: 'resource_gte', resourceId: 'gold', value: 50 }],
    triggerOnce: true,
  },

  {
    id: 'narr_time_passage',
    title: 'Time Flows',
    text: `Minutes pass. Your machines tick onwards without rest.
Automation has freed you from the burden of constant toil. The machines work while you dream.`,
    conditions: [{ type: 'time_gte', value: 2000 }],
    triggerOnce: true,
  },
  {
    id: 'narr_energy_awakening',
    title: 'Energy Awakens',
    text: 'You harnessed energy from gold. A new frontier beckons: advanced technology.',
    conditions: [{ type: 'unlock_acquired', unlockId: 'unlock_energy_tech' }],
    triggerOnce: true,
  },

  {
    id: 'narr_components_assembled',
    title: 'Technical Mastery',
    text: 'Your first component kit is complete. Precision meets power. The age of mechanisms begins.',
    conditions: [{ type: 'resource_gte', resourceId: 'component_kit', value: 1 }],
    triggerOnce: true,
  },

  {
    id: 'narr_alloy_creation',
    title: 'Supreme Materials',
    text: 'The Alloy Synthesizer produces your first advanced alloy. Metallurgy and technology fuse.',
    conditions: [{ type: 'resource_gte', resourceId: 'advanced_alloy', value: 1 }],
    triggerOnce: true,
  },

  {
    id: 'narr_chain_perfection',
    title: 'Perfect Harmony',
    text: 'Every machine feeds the next in perfect harmony. Gold flows to energy to components to alloys.',
    conditions: [
      { type: 'machine_count_gte', machineId: 'energy_reactor', value: 2 },
      { type: 'machine_count_gte', machineId: 'component_assembler', value: 1 },
    ],
    triggerOnce: true,
  },
];
