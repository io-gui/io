/** `BufferAttribute.version`, or the shared buffer's version for an interleaved attribute. */
export function attributeVersion(attribute) {
    return attribute.isInterleavedBufferAttribute ? attribute.data.version : attribute.version;
}
/** Changes whenever positions or the index change (positions, counts or versions). */
export function topologyKey(geometry, kind) {
    const position = geometry.getAttribute('position');
    const index = geometry.index;
    return `${kind}:${position ? `${position.count}:${attributeVersion(position)}` : '-'}:${index ? `${index.count}:${index.version}` : '-'}`;
}
/**
 * Derived connectivity of one geometry (ADR-0007): what `BufferGeometry` does not store.
 * Vertices are buffer vertices (split at UV and normal seams); points weld vertices with identical positions;
 * edges are unique point pairs; primitives are triangles (mesh) or segments (line); corners are the buffer
 * vertices of each triangle in order (`corner = triangle * 3 + k`), which is where UVs live.
 * Component indices are valid for one `key` only.
 */
export class Topology {
    kind;
    key;
    vertexCount;
    pointCount;
    /** Buffer vertex → point. */
    vertexToPoint;
    /** One buffer vertex per point (the first one welded into it). */
    pointToVertex;
    /** xyz per point, in the geometry's local space. */
    pointPositions;
    edgeCount;
    /** Two point indices per edge. */
    edgePoints;
    primitiveCount;
    /** Vertices per primitive: 3 (mesh), 2 (line) or 1 (points). */
    primitiveSize;
    /** Buffer vertex of each primitive corner, `primitiveSize` per primitive. */
    corners;
    /** Edges of each primitive, `primitiveSize` per primitive (none for points). */
    primitiveEdges;
    _edgeLookup;
    constructor(geometry, kind) {
        this.kind = kind;
        this.key = topologyKey(geometry, kind);
        const position = geometry.getAttribute('position');
        const vertexCount = position ? position.count : 0;
        this.vertexCount = vertexCount;
        // Weld vertices with identical positions into points.
        const vertexToPoint = new Uint32Array(vertexCount);
        const pointVertices = [];
        const positions = [];
        const lookup = new Map();
        for (let i = 0; i < vertexCount; i++) {
            const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
            const key = `${x},${y},${z}`;
            let point = lookup.get(key);
            if (point === undefined) {
                point = pointVertices.length;
                lookup.set(key, point);
                pointVertices.push(i);
                positions.push(x, y, z);
            }
            vertexToPoint[i] = point;
        }
        this.vertexToPoint = vertexToPoint;
        this.pointCount = pointVertices.length;
        this.pointToVertex = Uint32Array.from(pointVertices);
        this.pointPositions = Float32Array.from(positions);
        // Primitive corners as buffer vertices.
        const index = geometry.index;
        const elementCount = index ? index.count : vertexCount;
        const vertexAt = (i) => index ? index.getX(i) : i;
        this.primitiveSize = kind === 'mesh' ? 3 : kind === 'line' ? 2 : 1;
        const primitiveCount = kind === 'points' ? 0 : Math.floor(elementCount / this.primitiveSize);
        this.primitiveCount = primitiveCount;
        const corners = new Uint32Array(primitiveCount * this.primitiveSize);
        for (let i = 0; i < corners.length; i++)
            corners[i] = vertexAt(i);
        this.corners = corners;
        // Unique point pairs.
        const edgeLookup = new Map();
        const edgePoints = [];
        const edgesPerPrimitive = kind === 'mesh' ? 3 : kind === 'line' ? 1 : 0;
        const primitiveEdges = new Uint32Array(primitiveCount * edgesPerPrimitive);
        const pointCount = this.pointCount;
        const addEdge = (a, b) => {
            const lo = Math.min(a, b), hi = Math.max(a, b);
            const key = lo * pointCount + hi;
            let edge = edgeLookup.get(key);
            if (edge === undefined) {
                edge = edgePoints.length / 2;
                edgeLookup.set(key, edge);
                edgePoints.push(lo, hi);
            }
            return edge;
        };
        for (let p = 0; p < primitiveCount; p++) {
            if (kind === 'mesh') {
                const a = vertexToPoint[corners[p * 3]], b = vertexToPoint[corners[p * 3 + 1]], c = vertexToPoint[corners[p * 3 + 2]];
                primitiveEdges[p * 3] = addEdge(a, b);
                primitiveEdges[p * 3 + 1] = addEdge(b, c);
                primitiveEdges[p * 3 + 2] = addEdge(c, a);
            }
            else if (kind === 'line') {
                primitiveEdges[p] = addEdge(vertexToPoint[corners[p * 2]], vertexToPoint[corners[p * 2 + 1]]);
            }
        }
        this._edgeLookup = edgeLookup;
        this.edgeCount = edgePoints.length / 2;
        this.edgePoints = Uint32Array.from(edgePoints);
        this.primitiveEdges = primitiveEdges;
    }
    /** Corners: buffer vertices of triangles (mesh only). */
    get cornerCount() {
        return this.kind === 'mesh' ? this.corners.length : 0;
    }
    /** Edge between two points, or -1. */
    edgeIndex(a, b) {
        return this._edgeLookup.get(Math.min(a, b) * this.pointCount + Math.max(a, b)) ?? -1;
    }
}
const _cache = new WeakMap();
/** The topology of `geometry` drawn as `kind`, rebuilt when its positions or index change. */
export function getTopology(geometry, kind) {
    let entry = _cache.get(geometry);
    if (!entry) {
        entry = {};
        _cache.set(geometry, entry);
    }
    const cached = entry[kind];
    if (cached && cached.key === topologyKey(geometry, kind))
        return cached;
    const topology = new Topology(geometry, kind);
    entry[kind] = topology;
    return topology;
}
