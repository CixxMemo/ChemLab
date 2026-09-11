import { ElementData, BondAnalysis, ReactionScenario } from '../../../types/chemistry';

export interface ReactionContext {
  reactants: ElementData[];
  primaryAtom: ElementData;
  secondaryAtom: ElementData;
  deltaEN: number | null;
  donor: ElementData;
  acceptor: ElementData;
  isNobleInvolved: boolean;
}

export interface PhysicsMetrics {
  repulsion: boolean;
  repulsionStrength: number;
  overlapDistance: number;
  isReactionOccurred: boolean;
}

/**
 * Strict LSP Contract for Reaction Resolutions.
 * All strategies MUST return a fully formed, non-null ReactionResolution.
 * The consuming engine and renderers can treat every result interchangeably without
 * runtime type-checking or special-casing null values.
 */
export interface ReactionResolution {
  scenario: ReactionScenario;
  bondAnalysis: BondAnalysis;
  physics: PhysicsMetrics;
}

/**
 * Strategy Pattern Interface (OCP & LSP compliant).
 * Open for extension (new reaction strategies can be registered without modifying the engine),
 * closed for modification.
 */
export interface IReactionStrategy {
  readonly id: string;
  readonly name: string;

  /**
   * Determines if this strategy can process the given reaction context.
   */
  supports(context: ReactionContext): boolean;

  /**
   * Resolves the reaction, producing a complete, non-null ReactionResolution.
   * Conforms strictly to LSP: Never returns null/undefined, never throws on valid contexts.
   */
  resolve(context: ReactionContext): ReactionResolution;
}
