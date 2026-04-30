import './App.css';
import { useGameState } from './hooks/useGameState';
import { ResourceDisplay } from './ui/components/ResourceDisplay';
import { MachinePanel } from './ui/components/MachinePanel';
import { UnlockDisplay } from './ui/components/UnlockDisplay';
import { NarrativeLog } from './ui/components/NarrativeLog';
import { EventLog } from './ui/components/EventLog';
import { SaveLoadPanel } from './ui/components/SaveLoadPanel';

function App() {
  const { state, buyMachine, toggleMachineState, save, resetGame } = useGameState();

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔ Armory &amp; Machine Revival</h1>
        <p className="app-subtitle">An idle/incremental crafting game</p>
      </header>

      <main className="app-grid">
        <ResourceDisplay resources={state.ui.visibleResources} />
        <MachinePanel
          machines={state.ui.visibleMachines}
          onBuy={buyMachine}
          onToggle={toggleMachineState}
        />
        <UnlockDisplay unlockSummary={state.ui.unlockSummary} />
        <NarrativeLog narrativeLog={state.narrativeLog} />
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
