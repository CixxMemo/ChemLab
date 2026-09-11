import { IAtomRenderData, ReactionScenario } from '../../types/chemistry';

export interface RenderState {
  progress: number; // 0.0 to 1.0
  rotation: number; // continuous orbit rotation angle in radians
  flashProgress: number; // 0.0 to 1.0 for bond flash effects
  scenario: ReactionScenario | null;
  elementsMap: Record<string, IAtomRenderData>;
  selectedElements: IAtomRenderData[];
}

/**
 * DIP Abstraction for Canvas Rendering.
 * High-level canvas hooks and React components depend on this abstraction,
 * not on concrete rendering or physics implementations.
 */
export interface IRenderEngine {
  render(ctx: CanvasRenderingContext2D, state: RenderState): void;
  resize(width: number, height: number, dpr: number): void;
}
