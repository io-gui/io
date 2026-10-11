import { AnimationAction, AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * The Xbot model with base actions (crossfaded with the Document tab buttons) and additive poses
 * (weighted there). A live demo (ADR-0009): the timeline is only its clock. Plays when opened.
 */
export declare class AnimationSkinningAdditiveBlendingExample extends Document {
    isLoaded: boolean;
    mixer: AnimationMixer;
    currentBaseAction: string;
    baseActions: Record<string, AnimationAction | null>;
    additiveActions: Record<string, AnimationAction | null>;
    constructor(args?: DocumentProps);
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
