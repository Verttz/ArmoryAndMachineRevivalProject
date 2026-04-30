import type { GameState, UnlockDefinition, UnlockCondition } from '../../types';
import { UNLOCK_DEFINITIONS } from '../../config/unlocks';

/**
 * Unlock utility functions.
 * All unlock logic is separated from UI rendering here.
 */

/**
 * Evaluate a single unlock condition against game state.
 * @param condition The condition to check
 * @param state The game state
 * @returns true if condition is satisfied
 */
export function evaluateCondition(
  condition: UnlockCondition,
  state: GameState
): boolean {
  switch (condition.type) {
    case 'always':
      return true;

    case 'resource_gte': {
      if (!condition.resourceId || condition.value === undefined) {
        console.warn('Invalid resource_gte condition', condition);
        return false;
      }
      const amount = state.resources[condition.resourceId]?.amount ?? 0;
      return amount >= condition.value;
    }

    case 'machine_count_gte': {
      if (!condition.machineId || condition.value === undefined) {
        console.warn('Invalid machine_count_gte condition', condition);
        return false;
      }
      const count = state.machines[condition.machineId]?.count ?? 0;
      return count >= condition.value;
    }

    case 'time_gte': {
      if (condition.value === undefined) {
        console.warn('Invalid time_gte condition', condition);
        return false;
      }
      return state.tick >= condition.value;
    }

    default:
      console.warn('Unknown unlock condition type');
      return false;
  }
}

/**
 * Check if all conditions for an unlock are met.
 * @param unlock The unlock definition to check
 * @param state The game state
 * @returns true if all conditions are satisfied
 */
export function areConditionsMet(
  unlock: UnlockDefinition,
  state: GameState
): boolean {
  return unlock.conditions.every((condition) => evaluateCondition(condition, state));
}

/**
 * Get the unlock definition by ID.
 * @param unlockId The unlock ID
 * @returns The unlock definition, or undefined if not found
 */
export function getUnlockDef(unlockId: string): UnlockDefinition | undefined {
  return UNLOCK_DEFINITIONS.find((u) => u.id === unlockId);
}

/**
 * Check if an unlock is already unlocked.
 * @param unlockId The unlock ID
 * @param unlocksState The unlock state map
 * @returns true if already unlocked
 */
export function isUnlocked(unlockId: string, unlocksState: Record<string, boolean>): boolean {
  return unlocksState[unlockId] ?? false;
}

/**
 * Force unlock an unlock (bypasses conditions).
 * Used for save/load migration or admin commands.
 * @param state Game state to modify
 * @param unlockId The unlock to unlock
 * @returns true if successful
 */
export function forceUnlock(state: GameState, unlockId: string): boolean {
  const def = getUnlockDef(unlockId);
  if (!def) return false;

  const wasAlreadyUnlocked = state.unlocks[unlockId];
  state.unlocks[unlockId] = true;

  return !wasAlreadyUnlocked; // return true if this was a new unlock
}

/**
 * Get progress for a single condition (0-1 scale).
 * Useful for progress bars in UI.
 * @param condition The condition to measure
 * @param state The game state
 * @returns Progress as a number between 0 and 1
 */
export function getConditionProgress(
  condition: UnlockCondition,
  state: GameState
): number {
  switch (condition.type) {
    case 'always':
      return 1;

    case 'resource_gte': {
      if (!condition.resourceId || condition.value === undefined) return 0;
      const amount = state.resources[condition.resourceId]?.amount ?? 0;
      return Math.min(amount / condition.value, 1);
    }

    case 'machine_count_gte': {
      if (!condition.machineId || condition.value === undefined) return 0;
      const count = state.machines[condition.machineId]?.count ?? 0;
      return Math.min(count / condition.value, 1);
    }

    case 'time_gte': {
      if (condition.value === undefined) return 0;
      return Math.min(state.tick / condition.value, 1);
    }

    default:
      return 0;
  }
}

/**
 * Get progress for entire unlock (0-1 scale).
 * Uses the minimum progress among all conditions (bottleneck).
 * @param unlock The unlock definition
 * @param state The game state
 * @returns Progress as a number between 0 and 1
 */
export function getUnlockProgress(
  unlock: UnlockDefinition,
  state: GameState
): number {
  if (unlock.conditions.length === 0) return 1;

  const progressValues = unlock.conditions.map((cond) =>
    getConditionProgress(cond, state)
  );

  // Return minimum progress (bottleneck)
  return Math.min(...progressValues);
}

