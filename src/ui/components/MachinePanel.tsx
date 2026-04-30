import type { MachineViewModel } from '../../types';

interface Props {
  machines: MachineViewModel[];
  onBuy: (machineId: string) => void;
  onToggle: (machineId: string) => void;
}

export function MachinePanel({ machines, onBuy, onToggle }: Props) {

  return (
    <section className="panel machine-panel">
      <h2>⚙ Machines</h2>
      {machines.length === 0 ? (
        <p className="empty">
          No machines available yet — gather more resources!
        </p>
      ) : (
        <ul className="machine-list">
          {machines.map((machine) => {
            const maxed = machine.count >= machine.maxCount;

            return (
              <li key={machine.id} className={`machine-item${maxed ? ' maxed' : ''}${machine.canRun ? ' running' : ''}`}>
                <div className="machine-header">
                  <strong className="machine-name">{machine.name}</strong>
                  <span className="machine-count">
                    {machine.count}&thinsp;/&thinsp;{machine.maxCount}
                  </span>
                </div>

                <p className="machine-desc">{machine.description}</p>

                <div className="machine-io">
                  {machine.inputsLabel && (
                    <span className="machine-inputs">
                      ▼&thinsp;
                      {machine.inputsLabel}
                    </span>
                  )}
                  {machine.outputsLabel && (
                    <span className="machine-outputs">
                      ▲&thinsp;
                      {machine.outputsLabel}
                    </span>
                  )}
                </div>

                <div className="machine-cost">
                  Cost:&thinsp;
                  {machine.costLabel}
                </div>

                {machine.count > 0 && (
                  <div className="machine-status">
                    <div className="machine-efficiency">
                      Per tick:&thinsp;{machine.efficiencyLabel}
                    </div>
                    <div className="machine-controls">
                      <button
                        className={`toggle-btn${machine.active ? ' active' : ''}`}
                        onClick={() => onToggle(machine.id)}
                        title={machine.active ? 'Click to disable' : 'Click to enable'}
                      >
                        {machine.active ? '🟢' : '🔴'}
                      </button>
                      {machine.canRun && (
                        <span className="status running-badge">● Running</span>
                      )}
                      {machine.active && !machine.canRun && machine.count > 0 && (
                        <span className="status blocked-badge">⊗ Blocked</span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  className={`buy-btn${machine.affordable && !maxed ? ' can-afford' : ''}`}
                  onClick={() => onBuy(machine.id)}
                  disabled={!machine.affordable || maxed}
                >
                  {maxed ? '✔ Max' : machine.affordable ? '🔧 Buy' : '⛔ Insufficient'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
