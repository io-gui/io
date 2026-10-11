import { AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** The morph-target galloping horse, its clip played in 1 s. The source's orbiting camera is dropped. Plays when opened. */
export declare class MorphtargetsHorseExample extends Document {
    mixer?: AnimationMixer;
    constructor(args?: DocumentProps);
    private loadModel;
    onAnimate(delta: number): void;
}
