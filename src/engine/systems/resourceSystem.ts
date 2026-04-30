import type { GameState } from '../../types';
import { RESOURCE_DEFINITIONS } from '../../config/resources';

/**
 * Resource system — runs each tick.
 * Applies the passive base rate for every visible resource.
 */
export function updateResources(state: GameState): void {
  for (const def of RESOURCE_DEFINITIONS) {
    if (def.unlockId && !state.unlocks[def.unlockId]) continue;

    const res = state.resources[def.id];
    const cap = res.cap === -1 ? Infinity : res.cap;
    res.amount = Math.max(0, Math.min(res.amount + res.rate, cap));
  }
}
