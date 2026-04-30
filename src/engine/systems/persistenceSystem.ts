import type { GameState } from '../../types';
import { createInitialState } from '../gameState';

const SAVE_KEY = 'armory_machine_save_v1';

/**
 * Persistence system.
 * Saves / loads the entire game state to / from localStorage.
 */

export function saveGame(state: GameState): GameState {
  const withTimestamp: GameState = { ...state, lastSaved: Date.now() };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(withTimestamp));
  } catch (e) {
    console.error('[Persistence] Failed to save game:', e);
  }
  return withTimestamp;
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (e) {
    console.error('[Persistence] Failed to load game:', e);
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Merges a loaded save with the current config.
 * Adds any resources / machines / unlocks that did not exist at save time
 * so new content introduced after a save still initialises correctly.
 */
export function migrateState(loaded: GameState): GameState {
  const fresh = createInitialState();

  // Merge resources
  for (const id of Object.keys(fresh.resources)) {
    if (!loaded.resources[id]) {
      loaded.resources[id] = fresh.resources[id];
    }
  }

  // Merge machines
  for (const id of Object.keys(fresh.machines)) {
    if (!loaded.machines[id]) {
      loaded.machines[id] = fresh.machines[id];
    }
  }

  // Merge unlocks
  for (const id of Object.keys(fresh.unlocks)) {
    if (!(id in loaded.unlocks)) {
      loaded.unlocks[id] = false;
    }
  }

  return loaded;
}
