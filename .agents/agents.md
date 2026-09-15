# AGENT INSTRUCTIONS & RIGID ENGINEERING RULES
# Project: ChemLab - Interactive Periodic Table & Chemical Bond Simulator
# Target Audience: Chemistry Educators & Classrooms (Smartboards)

## 1. CORE ARCHITECTURE PRINCIPLES
- PLATFORM: Pure Client-Side SPA (Vite + React + TypeScript). Absolutely NO Server-Side Rendering (SSR) or heavy backend frameworks (No ASP.NET Core MVC, No Node server).
- HOSTING TARGET: Static Edge / CDN deployment.
- STATE MANAGEMENT: Zustand ONLY. Do not introduce Redux, MobX, or React Context.
- STYLING: Tailwind CSS. No CSS Modules, No styled-components, No arbitrary CSS files.
- SIMULATION ENGINE (MVP): HTML5 Canvas 2D API or SVG with pure TypeScript render loops. Do NOT use Three.js/WebGL for the MVP.

## 2. DESIGN & VISUAL DISCIPLINE (ANTI-AI SLOP DIRECTIVES)
- COLOR PALETTE: Strict "Muted Scientific / Slate" palette.
  * Base Background: #0B0F17 (Slate-950)
  * Card/Panel Surface: #151C28 (Slate-900)
  * Sharp Borders: #263345 (Slate-700, 1px solid)
  * Headings & Primary Text: #F8FAFC (Slate-50)
  * Subtext: #94A3B8 (Slate-400)
- ELEMENT PALETTE (NON-SATURATED):
  * Alkali Metals: #E06C75 (Muted Coral)
  * Alkaline Earth: #E5C07B (Warm Amber)
  * Transition Metals: #4FA6E0 (Steel Blue)
  * Metalloids: #56B6C2 (Mineral Cyan)
  * Non-Metals: #98C379 (Sage Green)
  * Halogens: #C678DD (Muted Lavender)
  * Noble Gases: #E06C9F (Dusty Rose)
  * Lanthanides / Actinides: #ABB2BF (Platinum Grey)
- ZERO-TOLERANCE DESIGN RULES:
  * NO random glowing effects. Glow is allowed ONLY on active bond creation (max 400ms duration).
  * NO multi-color background gradients on cards or buttons. Flat colors with sharp 1px borders only.
  * NO soft, blurry drop-shadows. Use 1px borders for elevation.

## 3. LAYOUT & INTERACTION RULES
- 2-COLUMN RATIO: Left Panel (~60% width, Full Height 100vh) for the 18-column Periodic Table; Right Panel (~40% width) for Controls, Canvas Simulation, and Live Theory Panel.
- TOUCH-TARGET SIZE: Minimum 40x40px for all interactive elements to guarantee smartboard/stylus usability.

## 4. CODE & DATA STANDARDS
- All element parameters must strictly conform to TypeScript interfaces (`/types/chemistry.ts`).
- Zero raw `any` types. Strict TypeScript configuration (`"strict": true`).
- Chemistry logic (octet rule checks, delta EN calculation, bond classification) MUST live in pure, decoupled utility functions under `/lib/chemistry/`.

---

## 5. SOLID PRINCIPLES — MANDATORY AND NON-NEGOTIABLE

**This section applies to every change, in every file, on every task, with no exceptions.** "It's a small change" or "it's just a quick fix" is never a reason to skip these rules. If following a rule below would require touching more files than the task seems to warrant, that is a signal the codebase already has a violation nearby — flag it in the report, do not silently work around it.

Each principle below includes a real incident from this project's history. These are not hypothetical — they are bugs that shipped and had to be found and fixed. Do not repeat them.

### 5.1 Single Responsibility Principle (SRP)
Every file, every function, every Zustand store slice has exactly one reason to change.

- **Past violation (fixed):** `useSimulationStore.ts` originally held both UI presentation state (`viewMode`, `isFullscreen`) and chemistry domain state (`selectedElements`, `bondAnalysis`) in one store. A change to a filter button and a change to bond-resolution logic both required touching the same file. Fixed by splitting into `useUIStore.ts` and `useChemistryStore.ts`.
- **Rule going forward:** if you are about to add a field or action to a store or file and cannot describe in one sentence why it belongs with the existing contents, it belongs in a new file instead.

### 5.2 Open/Closed Principle (OCP)
Adding new behavior must never require editing existing, already-correct code — only adding new code and registering it.

- **Past violation (fixed):** `bondResolver.ts` originally used an `if/else` chain per bond type. Adding a new bond type meant editing this file and risking every existing branch. Fixed with `ReactionEngine` — a strategy registry where each bond type is its own file implementing `IReactionStrategy`, registered via `registerStrategy()`.
- **Rule going forward:** adding a new reaction type (acid-base, combustion, redox, anything) must mean: write one new `*Strategy.ts` file, register it. Zero edits to `ReactionEngine.ts`, `bondResolver.ts`, or any existing strategy file. If a new feature requires editing an existing strategy's `resolve()` or `supports()` body, stop and redesign — that is OCP failing, not succeeding.

### 5.3 Liskov Substitution Principle (LSP)
Any implementation of an interface must be fully interchangeable with any other implementation of that interface — same contract, same guarantees, no surprises.

- **Past violation avoided by design, keep it this way:** every `IReactionStrategy` implementation (`IonicReactionStrategy`, `CovalentReactionStrategy`, `InertReactionStrategy`) always returns a complete, non-null `ReactionResolution` and never throws. `ReactionEngine` can call `.resolve()` on whichever strategy matched without knowing which concrete class it is.
- **Rule going forward:** the same discipline applies to `IRenderEngine` implementations (`CanvasBohrEngine`, `DebugWireframeEngine`, and any future one) — same method signatures, same behavior guarantees (never throw, always leave the canvas in a valid state), fully swappable.

