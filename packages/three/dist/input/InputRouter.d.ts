import { Behavior } from './Behavior.js';
import { InputHost } from './ViewInputEvent.js';
/** Max pixels between press and release for a click. */
export declare const CLICK_TOLERANCE = 4;
/**
 * Routes input for one viewport (ADR-0004). It is the only code that listens to the viewport's
 * pointer, wheel and context-menu events and takes pointer capture. Behaviors are offered events in
 * priority order; only events a behavior captured are `preventDefault`ed and stopped.
 * Key events go to the viewport under the pointer, else to the focused one.
 */
export declare class InputRouter {
    readonly host: InputHost;
    private _behaviors;
    private _captured;
    private readonly _capturedPointers;
    private _hovered;
    private readonly _lastPositions;
    private _suppressContextMenu;
    private _modal;
    /** Press position per pointer, for click detection; `multi` marks presses that cannot be clicks (multi-touch, started a modal operator). */
    private readonly _presses;
    constructor(host: InputHost);
    get behaviors(): readonly Behavior[];
    get captured(): Behavior | null;
    add(behavior: Behavior): void;
    remove(behavior: Behavior): void;
    /**
     * Gives every event in this viewport to `behavior` until `endModal(behavior)` (running modal operators).
     * Whatever had captured is cancelled; pointers it held stay captured for the modal behavior.
     */
    startModal(behavior: Behavior): void;
    endModal(behavior: Behavior): void;
    get isModal(): boolean;
    handleKey(type: 'keydown' | 'keyup', native: KeyboardEvent): boolean;
    dispose(): void;
    private _listeners;
    private _event;
    private _consume;
    private _capture;
    private _capturePointer;
    private _releaseAll;
    private _endHover;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    private _offerClick;
    private _handleRelease;
    private _releasePointer;
    private _onPointerCancel;
    private _onWheel;
    private _onContextMenu;
    private _onPointerEnter;
    private _onPointerLeave;
}
