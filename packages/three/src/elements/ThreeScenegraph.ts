import { Register, Property, Field, ReactiveElement, ReactiveElementProps, VDOMElement, WithBinding } from '@io-gui/core'
import type { Object3D } from 'three/webgpu'
import { Editor } from '../editor/Editor.js'
import type { Document, DocumentChange } from '../editor/Document.js'
import { SelectionModel } from '../selection/SelectionModel.js'
import { renderScheduler, ChangeListener } from '../render/RenderScheduler.js'
import { selectObjects } from '../input/behaviors/SelectBehavior.js'
import { getObjectIcon } from '../icons/objectIcons.js'
import { ThreeScenegraphItem, threeScenegraphItem, ScenegraphSelectDetail, ScenegraphObjectDetail, ScenegraphRenameDetail } from './ThreeScenegraphItem.js'

export type ThreeScenegraphProps = ReactiveElementProps & {
  editor: Editor
  disclosure?: WithBinding<Record<string, boolean>>
}

/** Past this many entries `disclosure` drops the oldest: uuids of objects that are gone (reloaded examples) pile up. */
export const DISCLOSURE_LIMIT = 1000

/**
 * A collapsible tree of the editor document's scene. Each row shows an object's type icon (`getObjectIcon`) and its
 * name, or `<ClassName>` when it has none. Everything starts expanded; `disclosure` keeps what the user collapsed, by
 * uuid. Rows highlight the editor's selection, the active object strongest; clicking a row selects its object as a
 * viewport click would (Shift toggles, Ctrl removes). A new active object, from anywhere, is revealed: its ancestors
 * expand and its row scrolls into view. Double-click or F2 renames an object through the `object.rename` operator.
 * Follows `editor.document` and refreshes on its `structure` changes and renames, also those made outside
 * transactions that are reported with `notify()`.
 */
@Register
export class ThreeScenegraph extends ReactiveElement implements ChangeListener {

  static override get Style() {
    return /* css */`
      :host {
        display: grid;
        /* As wide as the widest row, at least the panel: deep or long rows scroll horizontally. */
        grid-template-columns: minmax(max-content, auto);
        align-content: start;
        overflow: auto;
        padding: var(--io_spacing) 0;
        @apply --io-unselectable;
      }
    `
  }

  static override get Listeners() {
    return {
      'three-scenegraph-select': 'onSelectObject',
      'three-scenegraph-toggle': 'onToggleObject',
      'three-scenegraph-rename-start': 'onRenameStart',
      'three-scenegraph-rename-end': 'onRenameEnd',
    }
  }

  @Property({type: Editor})
  declare editor: Editor

  /** The editor's selection, observed for highlights. Follows `editor.selection`. */
  @Property({type: SelectionModel})
  declare selection: SelectionModel

  /**
   * Collapsed objects by uuid (`false`); objects without an entry show expanded. Bind it to `Storage` to persist it.
   */
  @Property({type: Object, init: null})
  declare disclosure: Record<string, boolean>

  /** uuid of the object whose name is being edited, or `''`. */
  @Property({type: String, value: ''})
  declare renamingId: string

  @Field('tree')
  declare role: string

  @Field('true')
  declare ariaMultiSelectable: string

  /** The active object last revealed. A Field: the handlers that set it can run inside the base constructor. */
  @Field('')
  declare private _revealedId: string

  /** The object whose row the next render scrolls into view. */
  declare private _scrollTarget: Object3D | undefined

  constructor(args: ThreeScenegraphProps) { super(args) }

  /** The document whose changes the scheduler hands to `onDocumentChanges`. */
  get document(): Document | null {
    return this.editor?.document ?? null
  }

  override connectedCallback() {
    super.connectedCallback()
    renderScheduler.addListener(this)
    // Changes made while disconnected were not seen.
    this.debounce(this.mutated)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    renderScheduler.removeListener(this)
  }

  isExpanded(object: Object3D): boolean {
    return this.disclosure[object.uuid] ?? true
  }

  setExpanded(object: Object3D, expanded: boolean) {
    this._setExpanded([object], expanded)
  }

  /** Expands the ancestors of `object` and scrolls its row into view. */
  reveal(object: Object3D) {
    const ancestors: Object3D[] = []
    for (let parent = object.parent; parent; parent = parent.parent) ancestors.push(parent)
    this._scrollTarget = object
    this._setExpanded(ancestors, true)
    this.debounce(this.mutated)
  }

