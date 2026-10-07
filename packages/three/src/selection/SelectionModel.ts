import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import type { Object3D } from 'three/webgpu'
import type { ThreeDocument } from '../editor/ThreeDocument.js'
import type { Transaction } from '../editor/Transaction.js'

/** Selection levels (ADR-0007). Only `object` is implemented; component domains arrive with geometry adapters. */
export type SelectionDomain = 'object' | 'point' | 'edge' | 'primitive' | 'corner' | (string & {})

export type SelectionModelProps = ReactiveObjectProps & {
  document: ThreeDocument
}

/**
 * Session selection of one document (ADR-0007): object uuids plus the active object. Not document data,
 * so it never syncs to other users. Changes go through `edit()`; one commit bumps `version` once and sends
 * one `'selection'` change, so views and inspectors update once per gesture, not per object.
 */
@Register
export class SelectionModel extends ReactiveObject {

  /** Current select mode. */
  @Property({type: String, value: 'object'})
  declare domain: SelectionDomain

  /** Bumped once per committed change. Bind UI to this, not to the set. */
  @Property({type: Number, value: 0})
  declare version: number

  /** uuid of the active object, or `''`. */
  @Property({type: String, value: ''})
  declare active: string

  @Property({type: Boolean, value: false})
  declare uvSync: boolean

  // Assigned from the constructor args by ReactiveObject; `declare` keeps a class field from resetting it.
  declare readonly document: ThreeDocument

  private readonly _objects = new Set<string>()

  constructor(args: SelectionModelProps) {
    super(args)
    this.document.addCommitListener(this._onCommit)
  }

  get size() {
    return this._objects.size
  }

  has(uuid: string) {
    return this._objects.has(uuid)
  }

  /** Selected uuids in selection order. */
  ids(): string[] {
    return [...this._objects]
  }

  /** Selected objects that are still in the document. */
  getObjects(): Object3D[] {
    const objects: Object3D[] = []
    for (const uuid of this._objects) {
      const object = this.document.getObject(uuid)
      if (object) objects.push(object)
    }
    return objects
  }

  getActiveObject(): Object3D | undefined {
    return this.active ? this.document.getObject(this.active) : undefined
  }

  edit(): SelectionEdit {
    return new SelectionEdit(this, this._objects, this.active)
  }

  /** Replaces the selection; the last id becomes active unless `active` is given. */
  set(uuids: Iterable<string>, active?: string) {
    this.edit().set(uuids, active).commit()
  }

  clear() {
    this.edit().clear().commit()
  }

  /** @internal Applies a committed edit. */
  _apply(objects: Set<string>, active: string) {
    const same = objects.size === this._objects.size && [...objects].every(uuid => this._objects.has(uuid))
    if (same && active === this.active) return false
    const changed = new Set([...this._objects, ...objects].filter(uuid => this._objects.has(uuid) !== objects.has(uuid)))
    this._objects.clear()
    for (const uuid of objects) this._objects.add(uuid)
    this.setProperties({active, version: this.version + 1})
    this.document.notify({kind: 'selection', ids: changed.size ? [...changed] : [active]})
    return true
  }

  override dispose() {
    this.document.removeCommitListener(this._onCommit)
    super.dispose()
  }

  /** Objects removed from the document leave the selection. */
  private _onCommit = (transaction: Transaction) => {
    const removed = transaction.patches.filter(patch => patch.op === 'remove').map(patch => patch.op === 'remove' ? patch.object : null)
    const ids: string[] = []
    for (const object of removed) object?.traverse(child => { if (this._objects.has(child.uuid)) ids.push(child.uuid) })
    if (ids.length) this.edit().remove(ids).commit()
  }
}

/**
 * A pending selection change. Nothing is visible until `commit()`.
 */
export class SelectionEdit {

  private readonly _model: SelectionModel
  private readonly _objects: Set<string>
  private _active: string

  constructor(model: SelectionModel, objects: Set<string>, active: string) {
    this._model = model
    this._objects = new Set(objects)
    this._active = active
  }

  add(uuids: string | Iterable<string>) {
    for (const uuid of typeof uuids === 'string' ? [uuids] : uuids) this._objects.add(uuid)
    return this
  }

  remove(uuids: string | Iterable<string>) {
    for (const uuid of typeof uuids === 'string' ? [uuids] : uuids) {
      this._objects.delete(uuid)
      if (this._active === uuid) this._active = ''
    }
    return this
  }

  toggle(uuids: string | Iterable<string>) {
    for (const uuid of typeof uuids === 'string' ? [uuids] : uuids) {
      if (this._objects.has(uuid)) this.remove(uuid)
      else this._objects.add(uuid)
    }
    return this
  }

  set(uuids: Iterable<string>, active?: string) {
    this._objects.clear()
    let last = ''
    for (const uuid of uuids) {
      this._objects.add(uuid)
      last = uuid
    }
    this._active = active ?? last
    return this
  }

  clear() {
    this._objects.clear()
    this._active = ''
    return this
  }

  setActive(uuid: string) {
    if (uuid) this._objects.add(uuid)
    this._active = uuid
    return this
  }

  /** Applies the edit. Returns false when nothing changed (no version bump, no notification). */
  commit() {
    if (this._active && !this._objects.has(this._active)) this._active = ''
    return this._model._apply(this._objects, this._active)
  }
}
