import { AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** The skinned, animated Michelle model over a blue gradient background. Plays when opened. */
export declare class SkinningExample extends Document {
    mixer?: AnimationMixer;
    constructor(args?: DocumentProps);
    private loadModel;
    onAnimate(delta: number): void;
}
