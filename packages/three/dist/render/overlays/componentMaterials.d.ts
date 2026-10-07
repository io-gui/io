import { Color, InstancedBufferAttribute, LineBasicNodeMaterial, MeshBasicNodeMaterial, PointsNodeMaterial } from 'three/webgpu';
import type { Node } from 'three/webgpu';
/**
 * Fragment depth pulled slightly toward the camera, so wires and points drawn on a surface win the depth
 * test against it (and stay hidden behind other surfaces). Relative in perspective, constant in orthographic.
 */
export declare function biasedDepthNode(bias?: number): Node;
/** Colors by state: 0 = hidden, 1 = normal, 2 = selected. Alpha 0 for hidden. */
export type StateColors = {
    normal: Color;
    normalAlpha: number;
    selected: Color;
    selectedAlpha: number;
};
/** Faces colored by a per-vertex `state` attribute. */
export declare function stateFaceMaterial(colors: StateColors, depthTest?: boolean): MeshBasicNodeMaterial;
/** Line segments colored by a per-vertex `state` attribute. */
export declare function stateLineMaterial(colors: StateColors, depthTest?: boolean): LineBasicNodeMaterial;
/** Screen-sized squares at instanced positions (use with a `Sprite` whose `count` is the point count). */
export declare function statePointMaterial(positions: InstancedBufferAttribute, states: InstancedBufferAttribute, colors: StateColors, size: number, depthTest?: boolean): PointsNodeMaterial;
