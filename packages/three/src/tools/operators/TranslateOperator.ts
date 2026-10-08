import { Matrix4, Object3D, Plane, Ray, Vector3 } from 'three/webgpu'
import type { Operator, OperatorContext, OperatorPollContext, OperatorProps, OperatorStatus, OperatorType } from '../Operator.js'
import type { ViewInputEvent } from '../../input/ViewInputEvent.js'

/** Movement constraint: one world axis, or the plane facing the view. */
export type TranslateAxis = 'x' | 'y' | 'z' | 'view'

export type TranslateProps = OperatorProps & {
  axis?: TranslateAxis
  /** World-space offset. Set when an interactive run finishes, so the command can be repeated with `exec`. */
  delta?: [number, number, number]
}

/** Unit direction of each world axis. */
export const AXES: Readonly<Record<Exclude<TranslateAxis, 'view'>, Vector3>> = {
  x: new Vector3(1, 0, 0),
  y: new Vector3(0, 1, 0),
  z: new Vector3(0, 0, 1),
}

const KEY_AXES: Record<string, Exclude<TranslateAxis, 'view'>> = {KeyX: 'x', KeyY: 'y', KeyZ: 'z'}

type Target = {object: Object3D; start: Vector3; parentInverse: Matrix4}

const _plane = new Plane()
const _normal = new Vector3()
const _world = new Vector3()
const _start = new Vector3()

/**
 * Moves the selected objects (`transform.translate`). Interactive runs are modal: drag along an axis or in the
 * view plane, X / Y / Z switch the constraint (again to release it), release or Enter confirms, Escape or right
 * click cancels and rolls the transaction back. `exec` applies `props.delta` directly (repeat, scripts).
 */
export class TranslateOperator implements Operator {

  readonly props: TranslateProps

  private _targets: Target[] = []
  private readonly _pivot = new Vector3()
  private _axis: TranslateAxis = 'view'
  private _startRay = new Ray()
  private _lastRay = new Ray()
  private readonly _viewNormal = new Vector3()
  private readonly _delta = new Vector3()

  constructor(props: TranslateProps) {
    this.props = props
  }

  poll(ctx: OperatorPollContext) {
    return ctx.editor.selection.size > 0
  }

  invoke(ctx: OperatorContext, event?: ViewInputEvent): OperatorStatus {
    if (!event || !ctx.host) return this.exec(ctx)
    this._collect(ctx)
    if (!this._targets.length) return 'cancelled'
    this._axis = this.props.axis ?? 'view'
    ctx.host.getViewCamera().getWorldDirection(this._viewNormal)
    this._startRay.copy(event.getRay())
    this._lastRay.copy(this._startRay)
    if (!this._pointOn(this._startRay, _world)) return 'cancelled'
    return 'running'
  }

  modal(ctx: OperatorContext, event: ViewInputEvent): OperatorStatus {
    switch (event.type) {
      case 'pointermove':
        this._lastRay.copy(event.getRay())
        this._apply(ctx)
        return 'running'
      case 'pointerup':
        return event.button === 0 ? this._finish() : 'running'
      case 'pointerdown':
        if (event.button === 2) return 'cancelled'
        return event.button === 0 ? this._finish() : 'running'
      case 'keydown': {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') return this._finish()
        const axis = KEY_AXES[event.code]
        if (axis) {
          this._axis = this._axis === axis ? 'view' : axis
          this._apply(ctx)
        }
        return 'running'
      }
    }
    return 'running'
  }

  exec(ctx: OperatorContext): Exclude<OperatorStatus, 'running'> {
    const delta = this.props.delta
    if (!delta) return 'cancelled'
    this._collect(ctx)
    if (!this._targets.length) return 'cancelled'
    this._delta.fromArray(delta)
    this._write(ctx)
    return 'finished'
  }

  private _collect(ctx: OperatorContext) {
    this._targets = ctx.editor.selection.getRootObjects().filter(object => object !== ctx.document.scene).map(object => {
      object.updateWorldMatrix(true, false)
      const parentInverse = new Matrix4()
      if (object.parent) parentInverse.copy(object.parent.matrixWorld).invert()
      return {object, start: new Vector3().setFromMatrixPosition(object.matrixWorld), parentInverse}
    })
    this._pivot.set(0, 0, 0)
    for (const target of this._targets) this._pivot.add(target.start)
    if (this._targets.length) this._pivot.divideScalar(this._targets.length)
  }

  /** Where `ray` meets the current constraint through the pivot. */
  private _pointOn(ray: Ray, out: Vector3): boolean {
    if (this._axis === 'view') {
      _plane.setFromNormalAndCoplanarPoint(_normal.copy(this._viewNormal).negate(), this._pivot)
      return !!ray.intersectPlane(_plane, out)
    }
    return closestPointOnLine(this._pivot, AXES[this._axis], ray, out)
  }

  private _apply(ctx: OperatorContext) {
    if (!this._pointOn(this._startRay, _start) || !this._pointOn(this._lastRay, _world)) return
    this._delta.subVectors(_world, _start)
    this._write(ctx)
  }

  private _write(ctx: OperatorContext) {
    for (const target of this._targets) {
      const local = _world.copy(target.start).add(this._delta).applyMatrix4(target.parentInverse)
      ctx.transaction.copy(target.object, 'position', local)
    }
  }

  private _finish(): OperatorStatus {
    // A press and release without movement moves nothing and records no command.
    if (this._delta.lengthSq() === 0) return 'cancelled'
    this.props.axis = this._axis
    this.props.delta = this._delta.toArray() as [number, number, number]
    return 'finished'
  }
}

const _w0 = new Vector3()

/** Closest point on the line `origin + s * direction` (unit direction) to `ray`. False when they are parallel. */
export function closestPointOnLine(origin: Vector3, direction: Vector3, ray: Ray, out: Vector3): boolean {
  const b = direction.dot(ray.direction)
  const denominator = 1 - b * b
  if (Math.abs(denominator) < 1e-6) return false
  _w0.subVectors(origin, ray.origin)
  const d = direction.dot(_w0)
  const e = ray.direction.dot(_w0)
  const s = (b * e - d) / denominator
  out.copy(direction).multiplyScalar(s).add(origin)
  return true
}

export const translateOperatorType: OperatorType = {
  id: 'transform.translate',
  label: 'Move',
  create: props => new TranslateOperator(props as TranslateProps),
}
