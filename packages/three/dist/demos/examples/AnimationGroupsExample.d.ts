import { AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** A 5×5 grid of boxes in one AnimationObjectGroup, sharing one animation state. Plays when opened. */
export declare class AnimationGroupsExample extends Document {
    mixer: AnimationMixer;
    constructor(args?: DocumentProps);
    onAnimate(delta: number): void;
}
