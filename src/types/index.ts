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
  amount: number;
  cap: number;
  /** Effective rate this tick (base + machine contributions). */
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

export type UnlockConditionType = 'resource_gte' | 'machine_count_gte' | 'always';

export interface UnlockCondition {
  type: UnlockConditionType;
  resourceId?: string;
  machineId?: string;
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

// ─── Central Game State ───────────────────────────────────────────────────────

export interface GameState {
  tick: number;
  resources: ResourceStateMap;
  machines: MachineStateMap;
  unlocks: UnlockStateMap;
  eventLog: GameEvent[];
  lastSaved: number | null;
}
