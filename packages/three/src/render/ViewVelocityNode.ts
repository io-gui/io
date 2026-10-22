import { Camera, Matrix4, NodeFrame, Object3D, VelocityNode } from 'three/webgpu'
import { nodeImmutable } from 'three/tsl'

type DrawnMatrices = {frameId: number; previous: Matrix4; current: Matrix4}

/** The world matrices each camera drew an object with, in the last frame it drew the object and the one before. */
const _drawn = new WeakMap<Object3D, WeakMap<Camera, DrawnMatrices>>()

/**
 * Motion vectors for views that draw the same scene: three's `velocity`, measured against the world matrix the drawing
 * camera last drew the object with. Workaround (upstream: velocity-per-view): three's `velocity` keeps one previous
 * matrix per object and overwrites it after every draw, so of several views drawing velocity in a frame only the first
 * sees objects move, and TRAA smears them in the others. Write `viewVelocity` in the scene pass's MRT and name it as
 * TRAA's context `velocity`, which TRAA un-jitters: `context(traa(...), {velocity: viewVelocity})`.
 */
export class ViewVelocityNode extends VelocityNode {

  override update(frame: NodeFrame) {
    const result = super.update(frame)
    const {object, camera, frameId} = frame
    if (!object || !camera) return result
    let byCamera = _drawn.get(object)
    if (!byCamera) _drawn.set(object, byCamera = new WeakMap())
    let drawn = byCamera.get(camera)
    if (!drawn) {
      drawn = {frameId, previous: object.matrixWorld.clone(), current: object.matrixWorld.clone()}
      byCamera.set(camera, drawn)
    } else if (drawn.frameId !== frameId) {
      drawn.frameId = frameId
      drawn.previous.copy(drawn.current)
      drawn.current.copy(object.matrixWorld)
    }
    this.previousModelWorldMatrix.value.copy(drawn.previous)
    return result
  }

  /** three's `velocity` stores the drawn matrix per object here; `update` keeps it per camera instead. */
  override updateAfter() {
    return undefined
  }
}

/** One `ViewVelocityNode` for every view: it keeps the matrices per camera. */
export const viewVelocity = nodeImmutable(ViewVelocityNode)
