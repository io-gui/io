import { AnimationAction, AnimationMixer, Group, PerspectiveCamera, SkeletonHelper } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * The Soldier model crossfading between idle, walk and run. The Document tab has model and skeleton visibility,
 * the crossfade buttons and the actions' effective weights. A live demo (ADR-0009): the timeline is only its clock,
 * so it pauses and steps forward with the timeline, and ignores time going back. Plays when opened.
 */
export declare class AnimationSkinningBlendingExample extends Document {
    showModel: boolean;
    showSkeleton: boolean;
    isActive: boolean;
    isCrossfading: boolean;
    /** Effective weights, the blend crossfades produce (`action.weight` stays put while fading). Read-only. */
    idleWeight: number;
    walkWeight: number;
    runWeight: number;
    camera: PerspectiveCamera;
    model?: Group;
    skeleton?: SkeletonHelper;
    mixer: AnimationMixer;
    actions: Record<string, AnimationAction>;
    useDefaultDuration: boolean;
    customDuration: number;
    /** Mixer time at which the running crossfade ends; Infinity while none runs or one waits for a loop end. */
    private crossfadeEnd;
    constructor(args?: DocumentProps);
    private loadModel;
    showModelChanged(): void;
    showSkeletonChanged(): void;
    isActiveChanged(): void;
    idle: () => void;
    walk: () => void;
    run: () => void;
    /** The name of the action at full weight; none while blended or inactive. */
    private getCurrentActionName;
    private crossfadeTo;
    private synchronizeCrossFade;
    private executeCrossFade;
    /** Fades are scheduled in mixer time, so a crossfade ends when the mixer reaches its end, not after wall-clock seconds. */
    private advanceMixer;
    private updateWeights;
    private setWeight;
    /**
     * Playback and frame steps forward advance the mixer. Time going back (a loop wrap, scrubbing or stepping back) is
     * ignored: crossfade state only moves forward, like a game clock.
     */
    onAnimate(delta: number): void;
}
