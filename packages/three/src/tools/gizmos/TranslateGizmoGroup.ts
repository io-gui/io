import { BufferGeometry, Color, ConeGeometry, Float32BufferAttribute, Group, LineBasicNodeMaterial, LineSegments, Mesh, MeshBasicNodeMaterial, SphereGeometry, Vector3 } from 'three/webgpu'
import type { ViewInputEvent } from '../../input/ViewInputEvent.js'
import type { TranslateAxis } from '../operators/TranslateOperator.js'
import { Gizmo, GizmoContext, GizmoGroup, projectToPixels, worldPerPixelAt } from '../Gizmo.js'

/** Arrow length in CSS pixels. */
export const TRANSLATE_GIZMO_SIZE = 90
const CENTER_RADIUS = 7
const HIGHLIGHT = new Color(0xffee55)
const AXIS_COLORS = {x: 0xff3352, y: 0x8bdc00, z: 0x2890ff}
const AXIS_DIRECTIONS = {x: new Vector3(1, 0, 0), y: new Vector3(0, 1, 0), z: new Vector3(0, 0, 1)}

const _a = new Vector3()
const _b = new Vector3()
const _tip = new Vector3()

function gizmoMaterial<T extends MeshBasicNodeMaterial | LineBasicNodeMaterial>(material: T, color: number): T {
  material.color.set(color)
  material.depthTest = false
  material.depthWrite = false
  material.transparent = true
  return material
}

/** Shared by the axis and center handles: color swap on highlight, invoke runs `transform.translate`. */
abstract class TranslateHandle implements Gizmo {
  abstract readonly object: Group
  protected abstract readonly materials: (MeshBasicNodeMaterial | LineBasicNodeMaterial)[]
  protected abstract readonly color: Color
  private _highlight = false

  constructor(protected readonly group: TranslateGizmoGroup, readonly axis: TranslateAxis) {}

  get highlight() {
    return this._highlight
  }
  set highlight(value: boolean) {
    this._highlight = value
    for (const material of this.materials) material.color.copy(value ? HIGHLIGHT : this.color)
  }

  abstract hitTest(ctx: GizmoContext, x: number, y: number): number

  invoke(ctx: GizmoContext, event: ViewInputEvent) {
    ctx.editor.operators.run('transform.translate', {axis: this.axis}, {host: ctx.host, event})
  }

  dispose() {
    for (const material of this.materials) material.dispose()
  }
}

class AxisHandle extends TranslateHandle {
  readonly object = new Group()
  protected readonly color: Color
  protected readonly materials: (MeshBasicNodeMaterial | LineBasicNodeMaterial)[]
  private readonly _direction: Vector3

  constructor(group: TranslateGizmoGroup, axis: 'x' | 'y' | 'z') {
    super(group, axis)
    this.color = new Color(AXIS_COLORS[axis])
    this._direction = AXIS_DIRECTIONS[axis]
    const lineGeometry = new BufferGeometry()
    lineGeometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, ...this._direction.toArray()], 3))
    const lineMaterial = gizmoMaterial(new LineBasicNodeMaterial(), AXIS_COLORS[axis])
    const coneMaterial = gizmoMaterial(new MeshBasicNodeMaterial(), AXIS_COLORS[axis])
    const line = new LineSegments(lineGeometry, lineMaterial)
    const cone = new Mesh(new ConeGeometry(0.06, 0.22, 16), coneMaterial)
    // Cones point along +Y; turn them onto the axis.
    cone.quaternion.setFromUnitVectors(AXIS_DIRECTIONS.y, this._direction)
    cone.position.copy(this._direction).multiplyScalar(0.89)
    this.object.add(line, cone)
    this.object.renderOrder = 1
    this.materials = [lineMaterial, coneMaterial]
  }

  hitTest(ctx: GizmoContext, x: number, y: number) {
    const pivot = this.group.pivot
    _tip.copy(this._direction).multiplyScalar(this.group.scale).add(pivot)
    projectToPixels(ctx.camera, pivot, ctx.width, ctx.height, _a)
    projectToPixels(ctx.camera, _tip, ctx.width, ctx.height, _b)
    const dx = _b.x - _a.x
    const dy = _b.y - _a.y
    const lengthSq = dx * dx + dy * dy
    // An axis pointing at the viewer cannot be dragged along.
    if (lengthSq < 12 * 12) return Infinity
    const t = ((x - _a.x) * dx + (y - _a.y) * dy) / lengthSq
    // The inner part belongs to the center handle.
    if (t < 0.2 || t > 1.05) return Infinity
    return Math.hypot(x - (_a.x + t * dx), y - (_a.y + t * dy))
  }
}

class CenterHandle extends TranslateHandle {
  readonly object = new Group()
  protected readonly color = new Color(0xffffff)
  protected readonly materials: MeshBasicNodeMaterial[]

  constructor(group: TranslateGizmoGroup) {
    super(group, 'view')
    const material = gizmoMaterial(new MeshBasicNodeMaterial({opacity: 0.85}), 0xffffff)
    this.object.add(new Mesh(new SphereGeometry(CENTER_RADIUS / TRANSLATE_GIZMO_SIZE, 16, 8), material))
    this.materials = [material]
  }

  hitTest(ctx: GizmoContext, x: number, y: number) {
    projectToPixels(ctx.camera, this.group.pivot, ctx.width, ctx.height, _a)
    if (_a.z < -1 || _a.z > 1) return Infinity
    const distance = Math.hypot(x - _a.x, y - _a.y)
    return distance <= CENTER_RADIUS + 3 ? 0 : Infinity
  }
}

/**
 * Move gizmo: X / Y / Z arrows that move along one world axis and a center handle that moves in the view
 * plane. Sits at the median of the selected objects and keeps a constant size on screen. Pressing a handle
 * starts the modal `transform.translate` operator. Shown in object mode when something is selected.
 */
export class TranslateGizmoGroup implements GizmoGroup {

  readonly id = 'transform.translate'
  readonly gizmos: readonly Gizmo[]
  /** World position the handles sit at. */
  readonly pivot = new Vector3()
  /** World length of an arrow at the current zoom. */
  scale = 1

  private readonly _handles: TranslateHandle[]

  constructor() {
    this._handles = [new AxisHandle(this, 'x'), new AxisHandle(this, 'y'), new AxisHandle(this, 'z'), new CenterHandle(this)]
    this.gizmos = this._handles
  }

  poll(ctx: GizmoContext) {
    return ctx.editor.mode === 'object' && ctx.view.kind === '3d' && ctx.editor.selection.size > 0
  }

  refresh(ctx: GizmoContext) {
    const objects = ctx.editor.selection.getRootObjects()
    this.pivot.set(0, 0, 0)
    for (const object of objects) {
      object.updateWorldMatrix(true, false)
      this.pivot.add(_a.setFromMatrixPosition(object.matrixWorld))
    }
    if (objects.length) this.pivot.divideScalar(objects.length)
  }

  drawPrepare(ctx: GizmoContext) {
    this.scale = worldPerPixelAt(ctx.camera, this.pivot, ctx.height) * TRANSLATE_GIZMO_SIZE
    for (const handle of this._handles) {
      handle.object.position.copy(this.pivot)
      handle.object.scale.setScalar(this.scale)
    }
  }

  dispose() {
    for (const handle of this._handles) {
      handle.object.traverse(child => (child as Mesh).geometry?.dispose())
      handle.dispose()
    }
  }
}
