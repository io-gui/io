import { AnimationMixer, WebGPURenderer } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class AnimationKeyframesExample extends ThreeApplet {
    mixer: AnimationMixer;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=animation_keyframes.d.ts.map