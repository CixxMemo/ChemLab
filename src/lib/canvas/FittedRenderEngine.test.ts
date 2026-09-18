import { describe, expect, it, vi } from 'vitest';
import { FittedRenderEngine } from './FittedRenderEngine';
import { IRenderEngine, RenderState } from './IRenderEngine';

const SCENE_WIDTH = 560; // The smallest coordinate surface covering the legacy pair animations.
const SCENE_HEIGHT = 320; // The smallest coordinate surface covering vertical arrangements.
const HALF = 0.5; // Narrow viewport fixture at half the renderer's native dimensions.
const FULL = 1; // Native coordinate scale and device pixel ratio.
const ZERO = 0; // Empty or unmeasured viewport boundary.
const NEGATIVE_SIZE = -1; // Invalid resize input must not reach the injected engine.

function createFixture() {
  const engine: IRenderEngine = { resize: vi.fn(), render: vi.fn() };
  const context = { save: vi.fn(), scale: vi.fn(), restore: vi.fn() };
  const ctx = context as unknown as CanvasRenderingContext2D;
  const state: RenderState = {
    progress: ZERO, rotation: ZERO, flashProgress: ZERO,
    scenario: null, bondAnalysis: null, selectedElements: [], elementsMap: {}
  };
  return { engine, context, ctx, state, fitted: new FittedRenderEngine(engine) };
}

describe('FittedRenderEngine', () => {
  it('scales small viewports while forwarding domain data unchanged', () => {
    const { fitted, engine, context, ctx, state } = createFixture();
    fitted.resize(SCENE_WIDTH * HALF, SCENE_HEIGHT, FULL);
    fitted.render(ctx, state);
    expect(engine.resize).toHaveBeenCalledWith(SCENE_WIDTH, SCENE_HEIGHT / HALF, FULL);
    expect(context.scale).toHaveBeenCalledWith(HALF, HALF);
    expect(engine.render).toHaveBeenCalledWith(ctx, state);
    expect(context.restore).toHaveBeenCalledOnce();
  });

  it('fits by height too and does not magnify larger viewports', () => {
    const { fitted, engine, context, ctx, state } = createFixture();
    fitted.resize(SCENE_WIDTH, SCENE_HEIGHT * HALF, FULL);
    expect(engine.resize).toHaveBeenLastCalledWith(SCENE_WIDTH / HALF, SCENE_HEIGHT, FULL);
    fitted.resize(SCENE_WIDTH / HALF, SCENE_HEIGHT / HALF, FULL);
    fitted.render(ctx, state);
    expect(context.scale).toHaveBeenCalledWith(FULL, FULL);
  });

  it.each([ZERO, NEGATIVE_SIZE, NaN, Infinity])('skips invalid or hidden dimensions: %s', dimension => {
    const { fitted, engine, ctx, state } = createFixture();
    fitted.render(ctx, state);
    fitted.resize(dimension, SCENE_HEIGHT, FULL);
    fitted.render(ctx, state);
    fitted.resize(SCENE_WIDTH, dimension, FULL);
    fitted.render(ctx, state);
    expect(engine.render).not.toHaveBeenCalled();
    expect(engine.resize).not.toHaveBeenCalled();
  });

  it('does not share viewport state between concurrent consumers', () => {
    const first = createFixture();
    const second = createFixture();
    first.fitted.resize(SCENE_WIDTH * HALF, SCENE_HEIGHT, FULL);
    second.fitted.resize(SCENE_WIDTH, SCENE_HEIGHT, FULL);
    first.fitted.render(first.ctx, first.state);
    second.fitted.render(second.ctx, second.state);
    expect(first.context.scale).toHaveBeenCalledWith(HALF, HALF);
    expect(second.context.scale).toHaveBeenCalledWith(FULL, FULL);
  });
});
