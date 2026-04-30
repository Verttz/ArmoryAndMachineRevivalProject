import type { GameState } from '../../types';
import { createInitialState } from '../gameState';
import { updateUIState } from './uiStateSystem';

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
 * Adds any resources / machines / unlocks / narratives that did not exist at save time
 * so new content introduced after a save still initialises correctly.
 */
export function migrateState(loaded: GameState): GameState {
  const fresh = createInitialState();

  if (!loaded || typeof loaded !== 'object') {
    return fresh;
  }

  if (!loaded.resources || typeof loaded.resources !== 'object') {
    loaded.resources = { ...fresh.resources };
  }

  if (!loaded.machines || typeof loaded.machines !== 'object') {
    loaded.machines = { ...fresh.machines };
  }

  if (!loaded.unlocks || typeof loaded.unlocks !== 'object') {
    loaded.unlocks = { ...fresh.unlocks };
  }

  if (typeof loaded.tick !== 'number') {
    loaded.tick = fresh.tick;
  }

  if (!loaded.eventLog || !Array.isArray(loaded.eventLog)) {
    loaded.eventLog = [];
  }

  if (typeof loaded.lastSaved !== 'number' && loaded.lastSaved !== null) {
    loaded.lastSaved = null;
  }

  // Merge resources
  for (const id of Object.keys(fresh.resources)) {
    if (!loaded.resources[id]) {
      loaded.resources[id] = fresh.resources[id];
      continue;
    }

    const target = loaded.resources[id];
    if (typeof target.amount !== 'number') {
      target.amount = fresh.resources[id].amount;
    }
    if (typeof target.cap !== 'number') {
      target.cap = fresh.resources[id].cap;
    }
    if (typeof target.rate !== 'number') {
      target.rate = fresh.resources[id].rate;
    }
  }

  // Merge machines
  for (const id of Object.keys(fresh.machines)) {
    if (!loaded.machines[id]) {
      loaded.machines[id] = fresh.machines[id];
      continue;
    }

    const target = loaded.machines[id];
    if (typeof target.count !== 'number') {
      target.count = fresh.machines[id].count;
    }
    if (typeof target.active !== 'boolean') {
      target.active = fresh.machines[id].active;
    }
  }

  // Merge unlocks
  for (const id of Object.keys(fresh.unlocks)) {
    if (!(id in loaded.unlocks)) {
      loaded.unlocks[id] = false;
    }
  }

  // Ensure narrative fields exist (for old saves)
  if (!loaded.narrativeLog) {
    loaded.narrativeLog = [];
  }
  if (!loaded.narrativesShown) {
    loaded.narrativesShown = {};
  }

  if (!loaded.pendingActions) {
    loaded.pendingActions = [];
  }

  if (!Array.isArray(loaded.pendingActions)) {
    loaded.pendingActions = [];
  }

  if (!loaded.ui || typeof loaded.ui !== 'object') {
    loaded.ui = fresh.ui;
  } else {
    if (!Array.isArray(loaded.ui.visibleResources)) {
      loaded.ui.visibleResources = [];
    }
    if (!Array.isArray(loaded.ui.visibleMachines)) {
      loaded.ui.visibleMachines = [];
    }
    if (!loaded.ui.unlockSummary || typeof loaded.ui.unlockSummary !== 'object') {
      loaded.ui.unlockSummary = fresh.ui.unlockSummary;
    } else {
      if (typeof loaded.ui.unlockSummary.unlockedCount !== 'number') {
        loaded.ui.unlockSummary.unlockedCount = 0;
      }
      if (typeof loaded.ui.unlockSummary.totalCount !== 'number') {
        loaded.ui.unlockSummary.totalCount = 0;
      }
      if (!Array.isArray(loaded.ui.unlockSummary.nearUnlocks)) {
        loaded.ui.unlockSummary.nearUnlocks = [];
      }
    }
  }

  updateUIState(loaded);

  return loaded;
}
