import { AnimationMixer } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/** A Mixamo FBX animation retargeted onto a Ready Player Me avatar, over a masked reflective floor. Plays when opened. */
export declare class AnimationRetargetingReadyplayerExample extends ThreeDocument {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    constructor(args?: ThreeDocumentProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
