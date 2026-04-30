import type { GameState } from '../../types';
import { RESOURCE_DEFINITIONS } from '../../config/resources';
import { applyPerTickChange } from './resourceUtils';

/**
 * Check if a resource is visible to the player.
 * A resource is hidden until its unlock condition is met.
 * @param resourceId The resource to check
 * @param unlocksState The unlock state map
 * @returns true if resource should be visible
 */
export function isResourceVisible(
  resourceId: string,
  unlocksState: Record<string, boolean>
): boolean {
  const def = RESOURCE_DEFINITIONS.find((r) => r.id === resourceId);
  // Resource is visible if it has no unlock requirement, or the unlock is active
  return !def?.unlockId || unlocksState[def.unlockId] === true;
}

/**
 * Resource system — runs each tick.
 * - Applies the per-tick change (rate) for every visible resource
 * - Clamps all values to [0, cap]
 * - Skips hidden resources (those locked by unmet unlocks)
 */
export function updateResources(state: GameState): void {
  for (const def of RESOURCE_DEFINITIONS) {
    // Skip hidden/locked resources
    if (!isResourceVisible(def.id, state.unlocks)) {
      continue;
    }

    const res = state.resources[def.id];
    // Apply per-tick change with automatic clamping
    applyPerTickChange(res);
  }
}

/**
 * Get all visible resources for display.
 * Filters out resources that are locked behind unmet unlocks.
 * @param unlocksState The unlock state map
 * @returns Array of resource IDs that should be displayed
 */
export function getVisibleResources(unlocksState: Record<string, boolean>): string[] {
  return RESOURCE_DEFINITIONS.filter((def) =>
    isResourceVisible(def.id, unlocksState)
  ).map((def) => def.id);
}
