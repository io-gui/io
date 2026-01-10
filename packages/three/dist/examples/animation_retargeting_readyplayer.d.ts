import { AnimationMixer } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class AnimationRetargetingReadyplayerExample extends ThreeApplet {
    sourceMixer: AnimationMixer;
    targetMixer: AnimationMixer;
    constructor();
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=animation_retargeting_readyplayer.d.ts.map