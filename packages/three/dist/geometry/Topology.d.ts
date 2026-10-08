import type { BufferAttribute, BufferGeometry, InterleavedBufferAttribute } from 'three/webgpu';
/** How an object draws its geometry: triangles, line segments or points. */
export type TopologyKind = 'mesh' | 'line' | 'points';
/** `BufferAttribute.version`, or the shared buffer's version for an interleaved attribute. */
export declare function attributeVersion(attribute: BufferAttribute | InterleavedBufferAttribute): number;
/** Changes whenever positions or the index change (positions, counts or versions). */
export declare function topologyKey(geometry: BufferGeometry, kind: TopologyKind): string;
/**
 * Derived connectivity of one geometry (ADR-0007): what `BufferGeometry` does not store.
 * Vertices are buffer vertices (split at UV and normal seams); points weld vertices with identical positions;
 * edges are unique point pairs; primitives are triangles (mesh) or segments (line); corners are the buffer
 * vertices of each triangle in order (`corner = triangle * 3 + k`), which is where UVs live.
 * Component indices are valid for one `key` only.
 */
export declare class Topology {
    readonly kind: TopologyKind;
    readonly key: string;
    readonly vertexCount: number;
    readonly pointCount: number;
    /** Buffer vertex → point. */
    readonly vertexToPoint: Uint32Array;
    /** xyz per point, in the geometry's local space. */
    readonly pointPositions: Float32Array;
    readonly edgeCount: number;
    /** Two point indices per edge. */
    readonly edgePoints: Uint32Array;
    readonly primitiveCount: number;
    /** Vertices per primitive: 3 (mesh), 2 (line) or 1 (points). */
    readonly primitiveSize: number;
    /** Buffer vertex of each primitive corner, `primitiveSize` per primitive. */
    readonly corners: Uint32Array;
    /** Edges of each primitive, `primitiveSize` per primitive (none for points). */
    readonly primitiveEdges: Uint32Array;
    constructor(geometry: BufferGeometry, kind: TopologyKind);
    /** Corners: buffer vertices of triangles (mesh only). */
    get cornerCount(): number;
}
/** The topology of `geometry` drawn as `kind`, rebuilt when its positions or index change. */
export declare function getTopology(geometry: BufferGeometry, kind: TopologyKind): Topology;
