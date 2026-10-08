import { AnimationMixer, WebGPURenderer } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class AnimationKeyframesExample extends ThreeEditor {
    mixer: AnimationMixer;
    constructor(args: ThreeEditorProps);
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(delta: number): void;
}
export declare class IoAnimationKeyframesExample extends IoThreeExample {
    editor: AnimationKeyframesExample;
    ready(): void;
}
export declare const ioAnimationKeyframesExample: (arg0: any) => import("@io-gui/core").VDOMElement;