/**
 * Get all unlocks that are currently locked (not yet unlocked).
 * @param state The game state
 * @returns Array of locked unlock definitions
 */
export function getLockedUnlocks(state: GameState): UnlockDefinition[] {
  return UNLOCK_DEFINITIONS.filter((def) => !state.unlocks[def.id]);
}

/**
 * Get all unlocks that are currently unlocked.
 * @param state The game state
 * @returns Array of unlocked unlock definitions
 */
export function getUnlockedUnlocks(state: GameState): UnlockDefinition[] {
  return UNLOCK_DEFINITIONS.filter((def) => state.unlocks[def.id]);
}

/**
 * Get unlocks that are close to being unlocked (progress > threshold).
 * Useful for showing "almost unlocked" feedback.
 * @param state The game state
 * @param threshold Progress threshold (0-1, default 0.5 = 50%)
 * @returns Array of almost-unlocked unlock definitions with their progress
 */
export function getAlmostUnlockedUnlocks(
  state: GameState,
  threshold: number = 0.5
): Array<{ unlock: UnlockDefinition; progress: number }> {
  return getLockedUnlocks(state)
    .map((unlock) => ({
      unlock,
      progress: getUnlockProgress(unlock, state),
    }))
    .filter((item) => item.progress >= threshold)
    .sort((a, b) => b.progress - a.progress);
}

/**
 * Format a condition into human-readable text.
 * @param condition The condition to format
 * @param state The game state (optional, for current values)
 * @returns Human-readable condition text
 */
export function formatCondition(condition: UnlockCondition, state?: GameState): string {
  switch (condition.type) {
    case 'always':
      return 'Always true';

    case 'resource_gte': {
      const resource = condition.resourceId?.replace(/_/g, ' ') || 'Unknown';
      const value = condition.value ?? 0;
      if (state) {
        const current = state.resources[condition.resourceId!]?.amount ?? 0;
        return `${current} / ${value} ${resource}`;
      }
      return `${value}× ${resource}`;
    }

    case 'machine_count_gte': {
      const machine = condition.machineId?.replace(/_/g, ' ') || 'Unknown';
      const value = condition.value ?? 0;
      if (state) {
        const current = state.machines[condition.machineId!]?.count ?? 0;
        return `${current} / ${value} ${machine}`;
      }
      return `${value}× ${machine}`;
    }

    case 'time_gte': {
      const ticks = condition.value ?? 0;
      const seconds = (ticks / 10).toFixed(1); // assuming 10 ticks per second
      if (state) {
        const currentSeconds = (state.tick / 10).toFixed(1);
        return `${currentSeconds} / ${seconds} seconds`;
      }
      return `${seconds} seconds`;
    }

    default:
      return 'Unknown condition';
  }
}

/**
 * Get summary of all unlocks with their status.
 * @param state The game state
 * @returns Array of unlock info with status
 */
export function getUnlocksSummary(state: GameState): Array<{
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number;
  conditions: Array<{
    text: string;
    progress: number;
    met: boolean;
  }>;
}> {
  return UNLOCK_DEFINITIONS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    unlocked: state.unlocks[def.id] ?? false,
    progress: getUnlockProgress(def, state),
    conditions: def.conditions.map((cond) => ({
      text: formatCondition(cond, state),
      progress: getConditionProgress(cond, state),
      met: evaluateCondition(cond, state),
    })),
  }));
}

/**
 * Check if an unlock blocks visibility of a resource.
 * @param resourceId The resource to check
 * @param unlocksState The unlock state
 * @returns The unlock ID that hides this resource, or undefined if visible
 */
export function getResourceLockingUnlock(
  resourceId: string,
  unlocksState: Record<string, boolean>
): string | undefined {
  // Find resource in config
  // This is a helper for UI to determine why a resource is hidden
  return undefined; // Implemented in resourceUtils instead
}

/**
 * Check if an unlock blocks visibility of a machine.
 * @param machineId The machine to check
 * @param unlocksState The unlock state
 * @returns true if machine is visible
 */
export function isMachineVisibleByUnlock(
  machineId: string,
  unlocksState: Record<string, boolean>
): boolean {
  // Machines are locked by their unlockId requirement
  // This is a convenience function for UI consistency
  return true; // Implementation in machineUtils
}
