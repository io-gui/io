import { ReactiveNode, ReactiveNodeProps } from '@io-gui/core';
import { Scene, ToneMapping, WebGPURenderer } from 'three/webgpu';
export type ThreeAppletProps = ReactiveNodeProps & {
    scene?: Scene;
    toneMappingExposure?: number;
    toneMapping?: ToneMapping;
    isPlaying?: boolean;
};
export declare class ThreeApplet extends ReactiveNode {
    scene: Scene;
    toneMappingExposure: number;
    toneMapping: ToneMapping;
    isPlaying: boolean;
    private _renderer;
    private _width;
    private _height;
    private readonly _clock;
    constructor(args?: ThreeAppletProps);
    isPlayingChanged(): void;
    onRAF(): void;
    updateViewportSize(width: number, height: number): void;
    isRendererInitialized(): boolean;
    onRendererInitialized(renderer: WebGPURenderer): void;
    onResized(width: number, height: number): void;
    onAnimate(delta: number, time: number): void;
    dispose(): void;
}
//# sourceMappingURL=ThreeApplet.d.ts.map