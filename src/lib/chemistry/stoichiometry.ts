import rawReactions from '../../data/reactions.json';
import { ReactionScenario, ElementData } from '../../types/chemistry';
import { reactionEngine } from './strategies/ReactionEngine';

const reactions: ReactionScenario[] = rawReactions as ReactionScenario[];

/**
 * Stoichiometry Auto-Resolver based on the extensible ReactionEngine Strategy Pattern (OCP & LSP).
 * Dynamically resolves scenarios for arbitrary element combinations without hardcoded if/else switches.
 */
export function resolveScenario(
  selectedSymbols: string[],
  elementsMap?: Record<string, ElementData>
): ReactionScenario | null {
  return reactionEngine.resolveScenario(selectedSymbols, elementsMap);
}

export function getAllScenarios(): ReactionScenario[] {
  return reactions;
}
