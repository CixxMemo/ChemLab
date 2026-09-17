import { IRenderEngine, RenderState } from './IRenderEngine';
import { renderScene } from './animationPhysics';

export class CanvasBohrEngine implements IRenderEngine {
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  public resize(width: number, height: number, dpr: number): void {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
  }

  public render(ctx: CanvasRenderingContext2D, state: RenderState): void {
    const w = this.width || (ctx.canvas.width / (this.dpr || 1)) || 300;
    const h = this.height || (ctx.canvas.height / (this.dpr || 1)) || 300;

    renderScene(ctx, w, h, state);
  }
}
