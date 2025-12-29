import { AnimationMixer, WebGPURenderer } from 'three/webgpu';
import { ThreeState } from '@io-gui/three';
export declare class AnimationKeyframesExample extends ThreeState {
    mixer: AnimationMixer | null;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=animation_keyframes.d.ts.map