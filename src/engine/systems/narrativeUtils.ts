import type { GameState } from '../../types';
import { NARRATIVE_DEFINITIONS } from '../../config/narratives';

/**
 * Narrative system utilities.
 * Handles evaluation of narrative conditions and triggering logic.
 * Separated from UI rendering.
 */

/**
 * Evaluate a single narrative condition against game state.
 * @param condition The condition to check
 * @param state The game state
 * @returns true if condition is satisfied
 */
export function evaluateNarrativeCondition(
  condition: (typeof NARRATIVE_DEFINITIONS)[number]['conditions'][number],
  state: GameState
): boolean {
  switch (condition.type) {
    case 'always':
      return true;

    case 'resource_gte': {
      if (!condition.resourceId || condition.value === undefined) return false;
      const amount = state.resources[condition.resourceId]?.amount ?? 0;
      return amount >= condition.value;
    }

    case 'machine_count_gte': {
      if (!condition.machineId || condition.value === undefined) return false;
      const count = state.machines[condition.machineId]?.count ?? 0;
      return count >= condition.value;
    }

    case 'time_gte': {
      if (condition.value === undefined) return false;
      return state.tick >= condition.value;
    }

    case 'unlock_acquired': {
      if (!condition.unlockId) return false;
      return state.unlocks[condition.unlockId] ?? false;
    }

    default:
      return false;
  }
}

/**
 * Check if all conditions for a narrative are met.
 * @param narrativeDef The narrative definition to check
 * @param state The game state
 * @returns true if all conditions are satisfied
 */
export function areNarrativeConditionsMet(
  narrativeDef: (typeof NARRATIVE_DEFINITIONS)[number],
  state: GameState
): boolean {
  return narrativeDef.conditions.every((cond) => evaluateNarrativeCondition(cond, state));
}

/**
 * Check if a narrative has already been shown.
 * @param narrativeId The narrative ID
 * @param narrativesShown The narratives shown map
 * @returns true if already shown
 */
export function hasNarrativeBeenShown(
  narrativeId: string,
  narrativesShown: Record<string, boolean>
): boolean {
  return narrativesShown[narrativeId] ?? false;
}

/**
 * Get all narratives that are eligible to trigger.
 * Filters based on:
 * - Conditions met
 * - Not already shown (if triggerOnce = true)
 * @param state The game state
 * @returns Array of eligible narratives
 */
export function getTriggeredNarratives(state: GameState): (typeof NARRATIVE_DEFINITIONS)[number][] {
  return NARRATIVE_DEFINITIONS.filter((def) => {
    // Check if conditions are met
    if (!areNarrativeConditionsMet(def, state)) {
      return false;
    }

    // Check if already shown (if triggerOnce is true)
    if (def.triggerOnce && hasNarrativeBeenShown(def.id, state.narrativesShown)) {
      return false;
    }

    return true;
  });
}

/**
 * Get a specific narrative definition by ID.
 * @param narrativeId The narrative ID
 * @returns The narrative definition, or undefined
 */
export function getNarrativeDef(narrativeId: string) {
  return NARRATIVE_DEFINITIONS.find((n) => n.id === narrativeId);
}

/**
 * Get progress towards a narrative trigger (0-1 scale).
 * Uses the minimum progress among all conditions (bottleneck).
 * @param narrativeDef The narrative definition
 * @param state The game state
 * @returns Progress as a number between 0 and 1
 */
export function getNarrativeProgress(
  narrativeDef: (typeof NARRATIVE_DEFINITIONS)[number],
  state: GameState
): number {
  if (narrativeDef.conditions.length === 0) return 1;

  const progressValues = narrativeDef.conditions.map((cond) => {
    switch (cond.type) {
      case 'always':
        return 1;

      case 'resource_gte': {
        if (!cond.resourceId || cond.value === undefined) return 0;
        const amount = state.resources[cond.resourceId]?.amount ?? 0;
        return Math.min(amount / cond.value, 1);
      }

      case 'machine_count_gte': {
        if (!cond.machineId || cond.value === undefined) return 0;
        const count = state.machines[cond.machineId]?.count ?? 0;
        return Math.min(count / cond.value, 1);
      }

      case 'time_gte': {
        if (cond.value === undefined) return 0;
        return Math.min(state.tick / cond.value, 1);
      }

      case 'unlock_acquired': {
        if (!cond.unlockId) return 0;
        return state.unlocks[cond.unlockId] ? 1 : 0;
      }

      default:
        return 0;
    }
  });

  return Math.min(...progressValues);
}

/**
 * Get all locked narratives (conditions not met yet, or already shown).
 * Sorted by progress ascending.
 * @param state The game state
 * @returns Array of locked narratives with their progress
 */
export function getLockedNarratives(
  state: GameState
): Array<{ narrative: (typeof NARRATIVE_DEFINITIONS)[number]; progress: number }> {
  return NARRATIVE_DEFINITIONS.map((narrative) => ({
    narrative,
    progress: getNarrativeProgress(narrative, state),
  }))
    .filter(
      (item) =>
        !areNarrativeConditionsMet(item.narrative, state) ||
        (item.narrative.triggerOnce && hasNarrativeBeenShown(item.narrative.id, state.narrativesShown))
    )
    .sort((a, b) => b.progress - a.progress);
}

/**
 * Get all shown narratives in order (from log).
 * @param state The game state
 * @returns Array of narrative entries in order
 */
export function getShownNarratives(state: GameState) {
  return state.narrativeLog.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Count how many unique narratives have been shown.
 * @param state The game state
 * @returns Number of shown narratives
 */
export function countShownNarratives(state: GameState): number {
  return Object.values(state.narrativesShown).filter((v) => v).length;
}

/**
 * Format a narrative for display.
 * @param narrative The narrative definition
 * @returns Formatted string
 */
export function formatNarrative(narrative: (typeof NARRATIVE_DEFINITIONS)[number]): string {
  if (narrative.title) {
    return `${narrative.title}\n${narrative.text}`;
  }
  return narrative.text;
}
