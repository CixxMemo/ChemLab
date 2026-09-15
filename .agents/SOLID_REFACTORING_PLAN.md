# ChemLab SOLID Architectural Refactoring Plan

## Overview
This plan defines the architectural refactoring of the ChemLab application to achieve 100% compliance with SOLID principles while maintaining the exact existing UI, Tailwind styling, and 62/38 layout ratio. The changes decouple UI state from chemistry domain logic, abstract imperative canvas loops into a reusable custom hook, replace hardcoded scenario branching with an extensible Strategy Pattern, and segregate large data interfaces into focused, component-specific contracts.

---

## User Review Required

> [!IMPORTANT]
> - **Zero UI / Styling Regression**: The 62/38 split, colors, animations, modals, and user interactions remain strictly unchanged.
> - **Backwards Compatibility**: To avoid breaking any existing calls while refactoring components, `useSimulationStore.ts` will be retained as a unified facade bridging `useUIStore` and `useChemistryStore`.
> - **Execution in Phases**: Work will be executed sequentially (Phase 1: Store & Hook Extraction, Phase 2: OCP Reaction Strategy Pattern, Phase 3: ISP Segregation & Component Integration).

---

## Proposed Changes

### Phase 1: SRP & DIP — State & Hook Decoupling

#### 1. Store Decoupling (SRP)
- **[NEW] `src/store/useUIStore.ts`**:
  - Handles UI presentation state:
    - `filterCategory: string | null`
    - `viewMode: 'standard' | 'electronegativity'`
    - `isFullscreen: boolean`
    - `isAnimationModalOpen: boolean`
  - Handles UI actions: `setFilterCategory`, `setViewMode`, `toggleFullscreen`, `openAnimationModal`, `closeAnimationModal`, `toggleAnimationModal`.
- **[NEW] `src/store/useChemistryStore.ts`**:
  - Handles Domain / Chemistry state:
    - `elements: Record<string, ElementData>`
    - `scenarios: ReactionScenario[]`
    - `selectedElements: ElementData[]`
    - `activeScenario: ReactionScenario | null`
    - `bondAnalysis: BondAnalysis | null`
    - `hoveredElement: ElementData | null`
    - `playbackStatus: PlaybackStatus`
    - `progress: number`
    - `playbackSpeed: number`
  - Handles Domain actions: `selectElement`, `deselectElement`, `setHoveredElement`, `loadScenarioById`, `setPlaybackStatus`, `setProgress`, `stepForward`, `stepBackward`, `setPlaybackSpeed`, `resetSimulation`.
- **[MODIFY] `src/store/useSimulationStore.ts`**:
  - Refactored as a facade delegating to `useUIStore` and `useChemistryStore` to preserve backwards compatibility.

#### 2. Canvas Hook Abstraction & True DIP (Dependency Inversion)
- **[NEW] `src/lib/canvas/IRenderEngine.ts`**:
  - Defines the rendering engine abstraction:
    ```ts
    export interface RenderState {
      progress: number;
      rotation: number;
      flashProgress: number;
      scenario: ReactionScenario | null;
      elementsMap: Record<string, ElementData>;
      selectedElements: ElementData[];
    }

    export interface IRenderEngine {
      render(ctx: CanvasRenderingContext2D, state: RenderState): void;
      resize(width: number, height: number, dpr: number): void;
    }
    ```
- **[NEW] `src/lib/canvas/CanvasBohrEngine.ts`**:
  - Concrete implementation `CanvasBohrEngine implements IRenderEngine`.
  - Wraps the Bohr orbit and scientific canvas scene rendering logic.
- **[NEW] `src/lib/canvas/useCanvasRenderer.ts`**:
  - Encapsulates `ResizeObserver`, canvas pixel-ratio scaling, `requestAnimationFrame` loop, rotation physics, and playback progress stepping.
  - Accepts `engine: IRenderEngine` via dependency injection (DIP). High-level hooks/components depend strictly on the `IRenderEngine` abstraction, not concrete rendering functions.
- **[MODIFY] `src/components/simulation/SimulationCanvas.tsx`**:
  - Strips out imperative Canvas setup; injects `CanvasBohrEngine` into `useCanvasRenderer`.
- **[MODIFY] `src/components/simulation/SimulationModal.tsx`**:
  - Replaces duplicated canvas logic with `useCanvasRenderer` using injected `CanvasBohrEngine`.

---

### Phase 2: OCP & LSP — Strategy Pattern for Chemical Reactions

