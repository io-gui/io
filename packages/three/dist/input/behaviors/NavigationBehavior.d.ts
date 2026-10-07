import { Behavior } from '../Behavior.js';
import { Keymap } from '../Keymap.js';
import { InputHost, ViewInputEvent } from '../ViewInputEvent.js';
/**
 * Camera navigation as a router behavior (ADR-0004, ADR-0005). Bindings come from a keymap; every
 * gesture edits `view.navigation` and tags only this view. Touch: one finger runs the bound drag action,
 * two fingers pan and pinch-dolly. Disabled while the view looks through a scene camera.
 */
export declare class NavigationBehavior implements Behavior {
    readonly priority: number;
    keymap: Keymap;
    /** Axis views do not orbit; an orbit gesture pans instead (Maya and Houdini behave the same). */
    lockAxisViews: boolean;
    private readonly _host;
    private _pending;
    private _action;
    private readonly _pointers;
    private _pinch;
    constructor(host: InputHost, keymap?: Keymap);
    private _isEnabled;
    wantsCapture(event: ViewInputEvent): boolean;
    begin(event: ViewInputEvent): void;
    update(event: ViewInputEvent): void;
    end(): void;
    cancel(): void;
    key(event: ViewInputEvent): boolean;
    private _reset;
    private _drag;
    private _zoom;
    private _measurePinch;
    private _updatePinch;
}
