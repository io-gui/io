import { ReactiveNode, ReactiveNodeProps } from '@io-gui/core';
import { PropertyConfig, PropertyGroups } from '@io-gui/editors';
import { Scene, ToneMapping, WebGPURenderer } from 'three/webgpu';
export type ThreeAppletProps = ReactiveNodeProps & {
    scene?: Scene;
    toneMappingExposure?: number;
    toneMapping?: ToneMapping;
    uiConfig?: PropertyConfig[];
};
export declare class ThreeApplet extends ReactiveNode {
    scene: Scene;
    toneMappingExposure: number;
    toneMapping: ToneMapping;
    uiConfig: PropertyConfig[];
    uiGroups: PropertyGroups;
    private _renderer;
    private _width;
    private _height;
    private _prevTime;
    constructor(args?: ThreeAppletProps);
    updateViewportSize(width: number, height: number): void;
    isRendererInitialized(): boolean;
    onRendererInitialized(renderer: WebGPURenderer): void;
    onResized(width: number, height: number): void;
    animate(time: number, delta: number): void;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=ThreeApplet.d.ts.map