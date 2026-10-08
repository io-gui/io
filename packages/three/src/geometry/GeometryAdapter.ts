import { BufferGeometry, Float32BufferAttribute, Object3D, Vector3 } from 'three/webgpu'
import type { Line, Mesh, Points } from 'three/webgpu'
import type { SelectionDomain } from '../selection/SelectionModel.js'
import { getTopology, Topology, TopologyKind } from './Topology.js'
import { topologyDomainSize } from './componentDomains.js'

/**
 * Component access for one kind of object (ADR-0007): which domains it has, how many elements each holds,
 * where they are, and the triangles the ID pass draws for picking primitives. The selection model knows
 * nothing about geometry; pickers and overlays go through adapters.
 */
export interface GeometryAdapter {
  readonly id: string
  readonly kind: TopologyKind
  /** Domains that can be selected in edit mode, in select-mode order. */
  readonly domains: readonly SelectionDomain[]
  accepts(object: Object3D): boolean
  getTopology(object: Object3D): Topology
  domainSize(object: Object3D, domain: SelectionDomain): number
  /** Element position in the object's local space (edges: midpoint; primitives: centroid). */
  elementPosition(object: Object3D, domain: SelectionDomain, index: number, out: Vector3): Vector3
  /**
   * Non-indexed triangles with a `pickId` attribute (primitive index + 1) for the ID pass, or null when the
   * object has no faces (lines and points are picked on the CPU).
   */
  getPrimitiveIdGeometry(object: Object3D): BufferGeometry | null
}

/** The shared part of the built-in adapters: everything comes from the topology cache. */
abstract class TopologyAdapter implements GeometryAdapter {
  abstract readonly id: string
  abstract readonly kind: TopologyKind
  abstract readonly domains: readonly SelectionDomain[]
  abstract accepts(object: Object3D): boolean

  getTopology(object: Object3D): Topology {
    return getTopology((object as Mesh).geometry, this.kind)
  }

  domainSize(object: Object3D, domain: SelectionDomain) {
    return topologyDomainSize(this.getTopology(object), domain)
  }

  elementPosition(object: Object3D, domain: SelectionDomain, index: number, out: Vector3) {
    const topology = this.getTopology(object)
    const points = topology.pointPositions
    const pointAt = (point: number) => _point.set(points[point * 3], points[point * 3 + 1], points[point * 3 + 2])
    out.set(0, 0, 0)
    if (domain === 'point') return out.copy(pointAt(index))
    if (domain === 'edge') {
      out.add(pointAt(topology.edgePoints[index * 2])).add(pointAt(topology.edgePoints[index * 2 + 1]))
      return out.multiplyScalar(0.5)
    }
    if (domain === 'corner') return out.copy(pointAt(topology.vertexToPoint[topology.corners[index]]))
    if (domain === 'primitive') {
      const size = topology.primitiveSize
      for (let k = 0; k < size; k++) out.add(pointAt(topology.vertexToPoint[topology.corners[index * size + k]]))
      return out.multiplyScalar(1 / size)
    }
    return out
  }

  getPrimitiveIdGeometry(_object: Object3D): BufferGeometry | null {
    return null
  }
}

const _point = new Vector3()
const _idGeometries = new WeakMap<Topology, BufferGeometry>()

export class MeshAdapter extends TopologyAdapter {
  readonly id = 'mesh'
  readonly kind = 'mesh'
  readonly domains = ['point', 'edge', 'primitive'] as const

  accepts(object: Object3D) {
    const mesh = object as Mesh & {isInstancedMesh?: boolean; isBatchedMesh?: boolean}
    return !!mesh.isMesh && !mesh.isInstancedMesh && !mesh.isBatchedMesh && !!mesh.geometry?.getAttribute('position')
  }

  override getPrimitiveIdGeometry(object: Object3D): BufferGeometry {
    const topology = this.getTopology(object)
    let geometry = _idGeometries.get(topology)
    if (geometry) return geometry
    const source = (object as Mesh).geometry.getAttribute('position')
    const positions = new Float32Array(topology.corners.length * 3)
    const ids = new Float32Array(topology.corners.length)
    for (let c = 0; c < topology.corners.length; c++) {
      const vertex = topology.corners[c]
      positions[c * 3] = source.getX(vertex)
      positions[c * 3 + 1] = source.getY(vertex)
      positions[c * 3 + 2] = source.getZ(vertex)
      ids[c] = Math.floor(c / 3) + 1
    }
    geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('pickId', new Float32BufferAttribute(ids, 1))
    _idGeometries.set(topology, geometry)
    return geometry
  }
}

export class LineSegmentsAdapter extends TopologyAdapter {
  readonly id = 'lineSegments'
  readonly kind = 'line'
  readonly domains = ['point', 'edge'] as const

  accepts(object: Object3D) {
    const line = object as Line & {isLineSegments?: boolean}
    return !!line.isLineSegments && !!line.geometry?.getAttribute('position')
  }
}

export class PointsAdapter extends TopologyAdapter {
  readonly id = 'points'
  readonly kind = 'points'
  readonly domains = ['point'] as const

  accepts(object: Object3D) {
    const points = object as Points
    return !!points.isPoints && !!points.geometry?.getAttribute('position')
  }
}

const _adapters: GeometryAdapter[] = [new MeshAdapter(), new LineSegmentsAdapter(), new PointsAdapter()]

/** Registers an adapter. Later registrations are asked first, so they can take over built-in kinds. */
export function registerGeometryAdapter(adapter: GeometryAdapter) {
  const existing = _adapters.findIndex(entry => entry.id === adapter.id)
  if (existing !== -1) _adapters.splice(existing, 1)
  _adapters.unshift(adapter)
}

/** The adapter for an object, or null when its components cannot be selected. */
export function getGeometryAdapter(object: Object3D): GeometryAdapter | null {
  return _adapters.find(adapter => adapter.accepts(object)) ?? null
}

/**
 * The objects edit mode works on (Blender's objects in edit mode): selected objects and their descendants
 * that have a geometry adapter. Visibility is not checked here; pickers and overlays skip hidden ones.
 */
export function getEditObjects(objects: readonly Object3D[]): Object3D[] {
  const result = new Set<Object3D>()
  for (const object of objects) object.traverse(child => { if (getGeometryAdapter(child)) result.add(child) })
  return [...result]
}
