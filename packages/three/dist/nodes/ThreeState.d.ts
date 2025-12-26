import { Node } from 'io-core';
import { Scene, WebGPURenderer } from 'three/webgpu';
export declare class ThreeState extends Node {
    scene: Scene;
    renderer: WebGPURenderer | null;
    width: number;
    height: number;
    setViewportSize(width: number, height: number): void;
    isRendererInitialized(): boolean;
    onRendererInitialized(renderer: WebGPURenderer): void;
    onResized(width: number, height: number): void;
    onAnimate(): void;
}
//# sourceMappingURL=ThreeState.d.ts.map