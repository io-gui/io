import { ReactiveNode, ReactiveNodeProps } from '@io-gui/core';
import { Scene, ToneMapping, WebGPURenderer } from 'three/webgpu';
export type ThreeAppletProps = ReactiveNodeProps & {
    scene?: Scene;
    toneMappingExposure?: number;
    toneMapping?: ToneMapping;
};
export declare class ThreeApplet extends ReactiveNode {
    scene: Scene;
    toneMappingExposure: number;
    toneMapping: ToneMapping;
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