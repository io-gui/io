import { Register, ReactiveObject, ReactiveObjectProps, Property, Field } from '@io-gui/core'
import { MathUtils, NoToneMapping, Object3D, Scene, ToneMapping, WebGPURenderer, ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, ReinhardToneMapping } from 'three/webgpu'
import { ChangeBus, DocumentChange } from './ChangeBus.js'
import { Patch, changeKindForPatch, insertChild, invertPatch, resolvePath, writeValue } from './Patch.js'
import { Transaction } from './Transaction.js'
import { isDescendant } from '../utils/sceneGraph.js'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioOptionSelect, Menu } from '@io-gui/menus'

export type ThreeDocumentProps = ReactiveObjectProps & {
  scene?: Scene
  toneMapping?: ToneMapping
  toneMappingExposure?: number
  autoplay?: boolean
}

const HISTORY_LIMIT = 100

/**
 * The content of a ThreeEditor (ADR-0002): the scene of authored objects plus scene render settings.
 * Edits go through transactions of invertible patches (ADR-0008); every applied patch is reported on
 * the change bus, so views redraw without extra calls. Each committed transaction is dispatched as a
 * `commit` event with the transaction as `detail` (future undo stack and sync).
 */
@Register
export class ThreeDocument extends ReactiveObject {

  @Property({type: Scene, init: null})
  declare scene: Scene

  @Property({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

  @Property({type: Number, value: 1})
  declare toneMappingExposure: number

  /**
   * Whether the document plays (`editor.isPlaying`) when opened. The editor does not read it; whatever opens
   * the document sets `isPlaying` from it.
   */
  @Property({type: Boolean, value: false})
  declare autoplay: boolean

  /** Stable id of this document, used to key per-document session state (selection, view navigation). */
  readonly uuid: string = MathUtils.generateUUID()

  /** A Field: `mutated()` reports settings changes from inside the base constructor. */
  @Field(ChangeBus)
  declare readonly changeBus: ChangeBus

  private readonly _index = new Map<string, Object3D>()
  /** Ids not found since the last index rebuild; cleared when the current task ends. */
  private readonly _misses = new Set<string>()
  private _active: Transaction | null = null
  private readonly _history: Transaction[] = []
  /** Renderers `onRendererInitialized` has run for. */
  private readonly _renderers = new WeakSet<WebGPURenderer>()

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
    if (cached && isDescendant(cached, scene)) return cached
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

  /**
   * Called once per renderer, when it is ready and about to draw this document for the first time
   * (a document opened later still gets it). Do GPU setup here: compute passes, PMREM environments.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRendererInitialized(renderer: WebGPURenderer) {}

  /**
   * Called each frame while the editor showing this document plays (`isPlaying`), after the editor's `onAnimate`.
   * Views redraw after it; scene writes here bypass transactions.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number, time: number) {}

  override mutated() {
    this.notify({kind: 'settings'})
  }

  /** @internal Called by viewports before each draw; runs `onRendererInitialized` once per renderer. */
  _prepareRenderer(renderer: WebGPURenderer) {
    if (this._renderers.has(renderer)) return
    this._renderers.add(renderer)
    void this.onRendererInitialized(renderer)
  }

  /** @internal Applies a patch and reports it. */
  _applyPatch(patch: Patch) {
    if (patch.op === 'set' || patch.op === 'copy') {
      const object = this.getObject(patch.id)
      if (!object) throw new Error(`Patch: object ${patch.id} is not in the document`)
      const {owner, key} = resolvePath(object, patch.path)
      writeValue(patch.op, owner, key, patch.value)
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
    const id = 'id' in patch ? patch.id : patch.object.uuid
    this.notify({kind: changeKindForPatch(patch), ids: [id]})
  }

  /** @internal */
  _endTransaction(transaction: Transaction) {
    if (this._active === transaction) this._active = null
    if (transaction.state !== 'committed' || transaction.patches.length === 0) return
    this._history.push(transaction)
    if (this._history.length > HISTORY_LIMIT) this._history.shift()
    this.dispatch('commit', transaction)
  }

  private _rebuildIndex() {
    this._index.clear()
    this.scene?.traverse(object => { this._index.set(object.uuid, object) })
  }
}

registerEditorConfig(ThreeDocument, [
  ['toneMappingExposure', ioNumberSlider({min: 0, max: 3, step: 0.01, exponent: 2})],
  ['toneMapping', ioOptionSelect({model: new Menu({options: [
    {value: NoToneMapping, id: 'NoToneMapping'},
    {value: LinearToneMapping, id: 'LinearToneMapping'},
    {value: ReinhardToneMapping, id: 'ReinhardToneMapping'},
    {value: CineonToneMapping, id: 'CineonToneMapping'},
    {value: ACESFilmicToneMapping, id: 'ACESFilmicToneMapping'},
    {value: AgXToneMapping, id: 'AgXToneMapping'},
    {value: NeutralToneMapping, id: 'NeutralToneMapping'},
  ]})})],
])

registerEditorGroups(ThreeDocument, {
  Main: ['toneMapping', 'toneMappingExposure'],
  Advanced: [new RegExp(/^[\s\S]*$/)]
})