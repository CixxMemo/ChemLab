import { describe, it, expect, vi } from 'vitest';
import { CanvasBohrEngine } from './CanvasBohrEngine';
import { DebugWireframeEngine } from './DebugWireframeEngine';
import { IRenderEngine, RenderState } from './IRenderEngine';

describe('IRenderEngine DIP Implementations', () => {
  const createMockContext = () => {
    const mockProps: Record<string, unknown> = {
      canvas: { width: 400, height: 300 }
    };
    return new Proxy(mockProps, {
      get(target, prop: string) {
        if (prop in target) return target[prop];
        target[prop] = vi.fn();
        return target[prop];
      },
      set(target, prop: string, value) {
        target[prop] = value;
        return true;
      }
    }) as unknown as CanvasRenderingContext2D;
  };

  const dummyState: RenderState = {
    progress: 0.5,
    rotation: 1.2,
    flashProgress: 0,
    scenario: null,
    bondAnalysis: null,
    elementsMap: {},
    selectedElements: []
  };

  it('allows polymorphic substitution between CanvasBohrEngine and DebugWireframeEngine (LSP & DIP)', () => {
    const engines: IRenderEngine[] = [
      new CanvasBohrEngine(),
      new DebugWireframeEngine()
    ];

    const ctx = createMockContext();

    engines.forEach(engine => {
      // Both engines implement resize without throwing
      expect(() => engine.resize(800, 600, 2)).not.toThrow();

      // Both engines implement render without throwing
      expect(() => engine.render(ctx, dummyState)).not.toThrow();
    });
  });

  it('keeps dimensions private to each renderer instance', () => {
    const first = new DebugWireframeEngine();
    const second = new DebugWireframeEngine();
    first.resize(500, 400, 1);
    second.resize(900, 700, 1);
    const firstContext = createMockContext();
    const secondContext = createMockContext();
    first.render(firstContext, dummyState);
    second.render(secondContext, dummyState);
    expect(firstContext.strokeRect).toHaveBeenCalledWith(10, 10, 480, 380);
    expect(secondContext.strokeRect).toHaveBeenCalledWith(10, 10, 880, 680);
  });

  it('DebugWireframeEngine draws wireframe elements with progress feedback', () => {
    const wireframe = new DebugWireframeEngine();
    wireframe.resize(500, 400, 1);
    const ctx = createMockContext();

    wireframe.render(ctx, {
      ...dummyState,
      progress: 0.75,
      selectedElements: [
        {
          atomicNumber: 17,
          symbol: 'Cl',
          category: 'halogen',
          valanceElectrons: 7,
          shells: [2, 8, 7]
        }
      ]
    });

    expect(ctx.strokeRect).toHaveBeenCalledWith(10, 10, 480, 380);
    expect(ctx.fillText).toHaveBeenCalledWith('[DEBUG WIREFRAME] Progress: 75%', 20, 30);
    expect(ctx.fillText).toHaveBeenCalledWith('Reactants: Cl', 20, 48);
  });
});
