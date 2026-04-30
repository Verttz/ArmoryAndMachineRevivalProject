import type { GameState } from '../../types';
import { UNLOCK_DEFINITIONS } from '../../config/unlocks';
import { addEvent } from './eventLogSystem';

/**
 * Unlock system — runs each tick.
 * Evaluates all unlock conditions and fires events when they first become true.
 */
export function updateUnlocks(state: GameState): void {
  for (const def of UNLOCK_DEFINITIONS) {
    if (state.unlocks[def.id]) continue; // already unlocked

    const allMet = def.conditions.every((condition) => {
      switch (condition.type) {
        case 'resource_gte':
          return (
            (state.resources[condition.resourceId!]?.amount ?? 0) >=
            condition.value!
          );
        case 'machine_count_gte':
          return (
            (state.machines[condition.machineId!]?.count ?? 0) >=
            condition.value!
          );
        case 'always':
          return true;
        default:
          return false;
      }
    });

    if (allMet) {
      state.unlocks[def.id] = true;
      addEvent(
        state,
        `🔓 Unlocked: ${def.name} — ${def.description}`,
        'achievement',
      );
    }
  }
}
