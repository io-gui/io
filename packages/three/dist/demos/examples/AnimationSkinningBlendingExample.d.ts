import { AnimationAction, AnimationMixer, PerspectiveCamera } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * The Soldier model crossfading between idle, walk and run. The Document tab has the crossfade buttons,
 * action weights, pause and single step. Plays when opened.
 */
export declare class AnimationSkinningBlendingExample extends Document {
    isActive: boolean;
    /** Stops the mixer while the editor keeps playing (single steps set it). */
    paused: boolean;
    isCrossfading: boolean;
    camera: PerspectiveCamera;
    mixer: AnimationMixer;
    actions: Record<string, AnimationAction>;
    stepSize: number;
    useDefaultDuration: boolean;
    customDuration: number;
    constructor(args?: DocumentProps);
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
