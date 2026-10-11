import { Group, RectAreaLight } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * A glossy torus knot lit by three turning rect area lights (red, green, blue) over a checker-rough floor. The
 * source's camera is a scene camera: the 2000-unit floor dwarfs the knot in the views' first-show framing.
 * Plays when opened.
 */
export declare class LightsRectarealightExample extends Document {
    rectLight1: RectAreaLight;
    rectLight2: RectAreaLight;
    rectLight3: RectAreaLight;
    helpers: Group;
    showHelpers: boolean;
    constructor(args?: DocumentProps);
    showHelpersChanged(): void;
    onAnimate(delta: number, time: number): void;
}
