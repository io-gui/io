import { Behavior } from '../Behavior.js';
import { Keymap } from '../Keymap.js';
import { InputHost, ViewInputEvent } from '../ViewInputEvent.js';
import { Picker } from '../../selection/Picker.js';
export type SelectMode = 'set' | 'extend' | 'toggle' | 'subtract';
/**
 * Object selection in the fallback band (ADR-0004, ADR-0007): click select through router clicks
 * (`select.click`), box select (`select.box`), and `select.all` / `select.none` / `select.invert` keys.
 * Bindings come from the keymap; picking from a Picker. Edits the host's `selection`.
 */
export declare class SelectBehavior implements Behavior {
    readonly priority: number;
    keymap: Keymap;
    /** Used unless the host provides its own (`InputHost.picker`). */
    picker: Picker;
    private readonly _host;
    private _box;
    private _marquee;
    constructor(host: InputHost, keymap?: Keymap, picker?: Picker);
    private get _picker();
    private get _selection();
    wantsCapture(event: ViewInputEvent): boolean;
    begin(): void;
    update(event: ViewInputEvent): void;
    end(): void;
    cancel(): void;
    click(event: ViewInputEvent): boolean;
    key(event: ViewInputEvent): boolean;
    private _drawMarquee;
    private _reset;
}