### 5.4 Interface Segregation Principle (ISP)
No component or function should be forced to depend on data or methods it doesn't use.

- **Past violation (fixed):** components were passed the full `ElementData` object (atomic mass, electron configuration, long descriptions, everything) even when they only needed a symbol and a category. Fixed by splitting into `IElementInfo`, `IAtomRenderData`, `IOctetStatusData`, each scoped to exactly what its consumers need.
- **Rule going forward:** when adding a new component or function, pass it the narrowest type that satisfies its actual needs — not the biggest convenient object you have on hand. If two unrelated fields keep showing up together in the same interface for no shared reason, split the interface.

### 5.5 Dependency Inversion Principle (DIP)
High-level code depends on abstractions, not concrete implementations — **and the abstraction must be real, not just a type signature.**

- **Past violation (fixed, and this is the one to internalize most):** `useCanvasRenderer` correctly accepted an `engine: IRenderEngine` parameter — a proper abstraction on paper. But the default value was a single module-level singleton (`export const defaultBohrEngine = new CanvasBohrEngine()`) that stored `width`/`height`/`dpr` as **mutable instance fields**. Both `SimulationCanvas.tsx` and `SimulationModal.tsx` used this same default, so opening the fullscreen modal silently corrupted the small canvas's rendering the moment the modal closed — the two consumers were fighting over one shared, stateful object. The interface was correct; the wiring behind it wasn't. Fixed by giving `SimulationModal.tsx` its own dedicated engine instance.
- **Rule going forward:** an injected dependency having the right interface type is not enough to call it DIP-compliant. Before accepting a shared default instance for an injectable dependency, ask: does this object hold mutable state, and will more than one consumer use the default concurrently? If yes to both, it must not be a shared singleton — either make it stateless, or require each consumer to construct or receive its own instance.

---

## 6. SPAGHETTI CODE — EXPLICITLY BANNED PATTERNS

"No spaghetti code" is enforced here as specific, checkable prohibitions, not a vague aspiration:

- **No unexplained magic numbers.** A bug shipped because a badge was positioned at `cy - 110` with no explanation of what 110 meant or how it related to the atom's actual final position. Every positioning offset, threshold, or tunable constant must be a named constant with a comment explaining what it's relative to (e.g. `const CH4_BADGE_CLEARANCE = 45; // px above the resting position of the top hydrogen`).
- **No branching on a raw element symbol or scenario id inside domain/business logic.** A bug shipped because bond-type classification used raw `ΔEN > 1.7` with no regard for element category, silently misclassifying H+F (both nonmetals) as ionic — a textbook error. The fix used category-based logic (`isNonMetalPair`, `isMetalNonMetalPair`) instead of a growing list of symbol exceptions. Any new classification logic must follow this same pattern: derive the answer from a general, data-driven property (category, group, electronegativity), never from `if (symbol === 'X')`. A `symbol ===` or `id ===` check is only acceptable for genuinely presentational lookups (e.g., "does this reaction already have a curated animation") — never for determining a chemistry outcome.
- **No new molecule-specific hardcoded render functions.** The five original MVP scenarios (`renderCH4Scenario` and siblings) are grandfathered as legacy, approved by the project owner — do not refactor them without being asked. But no new molecule may get its own bespoke render function; new molecules must go through the generic dynamic renderer.
- **No deriving domain truth from UI/animation timing.** A bug shipped because "is the octet complete" was computed as `progress >= 0.75` — an animation-clock proxy standing in for a real chemistry calculation. Domain facts (is the octet satisfied, what's the bond order, what's the formula ratio) must be computed once, from real inputs, at resolution time (e.g. in a strategy's `resolve()`), and passed down as data. Never let a component infer a domain fact from how far an animation has played.
- **No shared mutable singleton state across independent concurrent consumers** — see 5.5 above.
- **Every new pure function added to `/lib/chemistry/` or `/lib/canvas/` needs a colocated Vitest test** (`*.test.ts` next to the source file) covering at minimum its boundary values, before the task is considered done.

---

## 7. PRAGMATISM CLAUSE — READ BEFORE OVER-APPLYING SECTION 5

Rigorous SOLID compliance is mandatory for domain logic (`/lib/chemistry/`), state management (`/store/`), and reusable rendering/data abstractions (`/lib/canvas/`, `/types/`) — this is non-negotiable per Section 5.

It does **not** mean inventing an interface, a strategy pattern, or a factory for a trivial, single-consumer, purely presentational piece of UI that has no reasonable chance of needing a second implementation. Forcing abstraction onto code that doesn't need it produces exactly the kind of tangled, hard-to-follow indirection that Section 6 exists to prevent — it is a different flavor of spaghetti, not a cure for it. If unsure whether something warrants an interface, ask: "will there plausibly be a second implementation of this?" If no, a plain function or component is correct, not a violation.

---

## 8. SELF-AUDIT CHECKLIST — RUN BEFORE REPORTING ANY TASK AS COMPLETE

- [ ] `grep` the touched files for `symbol ===` or `id ===` outside a `supports()`/category-check context. Every match is listed in the report with a justification, or fixed.
- [ ] No module-level singleton introduced or reused holds mutable state consumed by more than one component.
- [ ] No new numeric literal was added without a named constant and a comment.
- [ ] Every new function in `/lib/chemistry/` or `/lib/canvas/` has a colocated test, and it passes.
- [ ] `npm run build` and `npm test` both pass — paste the actual terminal output in the report, not a summary claim.
