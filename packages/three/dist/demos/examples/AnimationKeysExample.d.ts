import { AnimationMixer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * A box animated by keyframe tracks for position, scale, rotation, color and opacity, in one 3 s clip. The source's
 * camera is a scene camera: its framing covers the box's path, which leaves the bounds views frame on first show.
 * Plays when opened.
 */
export declare class AnimationKeysExample extends Document {
    mixer: AnimationMixer;
    constructor(args?: DocumentProps);
    onAnimate(delta: number): void;
}
