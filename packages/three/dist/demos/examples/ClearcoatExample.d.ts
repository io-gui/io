import { Group, Mesh } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/**
 * Four clearcoat spheres (car paint, carbon fibers, golf ball, scratched red metal) in the Pisa HDR environment, lit
 * by an orbiting point light. Plays when opened.
 */
export declare class ClearcoatExample extends Document {
    group: Group;
    particleLight: Mesh;
    constructor(args?: DocumentProps);
    onAnimate(delta: number, time: number): void;
    private pose;
}
