import { describe, it, expect, vi } from 'vitest';
import { Pads } from './pads.js';
import { Pad } from './items/pad.js';
describe('Pads', () => {
    it('stores and retrieves pads by stride index', () => {
        const pads = new Pads(5, 6);
        expect(pads.addAt(2, 3)).toBe(true);
        const pad = pads.getAt(2, 3);
        expect(pad).toBeInstanceOf(Pad);
        expect(pads.toJSON()).toEqual({ '17': {} });
    });
    it('rejects collisions and out-of-bounds writes', () => {
        const pads = new Pads(5, 6);
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        expect(pads.addAt(1, 1)).toBe(true);
        expect(pads.addAt(1, 1)).toBe(false);
        expect(pads.addAt(-1, 0)).toBe(false);
        expect(pads.addAt(5, 0)).toBe(false);
        expect(pads.addAt(0, 6)).toBe(false);
        consoleErrorSpy.mockRestore();
    });
    it('deletes pads from index and value list', () => {
        const pads = new Pads(5, 6);
        pads.addAt(3, 2, 'red');
        expect(pads.getAt(3, 2)).toBeTruthy();
        expect(pads.deleteAt(3, 2)).toBe(true);
        expect(pads.getAt(3, 2)).toBeUndefined();
    });
    it('rebuilds index from replace source', () => {
        const source = {
            '0': {},
            '29': { color: 'blue' },
        };
        const pads = Pads.fromJSON(5, 6, source);
        expect(pads.getAt(0, 0)).toBeInstanceOf(Pad);
        expect(pads.getAt(4, 5)?.isTerminal).toBe(true);
        expect(pads.toJSON()).toEqual(source);
    });
});
//# sourceMappingURL=pads.test.js.map