# 🧪 ChemLab MVP: Interactive Periodic Table & Bond Simulator
## MVP Development & Implementation Plan (v2.0 - Extended)

---

### Phase 0: Strict Folder Architecture
Force the AI agent to create this exact structure to prevent component sprawl:
```text
/src
  /assets          # Static icons, global css
  /components
    /layout        # AppLayout.tsx, Header.tsx
    /table         # PeriodicTable.tsx, ElementCell.tsx, FilterBar.tsx
    /simulation    # SimulationCanvas.tsx, PlaybackControls.tsx
    /theory        # LiveInfoPanel.tsx
  /data            # elements.json, reactions.json
  /lib
    /chemistry     # bondResolver.ts, stoichiometry.ts
    /canvas        # renderLoop.ts, atomRenderer.ts (Pure JS canvas logic)
  /store           # useSimulationStore.ts (Zustand)
  /types           # chemistry.ts
Phase 1: Project Initialization & Domain Modeling
Goal: Establish a robust React + TypeScript codebase, design tokens, and strongly-typed chemical data schemas.
	•	Task 1.1: Environment & Theme Setup
	◦	Scaffold project using npm create vite@latest chemlab -- --template react-ts.
	◦	Install dependencies: zustand, tailwindcss, lucide-react.
	◦	Strict Tailwind Config (tailwind.config.js): JavaScript  export default {
	◦	  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	◦	  theme: {
	◦	    extend: {
	◦	      colors: {
	◦	        slate: { 50: '#F8FAFC', 400: '#94A3B8', 700: '#263345', 900: '#151C28', 950: '#0B0F17' },
	◦	        chem: {
	◦	          alkali: '#E06C75', alkaline: '#E5C07B', transition: '#4FA6E0',
	◦	          metalloid: '#56B6C2', nonmetal: '#98C379', halogen: '#C678DD',
	◦	          noble: '#E06C9F', fblock: '#ABB2BF', highlight: '#FFFFFF', electron: '#FDE047'
	◦	        }
	◦	      }
	◦	    }
	◦	  }
	◦	}
	◦	   
	•	Task 1.2: Chemistry Type Definitions (src/types/chemistry.ts)
	◦	(Keep existing types from v1, but add Stoichiometry interface)
	◦	export interface Stoichiometry { element: string; count: number; }
	•	Task 1.3: Static Chemistry Data Store (src/data/elements.json)
	◦	Prevent AI hallucination by providing the exact JSON shape: JSON  {
	◦	  "11": {
	◦	    "atomicNumber": 11,
	◦	    "symbol": "Na",
	◦	    "nameTR": "Sodyum",
	◦	    "group": 1,
	◦	    "period": 3,
	◦	    "category": "alkali",
	◦	    "electronegativity": 0.93,
	◦	    "shells": [2, 8, 1],
	◦	    "valanceElectrons": 1
	◦	  }
	◦	}
	◦	   
	◦	Define the 5 core MVP reaction scenarios ($NaCl$, $H_2O$, $O_2$, $CH_4$, $He/Ne$).
Phase 2: Core State Engine (Zustand) & Logic
Goal: Predictable state machine for selection and configuration.
	•	Task 2.1: Simulation Store (src/store/useSimulationStore.ts)
	◦	State: selectedElements, activeMode, playbackState, activeScenario.
	◦	MVP Stoichiometry Auto-Resolver: If user selects $H$ and $O$, the store automatically upgrades the selection to $2H$ and $1O$ to trigger the $H_2O$ scenario. The user does NOT need to click $H$ twice.
	•	Task 2.2: Reaction Resolver Engine (src/lib/chemistry/bondResolver.ts)
	◦	Pure function resolveBond(elemA: ElementData, elemB: ElementData).
	◦	Calculates $\Delta EN = |EN_A - EN_B|$.
	◦	Logic threshold: If $\Delta EN > 1.7$, return ionic. If $0.4 < \Delta EN \le 1.7$, return polar-covalent. Else nonpolar-covalent.
Phase 3: High-Density UI Layout & Periodic Grid
Goal: 62% - 38% two-column smartboard layout with high contrast.
	•	Task 3.1: Layout Frame (src/components/layout/AppLayout.tsx)
	◦	<main className="h-screen w-screen bg-slate-950 text-slate-50 flex overflow-hidden">
	◦	Left side: w-[62%] border-r border-slate-700. Right side: w-[38%] flex flex-col.
	•	Task 3.2: Periodic Grid Mapping (src/components/table/PeriodicTable.tsx)
	◦	Implement grid-cols-18.
	◦	Critical UI trick: Use CSS grid-column-start for elements after gaps (e.g., Boron starts at column 13 in period 2, skipping transition metal gaps).
	◦	ElementCell active state: ring-2 ring-chem-highlight ring-offset-2 ring-offset-slate-950.
Phase 4: 2D Canvas Simulation Engine (No Slop)
Goal: 60 FPS rendering with strict physics, avoiding cheap AI-generated animations.
	•	Task 4.1: Canvas Lifecycle & Retina Scaling
	◦	Hook: const scale = window.devicePixelRatio || 1;
	◦	Set canvas physical width/height to parent container size $\times$ scale, and CSS width/height to 100%.
	•	Task 4.2: Atomic Visualizer & Easing Physics
	◦	Do NOT use linear animations. Implement easeInOutCubic for electron transfers so they accelerate and snap into place naturally.
	◦	Orbital rendering: Draw faint concentric circles (strokeStyle = '#263345') for shells.
	•	Task 4.3: Bond Transition Visualizer
	◦	Ionic ($NaCl$): Draw valance electron leaving $Na$, moving to $Cl$. Once distance $< 5px$, hide migrating electron, redraw $Cl$ with full octet, and flash #38BDF8 bond line for 400ms.
	◦	Covalent ($H_2O$): Animate $O$ in center, and two $H$ atoms moving inward until their outer shells intersect.
Phase 5: Dynamic Theory & Sync
Goal: Synchronize text explanations with canvas render frames.
	•	Task 5.1: Live Theory Panel Component
	◦	Section A: Reaction Header ($Na + Cl \rightarrow NaCl$).
	◦	Section B: Explanation text updates based on playbackState.
	◦	Frame 1 (Start): "Sodyum ve Klor atomları etkileşime giriyor."
	◦	Frame 2 (Transfer): "Na atomu 1 valans elektronunu Cl atomuna aktarıyor ($\Delta EN = 2.23$)."
	◦	Frame 3 (End): "Oktet kuralı sağlandı. İyonik bağ oluştu."
Phase 6: QA & Fast Deployment
Goal: Ship to edge for immediate testing on smartboards.
	•	Task 6.1: Edge Deployment (Vercel)
	◦	Add vercel.json for static routing.
	◦	Connect GitHub repo for push-to-deploy.
	•	Task 6.2: Touch Ergonomics Verification
	◦	Test $40 \times 40$px hit target minimums.
	◦	Verify document.documentElement.requestFullscreen() triggers without layout breaking.
