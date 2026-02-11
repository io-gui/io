import { ReactiveNode } from '@io-gui/core';
import { Pad, type PadColor } from './items/pad.js';
import { Line } from './items/line.js';
type vec2 = [number, number];
export interface PointAt {
    id: number;
    isTerminal: boolean;
}
/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
export declare class Plotter extends ReactiveNode {
    width: number;
    height: number;
    pads: Pad[];
    lines: Line[];
    connect(pads: Pad[], lines: Line[], width: number, height: number): void;
    getPointAt([x, y]: vec2): Pad | undefined;
    getLinesAtPoint([x, y]: vec2, filter?: (line: Line) => boolean): Line[];
    getLineById(id: number): Line | undefined;
    checkDiagonalCrossing(line: Line, [x, y]: vec2): boolean;
    addPad(id: number, [x, y]: vec2, color?: PadColor, isTerminal?: boolean): boolean;
    delete([x, y]: vec2): void;
    verifyLineComplete(id: number): boolean;
    isInBounds([x, y]: vec2): boolean;
    addLineSegment(id: number, [x, y]: vec2, layer: number): {
        added: boolean;
        endDrag: boolean;
    };
}
export {};
//# sourceMappingURL=plotter.d.ts.map