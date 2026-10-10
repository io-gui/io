import { AnimationMixer, WebGPURenderer } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/**
 * The animated Littlest Tokyo model, lit by a PMREM room environment, with a scene camera riding the train.
 * Plays when opened.
 */
export declare class AnimationKeyframesExample extends ThreeDocument {
    mixer: AnimationMixer;
    constructor(args?: ThreeDocumentProps);
    onRendererInitialized(renderer: WebGPURenderer): void;
    private loadModel;
    onAnimate(delta: number): void;
}
