import { describe, it, expect, vi } from 'vitest';
import { CanvasBohrEngine, defaultBohrEngine } from './CanvasBohrEngine';
import { DebugWireframeEngine, debugWireframeEngine } from './DebugWireframeEngine';
import { IRenderEngine, RenderState } from './IRenderEngine';

describe('IRenderEngine DIP Implementations', () => {
  const createMockContext = () => {
    const mockProps: Record<string, any> = {
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
    elementsMap: {},
    selectedElements: []
  };

  it('allows polymorphic substitution between CanvasBohrEngine and DebugWireframeEngine (LSP & DIP)', () => {
    const engines: IRenderEngine[] = [
      defaultBohrEngine,
      new CanvasBohrEngine(),
      debugWireframeEngine,
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
