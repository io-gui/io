import type { ViewKind } from '../view/ThreeView.js';
import type { ViewInputEvent, Modifiers } from './ViewInputEvent.js';
/**
 * One binding, as data. `input` grammar: optional modifiers joined with `+`, then one of
 * `LMB drag` / `MMB drag` / `RMB drag`, `wheel`, or a `KeyboardEvent.code` (`KeyF`, `Numpad7`, `Home`).
 * Examples: `'Alt+LMB drag'`, `'Ctrl+wheel'`, `'Ctrl+Numpad7'`.
 */
export interface KeymapEntry {
    input: string;
    action: string;
    props?: Record<string, unknown>;
    when?: {
        viewKind?: ViewKind;
        mode?: string;
    };
}
type ParsedTrigger = {
    type: 'press';
    button: number;
} | {
    type: 'wheel';
} | {
    type: 'key';
    code: string;
};
type ParsedInput = {
    trigger: ParsedTrigger;
    modifiers: Modifiers;
};
export declare function parseInput(input: string): ParsedInput;
/**
 * An ordered table of bindings (ADR-0004). The first matching entry wins, so layering is concatenation:
 * `Keymap.layer(toolKeymap, viewKeymap, globalKeymap)`.
 */
export declare class Keymap {
    readonly entries: readonly KeymapEntry[];
    private readonly _parsed;
    constructor(entries: KeymapEntry[]);
    static layer(...keymaps: Keymap[]): Keymap;
    /** First entry matching a `pointerdown`, `wheel` or `keydown` event, optionally limited to some actions. */
    match(event: ViewInputEvent, actions?: (action: string) => boolean): KeymapEntry | null;
    /** Pairs of entries bound to the same input for overlapping view kinds (the later one never fires). */
    findConflicts(): Array<[KeymapEntry, KeymapEntry]>;
}
/** Navigation bindings. `default` matches three.js OrbitControls, so viewports feel as before. */
export declare const navigationKeymaps: {
    default: Keymap;
    blender: Keymap;
    maya: Keymap;
};
export {};
