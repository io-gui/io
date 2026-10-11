import { DirectionalLight, Group, Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * Spot and directional light shadows: a noise-masked torus knot casting a cut-out shadow, four pillars, and a ground
 * whose received shadow position is jittered by noise. The source's camera is a scene camera: the 600-unit ground
 * dwarfs the knot in the views' first-show framing. Plays when opened.
 */
export declare class ShadowmapExample extends Document {
    torusKnot: Mesh;
    dirGroup: Group;
    dirLight: DirectionalLight;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
    private pose;
}
