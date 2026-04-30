import type { GameState, GameAction } from '../../types';
import { MACHINE_DEFINITIONS } from '../../config/machines';
import { createInitialState } from '../gameState';
import { purchaseMachine } from './machineSystem';
import { toggleMachine } from './machineUtils';
import { addEvent } from './eventLogSystem';
import { saveGame, deleteSave } from './persistenceSystem';

function processAction(state: GameState, action: GameAction): void {
  switch (action.type) {
    case 'buy_machine': {
      const success = purchaseMachine(state, action.machineId);
      if (success) {
        const def = MACHINE_DEFINITIONS.find((m) => m.id === action.machineId);
        addEvent(state, `Purchased: ${def?.name ?? action.machineId}`, 'info');
      }
      return;
    }

    case 'toggle_machine': {
      const success = toggleMachine(state, action.machineId);
      if (success) {
        const def = MACHINE_DEFINITIONS.find((m) => m.id === action.machineId);
        const active = state.machines[action.machineId]?.active;
        addEvent(
          state,
          `${active ? 'Enabled' : 'Disabled'}: ${def?.name ?? action.machineId}`,
          'info',
        );
      }
      return;
    }

    case 'manual_save': {
      const saved = saveGame(state);
      state.lastSaved = saved.lastSaved;
      return;
    }

    case 'reset_game': {
      deleteSave();
      const fresh = createInitialState();
      Object.assign(state, fresh);
      return;
    }
  }
}

/**
 * Apply all queued actions in FIFO order and clear the queue.
 * This keeps gameplay mutations inside the main tick loop.
 */
export function processPendingActions(state: GameState): void {
  if (state.pendingActions.length === 0) return;

  const queue = [...state.pendingActions];
  state.pendingActions = [];

  for (const action of queue) {
    processAction(state, action);
  }
}
