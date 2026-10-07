import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import type { Object3D } from 'three/webgpu'
import type { ThreeDocument } from '../editor/ThreeDocument.js'
import type { Transaction } from '../editor/Transaction.js'
import { ComponentSet } from './ComponentSet.js'

/**
 * Selection levels (ADR-0007): `object`, then the attribute domains of geometry adapters. `corner` is the
 * UV view's own selection (UVs are stored per triangle corner).
 */
export type SelectionDomain = 'object' | 'point' | 'edge' | 'primitive' | 'corner' | (string & {})

/** Component sets of one object, by domain. */
export type ComponentSets = ReadonlyMap<SelectionDomain, ComponentSet>

export type SelectionModelProps = ReactiveObjectProps & {
  document: ThreeDocument
}

/**
 * Session selection of one document (ADR-0007): object uuids, the active object, and component bitsets per
 * object per domain. Not document data, so it never syncs to other users. Changes go through `edit()`; one
 * commit bumps `version` once and sends one `'selection'` change, so views and inspectors update once per
 * gesture, not per object. Component sets stay when their object is deselected (like Blender's mesh select
 * flags) and are meaningful only for the topology they were made for (`ComponentSet.size`).
 */
@Register
export class SelectionModel extends ReactiveObject {

  /** Current select mode: `'object'`, or the component domain picked in edit mode. */
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

  /** The component domain edit mode returns to (`domain` is `'object'` outside edit mode). */
  componentDomain: SelectionDomain = 'point'

  private readonly _objects = new Set<string>()
  private readonly _components = new Map<string, Map<SelectionDomain, ComponentSet>>()

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

  /** Selected objects without a selected ancestor: what transforms move, so children are not moved twice. */
  getRootObjects(): Object3D[] {
    return this.getObjects().filter(object => {
      for (let node = object.parent; node; node = node.parent) if (this._objects.has(node.uuid)) return false
      return true
    })
  }

  getActiveObject(): Object3D | undefined {
    return this.active ? this.document.getObject(this.active) : undefined
  }

  /** Selected components of one object in one domain. Do not modify; use `edit().components()`. */
  getComponents(uuid: string, domain: SelectionDomain = this.domain): ComponentSet | undefined {
    return this._components.get(uuid)?.get(domain)
  }

  /** uuids of objects with selected components (in `domain`, or in any domain). */
  componentIds(domain?: SelectionDomain): string[] {
    const ids: string[] = []
    for (const [uuid, sets] of this._components) if (!domain || sets.has(domain)) ids.push(uuid)
    return ids
  }

  edit(): SelectionEdit {
    return new SelectionEdit(this, this._objects, this.active, this.domain, this._components)
  }

  /** Replaces the selection; the last id becomes active unless `active` is given. */
  set(uuids: Iterable<string>, active?: string) {
    this.edit().set(uuids, active).commit()
  }

  clear() {
    this.edit().clear().commit()
  }

  /** @internal Applies a committed edit. `components` holds only the sets the edit touched (empty = none). */
  _apply(objects: Set<string>, active: string, domain: SelectionDomain, components: Map<string, Map<SelectionDomain, ComponentSet>>) {
    const changed = new Set([...this._objects, ...objects].filter(uuid => this._objects.has(uuid) !== objects.has(uuid)))
    for (const [uuid, sets] of components) {
      for (const [setDomain, set] of sets) {
        const current = this.getComponents(uuid, setDomain)
        if (current ? current.equals(set) : set.isEmpty()) continue
        changed.add(uuid)
        let own = this._components.get(uuid)
        if (set.isEmpty()) {
          own?.delete(setDomain)
          if (own && !own.size) this._components.delete(uuid)
        } else {
          if (!own) this._components.set(uuid, own = new Map())
          own.set(setDomain, set)
        }
      }
    }
    if (!changed.size && active === this.active && domain === this.domain) return false
    this._objects.clear()
    for (const uuid of objects) this._objects.add(uuid)
    this.setProperties({active, domain, version: this.version + 1})
    this.document.notify({kind: 'selection', ids: changed.size ? [...changed] : [active]})
    return true
  }

  override dispose() {
    this.document.removeCommitListener(this._onCommit)
    super.dispose()
  }

  /** Objects removed from the document leave the selection, with their components. */
  private _onCommit = (transaction: Transaction) => {
    const removed = transaction.patches.filter(patch => patch.op === 'remove').map(patch => patch.op === 'remove' ? patch.object : null)
    const ids: string[] = []
    for (const object of removed) object?.traverse(child => { if (this._objects.has(child.uuid) || this._components.has(child.uuid)) ids.push(child.uuid) })
    if (ids.length) this.edit().remove(ids).clearComponents(undefined, ids).commit()
  }
}

/**
 * A pending selection change. Nothing is visible until `commit()`.
 */
export class SelectionEdit {

  private readonly _model: SelectionModel
  private readonly _objects: Set<string>
  private _active: string
  private _domain: SelectionDomain
  private readonly _source: ReadonlyMap<string, ReadonlyMap<SelectionDomain, ComponentSet>>
  /** Sets this edit has copied or replaced. */
  private readonly _components = new Map<string, Map<SelectionDomain, ComponentSet>>()

  constructor(model: SelectionModel, objects: Set<string>, active: string, domain: SelectionDomain, components: ReadonlyMap<string, ReadonlyMap<SelectionDomain, ComponentSet>>) {
    this._model = model
    this._objects = new Set(objects)
    this._active = active
    this._domain = domain
    this._source = components
  }

  get domain() {
    return this._domain
  }

  setDomain(domain: SelectionDomain) {
    this._domain = domain
    return this
  }

  /**
   * A writable copy of one object's set in `domain`, made for a domain of `size` elements. An existing set
   * of another size (made for an older topology) is replaced by an empty one.
   */
  components(uuid: string, domain: SelectionDomain, size: number): ComponentSet {
    let sets = this._components.get(uuid)
    let set = sets?.get(domain)
    if (set && set.size === size) return set
    const source = this._source.get(uuid)?.get(domain)
    set = source && source.size === size ? source.clone() : new ComponentSet(size)
    if (!sets) this._components.set(uuid, sets = new Map())
    sets.set(domain, set)
    return set
  }

  /** The set as this edit currently sees it (copied or not). */
  peekComponents(uuid: string, domain: SelectionDomain): ComponentSet | undefined {
    return this._components.get(uuid)?.get(domain) ?? this._source.get(uuid)?.get(domain)
  }

  /** Clears component sets of `domain` (or of every domain) on every object, or on `uuids` only. */
  clearComponents(domain?: SelectionDomain, uuids?: Iterable<string>) {
    const ids = uuids ? [...uuids] : [...new Set([...this._source.keys(), ...this._components.keys()])]
    for (const uuid of ids) {
      const domains = new Set([...(this._source.get(uuid)?.keys() ?? []), ...(this._components.get(uuid)?.keys() ?? [])])
      for (const setDomain of domains) {
        if (domain && setDomain !== domain) continue
        const current = this.peekComponents(uuid, setDomain)
        if (current) this.components(uuid, setDomain, current.size).clear()
      }
    }
    return this
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
    return this._model._apply(this._objects, this._active, this._domain, this._components)
  }
}
