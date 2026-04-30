import type { UIState } from '../../types';

interface Props {
  unlockSummary: UIState['unlockSummary'];
}

export function UnlockDisplay({ unlockSummary }: Props) {
  const almostUnlocked = unlockSummary.nearUnlocks;
  const lockedCount = unlockSummary.totalCount - unlockSummary.unlockedCount;
  const unlockedCount = unlockSummary.unlockedCount;

  return (
    <section className="panel unlock-panel">
      <h2>🔓 Unlocks</h2>
      <div className="unlock-stats">
        <span className="stat">
          🔓&thinsp;{unlockedCount}/{allUnlocks.length}
        </span>
      </div>

      {almostUnlocked.length === 0 ? (
        <p className="empty">
          {lockedCount === 0
            ? 'All unlocks discovered!'
            : 'Keep playing to unlock more features!'}
        </p>
      ) : (
        <ul className="unlock-list">
          {almostUnlocked.map((unlock) => {
            return (
              <li key={unlock.id} className="unlock-item">
                <div className="unlock-header">
                  <strong>{unlock.name}</strong>
                  <span className="progress-pct">
                    {Math.floor(unlock.progress * 100)}%
                  </span>
                </div>

                <p className="unlock-desc">{unlock.description}</p>

                <div className="unlock-conditions">
                  {unlock.conditions.map((cond, idx) => (
                    <div key={idx} className="condition">
                      <div className="condition-header">
                        <span className="condition-text">{cond.text}</span>
                        {!cond.met && (
                          <span className="condition-status">
                            {Math.floor(cond.progress * 100)}%
                          </span>
                        )}
                      </div>
                      {!cond.met && (
                        <div
                          className="condition-bar"
                          role="progressbar"
                          aria-valuenow={Math.floor(cond.progress * 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="condition-bar-fill"
                            style={{ width: `${cond.progress * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