  /** Shows a name field on the object's row, scrolled into view. */
  startRename(object: Object3D) {
    this._scrollTarget = object
    this.renamingId = object.uuid
  }

  /** Renames the object being renamed (through the `object.rename` operator), or with `null` keeps its name. */
  endRename(name: string | null) {
    const id = this.renamingId
    if (!id) return
    if (name !== null) this.editor.operators.run('object.rename', {id, name})
    this.renamingId = ''
  }

  onSelectObject(event: CustomEvent<ScenegraphSelectDetail>) {
    event.stopPropagation()
    const {object, mode} = event.detail
    selectObjects(this.editor.selection, mode, [object.uuid], object.uuid)
  }

  onToggleObject(event: CustomEvent<ScenegraphObjectDetail>) {
    event.stopPropagation()
    const object = event.detail.object
    this.setExpanded(object, !this.isExpanded(object))
  }

  onRenameStart(event: CustomEvent<ScenegraphObjectDetail>) {
    event.stopPropagation()
    this.startRename(event.detail.object)
  }

  onRenameEnd(event: CustomEvent<ScenegraphRenameDetail>) {
    event.stopPropagation()
    this.endRename(event.detail.name)
  }

  onDocumentChanges(changes: readonly DocumentChange[]) {
    // `other` covers renames; `settings` a replaced scene.
    if (changes.some(change => change.kind === 'structure' || change.kind === 'other' || change.kind === 'settings')) {
      this.debounce(this.mutated)
    }
  }

  editorChanged() {
    this.selection = this.editor.selection
  }

  /** The editor switched documents (and selections), or changed mode or playback. */
  editorMutated() {
    this.selection = this.editor.selection
    if (this.renamingId && !this.editor.document.getObject(this.renamingId)) this.renamingId = ''
    this._revealActive()
    this.debounce(this.mutated)
  }

  selectionMutated() {
    this._revealActive()
    this.debounce(this.mutated)
  }

  override mutated() {
    const selection = this.editor.selection
    const rows: VDOMElement[] = []
    const addRows = (object: Object3D, depth: number) => {
      const hasChildren = object.children.length > 0
      const expanded = hasChildren && this.isExpanded(object)
      rows.push(threeScenegraphItem({
        object,
        depth,
        hasChildren,
        expanded,
        icon: getObjectIcon(object),
        label: object.name || `<${object.constructor.name}>`,
        selected: selection.has(object.uuid),
        active: selection.active === object.uuid,
        renaming: this.renamingId === object.uuid,
      }))
      if (expanded) for (const child of object.children) addRows(child, depth + 1)
    }
    addRows(this.editor.document.scene, 0)
    this.render(rows)

    const target = this._scrollTarget
    if (target) {
      this._scrollTarget = undefined
      const row = [...this.children].find(row => (row as ThreeScenegraphItem).object === target)
      if (row) this._scrollToRow(row as ThreeScenegraphItem)
    }
  }

  override dispose() {
    renderScheduler.removeListener(this)
    super.dispose()
  }

  /** Reveals the selection's active object when it changed since the last reveal. */
  private _revealActive() {
    const active = this.editor.selection.active
    if (active === this._revealedId) return
    this._revealedId = active
    const object = active ? this.editor.document.getObject(active) : undefined
    if (object) this.reveal(object)
  }

  /** Scrolls the least that shows the row, then its label (deep rows are wider than the view). */
  private _scrollToRow(row: ThreeScenegraphItem) {
    row.scrollIntoView({block: 'nearest'})
    row.lastElementChild!.scrollIntoView({block: 'nearest', inline: 'nearest'})
  }

  private _setExpanded(objects: Object3D[], expanded: boolean) {
    const changed = objects.filter(object => this.isExpanded(object) !== expanded)
    if (!changed.length) return
    const disclosure = {...this.disclosure}
    for (const object of changed) {
      if (expanded) delete disclosure[object.uuid]
      else disclosure[object.uuid] = false
    }
    const uuids = Object.keys(disclosure)
    for (let i = 0; i < uuids.length - DISCLOSURE_LIMIT; i++) delete disclosure[uuids[i]]
    this.disclosure = disclosure
  }
}

export const threeScenegraph = function(arg0: ThreeScenegraphProps) {
  return ThreeScenegraph.vConstructor(arg0)
}
