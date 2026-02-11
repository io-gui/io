import { ReactiveNode, Binding } from '@io-gui/core';
import { Pad, type PadColor } from './items/pad.js';
import { Line } from './items/line.js';
import { Plotter } from './plotter.js';
export type DrawMode = 'pad' | 'terminal' | 'line' | 'delete';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export declare class Game extends ReactiveNode {
    level: string;
    pads: Pad[];
    lines: Line[];
    width: number;
    height: number;
    drawMode: DrawMode;
    drawColor: PadColor;
    drawLayer: number;
    undoStack: string[];
    redoStack: string[];
    plotter: Plotter;
    storedState: Binding;
    clear(): void;
    initialize(): Promise<void>;
    levelChanged(): void;
    reload(): void;
    load(level: string): Promise<void>;
    save(): void;
    fromJSON(jsonText: string): void;
    toJSON(): string;
    updateUndoStack(): void;
    undo(): void;
    redo(): void;
    resetColors(): void;
    propagateColors(): void;
    finalizeMove(lineID: number): void;
}
//# sourceMappingURL=game.d.ts.map