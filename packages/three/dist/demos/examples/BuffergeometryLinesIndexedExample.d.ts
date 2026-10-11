import { Group } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** Four rows of Koch snowflake iterations as one indexed LineSegments geometry, turning with document time. Plays when opened. */
export declare class BuffergeometryLinesIndexedExample extends Document {
    parentNode: Group;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
}
