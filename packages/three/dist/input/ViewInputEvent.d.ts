import { OrthographicCamera, PerspectiveCamera, Ray, Scene, Vector2 } from 'three/webgpu';
import type { ThreeView } from '../view/ThreeView.js';
import type { SelectionModel } from '../selection/SelectionModel.js';
/** What an InputRouter needs from the element it routes for. Implemented by IoThreeViewport. */
export interface InputHost extends HTMLElement {
    readonly view: ThreeView;
    readonly scene: Scene | null;
    /** Current editor mode (`'object'`, `'edit'`, ...), for keymap `when.mode`. */
    readonly mode?: string;
    /** Selection of the shown document, when the host has one. */
    readonly selection?: SelectionModel | null;
    getViewCamera(): PerspectiveCamera | OrthographicCamera;
}
/** `click` is synthesized by the router: a press and release on one pointer that moved less than a few pixels. */
export type ViewInputType = 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'wheel' | 'keydown' | 'keyup' | 'click';
export type Modifiers = {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
};
/**
 * One input event in view terms: pixel and normalized coordinates inside the viewport,
 * movement since this pointer's previous event, and a ray built on demand.
 */
export declare class ViewInputEvent {
    readonly type: ViewInputType;
    readonly native: PointerEvent | WheelEvent | KeyboardEvent;
    readonly host: InputHost;
    /** Pixels from the viewport's left / top edge. */
    readonly x: number;
    readonly y: number;
    /** Viewport size in CSS pixels. */
    readonly width: number;
    readonly height: number;
    /** Pixels moved since this pointer's previous event. */
    readonly dx: number;
    readonly dy: number;
    /** Normalized device coordinates, -1..1, y up. */
    readonly screen: Vector2;
    readonly button: number;
    readonly pointerId: number;
    readonly pointerType: string;
    readonly modifiers: Modifiers;
    /** Wheel delta in pixels (line and page modes converted). */
    readonly deltaY: number;
    /** `KeyboardEvent.code` for key events. */
    readonly code: string;
    private _ray;
    constructor(type: ViewInputType, native: PointerEvent | WheelEvent | KeyboardEvent, host: InputHost, rect: DOMRect, previous?: {
        x: number;
        y: number;
    });
    get view(): ThreeView;
    /** World-space ray under the pointer, from the view's draw camera. */
    getRay(): Ray;
}
