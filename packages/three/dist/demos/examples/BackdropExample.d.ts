import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
import { AnimationMixer, Group } from 'three/webgpu';
/**
 * Eight spheres whose backdrop nodes filter what is behind them, circling the dancing Michelle model.
 * The mixer's time scale (Document tab) also drives the circling. Plays when opened.
 */
export declare class BackdropExample extends ThreeDocument {
    mixer: AnimationMixer;
    portals: Group;
    constructor(args?: ThreeDocumentProps);
    private loadModel;
    onAnimate(delta: number): void;
}
