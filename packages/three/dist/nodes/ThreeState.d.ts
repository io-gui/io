import { Node } from '@io-gui/core';
import { Scene, WebGPURenderer } from 'three/webgpu';
export declare class ThreeState extends Node {
    scene: Scene;
    renderer: WebGPURenderer | null;
    width: number;
    height: number;
    private _lastAnimatedFrame;
    setViewportSize(width: number, height: number): void;
    isRendererInitialized(): boolean;
    onRendererInitialized(renderer: WebGPURenderer): void;
    onResized(width: number, height: number): void;
    animate(time: number, delta: number): void;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=ThreeState.d.ts.map