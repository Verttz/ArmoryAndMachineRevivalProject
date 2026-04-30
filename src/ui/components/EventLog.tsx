import type { GameEvent } from '../../types';

interface Props {
  events: GameEvent[];
}

export function EventLog({ events }: Props) {
  return (
    <section className="panel event-log-panel">
      <h2>📜 Event Log</h2>
      {events.length === 0 ? (
        <p className="empty">
          No events yet — start gathering resources!
        </p>
      ) : (
        <ul className="event-list">
          {events.map((evt) => (
            <li key={evt.id} className={`event-item event-${evt.type}`}>
              <span className="event-tick">[{evt.timestamp}]</span>
              <span className="event-msg">{evt.message}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
