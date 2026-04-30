import type { NarrativeEntry } from '../../types';

interface Props {
  narrativeLog: NarrativeEntry[];
}

export function NarrativeLog({ narrativeLog }: Props) {
  return (
    <section className="panel narrative-log-panel">
      <h2>📖 Story</h2>
      {narrativeLog.length === 0 ? (
        <p className="empty">
          Your story has just begun...
        </p>
      ) : (
        <ul className="narrative-list">
          {narrativeLog.map((entry) => (
            <li key={entry.id} className="narrative-item">
              <div className="narrative-header">
                {entry.title && (
                  <strong className="narrative-title">{entry.title}</strong>
                )}
                <span className="narrative-tick">
                  [{Math.floor(entry.timestamp / 10)}s]
                </span>
              </div>
              <p className="narrative-text">{entry.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
