import { AnimationAction, AnimationMixer } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class AnimationSkinningAdditiveBlendingExample extends ThreeApplet {
    isLoaded: boolean;
    mixer: AnimationMixer;
    currentBaseAction: string;
    baseActions: Record<string, AnimationAction | null>;
    additiveActions: Record<string, AnimationAction | null>;
    constructor(args: ThreeAppletProps);
    private loadModel;
    private setWeight;
    none: () => void;
    idle: () => void;
    walk: () => void;
    run: () => void;
    private prepareCrossFade;
    private synchronizeCrossFade;
    private executeCrossFade;
    onAnimate(delta: number): void;
}
export declare class IoAnimationSkinningAdditiveBlendingExample extends IoThreeExample {
    applet: AnimationSkinningAdditiveBlendingExample;
    ready(): void;
}
export declare const ioAnimationSkinningAdditiveBlendingExample: (arg0: any) => import("@io-gui/core").VDOMElement;
