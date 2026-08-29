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