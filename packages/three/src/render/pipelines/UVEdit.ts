import { Color, Object3D, Vector3 } from 'three/webgpu'
import type { BufferAttribute, InterleavedBufferAttribute } from 'three/webgpu'
import type { InputHost } from '../../input/ViewInputEvent.js'
import type { PickRect } from '../../selection/Picker.js'
import type { SelectionDomain, SelectionModel } from '../../selection/SelectionModel.js'
import { ComponentSet } from '../../selection/ComponentSet.js'
import { COMPONENT_PICK_RADIUS, ComponentHit, ComponentPicker } from '../../selection/ComponentPicker.js'
import { getEditObjects, getGeometryAdapter } from '../../geometry/GeometryAdapter.js'
import { cornersFromPoints, deriveComponents } from '../../geometry/componentDomains.js'
import { attributeVersion, getTopology, Topology } from '../../geometry/Topology.js'
import { CageColors, StateCage } from '../overlays/componentMaterials.js'
import { COMPONENT_POINT_SIZE } from '../overlays/ComponentOverlay.js'
import { projectToPixels } from '../../utils/camera.js'
import type { Mesh as MeshType } from 'three/webgpu'

/** Meshes of the edit set that have UVs. */
export function getUVEditMeshes(selection: SelectionModel | null | undefined): MeshType[] {
  if (!selection) return []
  return getEditObjects(selection.getObjects()).filter(object => getGeometryAdapter(object)?.kind === 'mesh' && !!(object as MeshType).geometry.getAttribute('uv')) as MeshType[]
}

/** What the UV view shows and has selected for one mesh, per triangle corner. */
export interface UVEditState {
  topology: Topology
  /** Faces drawn: with `uvSync` off only faces selected in 3D (Blender), otherwise all. */
  shown: ComponentSet
  /** Selected corners. */
  corners: ComponentSet
  /** Selected faces. */
  faces: ComponentSet
  /** Triangle edge `f * 3 + k` (corner k to k+1) selected. */
  edges: ComponentSet
}

/**
 * Resolves the UV view's selection for one mesh (ADR-0007). With `uvSync` the 3D selection is shown per
 * corner; without it the view has its own `corner` selection over the faces selected in 3D.
 */
export function getUVEditState(selection: SelectionModel, mesh: MeshType): UVEditState {
  const topology = getTopology(mesh.geometry, 'mesh')
  const domain = selection.domain === 'object' ? 'point' : selection.domain
  const derived = deriveComponents(topology, domain, selection.getComponents(mesh.uuid, domain))
  const count = topology.primitiveCount
  const shown = new ComponentSet(count)
  let corners = new ComponentSet(topology.cornerCount)
  const faces = new ComponentSet(count)
  const edges = new ComponentSet(count * 3)
  if (selection.uvSync) {
    shown.fill()
    corners = cornersFromPoints(topology, derived.point)
    for (let f = 0; f < count; f++) {
      if (derived.primitive.has(f)) faces.add(f)
      for (let k = 0; k < 3; k++) if (derived.edge.has(topology.primitiveEdges[f * 3 + k])) edges.add(f * 3 + k)
    }
  } else {
    derived.primitive.forEach(f => shown.add(f))
    const own = selection.getComponents(mesh.uuid, 'corner')
    const valid = own && own.size === topology.cornerCount ? own : null
    for (let f = 0; f < count; f++) {
      if (!shown.has(f)) continue
      let all = true
      for (let k = 0; k < 3; k++) {
        const selected = !!valid?.has(f * 3 + k)
        if (selected) corners.add(f * 3 + k)
        else all = false
      }
      if (all) faces.add(f)
      for (let k = 0; k < 3; k++) if (corners.has(f * 3 + k) && corners.has(f * 3 + (k + 1) % 3)) edges.add(f * 3 + k)
    }
  }
  return {topology, shown, corners, faces, edges}
}

