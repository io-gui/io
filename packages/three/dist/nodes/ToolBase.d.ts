import { ReactiveNode, ReactiveNodeProps } from '@io-gui/core';
import { IoThreeViewport, Pointer3D } from '../elements/IoThreeViewport';
export type ToolBaseProps = ReactiveNodeProps & {};
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
}
//# sourceMappingURL=ToolBase.d.ts.map