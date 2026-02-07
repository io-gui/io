import { describe, it, expect } from 'vitest';
import { Game } from './game.js';
describe('Game layer and line logic', () => {
    it('getLineCount counts only layer 0 lines at position', () => {
        const game = new Game();
        game.fromJSON(JSON.stringify({
            width: 4,
            height: 5,
            pads: [{ ID: 1, pos: [0, 0] }, { ID: 2, pos: [1, 0] }],
            terminals: [],
            lines: [
                { ID: 10, pos: [[0, 0], [1, 0]], layer: 0 },
                { ID: 11, pos: [[0, 0], [0, 1]], layer: -1 },
            ],
        }));
        expect(game.getLineCount(0, 0)).toBe(1);
        expect(game.getLineCount(1, 0)).toBe(1);
        expect(game.getUnderlineCount(0, 0)).toBe(1);
        expect(game.getUnderlineCount(1, 0)).toBe(0);
    });
    it('addLine with layer creates line and sets lineColors by layer', () => {
        const game = new Game();
        game.fromJSON(JSON.stringify({
            width: 4,
            height: 5,
            pads: [{ ID: 1, pos: [0, 0] }, { ID: 2, pos: [2, 0] }],
            terminals: [],
            lines: [],
        }));
        game.addLine(100, 0, 0, 0);
        expect(game.lines[100]).toBeDefined();
        expect(game.lines[100].layer).toBe(0);
        expect(game.lineColors[100]).toBe('white');
        game.addLine(101, 0, 0, -1);
        expect(game.lines[101].layer).toBe(-1);
        expect(game.lineColors[101]).toBe('grey');
    });
    it('loads level with legacy line color from JSON', () => {
        const game = new Game();
        game.fromJSON(JSON.stringify({
            width: 4,
            height: 5,
            pads: [{ ID: 1, pos: [0, 0] }],
            terminals: [],
            lines: [
                { ID: 20, pos: [[0, 0], [1, 0]], color: 'grey' },
                { ID: 21, pos: [[1, 0], [2, 0]], color: 'white' },
            ],
        }));
        expect(game.lines[20].layer).toBe(-1);
        expect(game.lines[21].layer).toBe(0);
    });
    it('resetColors sets lineColors by layer', () => {
        const game = new Game();
        game.fromJSON(JSON.stringify({
            width: 4,
            height: 5,
            pads: [],
            terminals: [],
            lines: [
                { ID: 30, pos: [[0, 0], [1, 0]], layer: 0 },
                { ID: 31, pos: [[1, 0], [2, 0]], layer: -1 },
            ],
        }));
        game.resetColors();
        expect(game.lineColors[30]).toBe('white');
        expect(game.lineColors[31]).toBe('grey');
    });
});
//# sourceMappingURL=game.test.js.map