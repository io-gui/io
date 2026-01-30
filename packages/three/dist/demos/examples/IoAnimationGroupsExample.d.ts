import { AnimationMixer } from 'three/webgpu';
import { ThreeApplet, IoThreeExample } from '@io-gui/three';
export declare class AnimationGroupsExample extends ThreeApplet {
    mixer: AnimationMixer;
    constructor();
    onAnimate(delta: number): void;
}
export declare class IoAnimationGroupsExample extends IoThreeExample {
    applet: AnimationGroupsExample;
}
export declare const ioAnimationGroupsExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoAnimationGroupsExample.d.ts.map