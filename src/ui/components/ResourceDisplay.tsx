import type { ResourceStateMap, UnlockStateMap } from '../../types';
import { RESOURCE_DEFINITIONS } from '../../config/resources';

interface Props {
  resources: ResourceStateMap;
  unlocks: UnlockStateMap;
}

export function ResourceDisplay({ resources, unlocks }: Props) {
  const visible = RESOURCE_DEFINITIONS.filter(
    (def) => !def.unlockId || unlocks[def.unlockId],
  );

  return (
    <section className="panel resource-panel">
      <h2>⛏ Resources</h2>
      {visible.length === 0 ? (
        <p className="empty">No resources available yet.</p>
      ) : (
        <ul className="resource-list">
          {visible.map((def) => {
            const res = resources[def.id];
            const pct =
              res.cap === -1 ? 0 : Math.min((res.amount / res.cap) * 100, 100);
            return (
              <li key={def.id} className="resource-item">
                <div className="resource-header">
                  <span className="resource-name">{def.name}</span>
                  <span className="resource-amount">
                    {Math.floor(res.amount)}&thinsp;/&thinsp;
                    {res.cap === -1 ? '∞' : res.cap}
                  </span>
                </div>
                <div
                  className="resource-bar"
                  role="progressbar"
                  aria-valuenow={Math.floor(res.amount)}
                  aria-valuemin={0}
                  aria-valuemax={res.cap === -1 ? undefined : res.cap}
                >
                  <div
                    className="resource-bar-fill"
                    style={{ width: res.cap === -1 ? '100%' : `${pct}%` }}
                  />
                </div>
                {res.rate > 0 && (
                  <span className="resource-rate">+{res.rate} / tick</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
