import type { GameState, ResourceStateMap, MachineStateMap, UnlockStateMap, NarrativeShownMap } from '../types';
import { RESOURCE_DEFINITIONS } from '../config/resources';
import { MACHINE_DEFINITIONS } from '../config/machines';
import { UNLOCK_DEFINITIONS } from '../config/unlocks';
import { createEmptyUIState } from './systems/uiStateSystem';
import { updateUIState } from './systems/uiStateSystem';

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

  const narrativesShown: NarrativeShownMap = {};

  const state: GameState = {
    tick: 0,
    resources,
    machines,
    unlocks,
    pendingActions: [],
    eventLog: [],
    narrativeLog: [],
    ui: createEmptyUIState(),
    narrativesShown,
    lastSaved: null,
  };

  updateUIState(state);
  return state;
}
