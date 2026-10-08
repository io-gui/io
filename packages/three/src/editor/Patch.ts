import type { Object3D } from 'three/webgpu'
import type { ChangeKind } from './ChangeBus.js'

/**
 * The smallest invertible document edit, addressed by stable id (ADR-0008).
 * `set` paths are dot-separated property paths on the object: `'position'`, `'visible'`, `'material.color'`.
 */
export type Patch =
  | {op: 'set'; id: string; path: string; value: unknown; oldValue: unknown}
  | {op: 'insert'; parentId: string; index: number; object: Object3D}
  | {op: 'remove'; parentId: string; index: number; object: Object3D}

const TRANSFORM_PATHS = ['position', 'quaternion', 'rotation', 'scale', 'matrix', 'up']

export function changeKindForPatch(patch: Patch): ChangeKind {
  if (patch.op !== 'set') return 'structure'
  const head = patch.path.split('.')[0]
  if (TRANSFORM_PATHS.includes(head)) return 'transform'
  if (head === 'material') return 'material'
  if (head === 'geometry') return 'geometry'
  return 'other'
}

export function invertPatch(patch: Patch): Patch {
  switch (patch.op) {
    case 'set': return {op: 'set', id: patch.id, path: patch.path, value: patch.oldValue, oldValue: patch.value}
    case 'insert': return {op: 'remove', parentId: patch.parentId, index: patch.index, object: patch.object}
    case 'remove': return {op: 'insert', parentId: patch.parentId, index: patch.index, object: patch.object}
  }
}

type Cloneable = {clone(): unknown}
type Copyable = {copy(source: unknown): unknown}

/** Snapshot of a value: math objects are cloned, arrays sliced, everything else kept as is. */
export function cloneValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.slice()
  if (value && typeof (value as Cloneable).clone === 'function' && typeof (value as Copyable).copy === 'function') {
    return (value as Cloneable).clone()
  }
  return value
}

export function resolvePath(root: object, path: string): {owner: Record<string, unknown>; key: string} {
  const segments = path.split('.')
  const key = segments.pop()!
  let owner = root as Record<string, unknown>
  for (const segment of segments) {
    owner = owner[segment] as Record<string, unknown>
    if (owner === undefined || owner === null) throw new Error(`Patch: path "${path}" does not resolve`)
  }
  return {owner, key}
}

/**
 * Writes a value in place. Math objects (`Vector3`, `Euler`, `Color`, ...) are copied into the existing
 * instance, because Three.js relies on their identity (`object.position` is read-only).
 */
export function writeValue(owner: Record<string, unknown>, key: string, value: unknown) {
  const current = owner[key]
  if (current && value && typeof (current as Copyable).copy === 'function' && (value as object).constructor === (current as object).constructor) {
    (current as Copyable).copy(value)
  } else {
    owner[key] = value
  }
}

export function insertChild(parent: Object3D, object: Object3D, index: number) {
  parent.add(object)
  const children = parent.children
  children.splice(children.indexOf(object), 1)
  children.splice(Math.min(Math.max(index, 0), children.length), 0, object)
}
