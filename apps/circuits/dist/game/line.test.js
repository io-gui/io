import { describe, it, expect } from 'vitest';
import { Line } from './line.js';
describe('Line', () => {
    it('fromJSON with layer uses layer', () => {
        const line = Line.fromJSON({
            ID: 1,
            pos: [[0, 0], [1, 0]],
            layer: -1,
        });
        expect(line.layer).toBe(-1);
        expect(line.pos).toHaveLength(2);
        expect(line.toJSON()).toEqual({
            ID: 1,
            pos: [[0, 0], [1, 0]],
            layer: -1,
        });
    });
    it('fromJSON with legacy color white maps to layer 0', () => {
        const line = Line.fromJSON({
            ID: 2,
            pos: [[0, 0]],
            color: 'white',
        });
        expect(line.layer).toBe(0);
        expect(line.toJSON().layer).toBe(0);
        expect(line.toJSON().color).toBeUndefined();
    });
    it('fromJSON with legacy color grey maps to layer -1', () => {
        const line = Line.fromJSON({
            ID: 3,
            pos: [[1, 1], [2, 1]],
            color: 'grey',
        });
        expect(line.layer).toBe(-1);
        expect(line.toJSON().layer).toBe(-1);
    });
    it('constructor sets layer', () => {
        const line = new Line(4, [0, 0], 0);
        expect(line.layer).toBe(0);
        const bottom = new Line(5, [1, 1], -1);
        expect(bottom.layer).toBe(-1);
    });
});
//# sourceMappingURL=line.test.js.map