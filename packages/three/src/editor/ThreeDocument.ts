import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { MathUtils, NoToneMapping, Object3D, Scene, ToneMapping } from 'three/webgpu'
import { ChangeBus, DocumentChange } from './ChangeBus.js'
import { Patch, changeKindForPatch, insertChild, invertPatch, resolvePath, writeValue } from './Patch.js'
import { Transaction } from './Transaction.js'

export type ThreeDocumentProps = ReactiveObjectProps & {
  scene?: Scene
  toneMapping?: ToneMapping
  toneMappingExposure?: number
}

export type CommitListener = (transaction: Transaction) => void

const HISTORY_LIMIT = 100

/**
 * The content of a ThreeEditor (ADR-0002): the scene of authored objects plus scene render settings.
 * Edits go through transactions of invertible patches (ADR-0008); every applied patch is reported on
 * the change bus, so views redraw without extra calls.
 */
@Register
export class ThreeDocument extends ReactiveObject {

  @Property({type: Scene, init: null})
  declare scene: Scene

  @Property({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

  @Property({type: Number, value: 1})
  declare toneMappingExposure: number

  /** Stable id of this document, used to key per-document session state (selection, view navigation). */
  readonly uuid: string = MathUtils.generateUUID()

  readonly changeBus = new ChangeBus()

  private readonly _index = new Map<string, Object3D>()
  /** Ids not found since the last index rebuild; cleared when the current task ends. */
  private readonly _misses = new Set<string>()
  private _active: Transaction | null = null
  private readonly _history: Transaction[] = []
  private readonly _commitListeners = new Set<CommitListener>()

  constructor(args?: ThreeDocumentProps) {
    super(args)
  }

  /** Committed transactions, oldest first, up to the last 100. Not an undo stack (plan Phase 8). */
  get history(): readonly Transaction[] {
    return this._history
  }

  get activeTransaction(): Transaction | null {
    return this._active
  }

  notify(change: Omit<DocumentChange, 'source'>) {
    this.changeBus.notify({...change, source: this})
  }

  /**
   * Finds a scene object by uuid. Objects added outside transactions are found too: a miss rebuilds the
   * index, but an id that already missed in the current task does not walk the scene again.
   */
  getObject(uuid: string): Object3D | undefined {
    const scene = this.scene
    if (!scene) return undefined
    if (uuid === scene.uuid) return scene
    const cached = this._index.get(uuid)
    if (cached && this._isInScene(cached)) return cached
    if (this._misses.has(uuid)) return undefined
    this._rebuildIndex()
    const found = this._index.get(uuid)
    if (found) return found
    if (this._misses.size === 0) queueMicrotask(() => this._misses.clear())
    this._misses.add(uuid)
    return undefined
  }

  /** Opens a long-running transaction (an interactive drag). Commit or roll it back when done. */
  begin(label = ''): Transaction {
    debug: {
      if (this._active) console.error(`ThreeDocument.begin("${label}"): transaction "${this._active.label}" is still open`)
    }
    const transaction = new Transaction(this, label)
    this._active = transaction
    return transaction
  }

  /**
   * Runs `edit` in a transaction and commits it, or rolls it back if `edit` throws.
   * Inside an open transaction, `edit` joins it instead.
   */
  transact<T>(edit: (transaction: Transaction) => T, label = ''): T {
    if (this._active) return edit(this._active)
    const transaction = this.begin(label)
    try {
      const result = edit(transaction)
      transaction.commit()
      return result
    } catch (error) {
      if (transaction.state === 'open') transaction.rollback()
      throw error
    }
  }

  /** Applies the inverse of a committed transaction. The future undo stack builds on this. */
  revert(transaction: Transaction) {
    this._applyInverse(transaction.patches)
  }

  /** Re-applies a committed transaction's patches (redo). */
  reapply(transaction: Transaction) {
    for (const patch of transaction.patches) this._applyPatch(patch)
  }

  /** Called with every committed transaction (future undo stack and sync). */
  addCommitListener(listener: CommitListener) {
    this._commitListeners.add(listener)
  }

  removeCommitListener(listener: CommitListener) {
    this._commitListeners.delete(listener)
  }

  override mutated() {
    // Also runs inside the base constructor, before class fields exist.
    if (this.changeBus) this.notify({kind: 'settings'})
  }

  /** @internal Applies a patch and reports it. */
  _applyPatch(patch: Patch) {
    if (patch.op === 'set') {
      const object = this.getObject(patch.id)
      if (!object) throw new Error(`Patch: object ${patch.id} is not in the document`)
      const {owner, key} = resolvePath(object, patch.path)
      writeValue(owner, key, patch.value)
    } else {
      const parent = this.getObject(patch.parentId)
      if (!parent) throw new Error(`Patch: parent ${patch.parentId} is not in the document`)
      if (patch.op === 'insert') {
        insertChild(parent, patch.object, patch.index)
        patch.object.traverse(object => {
          this._index.set(object.uuid, object)
          this._misses.delete(object.uuid)
        })
      } else {
        parent.remove(patch.object)
        patch.object.traverse(object => { this._index.delete(object.uuid) })
      }
    }
    this._onPatchApplied(patch)
  }

  /** @internal */
  _applyInverse(patches: readonly Patch[]) {
    for (let i = patches.length - 1; i >= 0; i--) this._applyPatch(invertPatch(patches[i]))
  }

  /** @internal */
  _onPatchApplied(patch: Patch) {
    const id = patch.op === 'set' ? patch.id : patch.object.uuid
    this.notify({kind: changeKindForPatch(patch), ids: [id]})
  }

  /** @internal */
  _endTransaction(transaction: Transaction) {
    if (this._active === transaction) this._active = null
    if (transaction.state !== 'committed' || transaction.patches.length === 0) return
    this._history.push(transaction)
    if (this._history.length > HISTORY_LIMIT) this._history.shift()
    for (const listener of this._commitListeners) listener(transaction)
  }

  private _isInScene(object: Object3D) {
    let node: Object3D | null = object
    while (node) {
      if (node === this.scene) return true
      node = node.parent
    }
    return false
  }

  private _rebuildIndex() {
    this._index.clear()
    this.scene?.traverse(object => { this._index.set(object.uuid, object) })
  }
}
