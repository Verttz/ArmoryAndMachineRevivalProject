import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState } from '../types';
import { createInitialState } from '../engine/gameState';
import { createGameLoop } from '../engine/gameLoop';
import {
  loadGame,
  saveGame,
  deleteSave,
  migrateState,
} from '../engine/systems/persistenceSystem';
import { purchaseMachine } from '../engine/systems/machineSystem';
import { addEvent } from '../engine/systems/eventLogSystem';
import { MACHINE_DEFINITIONS } from '../config/machines';

/**
 * Central React hook that owns the game state and wires up the game loop.
 * UI components consume this hook; none of them contain game logic.
 */
export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadGame();
    return saved ? migrateState(saved) : createInitialState();
  });

  // Keep a ref so the loop closure always reads the latest state without
  // causing a stale closure or triggering re-renders.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Create and start the game loop once after first mount.
  useEffect(() => {
    const loop = createGameLoop(
      () => stateRef.current,
      (next) => setState(next),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  /** Purchase one unit of a machine. */
  const buyMachine = useCallback((machineId: string) => {
    setState((prev) => {
      const next: GameState = JSON.parse(JSON.stringify(prev));
      const success = purchaseMachine(next, machineId);
      if (success) {
        const def = MACHINE_DEFINITIONS.find((m) => m.id === machineId);
        addEvent(next, `🔧 Purchased: ${def?.name ?? machineId}`, 'info');
      }
      return next;
    });
  }, []);

  /** Manually save the game. */
  const save = useCallback(() => {
    setState((prev) => saveGame(prev));
  }, []);

  /** Wipe save data and restart from scratch. */
  const resetGame = useCallback(() => {
    deleteSave();
    setState(createInitialState());
  }, []);

  return { state, buyMachine, save, resetGame };
}
