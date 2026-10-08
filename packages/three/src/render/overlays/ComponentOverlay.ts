import { BufferGeometry, Color, Float32BufferAttribute, Group, InstancedBufferAttribute, LineSegments, Material, Mesh, Object3D, Sprite } from 'three/webgpu'
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js'
import type { SelectionModel } from '../../selection/SelectionModel.js'
import { getEditObjects, getGeometryAdapter, GeometryAdapter } from '../../geometry/GeometryAdapter.js'
import { deriveComponents, DerivedComponents } from '../../geometry/componentDomains.js'
import type { Topology } from '../../geometry/Topology.js'
import { StateColors, stateFaceMaterial, stateLineMaterial, statePointMaterial } from './componentMaterials.js'

/** Point size in CSS pixels. */
export const COMPONENT_POINT_SIZE = 6

const SELECTED = new Color(0xffaa33)
const WIRE = new Color(0x1a1a1a)

const FACE_COLORS: StateColors = {normal: WIRE, normalAlpha: 0, selected: SELECTED, selectedAlpha: 0.25}
const EDGE_COLORS: StateColors = {normal: WIRE, normalAlpha: 0.9, selected: SELECTED, selectedAlpha: 1}
const POINT_COLORS: StateColors = {normal: WIRE, normalAlpha: 1, selected: SELECTED, selectedAlpha: 1}

/** Edit-mode drawing of one object: wire, points and selected faces, built from its topology. */
class EditCage {

  readonly group = new Group()
  readonly topology: Topology
  private _state = ''
  private readonly _faces: Mesh | null = null
  private readonly _edges: LineSegments
  private readonly _points: Sprite
  private readonly _pointStates: InstancedBufferAttribute

  constructor(object: Object3D, adapter: GeometryAdapter) {
    const topology = this.topology = adapter.getTopology(object)
    this.group.matrixAutoUpdate = false

    const faceGeometry = adapter.getPrimitiveIdGeometry(object)
    if (faceGeometry) {
      const geometry = new BufferGeometry()
      // Own copy: disposing a geometry releases its attributes' GPU buffers, and the ID geometry is shared.
      geometry.setAttribute('position', faceGeometry.getAttribute('position').clone())
      geometry.setAttribute('state', new Float32BufferAttribute(new Float32Array(topology.corners.length), 1))
      this._faces = new Mesh(geometry, stateFaceMaterial(FACE_COLORS))
    }

    const edgePositions = new Float32Array(topology.edgeCount * 6)
    for (let e = 0; e < topology.edgeCount; e++) {
      for (let k = 0; k < 2; k++) {
        const point = topology.edgePoints[e * 2 + k]
        edgePositions.set(topology.pointPositions.subarray(point * 3, point * 3 + 3), e * 6 + k * 3)
      }
    }
    const edgeGeometry = new BufferGeometry()
    edgeGeometry.setAttribute('position', new Float32BufferAttribute(edgePositions, 3))
    edgeGeometry.setAttribute('state', new Float32BufferAttribute(new Float32Array(topology.edgeCount * 2), 1))
    this._edges = new LineSegments(edgeGeometry, stateLineMaterial(EDGE_COLORS))

    this._pointStates = new InstancedBufferAttribute(new Float32Array(topology.pointCount), 1)
    const pointPositions = new InstancedBufferAttribute(topology.pointPositions, 3)
    this._points = new Sprite(statePointMaterial(pointPositions, this._pointStates, POINT_COLORS, COMPONENT_POINT_SIZE))
    this._points.count = topology.pointCount

    for (const child of [this._faces, this._edges, this._points]) {
      if (!child) continue
      child.matrixAutoUpdate = false
      child.frustumCulled = false
      this.group.add(child)
    }
  }

  update(object: Object3D, selection: SelectionModel) {
    // Same result whether or not the overlay scene updates world matrices (children keep identity matrices).
    this.group.matrix.copy(object.matrixWorld)
    this.group.matrixWorld.copy(object.matrixWorld)
    for (const child of this.group.children) child.matrixWorld.copy(object.matrixWorld)
    const domain = selection.domain
    const state = `${selection.version}:${domain}`
    if (state === this._state) return
    this._state = state
    const derived = deriveComponents(this.topology, domain, selection.getComponents(object.uuid, domain))
    this._write(derived)
    this._points.visible = domain === 'point'
  }

  private _write(derived: DerivedComponents) {
    const topology = this.topology
    if (this._faces) {
      const states = this._faces.geometry.getAttribute('state') as Float32BufferAttribute
      const array = states.array as Float32Array
      for (let f = 0; f < topology.primitiveCount; f++) array.fill(derived.primitive.has(f) ? 2 : 1, f * 3, f * 3 + 3)
      states.needsUpdate = true
    }
    const edgeStates = this._edges.geometry.getAttribute('state') as Float32BufferAttribute
    const edgeArray = edgeStates.array as Float32Array
    for (let e = 0; e < topology.edgeCount; e++) edgeArray.fill(derived.edge.has(e) ? 2 : 1, e * 2, e * 2 + 2)
    edgeStates.needsUpdate = true
    const pointArray = this._pointStates.array as Float32Array
    for (let p = 0; p < topology.pointCount; p++) pointArray[p] = derived.point.has(p) ? 2 : 1
    this._pointStates.needsUpdate = true
  }

  dispose() {
    if (this._faces) {
      this._faces.geometry.dispose()
      ;(this._faces.material as Material).dispose()
    }
    this._edges.geometry.dispose()
    ;(this._edges.material as Material).dispose()
    ;(this._points.material as Material).dispose()
  }
}

/**
 * Edit mode in 3D views (ADR-0007): the wire, points (point select mode) and selected faces of every
 * object in the edit set, colored from the selection's component sets. Selected elements in other
 * domains are derived for display (points of selected faces, edges between selected points, ...).
 */
export class ComponentOverlay implements Overlay {

  readonly root = new Group()
  private readonly _cages = new Map<string, EditCage>()

  constructor() {
    this.root.name = 'ComponentOverlay'
  }

  prepare(ctx: OverlayContext) {
    const selection = ctx.selection
    const objects = ctx.editor.mode === 'edit' && selection ? getEditObjects(selection.getObjects()) : []
    const shown = new Set<string>()
    for (const object of objects) {
      if (!isShown(object)) continue
      const adapter = getGeometryAdapter(object)!
      let cage = this._cages.get(object.uuid)
      if (cage && cage.topology !== adapter.getTopology(object)) {
        this._remove(object.uuid)
        cage = undefined
      }
      if (!cage) {
        cage = new EditCage(object, adapter)
        this._cages.set(object.uuid, cage)
        this.root.add(cage.group)
      }
      cage.update(object, selection!)
      shown.add(object.uuid)
    }
    for (const uuid of [...this._cages.keys()]) if (!shown.has(uuid)) this._remove(uuid)
  }

  private _remove(uuid: string) {
    const cage = this._cages.get(uuid)
    if (!cage) return
    this.root.remove(cage.group)
    cage.dispose()
    this._cages.delete(uuid)
  }

  dispose() {
    for (const uuid of [...this._cages.keys()]) this._remove(uuid)
  }
}

function isShown(object: Object3D) {
  for (let node: Object3D | null = object; node; node = node.parent) if (!node.visible) return false
  return true
}

export const componentOverlayType: OverlayType = {
  id: 'components',
  label: 'Edit mode components',
  viewKinds: ['3d'],
  enabledByDefault: true,
  order: 90,
  create: () => new ComponentOverlay(),
}
