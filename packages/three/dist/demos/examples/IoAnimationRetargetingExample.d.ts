import { AnimationMixer, PerspectiveCamera, Group } from 'three/webgpu';
import { ThreeApplet, IoThreeExample } from '@io-gui/three';
export declare class AnimationRetargetingExample extends ThreeApplet {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    camera: PerspectiveCamera;
    group: Group;
    constructor();
    onResized(width: number, height: number): void;
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
export declare class IoAnimationRetargetingExample extends IoThreeExample {
    applet: AnimationRetargetingExample;
}
export declare const ioAnimationRetargetingExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoAnimationRetargetingExample.d.ts.map