import { AnimationMixer, PerspectiveCamera, Group } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class AnimationRetargetingExample extends ThreeApplet {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    camera: PerspectiveCamera;
    group: Group;
    constructor(args: ThreeAppletProps);
    onResized(width: number, height: number): void;
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
export declare class IoAnimationRetargetingExample extends IoThreeExample {
    applet: AnimationRetargetingExample;
    ready(): void;
}
export declare const ioAnimationRetargetingExample: (arg0?: import("@io-gui/core").IoElementProps | import("@io-gui/core").VDOMFactoryChildren, arg1?: import("@io-gui/core").VDOMFactoryChildren) => import("@io-gui/core").VDOMElement;
