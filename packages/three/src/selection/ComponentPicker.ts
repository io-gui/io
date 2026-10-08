import { Matrix4, Object3D, OrthographicCamera, PerspectiveCamera, Raycaster, Vector2, Vector3 } from 'three/webgpu'
import type { InputHost } from '../input/ViewInputEvent.js'
import type { SelectionDomain } from './SelectionModel.js'
import type { PickRect } from './Picker.js'
import { getEditObjects, getGeometryAdapter } from '../geometry/GeometryAdapter.js'
import { IdBufferData, IdSample, readIdBuffer } from '../render/IdPass.js'
import { isShown } from '../utils/sceneGraph.js'

/** One picked component. `size` is the domain size the index belongs to (for `SelectionEdit.components`). */
export interface ComponentHit {
  object: Object3D
  uuid: string
  domain: SelectionDomain
  index: number
  size: number
  /** Pixels from the pointer (0 for rectangle hits). */
  distance: number
}

/**
 * Component picking in one view (ADR-0007). A click returns the hits of one element; that can be several
 * stored components (a UV vertex is every corner that shares it). Async because the ID buffer is read back.
 */
export interface ComponentPicker {
  /** Objects whose components this view shows and picks. */
  objects(host: InputHost): Object3D[]
  /** Domain picks are stored in (the UV view stores `corner` unless `uvSync` is on). */
  domain(host: InputHost): SelectionDomain
  pick(host: InputHost, x: number, y: number): Promise<ComponentHit[]>
  pickRect(host: InputHost, rect: PickRect): Promise<ComponentHit[]>
}

/** Point and edge hit radius in CSS pixels. */
export const COMPONENT_PICK_RADIUS = 10

/** Reads the ID buffer for a view: draws edit `objects` with the view's camera at its CSS size. */
export type IdBufferSource = (host: InputHost, camera: PerspectiveCamera | OrthographicCamera, objects: readonly Object3D[], width: number, height: number) => Promise<IdBufferData | null>

export type IdComponentPickerOptions = {
  /** Where the ID buffer comes from; without one (or when it returns null) every pick is x-ray. */
  source?: IdBufferSource
}

const _world = new Vector3()
const _a = new Vector3()
const _b = new Vector3()
const _toClip = new Matrix4()
const _toView = new Matrix4()
const _raycaster = new Raycaster()
const _ndc = new Vector2()
const _sample: IdSample = {slot: 0, element: 0, depth: 0}

/** A projected element: CSS pixels plus view-space depth; `inFront` is false behind the camera. */
type Projected = {x: number; y: number; depth: number; inFront: boolean}

/**
 * Component picking in 3D views. Primitives come from the ID buffer (the front-most triangle under the
 * pointer); points and edges are projected on the CPU and kept when the ID buffer's depth shows them, so
 * hidden ones are skipped. In x-ray (`view.xray`) or without an ID buffer everything is projected and
 * nothing is occluded; primitives are then raycast (click) or tested by centroid (rectangle).
 * The buffer is cached until the camera, size, edit set or content changes (`invalidate()`).
 */
export class IdComponentPicker implements ComponentPicker {

  private readonly _source: IdBufferSource | null
  private _cache: {key: string; buffer: Promise<IdBufferData | null>} | null = null

  constructor(options: IdComponentPickerOptions = {}) {
    this._source = options.source ?? null
  }

  /** Drops the cached ID buffer (content changed). */
  invalidate() {
    this._cache = null
  }

  objects(host: InputHost): Object3D[] {
    const selection = host.selection
    if (!selection) return []
    return getEditObjects(selection.getObjects()).filter(isShown)
  }

  domain(host: InputHost): SelectionDomain {
    const domain = host.selection?.domain ?? 'point'
    return domain === 'object' ? 'point' : domain
  }

