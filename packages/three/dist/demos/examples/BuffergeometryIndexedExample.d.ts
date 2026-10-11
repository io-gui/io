import { Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** A 10 × 10 indexed grid with vertex colors, built by hand. Spins with document time; plays when opened. */
export declare class BuffergeometryIndexedExample extends Document {
    mesh: Mesh;
    private material;
    wireframe: boolean;
    constructor(args?: DocumentProps);
    wireframeChanged(): void;
    onAnimate(delta: number, time: number): void;
}
