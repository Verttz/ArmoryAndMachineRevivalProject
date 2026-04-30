// ─── Resource Types ───────────────────────────────────────────────────────────

export interface ResourceDefinition {
  id: string;
  name: string;
  description: string;
  initialAmount: number;
  /** Maximum storable amount. Use -1 for unlimited. */
  cap: number;
  /** Base passive income per tick (before machines). */
  baseRate: number;
  /** Optional unlock gate. Resource is hidden until this unlock is true. */
  unlockId?: string;
}

export interface ResourceState {
  /** Current amount of this resource */
  amount: number;
  /** Maximum capacity of this resource (max-capacity). -1 means unlimited. */
  cap: number;
  /** Per-tick change: effective rate this tick (base + machine contributions). */
  rate: number;
}

export type ResourceStateMap = Record<string, ResourceState>;

// ─── Machine Types ────────────────────────────────────────────────────────────

export interface ResourceAmount {
  resourceId: string;
  amount: number;
}

export interface MachineDefinition {
  id: string;
  name: string;
  description: string;
  /** Resources consumed per tick per unit. */
  inputs: ResourceAmount[];
  /** Resources produced per tick per unit. */
  outputs: ResourceAmount[];
  /** Optional unlock gate. Machine is hidden until this unlock is true. */
  unlockId?: string;
  maxCount: number;
  /** One-time cost to purchase one unit. */
  baseCost: ResourceAmount[];
}

export interface MachineState {
  count: number;
  active: boolean;
}

export type MachineStateMap = Record<string, MachineState>;

// ─── Unlock Types ─────────────────────────────────────────────────────────────

/**
 * Unlock condition types:
 * - 'always': Automatically satisfied
 * - 'resource_gte': Resource amount >= value
 * - 'machine_count_gte': Machine count >= value
 * - 'time_gte': Game tick >= value (elapsed ticks)
 */
export type UnlockConditionType = 'always' | 'resource_gte' | 'machine_count_gte' | 'time_gte';

export interface UnlockCondition {
  type: UnlockConditionType;
  /** Required for 'resource_gte' */
  resourceId?: string;
  /** Required for 'machine_count_gte' */
  machineId?: string;
  /** Required for 'resource_gte', 'machine_count_gte', and 'time_gte' */
  value?: number;
}

export interface UnlockDefinition {
  id: string;
  name: string;
  description: string;
  /** All conditions must be satisfied (AND logic). */
  conditions: UnlockCondition[];
}

export type UnlockStateMap = Record<string, boolean>;

// ─── Event Log Types ──────────────────────────────────────────────────────────

export interface GameEvent {
  id: string;
  /** Tick number when this event occurred. */
  timestamp: number;
  message: string;
  type: 'info' | 'warning' | 'achievement';
}

// ─── Narrative System Types ───────────────────────────────────────────────────

/**
 * Narrative entries are triggered story moments that track progression.
 * They differ from regular events: timestamped diegetic story text.
 */
export interface NarrativeEntry {
  id: string;
  /** Tick when this narrative was triggered. */
  timestamp: number;
  /** The story text to display. */
  text: string;
  /** Optional title/header for this narrative beat. */
  title?: string;
}

/** Tracks which narrative entries have been shown (by narrative ID). */
export type NarrativeShownMap = Record<string, boolean>;

// ─── Tick Actions & UI Models ───────────────────────────────────────────────

export type GameAction =
  | { type: 'buy_machine'; machineId: string }
  | { type: 'toggle_machine'; machineId: string }
  | { type: 'manual_save' }
  | { type: 'reset_game' };

export interface ResourceViewModel {
  id: string;
  name: string;
  amount: number;
  cap: number;
  rate: number;
  fillPercent: number;
}

export interface MachineViewModel {
  id: string;
  name: string;
  description: string;
  count: number;
  maxCount: number;
  active: boolean;
  canRun: boolean;
  affordable: boolean;
  inputsLabel: string;
  outputsLabel: string;
  costLabel: string;
  efficiencyLabel: string;
}

export interface UnlockConditionViewModel {
  text: string;
  progress: number;
  met: boolean;
}

export interface UnlockViewModel {
  id: string;
  name: string;
  description: string;
  progress: number;
  conditions: UnlockConditionViewModel[];
}

export interface UIState {
  visibleResources: ResourceViewModel[];
  visibleMachines: MachineViewModel[];
  unlockSummary: {
    unlockedCount: number;
    totalCount: number;
    nearUnlocks: UnlockViewModel[];
  };
}

// ─── Central Game State ───────────────────────────────────────────────────────

export interface GameState {
  tick: number;
  resources: ResourceStateMap;
  machines: MachineStateMap;
  unlocks: UnlockStateMap;
  pendingActions: GameAction[];
  eventLog: GameEvent[];
  narrativeLog: NarrativeEntry[];
  ui: UIState;
  /** Tracks which narrative entries have been shown. */
  narrativesShown: NarrativeShownMap;
  lastSaved: number | null;
}
