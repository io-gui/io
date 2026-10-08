import type { Object3D } from 'three/webgpu'
import type { ChangeKind } from './ChangeBus.js'

/**
 * An edit of one property path of a document object (dot-separated: `'visible'`, `'position.x'`, `'material.color'`).
 * `set` assigns the property, and its values are the assigned references. `copy` copies into the object the property
 * holds (`Vector3`, `Euler`, `Color`, ...), keeping its identity, and its values are snapshots (clones).
 */
export type ValuePatch = {id: string; path: string; value: unknown; oldValue: unknown} & ({op: 'set'} | {op: 'copy'})

/** The smallest invertible document edit, addressed by stable id (ADR-0008). */
export type Patch =
  | ValuePatch
  | {op: 'insert'; parentId: string; index: number; object: Object3D}
  | {op: 'remove'; parentId: string; index: number; object: Object3D}

const TRANSFORM_PATHS = ['position', 'quaternion', 'rotation', 'scale', 'matrix', 'up']

export function changeKindForPatch(patch: Patch): ChangeKind {
  if (patch.op === 'insert' || patch.op === 'remove') return 'structure'
  const head = patch.path.split('.')[0]
  if (TRANSFORM_PATHS.includes(head)) return 'transform'
  if (head === 'material') return 'material'
  if (head === 'geometry') return 'geometry'
  return 'other'
}

export function invertPatch(patch: Patch): Patch {
  switch (patch.op) {
    case 'set':
    case 'copy': return {...patch, value: patch.oldValue, oldValue: patch.value}
    case 'insert': return {op: 'remove', parentId: patch.parentId, index: patch.index, object: patch.object}
    case 'remove': return {op: 'insert', parentId: patch.parentId, index: patch.index, object: patch.object}
  }
}

/** The value a patch of `op` records: `copy` snapshots it, since the object it is copied into changes later. */
export function patchValue(op: ValuePatch['op'], value: unknown): unknown {
  return op === 'copy' ? (value as {clone(): unknown}).clone() : value
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
 * Applies a value patch: `set` assigns, `copy` copies into the held object. Assigning a read-only property
 * (`Object3D.position`, `rotation`, `quaternion`, `scale`) throws; those are written with `copy`.
 */
export function writeValue(op: ValuePatch['op'], owner: Record<string, unknown>, key: string, value: unknown) {
  if (op === 'set') owner[key] = value
  else (owner[key] as {copy(source: unknown): unknown}).copy(value)
}

export function insertChild(parent: Object3D, object: Object3D, index: number) {
  parent.add(object)
  const children = parent.children
  children.splice(children.indexOf(object), 1)
  children.splice(Math.min(Math.max(index, 0), children.length), 0, object)
}
