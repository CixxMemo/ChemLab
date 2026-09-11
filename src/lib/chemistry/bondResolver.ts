import { ElementData, BondAnalysis } from '../../types/chemistry';
import { reactionEngine } from './strategies/ReactionEngine';

/**
 * Pure chemistry bond resolver adhering to SOLID (OCP & LSP).
 * Delegates chemical classification to ReactionEngine and strategy polymorphic dispatch.
 */
export function resolveBond(elemA: ElementData, elemB: ElementData): BondAnalysis {
  return reactionEngine.resolveBond(elemA, elemB);
}
