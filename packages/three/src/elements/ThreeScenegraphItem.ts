import { Register, Property, Field, span } from '@io-gui/core'
import { IoField, IoFieldProps, IoString, ioString } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import type { Object3D } from 'three/webgpu'
import type { SelectMode } from '../input/behaviors/SelectBehavior.js'

export type ThreeScenegraphItemProps = IoFieldProps & {
  object: Object3D
  depth?: number
  hasChildren?: boolean
  expanded?: boolean
  active?: boolean
  renaming?: boolean
}

/** Detail of the bubbling `three-scenegraph-select` event. */
export type ScenegraphSelectDetail = {object: Object3D; mode: SelectMode}

/** Detail of the bubbling `three-scenegraph-toggle` and `three-scenegraph-rename-start` events. */
export type ScenegraphObjectDetail = {object: Object3D}

/** Detail of the bubbling `three-scenegraph-rename-end` event: the new name, or `null` when cancelled. */
export type ScenegraphRenameDetail = {name: string | null}

/**
 * One row of a `ThreeScenegraph`: the disclosure triangle, `icon` and `label` of one object, indented by `depth`.
 * Clicking the row dispatches `three-scenegraph-select`, with the mode viewport clicks use (Shift toggles, Ctrl
 * removes); clicking the triangle dispatches `three-scenegraph-toggle`. Up / Down / Home / End move between rows;
 * Right expands, then moves to the first child; Left collapses, then moves to the parent; Enter / Space select.
 * Double-click or F2 dispatches `three-scenegraph-rename-start`; while `renaming`, a name field replaces the label,
 * and Enter or leaving it dispatches `three-scenegraph-rename-end` with the name, Escape with `null`.
 */
