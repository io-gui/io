import { AnimationAction, AnimationMixer } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class AnimationSkinningAdditiveBlendingExample extends ThreeEditor {
    isLoaded: boolean;
    mixer: AnimationMixer;
    currentBaseAction: string;
    baseActions: Record<string, AnimationAction | null>;
    additiveActions: Record<string, AnimationAction | null>;
    constructor(args: ThreeEditorProps);
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
    editor: AnimationSkinningAdditiveBlendingExample;
    ready(): void;
}
export declare const ioAnimationSkinningAdditiveBlendingExample: (arg0: any) => import("@io-gui/core").VDOMElement;
