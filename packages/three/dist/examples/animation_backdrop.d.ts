import { ThreeApplet } from '@io-gui/three';
import { AnimationMixer, Group, PerspectiveCamera } from 'three/webgpu';
export declare class AnimationBackdropExample extends ThreeApplet {
    mixer?: AnimationMixer;
    portals: Group;
    camera: PerspectiveCamera;
    constructor();
    private loadModel;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=animation_backdrop.d.ts.map