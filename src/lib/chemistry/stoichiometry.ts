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
  if (!selectedSymbols || selectedSymbols.length === 0) {
    return null;
  }

  // 1. Noble Gas Non-Reactivity (Section 10)
  const nobleSymbols = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
  const hasNoble = selectedSymbols.some(s => nobleSymbols.includes(s));
  if (hasNoble) {
    const inertScenario = reactions.find(r => r.id === 'inert_gas');
    return inertScenario || null;
  }

  const uniqueSymbols = Array.from(new Set(selectedSymbols));

  // 2. Scenario 1: NaCl (Section 6 & 7)
  if (uniqueSymbols.includes('Na') && uniqueSymbols.includes('Cl')) {
    return reactions.find(r => r.id === 'nacl') || null;
  }

  // 3. Scenario 2: H2O (Section 6 & 8)
  if (uniqueSymbols.includes('H') && uniqueSymbols.includes('O')) {
    return reactions.find(r => r.id === 'h2o') || null;
  }

  // 4. Scenario 4: CH4 (Section 6 & 8)
  if (uniqueSymbols.includes('C') && uniqueSymbols.includes('H')) {
    return reactions.find(r => r.id === 'ch4') || null;
  }

  // 5. Scenario 3: Diatomic Elements Rule (Section 9 - "BrINClHOF")
  // Selecting O or duplicate O auto-pairs to O2
  if (selectedSymbols.every(s => s === 'O')) {
    return reactions.find(r => r.id === 'o2') || null;
  }

  return null;
}

export function getAllScenarios(): ReactionScenario[] {
  return reactions;
}
