import type { GameState, ResourceStateMap, MachineStateMap, UnlockStateMap } from '../types';
import { RESOURCE_DEFINITIONS } from '../config/resources';
import { MACHINE_DEFINITIONS } from '../config/machines';
import { UNLOCK_DEFINITIONS } from '../config/unlocks';

/** Build the initial (fresh-start) game state from config. */
export function createInitialState(): GameState {
  const resources: ResourceStateMap = {};
  for (const def of RESOURCE_DEFINITIONS) {
    resources[def.id] = {
      amount: def.initialAmount,
      cap: def.cap,
      rate: def.baseRate,
    };
  }

  const machines: MachineStateMap = {};
  for (const def of MACHINE_DEFINITIONS) {
    machines[def.id] = { count: 0, active: true };
  }

  const unlocks: UnlockStateMap = {};
  for (const def of UNLOCK_DEFINITIONS) {
    unlocks[def.id] = false;
  }

  return {
    tick: 0,
    resources,
    machines,
    unlocks,
    eventLog: [],
    lastSaved: null,
  };
}
