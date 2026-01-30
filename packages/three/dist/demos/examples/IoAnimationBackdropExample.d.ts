import { ThreeApplet, IoThreeExample } from '@io-gui/three';
import { AnimationMixer, Group } from 'three/webgpu';
export declare class AnimationBackdropExample extends ThreeApplet {
    mixer: AnimationMixer;
    portals: Group;
    constructor();
    private loadModel;
    onAnimate(delta: number): void;
}
export declare class IoAnimationBackdropExample extends IoThreeExample {
    applet: AnimationBackdropExample;
}
export declare const ioAnimationBackdropExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoAnimationBackdropExample.d.ts.map