import { ReactiveNode, ReactiveNodeProps } from '@io-gui/core';
import { IoThreeViewport } from '../elements/IoThreeViewport';
import { Vector2, Ray } from 'three/webgpu';
export type ToolBaseProps = ReactiveNodeProps & {};
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
    private readonly viewports;
    constructor(args: ToolBaseProps);
    registerViewport(viewport: IoThreeViewport): void;
    unregisterViewport(viewport: IoThreeViewport): void;
    private _activePointers;
    _onPointerDown(event: PointerEvent): void;
    _onPointerMove(event: PointerEvent): void;
    _onPointerUp(event: PointerEvent): void;
    _onPointerCancel(event: PointerEvent): void;
    on3DPointerDown(pointers: Pointer3D[]): void;
    on3DPointerMove(pointers: Pointer3D[]): void;
    on3DPointerUp(pointers: Pointer3D[]): void;
    on3DPointerCancel(pointers: Pointer3D[]): void;
    pointerTo3D(event: PointerEvent): Pointer3D;
}
//# sourceMappingURL=ToolBase.d.ts.map