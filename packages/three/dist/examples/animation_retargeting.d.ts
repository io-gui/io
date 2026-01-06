import { AnimationMixer, PerspectiveCamera } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class AnimationRetargetingExample extends ThreeApplet {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    camera: PerspectiveCamera;
    constructor();
    onResized(width: number, height: number): void;
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=animation_retargeting.d.ts.map