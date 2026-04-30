import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameState } from '../types';
import { createInitialState } from '../engine/gameState';
import { createGameLoop } from '../engine/gameLoop';
import {
  deleteSave,
  loadGame,
  migrateState,
} from '../engine/systems/persistenceSystem';

/**
 * Central React hook that owns the game state and wires up the game loop.
 * UI components consume this hook; none of them contain game logic.
 */
export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = loadGame();
      return saved ? migrateState(saved) : createInitialState();
    } catch (error) {
      console.error('[GameState] Failed to initialize from save, resetting.', error);
      deleteSave();
      return createInitialState();
    }
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

  /** Queue a machine purchase action (processed in tick loop). */
  const buyMachine = useCallback((machineId: string) => {
    setState((prev) => ({
      ...prev,
      pendingActions: [...prev.pendingActions, { type: 'buy_machine', machineId }],
    }));
  }, []);

  /** Queue a machine toggle action (processed in tick loop). */
  const toggleMachineState = useCallback((machineId: string) => {
    setState((prev) => ({
      ...prev,
      pendingActions: [...prev.pendingActions, { type: 'toggle_machine', machineId }],
    }));
  }, []);

  /** Queue a manual save action (processed in tick loop). */
  const save = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingActions: [...prev.pendingActions, { type: 'manual_save' }],
    }));
  }, []);

  /** Queue a full reset action (processed in tick loop). */
  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingActions: [...prev.pendingActions, { type: 'reset_game' }],
    }));
  }, []);

  return { state, buyMachine, toggleMachineState, save, resetGame };
}
