import type { GameState } from '../types';
import { updateResources } from './systems/resourceSystem';
import { updateMachines } from './systems/machineSystem';
import { updateUnlocks } from './systems/unlockSystem';
import { updateNarratives } from './systems/narrativeSystem';
import { processPendingActions } from './systems/actionSystem';
import { updateUIState } from './systems/uiStateSystem';
import { saveGame } from './systems/persistenceSystem';

/** Fixed ticks per second for the game loop. */
export const TICK_RATE = 10;

/** Auto-save every this many ticks (default: every 30 seconds). */
const AUTO_SAVE_INTERVAL = 300;

/**
 * Advance the game state by one tick.
 * Returns a new state object (deep-cloned) so React detects the change.
 */
export function runTick(state: GameState): GameState {
  // Deep-clone so downstream mutations don't affect the previous snapshot
  const next: GameState = JSON.parse(JSON.stringify(state));

  processPendingActions(next);
  next.tick += 1;

  updateMachines(next);
  updateResources(next);
  updateUnlocks(next);
  updateNarratives(next);
  updateUIState(next);

  if (next.tick % AUTO_SAVE_INTERVAL === 0) {
    return saveGame(next);
  }

  return next;
}

export interface GameLoop {
  start(): void;
  stop(): void;
}

/**
 * Create a fixed-rate game loop.
 * The caller provides getter/setter accessors for the current state so the
 * loop always operates on the latest React state without stale closures.
 */
export function createGameLoop(
  getState: () => GameState,
  setState: (state: GameState) => void,
): GameLoop {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return {
    start() {
      if (intervalId !== null) return;
      intervalId = setInterval(() => {
        setState(runTick(getState()));
      }, 1000 / TICK_RATE);
    },
    stop() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  };
}
