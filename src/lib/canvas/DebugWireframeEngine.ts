import { IRenderEngine, RenderState } from './IRenderEngine';

/**
 * Minimal debug/wireframe render engine implementing IRenderEngine.
 * Exercises DIP abstraction without modifying default production rendering.
 */
export class DebugWireframeEngine implements IRenderEngine {
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

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#4fa6e0';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText(`[DEBUG WIREFRAME] Progress: ${(state.progress * 100).toFixed(0)}%`, 20, 30);
    ctx.fillText(
      `Reactants: ${state.selectedElements.map(e => e.symbol).join(', ') || 'none'}`,
      20,
      48
    );
    ctx.restore();
  }
}
