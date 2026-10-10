import { AnimationMixer } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/** A 5×5 grid of boxes in one AnimationObjectGroup, sharing one animation state. Plays when opened. */
export declare class AnimationGroupsExample extends ThreeDocument {
    mixer: AnimationMixer;
    constructor(args?: ThreeDocumentProps);
    onAnimate(delta: number): void;
}
