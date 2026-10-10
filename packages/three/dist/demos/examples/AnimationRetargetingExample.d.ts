import { AnimationMixer, PerspectiveCamera, Group } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/**
 * Michelle's animation retargeted onto the Soldier, over a reflective floor with a TSL light-speed background.
 * Plays when opened.
 */
export declare class AnimationRetargetingExample extends ThreeDocument {
    sourceMixer?: AnimationMixer;
    targetMixer?: AnimationMixer;
    camera: PerspectiveCamera;
    group: Group;
    constructor(args?: ThreeDocumentProps);
    private loadModels;
    private getSource;
    private retargetModel;
    onAnimate(delta: number): void;
}
