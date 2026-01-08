import { AnimationAction, AnimationMixer, PerspectiveCamera } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
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
    constructor();
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
//# sourceMappingURL=animation_skinning_blending.d.ts.map