#### 1. Strategy Interface & Strict LSP Contracts
- **[NEW] `src/lib/chemistry/strategies/IReactionStrategy.ts`**:
  - Defines `ReactionContext` (reactants, calculated $\Delta EN$, donor/acceptor roles).
  - Defines `ReactionResolution` (resolved scenario, `bondAnalysis`, and physics metrics).
  - Enforces **Liskov Substitution Principle (LSP)**:
    - ALL implementations of `IReactionStrategy` MUST return a fully formed, non-null `ReactionResolution` object conforming to the same contract.
    - No strategy is allowed to return `null`, `undefined`, or throw runtime errors when unsupported.
    - `InertReactionStrategy` must return a valid non-reactive physics state (repulsion vectors, zero-bond metrics) so the consuming engine treats every strategy result interchangeably without checking runtime types.
  - Defines `IReactionStrategy`:
    - `readonly id: string`
    - `supports(context: ReactionContext): boolean`
    - `resolve(context: ReactionContext): ReactionResolution`
- **[NEW] `src/lib/chemistry/strategies/InertReactionStrategy.ts`**:
  - Handles noble gas atoms and cases with `electronegativity === null` or group 18.
  - Returns a fully populated `ReactionResolution` with `bondType: 'no-bond'` / `'inert'`, zero bond order, and explicit noble-gas repulsion dynamics.
- **[NEW] `src/lib/chemistry/strategies/IonicReactionStrategy.ts`**:
  - Handles $\Delta EN > 1.7$. Dynamically balances electron transfer, formula ratio calculation (e.g., $1:1$ for NaCl, $1:2$ for $\text{MgCl}_2$), cation/anion charge computation, and generates/retrieves ionic scenario.
- **[NEW] `src/lib/chemistry/strategies/CovalentReactionStrategy.ts`**:
  - Handles $\Delta EN \le 1.7$ (partitioning into Polar Covalent for $0.4 < \Delta EN \le 1.7$ and Nonpolar Covalent for $\Delta EN \le 0.4$, including diatomic pairings like $O_2$ and multi-ligand geometries like $CH_4$ and $H_2O$).
- **[NEW] `src/lib/chemistry/strategies/ReactionEngine.ts`**:
  - Strategy registry and dispatcher. Closed for modification, open for extension via `registerStrategy()`. Substitutes strategies polymorphically without branching or type guards.

#### 2. Refactoring Existing Resolvers
- **[MODIFY] `src/lib/chemistry/bondResolver.ts`**:
  - Removes rigid if/else branches; delegates to `ReactionEngine.resolveBond()`.
- **[MODIFY] `src/lib/chemistry/stoichiometry.ts`**:
  - Removes hardcoded 5-scenario switch; delegates to `ReactionEngine.resolveScenario()`.

---

### Phase 3: ISP — Interface Segregation & Component Integration

#### 1. Segregated Types
- **[MODIFY] `src/types/chemistry.ts`**:
  - `IElementInfo`: Segregated interface containing only table-cell and listing requirements (`atomicNumber`, `symbol`, `nameTR`, `category`, `electronegativity`).
  - `IAtomRenderData`: Segregated interface for canvas Bohr orbits and nuclei (`atomicNumber`, `symbol`, `category`, `shells`, `valanceElectrons`, `electronegativity`).
  - `IOctetStatusData`: Segregated interface for octet/duplet monitoring.
  - `ElementData`: Extends `IElementInfo` and `IAtomRenderData` for unified backwards compatibility.

#### 2. Component Decoupling
- **[MODIFY] `src/components/table/ElementCell.tsx`**: Consumes `IElementInfo`.
- **[MODIFY] `src/lib/canvas/atomRenderer.ts` & `src/lib/canvas/animationPhysics.ts`**: Accept `IAtomRenderData`.
- **[MODIFY] `src/components/theory/OctetStatusBadge.tsx`**: Consumes `IOctetStatusData`.
- **[MODIFY] `src/components/layout/Header.tsx`, `FilterBar.tsx`, `CategoryLegend.tsx`, `PlaybackControls.tsx`, `BondMetricsOverlay.tsx`, `LiveInfoPanel.tsx`**: Migrate store hooks to `useUIStore` and `useChemistryStore`.

---

## Verification Plan

### Automated Verification
- Run TypeScript compiler and production build:
  ```bash
  npm run build
  ```
  Ensure 0 type errors, 0 lint warnings, and clean bundle generation.

### Manual Verification in Browser
- Launch Vite dev server:
  ```bash
  npm run dev
  ```
- Verify in browser:
  1. Default loading: NaCl scenario loads with animated electron transfer, cation/anion badges, and correct live theory.
  2. Quick scenario switching: H2O, O2, CH4, He+Ne scenarios play seamlessly.
  3. Dynamic pair selection from Periodic Table: Selecting Na + Cl, H + O, C + H, O + O, and He + any element resolves expected reactions.
  4. Scrubber & Playback: Play, pause, step backward/forward, speed changing (0.5x, 1x, 2x), and reset.
  5. Simulation Modal: Opens with "Büyük Ekran Modalı", renders canvas via `useCanvasRenderer`, ESC closes properly.
  6. Electronegativity Heatmap & Filters: Toggling EN heatmap and category filtering works without performance drops.
