import { Register, Property, Field, IoOverlaySingleton as Overlay, span, WithBinding, NudgeDirection, ListenerDefinitions } from '@io-gui/core'
import { IoField, IoFieldProps } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import { IoMenuElementType, getMenuRoot, getMenuAncestors, getMenuDescendants, getMenuSiblings, getHoveredOption } from '../utils/MenuDOMUtils.js'
import { Option } from '../models/Option.js'
import { IoMenu } from './IoMenu.js'
import { IoMenuTree } from './IoMenuTree.js'

let timeoutOpen: ReturnType<typeof setTimeout> | undefined = undefined

let hovered: IoMenuElementType | undefined
let prevHovered: IoMenuElementType | undefined

export function onOverlayPointerdown(event: PointerEvent) {
  hovered = undefined
  prevHovered = undefined
}

export function onOverlayPointermove(event: PointerEvent) {
  clearTimeout(timeoutOpen)
  hovered = getHoveredOption(event)
  if (hovered && hovered !== prevHovered) {
    const v = Math.abs(event.movementY) - Math.abs(event.movementX)
    const h = (hovered.parentElement as IoMenu)?.horizontal
    if (prevHovered?.parentElement !== hovered.parentElement) {
      prevHovered = hovered
      hovered.focus()
    } else if (h ? v < -0.25 : v > 0.25) {
      prevHovered = hovered
      hovered.focus()
    } else {
      timeoutOpen = setTimeout(() => {
        prevHovered = hovered
        if (hovered) hovered.focus()
      }, 250)
    }
  }
}

export function onOverlayPointeup(event: PointerEvent) {
  if (hovered) (hovered as any).onClick()
}

Overlay.addEventListener('pointermove', onOverlayPointermove)

export type IoOptionProps = IoFieldProps & {
  model?: Option
  label?: string
  expanded?: WithBinding<boolean>
  direction?: NudgeDirection
  depth?: number
  $parent?: IoMenu | IoMenuTree
}

