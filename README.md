# Armory & Machine Revival

A modular idle/incremental game built with **TypeScript + React + Vite**.

## Quick start

```bash
npm install
npm run dev        # development server → http://localhost:5173
npm run build      # production build
npm run lint       # ESLint
```

---

## Architecture

### Game loop

The engine runs at a fixed **10 ticks per second** via `setInterval`.
Each tick executes three systems in order:

1. **machineSystem** – owned machines consume inputs and produce outputs
2. **resourceSystem** – passive base rates are applied to each resource
3. **unlockSystem** – conditions are evaluated; achievement events fire on first unlock

Auto-save triggers every 300 ticks (≈ 30 seconds).

All game state lives in a single `GameState` object. Systems receive a
deep-cloned copy of state each tick so React re-renders on change.
**No game logic lives in UI components.**

### Project structure

```
src/
  types/               # TypeScript interfaces (ResourceDefinition, MachineDefinition, …)
  config/
    resources.ts       # Data-driven resource definitions
    machines.ts        # Data-driven machine definitions
    unlocks.ts         # Data-driven unlock-gate definitions
  engine/
    gameState.ts       # Initial state builder
    gameLoop.ts        # Fixed-rate loop (createGameLoop, runTick)
    systems/
      resourceSystem.ts    # Passive income per tick
      machineSystem.ts     # Input → output conversion; purchaseMachine()
      unlockSystem.ts      # Condition evaluation; achievement events
      persistenceSystem.ts # save/load via localStorage; schema migration
      eventLogSystem.ts    # Append events; capped at 100 entries
  hooks/
    useGameState.ts    # React hook wiring loop → state → UI callbacks
  ui/
    components/
      ResourceDisplay.tsx  # Resource amounts + progress bars
      MachinePanel.tsx     # Buy machines; shows inputs/outputs/cost
      EventLog.tsx         # Scrollable event history
      SaveLoadPanel.tsx    # Manual save, reset, tick counter
```

---

## Adding new content (no engine changes needed)

### New resource

Edit `src/config/resources.ts`:

```ts
{
  id: 'mithril',
  name: 'Mithril',
  description: 'A rare elven metal.',
  initialAmount: 0,
  cap: 100,
  baseRate: 0,
  unlockId: 'unlock_mithril',   // optional unlock gate
},
```

### New machine

Edit `src/config/machines.ts`:

```ts
{
  id: 'mithril_furnace',
  name: 'Mithril Furnace',
  description: 'Smelts mithril ingots.',
  inputs:  [{ resourceId: 'iron_ingot', amount: 2 }],
  outputs: [{ resourceId: 'mithril',    amount: 1 }],
  unlockId: 'unlock_mithril',
  maxCount: 3,
  baseCost: [{ resourceId: 'steel_plate', amount: 10 }],
},
```

### New unlock gate

Edit `src/config/unlocks.ts`:

```ts
{
  id: 'unlock_mithril',
  name: 'Elven Metallurgy',
  description: 'Unlocks mithril processing.',
  conditions: [
    { type: 'resource_gte', resourceId: 'steel_plate', value: 25 },
  ],
},
```

Supported condition types: `resource_gte`, `machine_count_gte`, `always`.

---

## Persistence

Saves are stored in `localStorage` under the key `armory_machine_save_v1`.
`migrateState()` in `persistenceSystem.ts` merges new resources / machines / unlocks
added after a save was written, so existing saves are never broken by new content.
