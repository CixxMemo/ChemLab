# ChemLab — Chemistry Domain Rules

**Purpose:** This file complements `agents.md` (engineering rules) and `MVP_development_plan.md`. It is the single source of chemistry truth for everything under `/lib/chemistry/`. Treat every number here as fixed — do not let a coding agent estimate, round, or invent electronegativity, shell, or valence values; copy them from the tables below.

---

## 1. Electron Shell Model (simplified Bohr model)

ChemLab uses the classic Bohr shell model (matches the `shells: number[]` field in `elements.json`), not full quantum subshell notation (s/p/d/f) — this is correct and expected for the target audience (secondary-school chemistry).

Shell capacities, in real filling order:
- Shell 1 (K): max 2
- Shell 2 (L): max 8
- Shell 3 (M): **max 8, not 18**, for elements up to Z = 20

⚠️ **Known Bohr-model trap:** 4s fills before 3d. If the table is ever extended past Argon (Z=18), K and Ca are `[2,8,8,1]` and `[2,8,8,2]` — **not** `[2,8,9]` / `[2,8,10]`. This is the single most common shell-data bug; call it out explicitly if you ever ask an agent to generate elements past Z=18.

---

## 2. Valence Electrons (main-group elements only — MVP scope)

For main-group elements, valence electron count = last digit of the IUPAC group number:

| Group | Valence e⁻ |
|---|---|
| 1 | 1 |
| 2 | 2 |
| 13 | 3 |
| 14 | 4 |
| 15 | 5 |
| 16 | 6 |
| 17 | 7 |
| 18 | 8 (He = 2, the one exception) |

This rule does **not** apply to transition metals (groups 3–12) — they're out of MVP scope. Don't extend this formula to them later without separate rules.

---



## 4. Octet / Duet Rule

- Every atom except H and He "wants" 8 valence electrons (octet). H and He want 2 (duet).
- Exceptions that exist in real chemistry but aren't needed for the 5 MVP scenarios: B/Be commonly form stable compounds with an incomplete octet; P/S/Cl can exceed 8 in some compounds (expanded octet). Don't hardcode "always exactly 8" in a way that would break if scenarios expand later — but you don't need to implement these exceptions yet either.

---

## 5. Bond Classification — ΔEN Rule

`resolveBond(A, B)`:

1. **If either atom's electronegativity is `null` → return `"no-bond"` immediately.** Do this check before anything else — you cannot subtract from `null`.
2. `ΔEN = |EN_A − EN_B|`
3. `ΔEN ≤ 0.4` → `nonpolar-covalent`
4. `0.4 < ΔEN ≤ 1.7` → `polar-covalent`
5. `ΔEN > 1.7` → `ionic`

*(This matches the thresholds already in your MVP plan — confirmed correct. It's the standard Pauling teaching heuristic, not an exact physical law: HF, for instance, has ΔEN ≈ 1.78 — technically crosses into "ionic" by the raw number — but is universally taught as a polar covalent molecule. For your 5 MVP scenarios the heuristic gives the textbook-correct answer every time, so implement it exactly as above; just don't advertise it as infallible if you ever open the table to arbitrary element pairs.)*

---

## 6. Verified Classification — the 5 MVP Scenarios

| Scenario | Bond | ΔEN | Classification |
|---|---|---|---|
| NaCl | Na–Cl | \|0.93−3.16\| = 2.23 | ionic |
| H₂O | O–H | \|3.44−2.20\| = 1.24 | polar-covalent |
| CH₄ | C–H | \|2.55−2.20\| = 0.35 | nonpolar-covalent |
| O₂ | O–O | 0 | nonpolar-covalent |
| He + Ne | — | n/a (both null) | no-bond |

Your plan's own worked example for NaCl (ΔEN = 2.23) checks out exactly against this table.

---

## 7. Ionic Bonding — Electron Transfer & Formula Ratio

- The lower-EN atom (metal) loses electrons; the higher-EN atom (nonmetal) gains them, until both reach the nearest noble-gas configuration.
- Electrons lost by the metal = its valence electron count.
- Electrons gained by the nonmetal = 8 − its valence electron count.
- Resulting ion charges: metal → +(electrons lost), nonmetal → −(electrons gained).
- **Formula ratio** = smallest whole-number ratio that balances total + and − charge.
  - Na (loses 1 → Na⁺) + Cl (gains 1 → Cl⁻) → 1:1 → **NaCl**
  - Mg (loses 2 → Mg²⁺) + Cl (gains 1 → Cl⁻) → 1:2 → **MgCl₂** *(not in your 5 scenarios, but include this rule so the resolver isn't silently hardcoded to always output 1:1)*

---

## 8. Covalent Bonding — Shared Pairs & Bond Order

- Two nonmetals share electron pairs until both reach octet (or duet for H).
- Bond order (single/double/triple) = electrons an atom is short of octet, shared with its partner(s).

| Scenario | Reasoning | Result |
|---|---|---|
| O₂ | Each O is short 2 e⁻ → shares 2 pairs with its one partner | double bond |
| H₂O | O is short 2 e⁻ total → distributed as 2 separate single bonds | 2× single bond (O–H, O–H) |
| CH₄ | C is short 4 e⁻ → distributed as 4 separate single bonds | 4× single bond (C–H ×4) |

(For future expansion: N₂ would be a triple bond — N is short 3 e⁻.)

---

## 9. Diatomic Elements Rule

Seven elements exist as diatomic molecules in their pure elemental state: H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂ (mnemonic: "BrINClHOF"). This matters for your Stoichiometry Auto-Resolver (MVP plan §2.1) — selecting a single O with no partner, in an "elemental form" context, should auto-pair to O₂ the same way H+O auto-upgrades to 2H+1O.

---

## 10. Noble Gas Non-Reactivity

He, Ne, and Ar do not bond under classroom conditions. This must render as an explicit state in your UI — not a silent failure or empty canvas. Suggested theory-panel text: *"Neon zaten kararlı bir elektron dizilimine sahip; tepkimeye girmez."* This is a real, correct chemistry fact — treat it as a designed state, not a missing feature.

---

## 11. Known Simplification — Document, Don't "Fix"

Bond polarity ≠ molecule polarity. A molecule can have polar bonds but be nonpolar overall due to symmetric 3D geometry (CO₂, BF₃) — this requires molecular geometry your 2D canvas doesn't model. For your 5 MVP scenarios this never causes a wrong answer (CH₄'s C–H bonds are already nonpolar-covalent at the bond level, and the molecule is nonpolar too — no conflict). Leave a code comment flagging this scope boundary so a future agent doesn't "fix" CO₂ into an incorrect classification later.
