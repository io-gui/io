import { Box3, Camera, Object3D, Raycaster, Vector2, Vector3 } from 'three/webgpu'
import type { InputHost } from '../input/ViewInputEvent.js'

export interface PickHit {
  object: Object3D
  uuid: string
  distance: number
  point: Vector3
}

/** Rectangle in viewport pixels (corners in any order). */
export type PickRect = {x0: number; y0: number; x1: number; y1: number}

export type PickFilter = (object: Object3D) => boolean

/**
 * What is under the pointer in a view (ADR-0007). Async because GPU readback (ID buffers) is.
 * Implementations: `RaycastPicker` now; a `three-mesh-bvh` picker and an ID-buffer picker later.
 */
export interface Picker {
  pick(host: InputHost, x: number, y: number, filter?: PickFilter): Promise<PickHit | null>
  pickRect(host: InputHost, rect: PickRect, filter?: PickFilter): Promise<PickHit[]>
}

type Drawable = Object3D & {isMesh?: boolean; isPoints?: boolean; isLine?: boolean; isSprite?: boolean}

/** Line and point hit radius, in screen pixels. */
export const PICK_RADIUS = 4

/**
 * Objects that draw something, are visible down from the root, and are not opted out with
 * `userData.selectable = false` (on the object or an ancestor; use it for helpers such as grids).
 */
export function isSelectable(object: Object3D): boolean {
  const drawable = object as Drawable
  if (!(drawable.isMesh || drawable.isPoints || drawable.isLine || drawable.isSprite)) return false
  let node: Object3D | null = object
  while (node) {
    if (!node.visible || node.userData.selectable === false) return false
    node = node.parent
  }
  return true
}

export function collectSelectable(root: Object3D, camera?: Camera, filter?: PickFilter): Object3D[] {
  const objects: Object3D[] = []
  root.traverseVisible(object => {
    if (!isSelectable(object)) return
    if (camera && !object.layers.test(camera.layers)) return
    if (filter && !filter(object)) return
    objects.push(object)
  })
  return objects
}

const _raycaster = new Raycaster()
const _ndc = new Vector2()
const _box = new Box3()
const _corner = new Vector3()

/**
 * Picks with a plain `Raycaster` against the view's draw camera. Box selection tests each object's
 * projected world bounds against the rectangle (approximate: bounds, not drawn pixels).
 */
export class RaycastPicker implements Picker {

  pick(host: InputHost, x: number, y: number, filter?: PickFilter): Promise<PickHit | null> {
    const scene = host.scene
    if (!scene) return Promise.resolve(null)
    const rect = host.getBoundingClientRect()
    const camera = host.getViewCamera()
    _ndc.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1)
    _raycaster.setFromCamera(_ndc, camera)
    _raycaster.layers.mask = camera.layers.mask
    // Raycaster thresholds are world units (default 1); keep line and point hits to a few pixels.
    const threshold = host.view.getWorldPerPixel(rect.width, rect.height, scene) * PICK_RADIUS
    _raycaster.params.Line.threshold = threshold
    _raycaster.params.Points.threshold = threshold
    for (const intersection of _raycaster.intersectObject(scene, true)) {
      const object = intersection.object
      if (!isSelectable(object) || (filter && !filter(object))) continue
      return Promise.resolve({object, uuid: object.uuid, distance: intersection.distance, point: intersection.point})
    }
    return Promise.resolve(null)
  }

  pickRect(host: InputHost, rect: PickRect, filter?: PickFilter): Promise<PickHit[]> {
    const scene = host.scene
    if (!scene) return Promise.resolve([])
    const bounds = host.getBoundingClientRect()
    const camera = host.getViewCamera()
    const minX = Math.min(rect.x0, rect.x1), maxX = Math.max(rect.x0, rect.x1)
    const minY = Math.min(rect.y0, rect.y1), maxY = Math.max(rect.y0, rect.y1)
    const hits: PickHit[] = []
    for (const object of collectSelectable(scene, camera, filter)) {
      _box.setFromObject(object, true)
      if (_box.isEmpty()) continue
      let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity
      let inFront = false
      for (let i = 0; i < 8; i++) {
        _corner.set((i & 1) ? _box.max.x : _box.min.x, (i & 2) ? _box.max.y : _box.min.y, (i & 4) ? _box.max.z : _box.min.z)
        _corner.project(camera)
        if (_corner.z < -1 || _corner.z > 1) continue
        inFront = true
        const px = (_corner.x + 1) / 2 * bounds.width
        const py = (1 - _corner.y) / 2 * bounds.height
        left = Math.min(left, px); right = Math.max(right, px)
        top = Math.min(top, py); bottom = Math.max(bottom, py)
      }
      if (!inFront || right < minX || left > maxX || bottom < minY || top > maxY) continue
      _box.getCenter(_corner)
      hits.push({object, uuid: object.uuid, distance: _corner.distanceTo(camera.position), point: _corner.clone()})
    }
    return Promise.resolve(hits)
  }
}

export const defaultPicker = new RaycastPicker()
