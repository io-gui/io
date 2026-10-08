import { Behavior } from '../Behavior.js';
import { Keymap } from '../Keymap.js';
import { InputHost, ViewInputEvent } from '../ViewInputEvent.js';
import { Picker } from '../../selection/Picker.js';
export type SelectMode = 'set' | 'extend' | 'toggle' | 'subtract';
/**
 * Selection in the fallback band (ADR-0004, ADR-0007): click select through router clicks
 * (`select.click`), box select (`select.box`), and `select.all` / `select.none` / `select.invert` keys.
 * Bindings come from the keymap; picking from a Picker. Edits the host's `selection`.
 * In edit mode the same bindings select components through the host's `componentPicker`, and
 * `mode.editToggle` / `select.mode` keys run the `object.editmode_toggle` / `mesh.select_mode` operators.
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
    /** The component picker while the host is in edit mode. */
    private get _components();
    wantsCapture(event: ViewInputEvent): boolean;
    update(event: ViewInputEvent): void;
    end(): void;
    cancel(): void;
    click(event: ViewInputEvent): boolean;
    key(event: ViewInputEvent): boolean;
    /**
     * Picks components in edit mode, objects otherwise, and applies the hits when the pick resolves, unless the
     * host shows another selection by then. A click (`setsActive`) makes its hit the active object.
     */
    private _select;
    private _drawMarquee;
    private _reset;
}
