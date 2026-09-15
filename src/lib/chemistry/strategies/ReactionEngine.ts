import { IReactionStrategy, ReactionContext, ReactionResolution } from './IReactionStrategy';
import { InertReactionStrategy } from './InertReactionStrategy';
import { IonicReactionStrategy } from './IonicReactionStrategy';
import { CovalentReactionStrategy } from './CovalentReactionStrategy';
import { ElementData, BondAnalysis, ReactionScenario } from '../../../types/chemistry';
import { createOctetStatus } from '../reactionDomain';
import rawElements from '../../../data/elements.json';

const defaultElementsMap = rawElements as Record<string, ElementData>;

/**
 * ReactionEngine: Strategy Registry and Dispatcher.
 * Compliant with:
 * - OCP (Open for Extension via registerStrategy, Closed for Modification).
 * - LSP (Substitutes strategies polymorphically without type casts or null checks).
 */
export class ReactionEngine {
  private strategies: IReactionStrategy[] = [];

  constructor() {
    // Register default core strategies in precedence order
    this.registerStrategy(new InertReactionStrategy());
    this.registerStrategy(new IonicReactionStrategy());
    this.registerStrategy(new CovalentReactionStrategy());
  }

  /**
   * Registers a new reaction strategy dynamically (OCP).
   * New strategies are prepended so custom extensions can take precedence over defaults.
   */
  public registerStrategy(strategy: IReactionStrategy): void {
    // Avoid duplicate registration by ID
    this.strategies = [strategy, ...this.strategies.filter(s => s.id !== strategy.id)];
  }

  public getStrategies(): readonly IReactionStrategy[] {
    return this.strategies;
  }

  /**
   * Constructs the domain ReactionContext for strategy dispatch.
   */
  public buildContext(reactants: ElementData[]): ReactionContext | null {
    if (!reactants || reactants.length === 0) {
      return null;
    }

    const primaryAtom = reactants[0];
    const secondaryAtom = reactants[1] || reactants[0];

    const isNobleInvolved =
      primaryAtom.category === 'noble' ||
      secondaryAtom.category === 'noble' ||
      primaryAtom.group === 18 ||
      secondaryAtom.group === 18 ||
      primaryAtom.electronegativity === null ||
      secondaryAtom.electronegativity === null;

    let deltaEN: number | null = null;
    if (
      !isNobleInvolved &&
      primaryAtom.electronegativity !== null &&
      secondaryAtom.electronegativity !== null
    ) {
      deltaEN = Number(
        Math.abs(primaryAtom.electronegativity - secondaryAtom.electronegativity).toFixed(2)
      );
    }

    // Determine donor (lower EN / metal) and acceptor (higher EN / nonmetal)
    const pEN = primaryAtom.electronegativity ?? 0;
    const sEN = secondaryAtom.electronegativity ?? 0;
    const isPElectroNegative = pEN >= sEN;
    const acceptor = isPElectroNegative ? primaryAtom : secondaryAtom;
    const donor = isPElectroNegative ? secondaryAtom : primaryAtom;

    return {
      reactants,
      primaryAtom,
      secondaryAtom,
      deltaEN,
      donor,
      acceptor,
      isNobleInvolved
    };
  }

  /**
   * Polymorphically executes the matching strategy (LSP compliant).
   */
  public resolve(reactants: ElementData[]): ReactionResolution | null {
    const context = this.buildContext(reactants);
    if (!context) return null;

    const matchedStrategy = this.strategies.find(strategy => strategy.supports(context));
    if (!matchedStrategy) {
      // Fallback to inert if no strategy explicitly matched
      const inertStrategy = this.strategies.find(s => s.id === 'inert') || new InertReactionStrategy();
      return inertStrategy.resolve(context);
    }

    return matchedStrategy.resolve(context);
  }

  /**
   * Resolves bond analysis for two elements.
   */
  public resolveBond(elemA: ElementData, elemB: ElementData): BondAnalysis {
    const resolution = this.resolve([elemA, elemB]);
    if (resolution) {
      return resolution.bondAnalysis;
    }

    const octetStatuses = [
      createOctetStatus(elemA, elemA.valanceElectrons),
      createOctetStatus(elemB, elemB.valanceElectrons)
    ] as const;

    // Default safe fallback if single element or missing
    return {
      bondType: 'no-bond',
      deltaEN: null,
      primaryAtom: elemA,
      secondaryAtom: elemB,
      octetStatuses,
      explanationTR: 'Bağ oluşturmak için 2. bir element seçin.'
    };
  }

  /**
   * Resolves reaction scenario dynamically for selected element symbols.
   */
  public resolveScenario(
    selectedSymbols: string[],
    elementsMap: Record<string, ElementData> = defaultElementsMap
  ): ReactionScenario | null {
    if (!selectedSymbols || selectedSymbols.length < 2) {
      return null;
    }

    const allElements = Object.values(elementsMap);
    const reactants: ElementData[] = [];

    selectedSymbols.forEach(sym => {
      const el = allElements.find(e => e.symbol === sym);
      if (el) reactants.push(el);
    });

    if (reactants.length < 2) {
      return null;
    }

    const resolution = this.resolve(reactants);
    return resolution ? resolution.scenario : null;
  }
}

// Export default singleton instance
export const reactionEngine = new ReactionEngine();
