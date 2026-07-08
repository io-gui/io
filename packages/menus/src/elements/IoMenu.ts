import { Register, ReactiveElement, Property, VDOMElement, IoOverlaySingleton as Overlay, NudgeDirection, ReactiveElementProps, WithBinding, Field, nudge, ListenerDefinition, span, IoExpandable } from '@io-gui/core'
import { ioField, ioString } from '@io-gui/inputs'
import { Option } from '../models/Option.js'
import { Menu } from '../models/Menu.js'
import { ioOption, IoOption } from './IoOption.js'
import { IoContextMenu } from './IoContextMenu.js'
import { getMenuDescendants, getMenuSiblings } from '../utils/MenuDOMUtils.js'
import { searchOptions } from '../utils/MenuNodeUtils.js'

// TODO: improve focusto nav and in-layer navigation.

export type IoMenuProps = ReactiveElementProps & {
  model?: Menu | Option
  expanded?: WithBinding<boolean>
  horizontal?: boolean
  searchable?: boolean
  search?: WithBinding<string>
  direction?: NudgeDirection
  depth?: number
  widget?: VDOMElement | null
  $parent?: IoOption | IoContextMenu
}

/**
 * The view paired with an expanded selection scope: it renders a list of `IoOption` elements from
 * its model's `options`. The model is the `Menu` root or the branch `Option` whose children it shows.
 * If the `horizontal` property is set, options are displayed in a horizontal direction (menu bar).
 **/
