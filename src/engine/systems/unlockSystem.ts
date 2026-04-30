import type { GameState } from '../../types';
import { UNLOCK_DEFINITIONS } from '../../config/unlocks';
import { addEvent } from './eventLogSystem';
import { areConditionsMet } from './unlockUtils';

/**
 * Unlock system — runs each tick.
 * 
 * Process:
 * 1. Evaluates all conditions for each locked unlock
 * 2. Unlocks conditions are AND logic (all must be true)
 * 3. Supports: resource thresholds, machine ownership, time elapsed, always-true
 * 4. Fires achievement events when unlocks trigger
 * 
 * Unlocks gate:
 * - New machines (from machineSystem checks unlockId)
 * - New resources (from resourceSystem checks unlockId)
 * - UI elements (components can check state.unlocks map)
 */
export function updateUnlocks(state: GameState): void {
  for (const def of UNLOCK_DEFINITIONS) {
    // Skip already unlocked items
    if (state.unlocks[def.id]) continue;

    // Check if all conditions are met using utility function
    if (areConditionsMet(def, state)) {
      state.unlocks[def.id] = true;
      addEvent(
        state,
        `🔓 Unlocked: ${def.name} — ${def.description}`,
        'achievement',
      );
    }
  }
}

