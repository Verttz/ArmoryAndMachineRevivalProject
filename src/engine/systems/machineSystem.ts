import type { GameState } from '../../types';
import { MACHINE_DEFINITIONS } from '../../config/machines';
import {
  subtractResource,
  addResource,
  hasEnoughResource,
} from './resourceUtils';
import { canMachineRun } from './machineUtils';

/**
 * Machine system — runs each tick.
 * For every owned, active machine:
 * 1. Verifies all inputs are available
 * 2. Consumes inputs proportional to machine count
 * 3. Produces outputs proportional to machine count
 * 
 * Supports scaling: multiple instances of the same machine scale both
 * input consumption and output production linearly.
 */
export function updateMachines(state: GameState): void {
  for (const def of MACHINE_DEFINITIONS) {
    const ms = state.machines[def.id];

    // Skip if: no machines, not active, locked by unlock, or no capacity
    if (!ms || !ms.active || ms.count === 0) continue;
    if (def.unlockId && !state.unlocks[def.unlockId]) continue;

    const count = ms.count;

    // Verify all inputs are available before processing
    if (!canMachineRun(def, count, state.resources)) {
      continue;
    }

    // Consume inputs (scaled by machine count)
    for (const input of def.inputs) {
      const res = state.resources[input.resourceId];
      if (res) {
        subtractResource(res, input.amount * count);
      }
    }

    // Produce outputs (scaled by machine count, with automatic clamping)
    for (const output of def.outputs) {
      const res = state.resources[output.resourceId];
      if (res) {
        addResource(res, output.amount * count);
      }
    }
  }
}

/**
 * Purchase one unit of a machine.
 * Deducts the purchase cost from player resources.
 * Returns true if the purchase succeeded, false otherwise.
 * 
 * Conditions for success:
 * - Machine must exist
 * - Player must not have reached maxCount
 * - Player must have enough resources for baseCost
 * - Machine must be unlocked
 */
export function purchaseMachine(state: GameState, machineId: string): boolean {
  const def = MACHINE_DEFINITIONS.find((m) => m.id === machineId);
  if (!def) return false;

  const ms = state.machines[machineId];
  if (!ms || ms.count >= def.maxCount) return false;
  if (def.unlockId && !state.unlocks[def.unlockId]) return false;

  // Check all costs are affordable
  for (const cost of def.baseCost) {
    const res = state.resources[cost.resourceId];
    if (!res || !hasEnoughResource(res, cost.amount)) {
      return false;
    }
  }

  // Deduct the cost
  for (const cost of def.baseCost) {
    const res = state.resources[cost.resourceId];
    if (res) {
      subtractResource(res, cost.amount);
    }
  }

  ms.count += 1;
  return true;
}

/**
 * Sell one unit of a machine (refund some fraction of baseCost).
 * Returns true if successful, false if machine doesn't exist or has zero count.
 * 
 * @param state Game state to modify
 * @param machineId The machine to sell
 * @param refundFraction Fraction of baseCost to refund (default 0.5 = 50%)
 */
export function sellMachine(
  state: GameState,
  machineId: string,
  refundFraction: number = 0.5
): boolean {
  const def = MACHINE_DEFINITIONS.find((m) => m.id === machineId);
  if (!def) return false;

  const ms = state.machines[machineId];
  if (!ms || ms.count === 0) return false;

  // Refund fraction of baseCost
  for (const cost of def.baseCost) {
    const res = state.resources[cost.resourceId];
    if (res) {
      addResource(res, cost.amount * refundFraction);
    }
  }

  ms.count -= 1;
  return true;
}

