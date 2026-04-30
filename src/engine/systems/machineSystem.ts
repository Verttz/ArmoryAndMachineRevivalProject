import type { GameState } from '../../types';
import { MACHINE_DEFINITIONS } from '../../config/machines';

/**
 * Machine system — runs each tick.
 * For every owned, active machine: consume inputs and produce outputs.
 */
export function updateMachines(state: GameState): void {
  for (const def of MACHINE_DEFINITIONS) {
    const ms = state.machines[def.id];
    if (!ms || !ms.active || ms.count === 0) continue;
    if (def.unlockId && !state.unlocks[def.unlockId]) continue;

    const count = ms.count;

    // Verify all inputs are available
    let canRun = true;
    for (const input of def.inputs) {
      const available = state.resources[input.resourceId]?.amount ?? 0;
      if (available < input.amount * count) {
        canRun = false;
        break;
      }
    }
    if (!canRun) continue;

    // Consume inputs
    for (const input of def.inputs) {
      state.resources[input.resourceId].amount -= input.amount * count;
    }

    // Produce outputs (respect caps)
    for (const output of def.outputs) {
      const res = state.resources[output.resourceId];
      if (!res) continue;
      const cap = res.cap === -1 ? Infinity : res.cap;
      res.amount = Math.min(res.amount + output.amount * count, cap);
    }
  }
}

/**
 * Purchase one unit of a machine.
 * Returns true if the purchase succeeded, false otherwise.
 */
export function purchaseMachine(state: GameState, machineId: string): boolean {
  const def = MACHINE_DEFINITIONS.find((m) => m.id === machineId);
  if (!def) return false;

  const ms = state.machines[machineId];
  if (!ms || ms.count >= def.maxCount) return false;
  if (def.unlockId && !state.unlocks[def.unlockId]) return false;

  // Check costs
  for (const cost of def.baseCost) {
    if ((state.resources[cost.resourceId]?.amount ?? 0) < cost.amount) {
      return false;
    }
  }

  // Deduct costs
  for (const cost of def.baseCost) {
    state.resources[cost.resourceId].amount -= cost.amount;
  }

  ms.count += 1;
  return true;
}
