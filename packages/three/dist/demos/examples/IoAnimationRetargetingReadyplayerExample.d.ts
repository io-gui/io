import { AnimationMixer } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class AnimationRetargetingReadyplayerExample extends ThreeApplet {
    sourceMixer: AnimationMixer;
    targetMixer: AnimationMixer;
    constructor(args: ThreeAppletProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
export declare class IoAnimationRetargetingReadyplayerExample extends IoThreeExample {
    applet: AnimationRetargetingReadyplayerExample;
}
export declare const ioAnimationRetargetingReadyplayerExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoAnimationRetargetingReadyplayerExample.d.ts.map