/** Object mode: every face shown, nothing selected but the layout of the active mesh. */
export function getUVLayoutState(mesh: MeshType, isActive: boolean): UVEditState {
  const topology = getTopology(mesh.geometry, 'mesh')
  const faces = new ComponentSet(topology.primitiveCount)
  const edges = new ComponentSet(topology.primitiveCount * 3)
  if (isActive) {
    faces.fill()
    edges.fill()
  }
  return {topology, shown: new ComponentSet(topology.primitiveCount).fill(), corners: new ComponentSet(topology.cornerCount), faces, edges}
}

const SELECTED = new Color(0xffaa55)
const WIRE = new Color(0xb0b0b0)
const COLORS: CageColors = {
  faces: {normal: WIRE, normalAlpha: 0.08, selected: SELECTED, selectedAlpha: 0.05},
  edges: {normal: WIRE, normalAlpha: 0.9, selected: SELECTED, selectedAlpha: 1},
  points: {normal: new Color(0x202020), normalAlpha: 1, selected: SELECTED, selectedAlpha: 1},
}

/**
 * The UV layout of one mesh: faces, triangle edges and UV vertices (corners) with states. Its faces pick as
 * the mesh (`userData.source`), so the UV view selects objects by their layout.
 */
export class UVEditCage extends StateCage {

  readonly key: string

  constructor(mesh: MeshType) {
    const topology = getTopology(mesh.geometry, 'mesh')
    const uv = mesh.geometry.getAttribute('uv')
    const corners = new Float32Array(topology.cornerCount * 3)
    for (let c = 0; c < topology.cornerCount; c++) {
      corners[c * 3] = uv.getX(topology.corners[c])
      corners[c * 3 + 1] = uv.getY(topology.corners[c])
    }
    // Triangle edge `f * 3 + k` runs from corner k to k + 1.
    const wire = new Float32Array(topology.primitiveCount * 18)
    for (let f = 0; f < topology.primitiveCount; f++) {
      for (let k = 0; k < 3; k++) {
        const from = f * 3 + k, to = f * 3 + (k + 1) % 3
        wire.set(corners.subarray(from * 3, from * 3 + 3), f * 18 + k * 6)
        wire.set(corners.subarray(to * 3, to * 3 + 3), f * 18 + k * 6 + 3)
      }
    }
    super(corners, wire, corners, COLORS, COMPONENT_POINT_SIZE - 1, false)
    this.key = uvKey(mesh)
    this.edges.renderOrder = 1
    this.points.renderOrder = 2
    this.faces!.userData.source = mesh
    this.edges.userData.selectable = this.points.userData.selectable = false
  }

  update(state: UVEditState, showPoints: boolean) {
    const {topology, shown, corners, faces, edges} = state
    const faceStates = this.faceStates!
    for (let f = 0; f < topology.primitiveCount; f++) {
      const visible = shown.has(f)
      faceStates.fill(!visible ? 0 : faces.has(f) ? 2 : 1, f * 3, f * 3 + 3)
      for (let k = 0; k < 3; k++) {
        this.edgeStates.fill(!visible ? 0 : edges.has(f * 3 + k) ? 2 : 1, f * 6 + k * 2, f * 6 + k * 2 + 2)
        this.pointStates[f * 3 + k] = !visible ? 0 : corners.has(f * 3 + k) ? 2 : 1
      }
    }
    this.updateStates()
    this.points.visible = showPoints
  }
}

/** Changes when the mesh's topology or UVs change. */
export function uvKey(mesh: MeshType) {
  const uv = mesh.geometry.getAttribute('uv') as BufferAttribute | InterleavedBufferAttribute
  return `${getTopology(mesh.geometry, 'mesh').key}:${uv ? attributeVersion(uv) : -1}`
}

const _vertexCorners = new WeakMap<Topology, Map<number, number[]>>()

