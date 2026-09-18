import { IRenderEngine, RenderState } from './IRenderEngine';

const MIN_SCENE_WIDTH = 560; // px covering the legacy pair animations' initial atom spacing and outer shells.
const MIN_SCENE_HEIGHT = 320; // px covering the water animation's vertical atom arrangement.
const EMPTY_SIZE = 0; // An unmeasured or hidden container cannot produce a drawable viewport.
const UNIT_SCALE = 1; // Never enlarge the scene beyond its native coordinate system.

/** Fits an injected renderer into a compact preview without changing its atom geometry. */
export class FittedRenderEngine implements IRenderEngine {
  private width = EMPTY_SIZE;
  private height = EMPTY_SIZE;
  private scale = UNIT_SCALE;

  constructor(private readonly engine: IRenderEngine) {}

  resize(width: number, height: number, dpr: number): void {
    this.width = Number.isFinite(width) ? Math.max(EMPTY_SIZE, width) : EMPTY_SIZE;
    this.height = Number.isFinite(height) ? Math.max(EMPTY_SIZE, height) : EMPTY_SIZE;
    this.scale = Math.min(UNIT_SCALE, this.width / MIN_SCENE_WIDTH, this.height / MIN_SCENE_HEIGHT);
    if (this.scale <= EMPTY_SIZE) return;
    this.engine.resize(this.width / this.scale, this.height / this.scale, dpr);
  }

  render(ctx: CanvasRenderingContext2D, state: RenderState): void {
    if (this.width <= EMPTY_SIZE || this.height <= EMPTY_SIZE) return;
    ctx.save();
    try {
      ctx.scale(this.scale, this.scale);
      this.engine.render(ctx, state);
    } finally {
      ctx.restore();
    }
  }
}
