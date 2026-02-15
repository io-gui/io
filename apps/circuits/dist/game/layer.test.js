import { describe, expect, it } from 'vitest';
import { Layer } from './layer.js';
describe('Layer', () => {
    it('clears stale cells when a shortened line is deleted', () => {
        const layer = new Layer(8, 8);
        expect(layer.addAt(2, 2)).toBe(true);
        expect(layer.extendAt(3, 2)).toBe(true);
        expect(layer.extendAt(4, 2)).toBe(true);
        expect(layer.getLinesAt(4, 2)).toContain(layer.lastLine);
        expect(layer.extendAt(3, 2)).toBe(true);
        const line = layer.lastLine;
        expect(line).toBeTruthy();
        expect(layer.delete(line)).toBe(true);
        expect(layer.getLinesAt(2, 2)).toBeUndefined();
        expect(layer.getLinesAt(3, 2)).toBeUndefined();
        expect(layer.getLinesAt(4, 2)).toBeUndefined();
        expect(layer.lines).toHaveLength(0);
    });
});
//# sourceMappingURL=layer.test.js.map