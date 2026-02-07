import { ReactiveNode } from '@io-gui/core';
import { Pad } from './items/pad.js';
import { Terminal, type TerminalColor } from './items/terminal.js';
import { Line } from './items/line.js';
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
    terminals: Terminal[];
    lines: Line[];
    connect(pads: Pad[], terminals: Terminal[], lines: Line[], width: number, height: number): void;
    getPointAt(x: number, y: number): Pad | Terminal | undefined;
    getLinesAtPoint(x: number, y: number, filter?: (line: Line) => boolean): Line[];
    getLineById(id: number): Line | undefined;
    checkDiagonalCrossing(line: Line, x: number, y: number): boolean;
    addPad(id: number, x: number, y: number): boolean;
    addTerminal(id: number, x: number, y: number, color: TerminalColor): boolean;
    delete(x: number, y: number): void;
    verifyLineLegality(id: number): boolean;
    addLineSegment(id: number, x: number, y: number, layer: number): {
        added: boolean;
        endDrag: boolean;
    };
}
//# sourceMappingURL=plotter.d.ts.map