import { Line } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** One line strip through 10,000 random, vertex-colored points, morphing toward a second random set. Spins with document time; plays when opened. */
export declare class BuffergeometryLinesExample extends Document {
    line: Line;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
}
