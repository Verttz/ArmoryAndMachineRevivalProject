import type { GameState, GameEvent } from '../../types';

let _nextId = 0;
const MAX_EVENTS = 100;

/**
 * Event log system.
 * Prepends a new event to the game state and trims to MAX_EVENTS.
 */
export function addEvent(
  state: GameState,
  message: string,
  type: GameEvent['type'] = 'info',
): void {
  const event: GameEvent = {
    id: `evt_${_nextId++}`,
    timestamp: state.tick,
    message,
    type,
  };
  state.eventLog = [event, ...state.eventLog].slice(0, MAX_EVENTS);
}
