import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
import { AnimationMixer, Group } from 'three/webgpu';
export declare class BackdropExample extends ThreeApplet {
    mixer: AnimationMixer;
    portals: Group;
    constructor(args: ThreeAppletProps);
    private loadModel;
    onAnimate(delta: number): void;
}
export declare class IoBackdropExample extends IoThreeExample {
    applet: BackdropExample;
}
export declare const ioBackdropExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoBackdropExample.d.ts.map