import { Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * 160,000 random, translucent, vertex-colored triangles in an 800-unit cube: one non-indexed BufferGeometry with flat
 * normals and RGBA colors. Spins with document time; plays when opened.
 */
export declare class BuffergeometryExample extends Document {
    mesh: Mesh;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
}
