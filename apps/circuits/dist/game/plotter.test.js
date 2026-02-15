import { describe, expect, it } from 'vitest';
import { Vector2 } from 'three/webgpu';
import { Plotter } from './plotter.js';
import { Pads } from './pads.js';
import { Layer } from './layer.js';
function createPlotter(width = 8, height = 8) {
    const plotter = new Plotter();
    const pads = new Pads(width, height);
    const layer0 = new Layer(width, height);
    const layer1 = new Layer(width, height);
    plotter.connect(pads, layer0, layer1);
    return { plotter, pads, layer0, layer1 };
}
describe('Plotter', () => {
    it('extends multiple cells in one call toward a distant point', () => {
        const { plotter, pads, layer1 } = createPlotter();
        pads.addAt(1, 1);
        expect(plotter.startLineAt(new Vector2(1, 1), 1)).toBe(true);
        expect(plotter.plotLineTo(new Vector2(5, 3), 1)).toBe(true);
        const line = layer1.lastLine;
        expect(line).toBeTruthy();
        expect(line.pos.map((pt) => [pt.x, pt.y])).toEqual([
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 3],
            [5, 3],
        ]);
    });
    it('stops at first blocked step and does not skip obstacle', () => {
        const { plotter, pads, layer1 } = createPlotter();
        expect(layer1.addAt(3, 3)).toBe(true);
        pads.addAt(1, 1);
        expect(plotter.startLineAt(new Vector2(1, 1), 1)).toBe(true);
        expect(plotter.plotLineTo(new Vector2(5, 5), 1)).toBe(true);
        const line = layer1.lastLine;
        expect(line).toBeTruthy();
        expect(line.lastPt.equals(new Vector2(2, 2))).toBe(true);
        expect(line.pos.map((pt) => [pt.x, pt.y])).toEqual([
            [1, 1],
            [2, 2],
        ]);
    });
    it('returns false when first step is blocked', () => {
        const { plotter, pads, layer1 } = createPlotter();
        expect(layer1.addAt(2, 2)).toBe(true);
        pads.addAt(1, 1);
        expect(plotter.startLineAt(new Vector2(1, 1), 1)).toBe(true);
        expect(plotter.plotLineTo(new Vector2(5, 5), 1)).toBe(false);
        const line = layer1.lastLine;
        expect(line).toBeTruthy();
        expect(line.pos.map((pt) => [pt.x, pt.y])).toEqual([[1, 1]]);
    });
    it('continues extending on later calls after path becomes clear', () => {
        const { plotter, pads, layer1 } = createPlotter();
        expect(layer1.addAt(3, 3)).toBe(true);
        pads.addAt(1, 1);
        expect(plotter.startLineAt(new Vector2(1, 1), 1)).toBe(true);
        expect(plotter.plotLineTo(new Vector2(5, 5), 1)).toBe(true);
        expect(layer1.deleteAt(3, 3)).toBe(true);
        expect(plotter.plotLineTo(new Vector2(5, 5), 1)).toBe(true);
        const line = layer1.lastLine;
        expect(line).toBeTruthy();
        expect(line.pos.map((pt) => [pt.x, pt.y])).toEqual([
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
        ]);
    });
});
//# sourceMappingURL=plotter.test.js.map