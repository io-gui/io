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
}
export declare const ioAnimationKeyframesExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoAnimationKeyframesExample.d.ts.map