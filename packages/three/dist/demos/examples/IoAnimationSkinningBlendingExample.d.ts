import { AnimationAction, AnimationMixer, PerspectiveCamera } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class AnimationSkinningBlendingExample extends ThreeEditor {
    isActive: boolean;
    isPlaying: boolean;
    isCrossfading: boolean;
    camera: PerspectiveCamera;
    mixer: AnimationMixer;
    actions: Record<string, AnimationAction>;
    stepSize: number;
    useDefaultDuration: boolean;
    customDuration: number;
    constructor(args: ThreeEditorProps);
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
    editor: AnimationSkinningBlendingExample;
    ready(): void;
}
export declare const ioAnimationSkinningBlendingExample: (arg0: any) => import("@io-gui/core").VDOMElement;
