import type { GameState } from '../../types';
import { MACHINE_DEFINITIONS } from '../../config/machines';

interface Props {
  state: GameState;
  onBuy: (machineId: string) => void;
}

export function MachinePanel({ state, onBuy }: Props) {
  const visible = MACHINE_DEFINITIONS.filter(
    (def) => !def.unlockId || state.unlocks[def.unlockId],
  );

  function canAfford(machineId: string): boolean {
    const def = MACHINE_DEFINITIONS.find((m) => m.id === machineId)!;
    return def.baseCost.every(
      (cost) =>
        (state.resources[cost.resourceId]?.amount ?? 0) >= cost.amount,
    );
  }

  function resourceLabel(id: string): string {
    return id.replace(/_/g, ' ');
  }

  return (
    <section className="panel machine-panel">
      <h2>⚙ Machines</h2>
      {visible.length === 0 ? (
        <p className="empty">
          No machines available yet — gather more resources!
        </p>
      ) : (
        <ul className="machine-list">
          {visible.map((def) => {
            const ms = state.machines[def.id];
            const affordable = canAfford(def.id);
            const maxed = ms.count >= def.maxCount;

            return (
              <li key={def.id} className={`machine-item${maxed ? ' maxed' : ''}`}>
                <div className="machine-header">
                  <strong className="machine-name">{def.name}</strong>
                  <span className="machine-count">
                    {ms.count}&thinsp;/&thinsp;{def.maxCount}
                  </span>
                </div>

                <p className="machine-desc">{def.description}</p>

                <div className="machine-io">
                  {def.inputs.length > 0 && (
                    <span className="machine-inputs">
                      ▼&thinsp;
                      {def.inputs
                        .map((i) => `${i.amount}× ${resourceLabel(i.resourceId)}`)
                        .join(', ')}
                    </span>
                  )}
                  {def.outputs.length > 0 && (
                    <span className="machine-outputs">
                      ▲&thinsp;
                      {def.outputs
                        .map((o) => `${o.amount}× ${resourceLabel(o.resourceId)}`)
                        .join(', ')}
                    </span>
                  )}
                </div>

                <div className="machine-cost">
                  Cost:&thinsp;
                  {def.baseCost
                    .map((c) => `${c.amount}× ${resourceLabel(c.resourceId)}`)
                    .join(', ')}
                </div>

                <button
                  className={`buy-btn${affordable && !maxed ? ' can-afford' : ''}`}
                  onClick={() => onBuy(def.id)}
                  disabled={!affordable || maxed}
                >
                  {maxed ? '✔ Max' : affordable ? '🔧 Buy' : '⛔ Insufficient'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
