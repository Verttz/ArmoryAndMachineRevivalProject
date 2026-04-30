import type { GameState, NarrativeEntry } from '../../types';
import { NARRATIVE_DEFINITIONS } from '../../config/narratives';
import { getTriggeredNarratives } from './narrativeUtils';
import { addEvent } from './eventLogSystem';

let _narrativeId = 0;

/**
 * Narrative system — runs each tick.
 * 
 * Process:
 * 1. Evaluates all narratives against current game state
 * 2. For narratives that trigger:
 *    - Adds to narrative log
 *    - Marks as shown (prevents re-showing if triggerOnce = true)
 *    - Optionally fires an event
 */
export function updateNarratives(state: GameState): void {
  const triggeredNarratives = getTriggeredNarratives(state);

  for (const narrative of triggeredNarratives) {
    // Create narrative entry
    const entry: NarrativeEntry = {
      id: `narr_${_narrativeId++}`,
      timestamp: state.tick,
      title: narrative.title,
      text: narrative.text,
    };

    // Add to narrative log
    state.narrativeLog = [entry, ...state.narrativeLog].slice(0, 50); // Keep last 50 narratives

    // Mark as shown
    state.narrativesShown[narrative.id] = true;

    // Fire an optional narrative event (quieter than achievements)
    addEvent(
      state,
      narrative.title
        ? `📖 ${narrative.title}`
        : `📖 ${narrative.text.substring(0, 50)}...`,
      'info'
    );
  }
}