/** Corners per buffer vertex: a UV vertex is every corner that uses one buffer vertex. */
function vertexCorners(topology: Topology) {
  let map = _vertexCorners.get(topology)
  if (!map) {
    map = new Map()
    for (let c = 0; c < topology.cornerCount; c++) {
      const vertex = topology.corners[c]
      let list = map.get(vertex)
      if (!list) map.set(vertex, list = [])
      list.push(c)
    }
    _vertexCorners.set(topology, map)
  }
  return map
}

const _p = new Vector3()

/**
 * Component picking in the UV view, on the CPU in UV space (nothing is occluded). With `uvSync` off picks
 * are stored as corners: a UV vertex selects every shown corner sharing its buffer vertex, a face its three
 * corners. With `uvSync` on picks map to the mesh domains (point, edge, primitive).
 */
export class UVComponentPicker implements ComponentPicker {

  objects(host: InputHost): Object3D[] {
    return getUVEditMeshes(host.selection)
  }

  domain(host: InputHost): SelectionDomain {
    const selection = host.selection
    if (!selection?.uvSync) return 'corner'
    return selection.domain === 'object' ? 'point' : selection.domain
  }

  pick(host: InputHost, x: number, y: number): Promise<ComponentHit[]> {
    const selection = host.selection
    if (!selection) return Promise.resolve([])
    const mode = selectMode(selection)
    const project = projector(host)
    let best: {hits: ComponentHit[]; distance: number} | null = null
    for (const mesh of getUVEditMeshes(selection)) {
      const state = getUVEditState(selection, mesh)
      const {topology, shown} = state
      const uv = mesh.geometry.getAttribute('uv')
      const screen = projectCorners(topology, uv, project)
      for (let f = 0; f < topology.primitiveCount; f++) {
        if (!shown.has(f)) continue
        if (mode === 'primitive') {
          if (!insideTriangle(x, y, screen, f)) continue
          if (!best || best.distance > 0) best = {hits: this._faceHits(selection, mesh, topology, f), distance: 0}
          continue
        }
        for (let k = 0; k < 3; k++) {
          const c = f * 3 + k
          if (mode === 'point') {
            const distance = Math.hypot(screen[c * 2] - x, screen[c * 2 + 1] - y)
            if (distance <= COMPONENT_PICK_RADIUS && (!best || distance < best.distance)) best = {hits: this._cornerHits(selection, mesh, topology, shown, [c]), distance}
          } else {
            const d = c, e = f * 3 + (k + 1) % 3
            const distance = segmentDistance(x, y, screen[d * 2], screen[d * 2 + 1], screen[e * 2], screen[e * 2 + 1])
            if (distance <= COMPONENT_PICK_RADIUS && (!best || distance < best.distance)) {
              best = {hits: selection.uvSync ? [hitOf(mesh, 'edge', topology.primitiveEdges[c], topology.edgeCount)] : this._cornerHits(selection, mesh, topology, shown, [d, e]), distance}
            }
          }
        }
      }
    }
    return Promise.resolve(best?.hits ?? [])
  }

  pickRect(host: InputHost, rect: PickRect): Promise<ComponentHit[]> {
    const selection = host.selection
    if (!selection) return Promise.resolve([])
    const mode = selectMode(selection)
    const project = projector(host)
    const minX = Math.min(rect.x0, rect.x1), maxX = Math.max(rect.x0, rect.x1)
    const minY = Math.min(rect.y0, rect.y1), maxY = Math.max(rect.y0, rect.y1)
    const hits: ComponentHit[] = []
    for (const mesh of getUVEditMeshes(selection)) {
      const {topology, shown} = getUVEditState(selection, mesh)
      const screen = projectCorners(topology, mesh.geometry.getAttribute('uv'), project)
      const inside = (c: number) => screen[c * 2] >= minX && screen[c * 2] <= maxX && screen[c * 2 + 1] >= minY && screen[c * 2 + 1] <= maxY
      const corners: number[] = []
      for (let f = 0; f < topology.primitiveCount; f++) {
        if (!shown.has(f)) continue
        if (mode === 'primitive') {
          const cx = (screen[f * 6] + screen[f * 6 + 2] + screen[f * 6 + 4]) / 3
          const cy = (screen[f * 6 + 1] + screen[f * 6 + 3] + screen[f * 6 + 5]) / 3
          if (cx >= minX && cx <= maxX && cy >= minY && cy <= maxY) hits.push(...this._faceHits(selection, mesh, topology, f))
        } else if (mode === 'edge' && selection.uvSync) {
          for (let k = 0; k < 3; k++) {
            if (inside(f * 3 + k) && inside(f * 3 + (k + 1) % 3)) hits.push(hitOf(mesh, 'edge', topology.primitiveEdges[f * 3 + k], topology.edgeCount))
          }
        } else {
          for (let k = 0; k < 3; k++) if (inside(f * 3 + k)) corners.push(f * 3 + k)
        }
      }
      if (corners.length) hits.push(...this._cornerHits(selection, mesh, topology, shown, corners))
    }
    return Promise.resolve(hits)
  }

