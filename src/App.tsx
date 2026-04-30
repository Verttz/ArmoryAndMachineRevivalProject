import './App.css';
import { useGameState } from './hooks/useGameState';
import { ResourceDisplay } from './ui/components/ResourceDisplay';
import { MachinePanel } from './ui/components/MachinePanel';
import { EventLog } from './ui/components/EventLog';
import { SaveLoadPanel } from './ui/components/SaveLoadPanel';

function App() {
  const { state, buyMachine, save, resetGame } = useGameState();

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔ Armory &amp; Machine Revival</h1>
        <p className="app-subtitle">An idle/incremental crafting game</p>
      </header>

      <main className="app-grid">
        <ResourceDisplay resources={state.resources} unlocks={state.unlocks} />
        <MachinePanel state={state} onBuy={buyMachine} />
        <EventLog events={state.eventLog} />
        <SaveLoadPanel
          tick={state.tick}
          lastSaved={state.lastSaved}
          onSave={save}
          onReset={resetGame}
        />
      </main>
    </div>
  );
}

export default App;
