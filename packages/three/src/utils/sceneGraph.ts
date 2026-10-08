import type { Object3D } from 'three/webgpu'

/** Whether `object` is `ancestor` or below it. */
export function isDescendant(object: Object3D, ancestor: Object3D) {
  for (let node: Object3D | null = object; node; node = node.parent) if (node === ancestor) return true
  return false
}

/** Whether `object` and every ancestor are visible. */
export function isShown(object: Object3D) {
  for (let node: Object3D | null = object; node; node = node.parent) if (!node.visible) return false
  return true
}
