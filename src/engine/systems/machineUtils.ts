import type { MachineState, MachineDefinition, GameState } from '../../types';
import { MACHINE_DEFINITIONS } from '../../config/machines';
import { hasEnoughResource } from './resourceUtils';

/**
 * Machine utility functions for operational tasks.
 * Handles purchasing, toggling, validation, and efficiency calculations.
 */

/**
 * Check if a machine is available for purchase/use.
 * @param machineId The machine to check
 * @param unlocksState The unlock state map
 * @returns true if machine is unlocked and available
 */
export function isMachineUnlocked(
  machineId: string,
  unlocksState: Record<string, boolean>
): boolean {
  const def = MACHINE_DEFINITIONS.find((m) => m.id === machineId);
  return !def?.unlockId || unlocksState[def.unlockId] === true;
}

/**
 * Check if a machine can currently produce (has inputs available).
 * @param machine The machine definition
 * @param machineCount How many units of this machine are owned
 * @param resources The current resources state
 * @returns true if all inputs are available
 */
export function canMachineRun(
  machine: MachineDefinition,
  machineCount: number,
  resources: Record<string, any>
): boolean {
  if (machineCount === 0) return false;

  for (const input of machine.inputs) {
    const res = resources[input.resourceId];
    if (!res || !hasEnoughResource(res, input.amount * machineCount)) {
      return false;
    }
  }
  return true;
}

/**
 * Toggle a machine's active/inactive state.
 * @param state Game state with machines to modify
 * @param machineId The machine to toggle
 * @returns true if toggle succeeded, false if machine not found
 */
export function toggleMachine(state: GameState, machineId: string): boolean {
  const ms = state.machines[machineId];
  if (!ms) return false;
  ms.active = !ms.active;
  return true;
}

/**
 * Set a machine's active state explicitly.
 * @param state Game state with machines to modify
 * @param machineId The machine to modify
 * @param active The desired active state
 * @returns true if operation succeeded
 */
export function setMachineActive(
  state: GameState,
  machineId: string,
  active: boolean
): boolean {
  const ms = state.machines[machineId];
  if (!ms) return false;
  ms.active = active;
  return true;
}

/**
 * Get the total input cost per tick for a machine type.
 * @param machine The machine definition
 * @param machineCount How many units to calculate for
 * @returns Array of resource costs per tick
 */
export function getMachineInputCost(
  machine: MachineDefinition,
  machineCount: number
): { resourceId: string; amount: number }[] {
  return machine.inputs.map((input) => ({
    resourceId: input.resourceId,
    amount: input.amount * machineCount,
  }));
}

/**
 * Get the total output production per tick for a machine type.
 * @param machine The machine definition
 * @param machineCount How many units to calculate for
 * @returns Array of resource production per tick
 */
export function getMachineOutputProduction(
  machine: MachineDefinition,
  machineCount: number
): { resourceId: string; amount: number }[] {
  return machine.outputs.map((output) => ({
    resourceId: output.resourceId,
    amount: output.amount * machineCount,
  }));
}

/**
 * Check if a machine is at maximum capacity.
 * @param machineState The current machine state
 * @param machineDef The machine definition
 * @returns true if count >= maxCount
 */
export function isMachineMaxed(
  machineState: MachineState,
  machineDef: MachineDefinition
): boolean {
  return machineState.count >= machineDef.maxCount;
}

/**
 * Calculate how many more units of a machine can be purchased.
 * @param machineState The current machine state
 * @param machineDef The machine definition
 * @returns Number of additional units that can be purchased
 */
export function getMachineCapacity(
  machineState: MachineState,
  machineDef: MachineDefinition
): number {
  return Math.max(0, machineDef.maxCount - machineState.count);
}

/**
 * Get detailed efficiency metrics for a machine.
 * @param machine The machine definition
 * @param count Number of units owned
 * @returns Object with efficiency metrics
 */
export function getMachineEfficiency(
  machine: MachineDefinition,
  count: number
): {
  actualCount: number;
  inputsPerTick: number;
  outputsPerTick: number;
  ratioPerUnit: number;
} {
  const inputsPerTick = machine.inputs.reduce((sum, i) => sum + i.amount, 0) * count;
  const outputsPerTick = machine.outputs.reduce((sum, o) => sum + o.amount, 0) * count;
  const ratioPerUnit =
    inputsPerTick > 0 ? outputsPerTick / inputsPerTick : outputsPerTick;

  return {
    actualCount: count,
    inputsPerTick,
    outputsPerTick,
    ratioPerUnit,
  };
}

/**
 * Get all machines that are currently visible/unlocked.
 * @param unlocksState The unlock state map
 * @returns Array of machine IDs that are visible
 */
export function getVisibleMachines(
  unlocksState: Record<string, boolean>
): string[] {
  return MACHINE_DEFINITIONS.filter((def) =>
    isMachineUnlocked(def.id, unlocksState)
  ).map((def) => def.id);
}

/**
 * Validate machine state and fix any inconsistencies.
 * Called during state initialization or save/load.
 * @param state Game state to validate
 * @returns true if validation passed/fixed, false if critical error
 */
export function validateMachineState(state: GameState): boolean {
  for (const def of MACHINE_DEFINITIONS) {
    const ms = state.machines[def.id];

    if (!ms) {
      console.warn(`Missing machine state for ${def.id}`);
      state.machines[def.id] = { count: 0, active: false };
      continue;
    }

    // Clamp count to valid range
    if (ms.count < 0) ms.count = 0;
    if (ms.count > def.maxCount) ms.count = def.maxCount;

    // Ensure active is boolean
    if (typeof ms.active !== 'boolean') ms.active = true;
  }
  return true;
}

/**
 * Get summary of all active machine operations.
 * Useful for debugging or displaying machine status.
 * @param state Game state
 * @returns Array of active machines with their metrics
 */
export function getActiveMachinesReport(
  state: GameState
): Array<{
  id: string;
  name: string;
  count: number;
  active: boolean;
  canRun: boolean;
}> {
  return MACHINE_DEFINITIONS.map((def) => {
    const ms = state.machines[def.id];
    return {
      id: def.id,
      name: def.name,
      count: ms?.count ?? 0,
      active: ms?.active ?? false,
      canRun:
        (ms?.active ?? false) &&
        canMachineRun(def, ms?.count ?? 0, state.resources),
    };
  }).filter((m) => m.count > 0);
}
