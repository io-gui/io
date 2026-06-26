import { Register, ReactiveElement, Property, IoOverlaySingleton as Overlay, ReactiveElementProps, WithBinding } from '@io-gui/core'
import { IoMenuOptions } from './IoMenuOptions.js'
import { onOverlayPointerdown, onOverlayPointermove, onOverlayPointeup } from './IoMenuItem.js'
import { MenuOption } from '../nodes/MenuOption.js'

export type IoContextMenuProps = ReactiveElementProps & {
  option: MenuOption
  expanded?: WithBinding<boolean>
  button?: number
}

/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked.
 * Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element
 * by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button),
 * but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same
 * `parentElement` as long as the `button` properties are different.
 **/
@Register
export class IoContextMenu extends ReactiveElement {

  @Property({type: MenuOption})
  declare option: MenuOption

  @Property({value: false, reflect: true})
  declare expanded: boolean

  @Property(0)
  declare button: number

  declare $options: IoMenuOptions
  declare _contextTimeout: ReturnType<typeof setTimeout>
  declare _listenerParent: HTMLElement | null

  static override get Properties(): any {
    return {
      $options: null,
    }
  }

  constructor(args: IoContextMenuProps) {
    super(args)
    this.$options = new IoMenuOptions({
      expanded: this.bind('expanded'),
      option: this.option,
      $parent: this,
    })
  }

  override init() {
    this.collapse = this.collapse.bind(this)
  }

  optionChanged() {
    if (this.$options) this.$options.option = this.option
  }
  override connectedCallback() {
    super.connectedCallback()
    Overlay.appendChild(this.$options as HTMLElement)
    this._listenerParent = this.parentElement
    this._listenerParent!.addEventListener('pointerdown', this.onPointerdown)
    this._listenerParent!.addEventListener('click', (this as any).onClick)
    this._listenerParent!.addEventListener('contextmenu', this.onContextmenu)
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    this.releasePointerListeners()
    clearTimeout(this._contextTimeout)
    Overlay.removeChild(this.$options as HTMLElement)
    if (this._listenerParent) {
      this._listenerParent.removeEventListener('pointerdown', this.onPointerdown)
      this._listenerParent.removeEventListener('click', (this as any).onClick)
      this._listenerParent.removeEventListener('contextmenu', this.onContextmenu)
      this._listenerParent = null
    }
  }
  releasePointerListeners() {
    const parent = this._listenerParent
    if (!parent) return
    parent.removeEventListener('pointermove', this.onPointermove)
    parent.removeEventListener('pointerleave', this.onPointerleave)
    parent.removeEventListener('pointerup', this.onPointerup)
  }
  override getBoundingClientRect() {
    return this.parentElement!.getBoundingClientRect()
  }
  onContextmenu(event: MouseEvent) {
    if (this.button === 2) event.preventDefault()
  }
  onPointerdown(event: PointerEvent) {
    event.stopPropagation()

    this.$options.style.left = `${event.clientX}px`
    this.$options.style.top = `${event.clientY}px`

    const parent = this._listenerParent!
    parent.addEventListener('pointermove', this.onPointermove)
    parent.addEventListener('pointerleave', this.onPointerleave)
    parent.addEventListener('pointerup', this.onPointerup)

    clearTimeout(this._contextTimeout)
    if (event.pointerType !== 'touch') {
      if (event.button === this.button) {
        this.setPointerCapture(event.pointerId)
        this.expanded = true
        // TODO: keyboard focus navigation
      }
    } else {
      // iOS Safari contextmenu event emulation.
      event.preventDefault()
      this._contextTimeout = setTimeout(() => {
        this.setPointerCapture(event.pointerId)
        this.expanded = true
        // TODO: keyboard focus navigation
      }, 150)
    }
    onOverlayPointerdown.call(this, event)
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation()
    clearTimeout(this._contextTimeout)
    if (event.pointerType === 'touch') {
      // Let touch scroll the document.
      if (!this.expanded) return
    }
    onOverlayPointermove.call(this, event)
  }
  onPointerup(event: PointerEvent) {
    clearTimeout(this._contextTimeout)
    this.releasePointerCapture(event.pointerId)
    this.releasePointerListeners()
    onOverlayPointeup.call(this, event)
  }
  onPointerleave(event: PointerEvent) {
    this.releasePointerCapture(event.pointerId)
    this.releasePointerListeners()
  }
  collapse() {
    Overlay.collapse()
  }
}
export const ioContextMenu = function(arg0?: IoContextMenuProps) {
  return IoContextMenu.vConstructor(arg0)
}