import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three/webgpu';
import { getTopology } from './Topology.js';
import { topologyDomainSize } from './componentDomains.js';
/** The shared part of the built-in adapters: everything comes from the topology cache. */
class TopologyAdapter {
    getTopology(object) {
        return getTopology(object.geometry, this.kind);
    }
    domainSize(object, domain) {
        return topologyDomainSize(this.getTopology(object), domain);
    }
    elementPosition(object, domain, index, out) {
        const topology = this.getTopology(object);
        const points = topology.pointPositions;
        const pointAt = (point) => _point.set(points[point * 3], points[point * 3 + 1], points[point * 3 + 2]);
        out.set(0, 0, 0);
        if (domain === 'point')
            return out.copy(pointAt(index));
        if (domain === 'edge') {
            out.add(pointAt(topology.edgePoints[index * 2])).add(pointAt(topology.edgePoints[index * 2 + 1]));
            return out.multiplyScalar(0.5);
        }
        if (domain === 'corner')
            return out.copy(pointAt(topology.vertexToPoint[topology.corners[index]]));
        if (domain === 'primitive') {
            const size = topology.primitiveSize;
            for (let k = 0; k < size; k++)
                out.add(pointAt(topology.vertexToPoint[topology.corners[index * size + k]]));
            return out.multiplyScalar(1 / size);
        }
        return out;
    }
    getPrimitiveIdGeometry(_object) {
        return null;
    }
}
const _point = new Vector3();
const _idGeometries = new WeakMap();
export class MeshAdapter extends TopologyAdapter {
    id = 'mesh';
    kind = 'mesh';
    domains = ['point', 'edge', 'primitive'];
    accepts(object) {
        const mesh = object;
        return !!mesh.isMesh && !mesh.isInstancedMesh && !mesh.isBatchedMesh && !!mesh.geometry?.getAttribute('position');
    }
    getPrimitiveIdGeometry(object) {
        const topology = this.getTopology(object);
        let geometry = _idGeometries.get(topology);
        if (geometry)
            return geometry;
        const source = object.geometry.getAttribute('position');
        const positions = new Float32Array(topology.corners.length * 3);
        const ids = new Float32Array(topology.corners.length);
        for (let c = 0; c < topology.corners.length; c++) {
            const vertex = topology.corners[c];
            positions[c * 3] = source.getX(vertex);
            positions[c * 3 + 1] = source.getY(vertex);
            positions[c * 3 + 2] = source.getZ(vertex);
            ids[c] = Math.floor(c / 3) + 1;
        }
        geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('pickId', new Float32BufferAttribute(ids, 1));
        _idGeometries.set(topology, geometry);
        return geometry;
    }
}
export class LineSegmentsAdapter extends TopologyAdapter {
    id = 'lineSegments';
    kind = 'line';
    domains = ['point', 'edge'];
    accepts(object) {
        const line = object;
        return !!line.isLineSegments && !!line.geometry?.getAttribute('position');
    }
}
export class PointsAdapter extends TopologyAdapter {
    id = 'points';
    kind = 'points';
    domains = ['point'];
    accepts(object) {
        const points = object;
        return !!points.isPoints && !!points.geometry?.getAttribute('position');
    }
}
const _adapters = [new MeshAdapter(), new LineSegmentsAdapter(), new PointsAdapter()];
/** Registers an adapter. Later registrations are asked first, so they can take over built-in kinds. */
export function registerGeometryAdapter(adapter) {
    const existing = _adapters.findIndex(entry => entry.id === adapter.id);
    if (existing !== -1)
        _adapters.splice(existing, 1);
    _adapters.unshift(adapter);
}
/** The adapter for an object, or null when its components cannot be selected. */
export function getGeometryAdapter(object) {
    return _adapters.find(adapter => adapter.accepts(object)) ?? null;
}
/**
 * The objects edit mode works on (Blender's objects in edit mode): selected objects and their descendants
 * that have a geometry adapter. Visibility is not checked here; pickers and overlays skip hidden ones.
 */
export function getEditObjects(objects) {
    const result = new Set();
    for (const object of objects)
        object.traverse(child => { if (getGeometryAdapter(child))
            result.add(child); });
    return [...result];
}