/**
 * The view paired with one `Option` model. It displays `model.icon`, `model.label` and `model.hint`
 * and creates an expandable `IoMenu` from the `model.options` array. Options expand in the direction
 * specified by the `direction` property. Activating an option dispatches `io-option-clicked` from the
 * menu root element — the single public menus event; selection state is observed via model properties.
 **/

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoOption extends IoField {
  static override get Style() {
    return /* css */`
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
      :host > .label {
        flex: 1 1 auto;
        padding: 0 var(--io_spacing2);
      }
      :host > .hint {
        flex: 0 1 auto;
        opacity: 0.25;
        padding: 0 var(--io_spacing2);
      }
      :host > .hasmore {
        opacity: 0.5;
      }
    `
  }

  @Property({type: Option})
  declare model: Option

  @Field('')
  declare label: string

  @Property({value: false, reflect: true})
  declare expanded: boolean

  @Property({value: 'right', reflect: true})
  declare direction: NudgeDirection

  @Property({value: 1000, reflect: true})
  declare depth: number

  @Field('false')
  declare contentEditable: string

  @Field()
  declare $parent?: IoMenu | IoMenuTree

  declare $menu?: IoMenu

  static override get Listeners(): ListenerDefinitions {
    return {
      'click': 'preventDefault',
      'focus': 'onFocus',
      'blur': 'onBlur',
    }
  }

  constructor(args: IoOptionProps = {}) { super(args) }

  preventDefault(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }
  get hasmore() {
    return this.model.options.length && this.depth > 0
  }
  get inoverlay() {
    return Overlay.contains(this.parentElement?.parentElement as HTMLElement)
  }
  override connectedCallback() {
    super.connectedCallback()
    if (this.$menu) Overlay.appendChild(this.$menu as HTMLElement)
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.$menu) Overlay.removeChild(this.$menu as HTMLElement)
  }
  override onClick() {
    const o = this.model
    if (this.hasmore) {
      if (!this.expanded) this.expanded = true
      return
    } else if (o.mode === 'toggle') {
      o.selected = !o.selected
    } else {
      if (o.action) {
        o.action.apply(null, [o.value])
        this.collapseRoot()
      }
      if (o.mode === 'select') {
        if (o.options.length && this.depth <= 0) {
          o.selectDefault()
        } else {
          o.selected = true
        }
        this.collapseRoot()
      }
    }
    getMenuRoot(this).dispatch('io-option-clicked', {option: o}, true)
  }
  override onPointerdown(event: PointerEvent) {
    super.onPointerdown(event)
    if (event.pointerType !== 'touch') {
      this.setPointerCapture(event.pointerId)
      event.stopPropagation()
      if (this.hasmore) this.expanded = true
      onOverlayPointerdown.call(this, event)
    }
  }
  override onPointermove(event: PointerEvent) {
    event.stopPropagation()
    if (event.pointerType !== 'touch') {
      onOverlayPointermove.call(this, event)
    }
  }
  override onPointerup(event: PointerEvent) {
    super.onPointerup(event)
    event.stopPropagation()
    this.onPointerupAction(event)
  }
  onPointerupAction(event: PointerEvent) {
    this.onClick()
  }
  override onFocus(event: FocusEvent) {
    super.onFocus(event)
    if (this.hasmore && this.inoverlay) this.expanded = true
    const $allitems = getMenuDescendants(getMenuRoot(this))
    const $ancestoritems = getMenuAncestors(this)
    for (let i = $allitems.length; i--;) {
      if ($allitems[i] !== this && $allitems[i] !== this.$menu && $ancestoritems.indexOf($allitems[i]) === -1 && ($allitems[i] as any).expanded) {
        ($allitems[i] as any).collapse()
      }
    }
  }
  override onBlur(event: FocusEvent) {
    super.onBlur(event)
    this.debounce(this.onBlurDebounced)
  }
  onBlurDebounced() {
    if (this._disposed) return
    // TODO: rewrite this.
    const descendants = getMenuDescendants(this)
    const siblings = getMenuSiblings(this)
    const ancestors = getMenuAncestors(this)
    const descendantIsFocused = descendants.some(descendant => descendant === document.activeElement as unknown as IoMenuElementType)
    const siblingIsFocused = siblings.some(sibling => sibling === document.activeElement as unknown as IoMenuElementType)
    const ancestorIsFocused = ancestors.some(ancestor => ancestor === document.activeElement as unknown as IoMenuElementType)
    const nothingIsFocused = document.activeElement === document.body

    const focusLeftOverlay = !Overlay.contains(document.activeElement)

    if (descendantIsFocused || nothingIsFocused) return
    if (ancestorIsFocused || siblingIsFocused) {
      this.collapse()
    } else if (focusLeftOverlay) {
      this.collapseRoot()
    }
  }
  override onKeydown(event: KeyboardEvent) {
    const inoverlay = this.inoverlay
    let direction = this.direction

    // Determine relative position of expanded options. If they are nudged to the opposite direction, flip direction.
    let optionsAreAbove = false
    let optionsAreBelow = false
    let optionsAreLeft = false
    let optionsAreRight = false
    if (this.expanded && this.$menu) {
      const rect = this.getBoundingClientRect()
      const optionsRect = this.$menu.getBoundingClientRect()
      optionsAreAbove = rect.top > optionsRect.top
      optionsAreBelow = rect.bottom < optionsRect.bottom
      optionsAreLeft = rect.left > optionsRect.left
      optionsAreRight = rect.right < optionsRect.right
    }
    // Flip direction if options are nudged to the opposite direction.
    if (direction === 'up' && optionsAreBelow) direction = 'down'
    if (direction === 'down' && optionsAreAbove) direction = 'up'
    if (direction === 'left' && optionsAreRight) direction = 'right'
    if (direction === 'right' && optionsAreLeft) direction = 'left'

    // TODO: types!
    let cmd = null

    // TODO: 'Home', 'End', 'PageUp', 'PageDown' keys should be handled.
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.hasmore) {
        cmd = 'In'
      } else {
        event.preventDefault()
        this.onClick()
        return
      }
    } else if (event.key === 'Backspace') {
      cmd = 'Out'
    } else if (event.key === 'Escape') {
      cmd = 'Collapse'
    } else if (event.key === 'ArrowLeft' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'left') {
        cmd = 'In'
      } else if (direction === 'right') {
        cmd = 'Out'
      }
    } else if (event.key === 'ArrowRight' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'right') {
        cmd = 'In'
      } else if (direction === 'left') {
        cmd = 'Out'
      }
    } else if (event.key === 'ArrowUp' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'up') {
        cmd = 'In'
      } else if (direction === 'down') {
        cmd = 'Out'
      }
    } else if (event.key === 'ArrowDown' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'down') {
        cmd = 'In'
      } else if (direction === 'up') {
        cmd = 'Out'
      }
    }

    if (cmd) {
      event.preventDefault()
      switch (cmd) {
        case 'Collapse':
          this.collapseRoot()
          break
        case 'In':
          if (this.hasmore) this.expanded = true
          if (this.$menu && this.$menu.children.length) {
            const option = this.$menu!.querySelector('[selected]') as IoOption
            if (option) option.focus()
            else (this.$menu!.children[0] as IoOption).focus()
          }
          break
        case 'Out':
          if (this.$parent && this.$parent.$parent) {
            this.$parent.$parent.focus()
            this.$parent.$parent.collapse()
          }
          break
        default:
          break
      }
    } else {
      super.onKeydown(event)
    }
  }
  collapse() {
    getMenuDescendants(this).forEach(descendant => {
      (descendant as any).expanded = false
    })
    this.expanded = false
  }
  collapseRoot() {
    (getMenuRoot(this) as any).collapse()
  }
  modelChanged() {
    this.setProperties({
      selected: this.model.selected,
      disabled: this.model.disabled,
      hidden: this.model.hidden,
    })
    this.initMenu()
  }
  modelMutated() {
    this.setProperties({
      selected: this.model.selected,
      disabled: this.model.disabled,
      hidden: this.model.hidden,
    })
    this.mutated()
  }
  initMenu() {
    if (this.model.options && this.depth > 0) {
      if (this.$menu === undefined) {
        this.$menu = new IoMenu({
          expanded: this.bind('expanded'),
          depth: this.depth - 1,
          model: this.model,
          direction: this.direction,
          $parent: this,
        })
      } else {
        this.$menu.model = this.model
      }
    }
  }
  override mutated() {
    const icon = this.icon || this.model.icon
    const label = this.label || this.model.label

    this.render([
      this.hasmore && this.direction === 'left' ? ioIcon({value: 'io:triangle_left', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'up' ? ioIcon({value: 'io:triangle_up', class: 'hasmore'}) : null,
      icon ? ioIcon({value: icon}) : null,
      label ? span({class: 'label'}, label) : null,
      this.model.hint ? span({class: 'hint'}, this.model.hint) : null,
      this.hasmore && this.direction === 'right' ? ioIcon({value: 'io:triangle_right', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'down' ? ioIcon({value: 'io:triangle_down', class: 'hasmore'}) : null,
    ])
  }
  override dispose() {
    super.dispose()
    delete this.$menu
  }
}
export const ioOption = function(arg0?: IoOptionProps) {
  return IoOption.vConstructor(arg0)
}
