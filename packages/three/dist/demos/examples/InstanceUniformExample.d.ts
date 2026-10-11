import { Color, Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** A mesh with its own color, read by `InstanceUniformNode` when the mesh draws. */
declare class ColorMesh extends Mesh {
    color: Color;
}
/**
 * Twelve teapots sharing one material, each tinted by its own `color` (Inspector) through a per-object uniform node
 * over a castle cube map. Spins with document time; plays when opened.
 */
export declare class InstanceUniformExample extends Document {
    objects: ColorMesh[];
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
}
export {};
