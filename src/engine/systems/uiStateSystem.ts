import type {
  GameState,
  MachineDefinition,
  ResourceDefinition,
  ResourceViewModel,
  MachineViewModel,
  UnlockViewModel,
  UIState,
} from '../../types';
import { RESOURCE_DEFINITIONS } from '../../config/resources';
import { MACHINE_DEFINITIONS } from '../../config/machines';
import { getVisibleResources } from './resourceSystem';
import { canMachineRun, getMachineEfficiency } from './machineUtils';
import { getAlmostUnlockedUnlocks, getUnlocksSummary } from './unlockUtils';

function resourceLabel(id: string): string {
  return id.replace(/_/g, ' ');
}

function toResourceViewModel(state: GameState, def: ResourceDefinition): ResourceViewModel {
  const res = state.resources[def.id];
  return {
    id: def.id,
    name: def.name,
    amount: res.amount,
    cap: res.cap,
    rate: res.rate,
    fillPercent:
      res.cap === -1 ? 100 : Math.min((res.amount / Math.max(res.cap, 1)) * 100, 100),
  };
}

function toMachineViewModel(state: GameState, def: MachineDefinition): MachineViewModel {
  const ms = state.machines[def.id];
  const affordable = def.baseCost.every(
    (cost) => (state.resources[cost.resourceId]?.amount ?? 0) >= cost.amount,
  );
  const eff = getMachineEfficiency(def, ms.count);

  return {
    id: def.id,
    name: def.name,
    description: def.description,
    count: ms.count,
    maxCount: def.maxCount,
    active: ms.active,
    canRun: ms.active && canMachineRun(def, ms.count, state.resources),
    affordable,
    inputsLabel: def.inputs
      .map((i) => `${i.amount}x ${resourceLabel(i.resourceId)}`)
      .join(', '),
    outputsLabel: def.outputs
      .map((o) => `${o.amount}x ${resourceLabel(o.resourceId)}`)
      .join(', '),
    costLabel: def.baseCost
      .map((c) => `${c.amount}x ${resourceLabel(c.resourceId)}`)
      .join(', '),
    efficiencyLabel:
      eff.inputsPerTick > 0 && eff.outputsPerTick > 0
        ? `${eff.inputsPerTick} in -> ${eff.outputsPerTick} out / tick`
        : eff.outputsPerTick > 0
          ? `${eff.outputsPerTick} out / tick`
          : 'Idle',
  };
}

function toUnlockViewModels(state: GameState): UnlockViewModel[] {
  const summary = getUnlocksSummary(state);
  const near = getAlmostUnlockedUnlocks(state, 0.33);

  return near
    .map(({ unlock, progress }) => {
      const detailed = summary.find((s) => s.id === unlock.id);
      if (!detailed) return null;
      return {
        id: unlock.id,
        name: unlock.name,
        description: unlock.description,
        progress,
        conditions: detailed.conditions,
      };
    })
    .filter((v): v is UnlockViewModel => v !== null);
}

export function createEmptyUIState(): UIState {
  return {
    visibleResources: [],
    visibleMachines: [],
    unlockSummary: {
      unlockedCount: 0,
      totalCount: 0,
      nearUnlocks: [],
    },
  };
}

/** Derive all UI-facing data from central state. */
export function updateUIState(state: GameState): void {
  const visibleResourceIds = new Set(getVisibleResources(state.unlocks));
  const visibleResources = RESOURCE_DEFINITIONS
    .filter((def) => visibleResourceIds.has(def.id))
    .map((def) => toResourceViewModel(state, def));

  const visibleMachines = MACHINE_DEFINITIONS
    .filter((def) => !def.unlockId || state.unlocks[def.unlockId])
    .map((def) => toMachineViewModel(state, def));

  const unlockSummary = getUnlocksSummary(state);

  state.ui = {
    visibleResources,
    visibleMachines,
    unlockSummary: {
      unlockedCount: unlockSummary.filter((u) => u.unlocked).length,
      totalCount: unlockSummary.length,
      nearUnlocks: toUnlockViewModels(state),
    },
  };
}
