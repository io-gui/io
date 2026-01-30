import { AnimationAction, AnimationMixer, PerspectiveCamera } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class AnimationSkinningBlendingExample extends ThreeApplet {
    isActive: boolean;
    isPlaying: boolean;
    isCrossfading: boolean;
    camera: PerspectiveCamera;
    mixer: AnimationMixer;
    actions: Record<string, AnimationAction>;
    stepSize: number;
    useDefaultDuration: boolean;
    customDuration: number;
    constructor(args: ThreeAppletProps);
    private loadModel;
    isActiveChanged(): void;
    idle: () => void;
    walk: () => void;
    run: () => void;
    makeSingleStep: () => void;
    private getCurrentAction;
    private crossfadeTo;
    private synchronizeCrossFade;
    private executeCrossFade;
    private setWeight;
    onAnimate(delta: number): void;
}
export declare class IoAnimationSkinningBlendingExample extends IoThreeExample {
    applet: AnimationSkinningBlendingExample;
    ready(): void;
}
export declare const ioAnimationSkinningBlendingExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoAnimationSkinningBlendingExample.d.ts.map