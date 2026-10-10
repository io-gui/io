import { AnimationMixer, PerspectiveCamera, Group } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * Michelle's animation retargeted onto the Soldier, over a reflective floor with a TSL light-speed background.
 * Plays when opened.
 */
export declare class AnimationRetargetingExample extends Document {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    camera: PerspectiveCamera;
    group: Group;
    constructor(args?: DocumentProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
