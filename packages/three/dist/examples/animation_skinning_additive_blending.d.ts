import { AnimationAction, AnimationMixer, PerspectiveCamera, SkeletonHelper } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
interface ActionSettings {
    weight: number;
    action?: AnimationAction;
}
export declare class AnimationSkinningAdditiveBlendingExample extends ThreeApplet {
    isLoaded: boolean;
    showSkeleton: boolean;
    timeScale: number;
    sneakPoseWeight: number;
    sadPoseWeight: number;
    agreeWeight: number;
    headShakeWeight: number;
    camera: PerspectiveCamera;
    mixer: AnimationMixer;
    skeleton: SkeletonHelper | null;
    currentBaseAction: string;
    allActions: AnimationAction[];
    baseActions: Record<string, ActionSettings>;
    additiveActions: Record<string, ActionSettings>;
    constructor();
    private loadModel;
    private activateAction;
    private setWeight;
    showSkeletonChanged(): void;
    timeScaleChanged(): void;
    sneakPoseWeightChanged(): void;
    sadPoseWeightChanged(): void;
    agreeWeightChanged(): void;
    headShakeWeightChanged(): void;
    idle: () => void;
    walk: () => void;
    run: () => void;
    private prepareCrossFade;
    private synchronizeCrossFade;
    private executeCrossFade;
    onAnimate(delta: number): void;
}
export {};
//# sourceMappingURL=animation_skinning_additive_blending.d.ts.map