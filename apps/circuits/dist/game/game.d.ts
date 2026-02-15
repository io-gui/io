import { ReactiveNode, Binding } from '@io-gui/core';
import { Plotter } from './plotter.js';
import { Pads } from './pads.js';
import { Layer } from './layer.js';
export type DrawMode = 'pad' | 'terminal' | 'line' | 'delete';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export declare class Game extends ReactiveNode {
    level: string;
    width: number;
    height: number;
    pads: Pads;
    layer0: Layer;
    layer1: Layer;
    plotter: Plotter;
    storedState: Binding;
    undoStack: string[];
    redoStack: string[];
    static get Listeners(): {
        'game-init': string;
        'game-update': string;
    };
    load(level: string): Promise<void>;
    initialize(): Promise<void>;
    onGameInit(): void;
    onGameUpdate(): void;
    levelChanged(): void;
    reload(): void;
    save(): void;
    fromJSON(jsonText: string): void;
    toJSON(): string;
    updateUndoStack(): void;
    undo(): void;
    redo(): void;
    resetColors(): void;
    propagateColors(): void;
    updateTextures(): void;
    finalizeMove(): void;
}
//# sourceMappingURL=game.d.ts.map