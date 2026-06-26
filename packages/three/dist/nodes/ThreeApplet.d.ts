import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { Timer, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu';
export type ThreeAppletProps = ReactiveObjectProps & {
    scene?: Scene;
    toneMappingExposure?: number;
    toneMapping?: ToneMapping;
    isPlaying?: boolean;
};
export declare class ThreeApplet extends ReactiveObject {
    scene: Scene;
    toneMappingExposure: number;
    toneMapping: ToneMapping;
    isPlaying: boolean;
    _renderer: WebGPURenderer | null;
    _width: number;
    _height: number;
    readonly _timer: Timer;
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
