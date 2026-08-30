import rawReactions from '../../data/reactions.json';
import { ReactionScenario } from '../../types/chemistry';

const reactions: ReactionScenario[] = rawReactions as ReactionScenario[];

/**
 * MVP Stoichiometry Auto-Resolver based on .agents/chemistry-rules.md:
 * Automatically resolves element combinations to the 5 MVP scenarios:
 * 1. NaCl (Na + Cl)
 * 2. H2O (H + O -> 2H + 1O)
 * 3. O2 (O or O+O -> diatomic O2 auto-pairing)
 * 4. CH4 (C + H -> 1C + 4H)
 * 5. Noble gas (He, Ne, Ar, Kr, Xe, Rn -> no-bond / inert repulsion)
 */
export function resolveScenario(selectedSymbols: string[]): ReactionScenario | null {
  // Reaction scenarios strictly require AT LEAST 2 elements (e.g. O+O, Na+Cl, H+O, C+H, He+He)
  if (!selectedSymbols || selectedSymbols.length < 2) {
    return null;
  }

  // 1. Noble Gas Non-Reactivity (requires 2+ elements where at least one is noble)
  const nobleSymbols = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
  const hasNoble = selectedSymbols.some(s => nobleSymbols.includes(s));
  if (hasNoble) {
    const inertScenario = reactions.find(r => r.id === 'inert_gas');
    return inertScenario || null;
  }

  const uniqueSymbols = Array.from(new Set(selectedSymbols));

  // 2. Scenario 1: NaCl (Na + Cl)
  if (uniqueSymbols.includes('Na') && uniqueSymbols.includes('Cl')) {
    return reactions.find(r => r.id === 'nacl') || null;
  }

  // 3. Scenario 2: H2O (H + O)
  if (uniqueSymbols.includes('H') && uniqueSymbols.includes('O')) {
    return reactions.find(r => r.id === 'h2o') || null;
  }

  // 4. Scenario 4: CH4 (C + H)
  if (uniqueSymbols.includes('C') && uniqueSymbols.includes('H')) {
    return reactions.find(r => r.id === 'ch4') || null;
  }

  // 5. Scenario 3: Diatomic Elements Rule (Section 9 - "BrINClHOF")
  // Only triggers when TWO Oxygen atoms are explicitly selected: [O, O]
  if (selectedSymbols.length >= 2 && selectedSymbols.every(s => s === 'O')) {
    return reactions.find(r => r.id === 'o2') || null;
  }

  return null;
}

export function getAllScenarios(): ReactionScenario[] {
  return reactions;
}
