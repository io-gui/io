import { ReactiveNode, Binding } from '@io-gui/core';
import { Pad } from './items/pad.js';
import { Terminal, type TerminalColor } from './items/terminal.js';
import { Line } from './items/line.js';
import { Plotter } from './plotter.js';
export type DrawMode = 'pad' | 'terminal' | 'line' | 'delete';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export declare class Game extends ReactiveNode {
    width: number;
    height: number;
    pads: Pad[];
    terminals: Terminal[];
    lines: Line[];
    drawMode: DrawMode;
    drawColor: TerminalColor;
    drawLayer: number;
    undoStack: string[];
    redoStack: string[];
    currentLevel: string;
    plotter: Plotter;
    storedState: Binding;
    clear(): void;
    initialize(): Promise<void>;
    currentLevelChanged(): void;
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