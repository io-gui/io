import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { IoThreeViewport } from '../elements/IoThreeViewport';
import { Vector2, Ray } from 'three/webgpu';
import { ThreeApplet } from './ThreeApplet';
import { Behavior } from '../input/Behavior.js';
export type ToolBaseProps = ReactiveObjectProps & {
    applet: ThreeApplet;
};
export interface Pointer3D {
    event: PointerEvent;
    screen: Vector2;
    screenStart: Vector2;
    screenPrevious: Vector2;
    screenMovement: Vector2;
    ray: Ray;
    rayStart: Ray;
    rayPrevious: Ray;
    rayMovement: Ray;
}
export declare class ToolBase extends ReactiveObject {
    applet: ThreeApplet;
    private readonly _viewports;
    private _activePointers;
    private _hoverPointers;
    private readonly _behavior;
    constructor(args?: ToolBaseProps);
    /** The behavior this tool adds to each registered viewport's InputRouter. */
    get behavior(): Behavior;
    registerViewport(viewport: IoThreeViewport): void;
    unregisterViewport(viewport: IoThreeViewport): void;
    /**
     * Whether this tool captures a press or wheel event. Defaults to everything, so lower-priority behaviors
     * (camera navigation) only get input the tool lets through. Override to share, for example
     * `return event.button === 0` to leave other buttons and the wheel to navigation.
     */
    capturesInput(event: PointerEvent | WheelEvent): boolean;
    _resetPointers(viewport: IoThreeViewport): void;
    _onContextMenu(event: PointerEvent): void;
    _onPointerDown(event: PointerEvent): void;
    _onPointerMove(event: PointerEvent): void;
    _onPointerUp(event: PointerEvent): void;
    _onPointerCancel(event: PointerEvent): void;
    _onPointerLeave(event: PointerEvent): void;
    _onPointerOut(event: PointerEvent): void;
    _onLostPointerCapture(event: PointerEvent): void;
    _onWheel(event: WheelEvent): void;
    on3DPointerHover(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerDown(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerMove(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerUp(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerCancel(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DWheel(pointer: Pointer3D, event: WheelEvent, viewport: IoThreeViewport): void;
    private _getActivePointers;
    private _getHoverPointers;
    private _findPointer;
    private _setPointer;
    private _removePointer;
    private _removeHoverPointer;
    pointerTo3D(event: PointerEvent): Pointer3D;
}