  async pick(host: InputHost, x: number, y: number): Promise<ComponentHit[]> {
    const objects = this.objects(host)
    const domain = this.domain(host)
    if (!objects.length) return []
    const {camera, width, height} = viewOf(host)
    const buffer = await this._buffer(host, camera, objects, width, height)
    let best: ComponentHit | null = null
    const consider = (hit: ComponentHit) => {
      if (!best || hit.distance < best.distance) best = hit
    }

    if (domain === 'primitive') {
      if (buffer) {
        readIdBuffer(buffer, x, y, _sample)
        const object = _sample.slot ? buffer.objects[_sample.slot - 1] : undefined
        if (object && _sample.element) return [hitOf(object, domain, _sample.element - 1, 0)]
      }
      // Lines (no faces) and x-ray: raycast meshes; segments by distance.
      if (!buffer) {
        _ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1)
        _raycaster.setFromCamera(_ndc, camera)
        const meshes = objects.filter(object => getGeometryAdapter(object)?.kind === 'mesh')
        const intersection = _raycaster.intersectObjects(meshes, false)[0]
        if (intersection && intersection.faceIndex !== undefined && intersection.faceIndex !== null) {
          return [hitOf(intersection.object, domain, intersection.faceIndex, 0)]
        }
      }
      for (const object of objects) {
        if (getGeometryAdapter(object)?.kind === 'line') this._nearestSegment(object, 'edge', camera, width, height, x, y, buffer, consider)
      }
      return best ? [best] : []
    }

    for (const object of objects) {
      if (domain === 'point') this._nearestPoint(object, camera, width, height, x, y, buffer, consider)
      else if (domain === 'edge') this._nearestSegment(object, domain, camera, width, height, x, y, buffer, consider)
    }
    return best ? [best] : []
  }

  async pickRect(host: InputHost, rect: PickRect): Promise<ComponentHit[]> {
    const objects = this.objects(host)
    const domain = this.domain(host)
    if (!objects.length) return []
    const {camera, width, height} = viewOf(host)
    const buffer = await this._buffer(host, camera, objects, width, height)
    const minX = Math.min(rect.x0, rect.x1), maxX = Math.max(rect.x0, rect.x1)
    const minY = Math.min(rect.y0, rect.y1), maxY = Math.max(rect.y0, rect.y1)
    const inside = (p: Projected) => p.inFront && p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY
    const hits: ComponentHit[] = []

    if (domain === 'primitive' && buffer) {
      const seen = new Set<number>()
      const x0 = Math.max(0, Math.floor(minX)), x1 = Math.min(buffer.width - 1, Math.floor(maxX))
      const y0 = Math.max(0, Math.floor(minY)), y1 = Math.min(buffer.height - 1, Math.floor(maxY))
      for (let py = y0; py <= y1; py++) {
        for (let px = x0; px <= x1; px++) {
          readIdBuffer(buffer, px, py, _sample)
          if (!_sample.slot || !_sample.element) continue
          const key = _sample.slot * 0x1000000 + _sample.element
          if (seen.has(key)) continue
          seen.add(key)
          hits.push(hitOf(buffer.objects[_sample.slot - 1], domain, _sample.element - 1, 0))
        }
      }
    }

    for (const object of objects) {
      const adapter = getGeometryAdapter(object)!
      const topology = adapter.getTopology(object)
      const project = projector(object, camera, width, height)
      if (domain === 'point') {
        for (let p = 0; p < topology.pointCount; p++) {
          const projected = project(_world.fromArray(topology.pointPositions, p * 3))
          if (inside(projected) && isVisible(buffer, projected)) hits.push(hitOf(object, domain, p, 0))
        }
      } else if (domain === 'edge') {
        for (let e = 0; e < topology.edgeCount; e++) {
          const a = {...project(_a.fromArray(topology.pointPositions, topology.edgePoints[e * 2] * 3))}
          const b = project(_b.fromArray(topology.pointPositions, topology.edgePoints[e * 2 + 1] * 3))
          if (!inside(a) || !inside(b)) continue
          const middle = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, depth: (a.depth + b.depth) / 2, inFront: true}
          if (isVisible(buffer, a) || isVisible(buffer, b) || isVisible(buffer, middle)) hits.push(hitOf(object, domain, e, 0))
        }
      } else if (domain === 'primitive' && (!buffer || adapter.kind !== 'mesh')) {
        // X-ray: primitives whose centroid is inside.
        for (let f = 0; f < topology.primitiveCount; f++) {
          const projected = project(adapter.elementPosition(object, domain, f, _world))
          if (inside(projected)) hits.push(hitOf(object, domain, f, 0))
        }
      }
    }
    return hits
  }

  private _buffer(host: InputHost, camera: PerspectiveCamera | OrthographicCamera, objects: Object3D[], width: number, height: number): Promise<IdBufferData | null> {
    if (!this._source || host.view.xray) return Promise.resolve(null)
    const key = [width, height, ...camera.matrixWorld.elements, ...camera.projectionMatrix.elements, ...objects.map(object => object.uuid)].join(',')
    if (this._cache?.key !== key) {
      const buffer = this._source(host, camera, objects, width, height).catch(error => {
        console.warn('IdComponentPicker: ID buffer read failed, picking without occlusion', error)
        return null
      })
      this._cache = {key, buffer}
    }
    return this._cache.buffer
  }

  private _nearestPoint(object: Object3D, camera: PerspectiveCamera | OrthographicCamera, width: number, height: number, x: number, y: number, buffer: IdBufferData | null, consider: (hit: ComponentHit) => void) {
    const topology = getGeometryAdapter(object)!.getTopology(object)
    const project = projector(object, camera, width, height)
    for (let p = 0; p < topology.pointCount; p++) {
      const projected = project(_world.fromArray(topology.pointPositions, p * 3))
      if (!projected.inFront) continue
      const distance = Math.hypot(projected.x - x, projected.y - y)
      if (distance > COMPONENT_PICK_RADIUS || !isVisible(buffer, projected)) continue
      consider(hitOf(object, 'point', p, distance))
    }
  }

  private _nearestSegment(object: Object3D, domain: SelectionDomain, camera: PerspectiveCamera | OrthographicCamera, width: number, height: number, x: number, y: number, buffer: IdBufferData | null, consider: (hit: ComponentHit) => void) {
    const topology = getGeometryAdapter(object)!.getTopology(object)
    const project = projector(object, camera, width, height)
    for (let e = 0; e < topology.edgeCount; e++) {
      const a = {...project(_a.fromArray(topology.pointPositions, topology.edgePoints[e * 2] * 3))}
      const b = project(_b.fromArray(topology.pointPositions, topology.edgePoints[e * 2 + 1] * 3))
      if (!a.inFront || !b.inFront) continue
      const dx = b.x - a.x, dy = b.y - a.y
      const lengthSq = dx * dx + dy * dy
      const t = lengthSq ? Math.min(1, Math.max(0, ((x - a.x) * dx + (y - a.y) * dy) / lengthSq)) : 0
      const closest = {x: a.x + dx * t, y: a.y + dy * t, depth: a.depth + (b.depth - a.depth) * t, inFront: true}
      const distance = Math.hypot(closest.x - x, closest.y - y)
      if (distance > COMPONENT_PICK_RADIUS || !isVisible(buffer, closest)) continue
      // A line object's primitive is its segment, which is also its edge.
      const index = domain === 'primitive' ? topology.primitiveEdges.indexOf(e) : e
      if (index !== -1) consider(hitOf(object, domain, index, distance))
    }
  }
}

