import { AnimationMixer, WebGPURenderer } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class AnimationKeyframesExample extends ThreeApplet {
    mixer: AnimationMixer;
    constructor(args: ThreeAppletProps);
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
    onAnimate(delta: number): void;
}
export declare class IoAnimationKeyframesExample extends IoThreeExample {
    applet: AnimationKeyframesExample;
    ready(): void;
}
export declare const ioAnimationKeyframesExample: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
