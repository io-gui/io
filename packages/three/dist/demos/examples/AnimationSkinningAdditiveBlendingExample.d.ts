import { AnimationAction, AnimationMixer } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/**
 * The Xbot model with base actions (crossfaded with the Document tab buttons) and additive poses
 * (weighted there). Plays when opened.
 */
export declare class AnimationSkinningAdditiveBlendingExample extends ThreeDocument {
    isLoaded: boolean;
    mixer: AnimationMixer;
    currentBaseAction: string;
    baseActions: Record<string, AnimationAction | null>;
    additiveActions: Record<string, AnimationAction | null>;
    constructor(args?: ThreeDocumentProps);
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
