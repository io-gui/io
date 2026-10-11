import { Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** A crate-textured cube spinning with document time. Plays when opened. */
export declare class GeometryCubeExample extends Document {
    mesh: Mesh;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
}
