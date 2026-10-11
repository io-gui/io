import { AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** A Mixamo FBX animation retargeted onto a Ready Player Me avatar, over a masked reflective floor. Plays when opened. */
export declare class AnimationRetargetingReadyplayerExample extends Document {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    constructor(args?: DocumentProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
