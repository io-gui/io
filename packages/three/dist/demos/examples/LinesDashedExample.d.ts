import { Line } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** A dashed Hilbert curve inside a dashed box (`LineDashedMaterial`, `computeLineDistances`). Turns with document time; plays when opened. */
export declare class LinesDashedExample extends Document {
    objects: Line[];
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
}