@Register
export class IoMenu extends ReactiveElement {
  static override get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: calc(var(--io_spacing) + var(--io_borderWidth));
      transition: opacity 0.3s ease-in-out;
      @apply --io-unselectable;
    }
    :host[horizontal] {
      padding: var(--io_spacing) 0;
      flex-direction: row;
      align-self: stretch;
    }
    :host[inoverlay] {
      overflow-y: auto;
      box-shadow: 1px 1px 16px var(--io_shadowColor),
                  1px 1px 8px var(--io_shadowColor),
                  1px 1px 4px var(--io_shadowColor);
    }
    :host[inoverlay]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }
    :host > io-option[hidden] ~ span.divider {
      display: none;
    }
    :host > span.divider {
      flex: 0 0 0;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      margin: var(--io_spacing) 0;
      opacity: 0.1;
    }
    :host[horizontal] > span.divider {
      margin: 0 var(--io_spacing);
    }
    :host[horizontal] > io-option > .hint {
      display: none;
    }
    :host:not([horizontal]) > #search {
      margin: var(--io_spacing);
      margin-top: 0;
    }
    :host[horizontal] > #search {
      margin: 0 var(--io_spacing);
      flex: 0 0 10em;
    }
    `
  }

  @Property({type: Option})
  declare model: Menu | Option

  @Property({value: false, reflect: true})
  declare expanded: boolean

  @Property({value: false, reflect: true})
  declare horizontal: boolean

  @Property(false)
  declare searchable: boolean

  @Property('')
  declare search: string

  @Property({value: 'none', reflect: true})
  declare direction: NudgeDirection

  @Property(100)
  declare depth: number

  @Property({value: '', reflect: true})
  declare overflow: string

  @Property(null)
  declare widget: VDOMElement | null

  @Field()
  declare $parent?: IoOption

  @Field('listbox')
  declare role: string

  static override get Listeners() {
    return {
      'touchstart': ['stopPropagation'] as ListenerDefinition,
      'io-focus-to': 'onIoFocusTo',
    }
  }
  get inoverlay() {
    return Overlay.contains(this.parentElement)
  }
  constructor(args: IoMenuProps = {}) { super(args) }

  stopPropagation(event: TouchEvent) {
    if (this.inoverlay) {
      // TODO: Prevent pull-down-to-refresh on scrollable menus.
      // Stops overlay from capturing touch events
      event.stopPropagation()
    }
  }
  override connectedCallback() {
    super.connectedCallback()
    if (this.inoverlay) {
      this.setAttribute('inoverlay', 'true')
    }
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this.expanded) this.collapse()
  }
  onIoFocusTo(event: CustomEvent) {
    const source = event.detail.source
    const cmd = event.detail.command
    const siblings = getMenuSiblings(source)
    const index = siblings.indexOf(source)

    const inoverlay = this.inoverlay

    let parentIsAbove = false
    let parentIsBelow = false
    let parentIsLeft = false
    let parentIsRight = false

    if (this.$parent) {
      const rect = this.getBoundingClientRect()
      const parentRect = this.$parent.getBoundingClientRect()
      parentIsAbove = rect.top > parentRect.top
      parentIsBelow = rect.bottom < parentRect.bottom
      parentIsLeft = rect.left > parentRect.left
      parentIsRight = rect.right < parentRect.right
    }

    let cmdOverride = ''

    if (this.horizontal) {
      if (cmd === 'ArrowRight' && inoverlay) cmdOverride = 'Next'
      if (cmd === 'ArrowLeft' && inoverlay) cmdOverride = 'Prev'
      if (cmd === 'ArrowUp' && parentIsAbove) cmdOverride = 'Out'
      if (cmd === 'ArrowDown' && parentIsBelow) cmdOverride = 'Out'
    } else {
      if (cmd === 'ArrowDown' && inoverlay) cmdOverride = 'Next'
      if (cmd === 'ArrowUp' && inoverlay) cmdOverride = 'Prev'
      if (cmd === 'ArrowLeft' && parentIsLeft) cmdOverride = 'Out'
      if (cmd === 'ArrowRight' && parentIsRight) cmdOverride = 'Out'
    }
    if (cmd === 'Tab' && inoverlay) cmdOverride = 'Next'

    if (cmdOverride) {
      if (cmdOverride === 'Next') {
        siblings[(index + 1) % siblings.length].focus()
      } else if (cmdOverride === 'Prev') {
        siblings[(index - 1 + siblings.length) % siblings.length].focus()
      } else if (cmdOverride === 'Out') {
        if (this.$parent) this.$parent.focus()
      }
      event.stopPropagation()
    }
  }
  collapse() {
    const optionWasFocused = this.contains(document.activeElement)
    const searchHadInput = this.searchable && !!this.search
    getMenuDescendants(this).forEach(descendant => {
      if (Object.prototype.hasOwnProperty.call(descendant, 'expanded')) {
        (descendant as IoExpandable).expanded = false
      }
    })
    this.expanded = false
    if (searchHadInput && optionWasFocused && !this.inoverlay) {
      this.search = ''
      this.$.search.focus()
    }
  }
  expandedChanged() {
    if (this.expanded) {
      if (this.inoverlay) {
        this.debounce(this.onExpandInOverlay)
      }
    } else {
      this.style.top = ''
      this.style.height = ''
      this.scrollTop = 0
      this.search = ''
    }
  }
  searchChanged() {
    // TODO: focus drifts when filtered option is clicked
    if (this.inoverlay && this.$parent) {
      this.debounce(this.onExpandInOverlay)
    }
  }
  // TODO: Move functionality to Overlay
  onExpandInOverlay() {
    if (this.$parent) {
      nudge(this, this.$parent, this.direction, true)
    }
  }
  focusFirstOption() {
    const firstOption = this.querySelector('io-option')
    if (firstOption) {
      (firstOption as IoOption).focus()
    }
  }
  override mutated() {
    const vChildren: VDOMElement[] = this.widget ? [this.widget] : []
    if (this.searchable) {
      vChildren.push(ioString({
        id: 'search',
        role: 'search',
        value: this.bind('search'),
        placeholder: 'Search',
        live: true
      }))
    }
    if (this.search) {
      const filteredOptions = searchOptions(this.model, this.search, this.depth)
      if (filteredOptions.length === 0) {
        vChildren.push(ioField({label: 'No matches'}))
      } else {
        for (let i = 0; i < filteredOptions.length; i++) {
          vChildren.push(ioOption({model: filteredOptions[i], depth: 0}))
          if (i < filteredOptions.length - 1) {
            vChildren.push({tag: 'span', props: {class: 'divider'}})
          }
        }
      }
    } else {
      let direction: 'left' | 'right' | 'up' | 'down' = this.horizontal ? 'down' : 'right'
      if (this.horizontal && this.direction === 'up') {
        direction = 'up'
      }
      for (let i = 0; i < this.model.options.length; i++) {
        vChildren.push(ioOption({
          model: this.model.options[i],
          direction: direction,
          $parent: this,
          depth: this.depth
        }))
        if (i < this.model.options.length - 1) {
          vChildren.push(span({class: 'divider'}))
        }
      }
    }
    this.render(vChildren)
  }
}
export const ioMenu = function(arg0?: IoMenuProps) {
  return IoMenu.vConstructor(arg0)
}
