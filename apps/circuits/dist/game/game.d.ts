import { Pad } from './pad.js';
import { Terminal } from './terminal.js';
import { Line } from './line.js';
export type DrawMode = 'pad' | 'terminal' | 'line' | 'delete';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export declare class Game {
    width: number;
    height: number;
    pads: Record<number, Pad>;
    terminals: Record<number, Terminal>;
    lines: Record<number, Line>;
    padColors: Record<number, string>;
    terminalColors: Record<number, string>;
    lineColors: Record<number, string>;
    drawMode: DrawMode;
    drawColor: string;
    drawLayer: number;
    undoStack: string[];
    redoStack: string[];
    currentLevel: string;
    /** Callback invoked after save — host element persists state. */
    onSave: ((level: string, json: string) => void) | null;
    /** Callback invoked on completion change. */
    onComplete: ((level: string, completed: boolean) => void) | null;
    /** Callback invoked when grid dimensions change and scene needs re-init. */
    onInitScene: (() => void) | null;
    /** Callback invoked when game state changes and scene needs re-render. */
    onRender: (() => void) | null;
    init(): void;
    load(level: string, savedState?: string): void;
    clear(): void;
    reset(level: string): Promise<void>;
    fromJSON(jsonText: string): void;
    toJSON(): string;
    private _cleanPads;
    private _cleanTerminals;
    private _cleanLines;
    save(): void;
    updateUndoStack(): void;
    undo(): void;
    redo(): void;
    getPointAt(x: number, y: number): {
        id: number;
        color: string;
        isTerminal: boolean;
    } | false;
    addPad(ID: number, x: number, y: number): void;
    addTerminal(ID: number, x: number, y: number, color: string): void;
    deletePad(x: number, y: number): void;
    deleteTerminal(x: number, y: number): void;
    /**
     * Add / extend a line.
     * Returns true if the line reached a destination pad or terminal (drag should stop).
     */
    addLine(ID: number, x: number, y: number, layer: number): boolean;
    getLineColor(x: number, y: number): string | false;
    getLineCount(x: number, y: number): number;
    getUnderlineCount(x: number, y: number): number;
    checkLine(ID: number): void;
    deleteLine(x: number, y: number): void;
    /** Prevent diagonal lines from crossing other diagonals on the same layer. */
    private _checkCrossing;
    resetColors(): void;
    propagateColors(): void;
    checkCompletion(): void;
    finalizeMove(lineID: number): void;
    initScene(): void;
    private _renderScene;
}
//# sourceMappingURL=game.d.ts.map