  /** Corners as stored hits: shown corners sharing their UV vertex, or (uvSync) their points. */
  private _cornerHits(selection: SelectionModel, mesh: MeshType, topology: Topology, shown: ComponentSet, corners: number[]): ComponentHit[] {
    if (selection.uvSync) {
      const points = new Set(corners.map(c => topology.vertexToPoint[topology.corners[c]]))
      return [...points].map(point => hitOf(mesh, 'point', point, topology.pointCount))
    }
    const byVertex = vertexCorners(topology)
    const result = new Set<number>()
    for (const c of corners) for (const shared of byVertex.get(topology.corners[c]) ?? []) if (shown.has(Math.floor(shared / 3))) result.add(shared)
    return [...result].map(c => hitOf(mesh, 'corner', c, topology.cornerCount))
  }

  private _faceHits(selection: SelectionModel, mesh: MeshType, topology: Topology, face: number): ComponentHit[] {
    if (selection.uvSync) return [hitOf(mesh, 'primitive', face, topology.primitiveCount)]
    return [0, 1, 2].map(k => hitOf(mesh, 'corner', face * 3 + k, topology.cornerCount))
  }
}

function selectMode(selection: SelectionModel) {
  return selection.domain === 'object' || selection.domain === 'corner' ? 'point' : selection.domain
}

function hitOf(object: Object3D, domain: SelectionDomain, index: number, size: number): ComponentHit {
  return {object, uuid: object.uuid, domain, index, size, distance: 0}
}

function projector(host: InputHost) {
  const rect = host.getBoundingClientRect()
  const camera = host.getViewCamera()
  return (u: number, v: number, out: Float32Array, offset: number) => {
    projectToPixels(camera, _p.set(u, v, 0), rect.width, rect.height, _p)
    out[offset] = _p.x
    out[offset + 1] = _p.y
  }
}

function projectCorners(topology: Topology, uv: BufferAttribute | InterleavedBufferAttribute, project: ReturnType<typeof projector>) {
  const screen = new Float32Array(topology.cornerCount * 2)
  for (let c = 0; c < topology.cornerCount; c++) project(uv.getX(topology.corners[c]), uv.getY(topology.corners[c]), screen, c * 2)
  return screen
}

function segmentDistance(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay
  const lengthSq = dx * dx + dy * dy
  const t = lengthSq ? Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / lengthSq)) : 0
  return Math.hypot(ax + dx * t - x, ay + dy * t - y)
}

function insideTriangle(x: number, y: number, screen: Float32Array, f: number) {
  const ax = screen[f * 6], ay = screen[f * 6 + 1], bx = screen[f * 6 + 2], by = screen[f * 6 + 3], cx = screen[f * 6 + 4], cy = screen[f * 6 + 5]
  const d1 = (x - bx) * (ay - by) - (ax - bx) * (y - by)
  const d2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy)
  const d3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay)
  const negative = d1 < 0 || d2 < 0 || d3 < 0
  const positive = d1 > 0 || d2 > 0 || d3 > 0
  return !(negative && positive)
}