function viewOf(host: InputHost) {
  const rect = host.getBoundingClientRect()
  return {camera: host.getViewCamera(), width: rect.width, height: rect.height}
}

function hitOf(object: Object3D, domain: SelectionDomain, index: number, distance: number): ComponentHit {
  return {object, uuid: object.uuid, domain, index, size: getGeometryAdapter(object)?.domainSize(object, domain) ?? 0, distance}
}

/** Projects local points of `object` to CSS pixels and view depth. */
function projector(object: Object3D, camera: PerspectiveCamera | OrthographicCamera, width: number, height: number) {
  camera.updateMatrixWorld()
  _toView.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld)
  _toClip.multiplyMatrices(camera.projectionMatrix, _toView)
  const toView = _toView.clone(), toClip = _toClip.clone()
  const view = new Vector3(), clip = new Vector3()
  const out: Projected = {x: 0, y: 0, depth: 0, inFront: false}
  return (local: Vector3): Projected => {
    view.copy(local).applyMatrix4(toView)
    clip.copy(local).applyMatrix4(toClip)
    out.depth = -view.z
    out.inFront = clip.z >= -1 && clip.z <= 1
    out.x = (clip.x + 1) / 2 * width
    out.y = (1 - clip.y) / 2 * height
    return out
  }
}

/** Relative depth tolerance for "on the front surface". */
const DEPTH_TOLERANCE = 0.01

/**
 * Whether a projected element is in front of (or on) the surface the ID buffer saw around it. Looks at a
 * 3×3 neighbourhood so elements on silhouettes count as visible. No buffer means x-ray: everything is.
 */
function isVisible(buffer: IdBufferData | null, projected: Projected) {
  if (!buffer) return true
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      readIdBuffer(buffer, projected.x + dx, projected.y + dy, _sample)
      if (_sample.depth <= 0 || projected.depth <= _sample.depth * (1 + DEPTH_TOLERANCE) + 1e-4) return true
    }
  }
  return false
}