@Register
export class ThreeScenegraphItem extends IoField {

  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        align-items: center;
        border-radius: 0;
      }
      :host > .expander {
        flex: none;
        width: var(--io_lineHeight);
        height: var(--io_lineHeight);
      }
      :host > io-icon {
        flex: none;
      }
      :host > span:last-child {
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 var(--io_spacing2);
      }
      :host > io-string[appearance] {
        flex: none;
        width: 12em;
        height: var(--io_lineHeight);
        min-height: var(--io_lineHeight);
        margin-left: var(--io_spacing);
        padding-top: 0;
        padding-bottom: 0;
      }
      :host[selected] {
        color: var(--io_color);
        background-color: color-mix(in srgb, var(--io_bgColorBlue) 40%, transparent);
        border-color: transparent;
      }
      :host[active] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorBlue);
      }
      :host[active] > io-icon {
        fill: var(--io_colorWhite);
      }
    `
  }

  static override get Listeners() {
    return {
      'dblclick': 'onDblclick',
    }
  }

  /** The object this row shows. A Field: a reactive property would observe each row's object for mutations. */
  @Field()
  declare object: Object3D

  @Property({type: Number, value: 0})
  declare depth: number

  @Property({type: Boolean, value: false})
  declare hasChildren: boolean

  @Property({type: Boolean, value: false})
  declare expanded: boolean

  /** Whether the object is the selection's active object (it is `selected` too). */
  @Property({type: Boolean, value: false, reflect: true})
  declare active: boolean

  /** Whether a name field replaces the label. */
  @Property({type: Boolean, value: false})
  declare renaming: boolean

  @Field('treeitem')
  declare role: string

  /** Whether the last press started on the disclosure triangle. */
  private _expanderPressed = false

  constructor(args: ThreeScenegraphItemProps) { super(args) }

  override onPointerdown(event: PointerEvent) {
    // The name field takes its own presses: placing the caret, selecting text.
    if (this._nameField()?.contains(event.target as Node)) return
    const expander = this.querySelector(':scope > io-icon.expander')
    this._expanderPressed = !!expander && expander.contains(event.target as Node)
    super.onPointerdown(event)
  }

  override onClick(event?: MouseEvent) {
    event?.stopPropagation()
    if (event && this._nameField()?.contains(event.target as Node)) return
    if (event && this._expanderPressed) {
      this._dispatchObject('three-scenegraph-toggle')
    } else {
      const mode: SelectMode = event?.shiftKey ? 'toggle' : event?.ctrlKey ? 'subtract' : 'set'
      this.dispatch('three-scenegraph-select', {object: this.object, mode} satisfies ScenegraphSelectDetail, true)
    }
  }

  onDblclick() {
    if (!this.renaming && !this._expanderPressed) this._dispatchObject('three-scenegraph-rename-start')
  }

  override onKeydown(event: KeyboardEvent) {
    const rows = this.parentElement
    switch (event.key) {
      case 'ArrowDown':
        focusRow(this.nextElementSibling)
        break
      case 'ArrowUp':
        focusRow(this.previousElementSibling)
        break
      case 'Home':
        focusRow(rows?.firstElementChild)
        break
      case 'End':
        focusRow(rows?.lastElementChild)
        break
      case 'ArrowRight':
        if (this.hasChildren && !this.expanded) this._dispatchObject('three-scenegraph-toggle')
        else if (this.expanded) focusRow(this.nextElementSibling)
        break
      case 'ArrowLeft':
        if (this.expanded) this._dispatchObject('three-scenegraph-toggle')
        else focusRow(this._parentRow())
        break
      case 'F2':
        this._dispatchObject('three-scenegraph-rename-start')
        break
      default:
        super.onKeydown(event)
        return
    }
    event.preventDefault()
  }

  // Ending the rename removes the name field, so its own handlers for the same event are stopped.
  onNameKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== 'Escape') return
    event.preventDefault()
    event.stopImmediatePropagation()
    this._endRename(event.key === 'Enter' ? (event.currentTarget as IoString).textNode ?? '' : null)
    this.focus()
  }

  onNameBlur(event: FocusEvent) {
    event.stopImmediatePropagation()
    this._endRename((event.currentTarget as IoString).textNode ?? '')
  }

  override mutated() {
    // Each level indents by half a triangle, so deep hierarchies stay compact.
    this.style.paddingLeft = `calc(var(--io_spacing) + ${this.depth} * var(--io_lineHeight) * 0.5)`
    this.setAttribute('aria-level', String(this.depth + 1))
    if (this.hasChildren) this.setAttribute('aria-expanded', String(this.expanded))
    else this.removeAttribute('aria-expanded')
    this.render([
      this.hasChildren
        ? ioIcon({class: 'expander', value: this.expanded ? 'io:triangle_down' : 'io:triangle_right'})
        : span({class: 'expander'}),
      ioIcon({value: this.icon}),
      this.renaming
        ? ioString({
          value: this.object.name,
          placeholder: this.object.constructor.name,
          '@keydown': this.onNameKeydown,
          '@blur': this.onNameBlur,
        })
        : span(this.label),
    ])
    const field = this._nameField()
    if (field && document.activeElement !== field) {
      field.focus()
      field.selectAll()
    }
  }

  private _nameField() {
    return this.querySelector(':scope > io-string') as IoString | null
  }

  private _endRename(name: string | null) {
    this.dispatch('three-scenegraph-rename-end', {name} satisfies ScenegraphRenameDetail, true)
  }

  private _dispatchObject(type: string) {
    this.dispatch(type, {object: this.object} satisfies ScenegraphObjectDetail, true)
  }

  /** The row of the parent object: the nearest row above with a smaller depth. */
  private _parentRow() {
    let row = this.previousElementSibling
    while (row instanceof ThreeScenegraphItem && row.depth >= this.depth) row = row.previousElementSibling
    return row
  }
}

function focusRow(row: Element | null | undefined) {
  if (row instanceof ThreeScenegraphItem) row.focus()
}

export const threeScenegraphItem = function(arg0: ThreeScenegraphItemProps) {
  return ThreeScenegraphItem.vConstructor(arg0)
}
