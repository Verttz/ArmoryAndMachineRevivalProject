interface Props {
  tick: number;
  lastSaved: number | null;
  onSave: () => void;
  onReset: () => void;
}

export function SaveLoadPanel({ tick, lastSaved, onSave, onReset }: Props) {
  const savedAt = lastSaved
    ? new Date(lastSaved).toLocaleTimeString()
    : 'Never';

  return (
    <section className="panel save-panel">
      <h2>💾 Save / Load</h2>
      <p className="save-info">
        Tick:&thinsp;<strong>{tick}</strong>&emsp;|&emsp;Last saved:&thinsp;
        <strong>{savedAt}</strong>
      </p>
      <div className="save-actions">
        <button className="save-btn" onClick={onSave}>
          💾 Save Now
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            if (
              window.confirm(
                'Reset all progress? This cannot be undone.',
              )
            ) {
              onReset();
            }
          }}
        >
          🗑 Reset Game
        </button>
      </div>
    </section>
  );
}
