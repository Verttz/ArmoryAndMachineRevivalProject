import type { ResourceViewModel } from '../../types';

interface Props {
  resources: ResourceViewModel[];
}

export function ResourceDisplay({ resources }: Props) {

  return (
    <section className="panel resource-panel">
      <h2>⛏ Resources</h2>
      {resources.length === 0 ? (
        <p className="empty">No resources available yet.</p>
      ) : (
        <ul className="resource-list">
          {resources.map((res) => {
            return (
              <li key={res.id} className="resource-item">
                <div className="resource-header">
                  <span className="resource-name">{res.name}</span>
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
                    style={{ width: `${res.fillPercent}%` }}
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
