import { Color, Group, InstancedBufferAttribute, LineBasicNodeMaterial, LineSegments, Mesh, MeshBasicNodeMaterial, PointsNodeMaterial, Sprite } from 'three/webgpu';
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
export type CageColors = {
    faces: StateColors;
    edges: StateColors;
    points: StateColors;
};
/**
 * Faces (triangles), edges (segments) and points with a state per vertex: how edit mode draws the components
 * of an object, and the UV view a layout. Positions are fixed; write the state arrays, then `updateStates()`.
 */
export declare class StateCage {
    readonly group: Group<import("three").Object3DEventMap>;
    readonly faces: Mesh | null;
    readonly edges: LineSegments;
    readonly points: Sprite;
    /** One state per face vertex, per edge end and per point: 0 hidden, 1 normal, 2 selected. */
    readonly faceStates: Float32Array | null;
    readonly edgeStates: Float32Array;
    readonly pointStates: Float32Array;
    private readonly _attributes;
    constructor(facePositions: Float32Array | null, edgePositions: Float32Array, pointPositions: Float32Array, colors: CageColors, pointSize: number, depthTest?: boolean);
    /** Uploads the state arrays after they were written. */
    updateStates(): void;
    dispose(): void;
}
