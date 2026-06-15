import { ReactiveNode, ReactiveNodeProps } from '@io-gui/core';
import { IoThreeViewport } from '../elements/IoThreeViewport';
import { Vector2, Ray } from 'three/webgpu';
import { ThreeApplet } from './ThreeApplet';
export type ToolBaseProps = ReactiveNodeProps & {
    applet: ThreeApplet;
};
export interface Pointer3D {
    event: PointerEvent;
    screen: Vector2;
    screenStart: Vector2;
    screenMovement: Vector2;
    ray: Ray;
    rayStart: Ray;
    rayMovement: Ray;
}
export declare class ToolBase extends ReactiveNode {
    applet: ThreeApplet;
    private readonly _viewports;
    private _activePointers;
    private _hoverPointers;
    constructor(args?: ToolBaseProps);
    registerViewport(viewport: IoThreeViewport): void;
    unregisterViewport(viewport: IoThreeViewport): void;
    _onContextMenu(event: PointerEvent): void;
    _onPointerDown(event: PointerEvent): void;
    _onPointerMove(event: PointerEvent): void;
    _onPointerUp(event: PointerEvent): void;
    _onPointerCancel(event: PointerEvent): void;
    _onPointerLeave(event: PointerEvent): void;
    _onPointerOut(event: PointerEvent): void;
    _onLostPointerCapture(event: PointerEvent): void;
    on3DPointerHover(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerDown(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerMove(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerUp(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    on3DPointerCancel(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport): void;
    private _getActivePointers;
    private _getHoverPointers;
    private _removeHoverPointer;
    pointerTo3D(event: PointerEvent): Pointer3D;
}
