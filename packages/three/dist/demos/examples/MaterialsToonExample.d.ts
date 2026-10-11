import { Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * A cube of toon spheres: gradient map steps along x, diffuse brightness along z, energy along y, lit by an orbiting
 * point light. The source's toon outline post-processing is dropped (cosmetic; needs `document-pipeline`). Plays
 * when opened.
 */
export declare class MaterialsToonExample extends Document {
    particleLight: Mesh;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
    private pose;
    private loadLabels;
}
