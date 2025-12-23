import { IoOverlaySingleton, NudgeDirection, NodeArray, VDOMElement, IoElement, IoElementProps, Register, ReactiveProperty, nudge, ListenerDefinition } from 'io-core'
import { Tab } from '../nodes/Tab.js'
import { ioTab, IoTab } from './IoTab.js'

export interface IoTabsHamburgerMenuExpandProps {
  source: HTMLElement
  direction: NudgeDirection
  tabs: NodeArray<Tab>
  onEditTab: (event: CustomEvent) => void
}

@Register
class IoTabsHamburgerMenu extends IoElement {
  static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        border: var(--io_border);
        border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
        border-color: var(--io_borderColorOutset);
        background-color: var(--io_bgColorLight);
        padding: calc(var(--io_spacing) + var(--io_borderWidth));
        position: absolute;
        overflow-y: auto;
        box-shadow: 1px 1px 16px var(--io_shadowColor),
                    1px 1px 8px var(--io_shadowColor), 
                    1px 1px 4px var(--io_shadowColor);
      }
      :host:not([expanded]) {
        visibility: hidden;
        opacity: 0;
      }
      :host > io-tab {
        border-color: transparent !important;
        background-color: var(--io_bgColorLight) !important;
        border-radius: var(--io_borderRadius) !important;
      }
      :host > io-tab[selected] {
        background-color: var(--io_bgColor) !important;
      }
      :host > io-tab > .marker {
        border-radius: 0;
      }
    `
  }

  @ReactiveProperty({type: NodeArray, init: 'this'})
  declare private tabs: NodeArray<Tab>

  @ReactiveProperty({type: Boolean, reflect: true})
  declare private expanded: boolean

  declare private onEditTab: (event: CustomEvent) => void

  static get Listeners() {
    return {
      'touchstart': ['stopPropagation', {passive: false}] as ListenerDefinition, // TODO: why?
      'io-focus-to': 'onIoFocusTo',
      'io-edit-tab': 'onEditTabCapture',
    }
  }

  constructor(args: IoElementProps = {}) { super(args) }

  stopPropagation(event: TouchEvent) {
    event.stopPropagation()
  }

  onIoFocusTo(event: CustomEvent) {
    const source = event.detail.source
    const cmd = event.detail.command
    const siblings = Array.from(this.querySelectorAll('io-tab')) as IoTab[]
    const index = siblings.indexOf(source)

    let cmdOverride = ''

    if (cmd === 'ArrowDown') cmdOverride = 'Next'
    if (cmd === 'ArrowUp') cmdOverride = 'Prev'
    if (cmd === 'ArrowLeft') cmdOverride = 'First'
    if (cmd === 'ArrowRight') cmdOverride = 'Last'

    if (cmdOverride) {
      if (cmdOverride === 'Next') {
        siblings[(index + 1) % siblings.length].focus()
      } else if (cmdOverride === 'Prev') {
        siblings[(index - 1 + siblings.length) % siblings.length].focus()
      } else if (cmdOverride === 'First') {
        siblings[0].focus()
      } else if (cmdOverride === 'Last') {
        siblings[siblings.length - 1].focus()
      }
      event.stopPropagation()
    }
  }

  onEditTabCapture(event: CustomEvent) {
    event.stopPropagation()
    this.onEditTab(event)
    this.expanded = false
  }

  expand(props: IoTabsHamburgerMenuExpandProps) {
    this.setProperties({
      tabs: props.tabs,
      expanded: true,
    })
    this.onEditTab = props.onEditTab
    nudge(this, props.source, props.direction)
    this.debounce(this.onExpand)
  }
  onExpand() {
    (this.querySelector('[selected]') as HTMLElement)?.focus()
  }
  changed() {
    this.render([
      ...this.tabs.map(tab => ioTab({tab: tab})),
    ])
  }
}

export const IoTabsHamburgerMenuSingleton = new IoTabsHamburgerMenu()
setTimeout(() => {
  IoOverlaySingleton.appendChild(IoTabsHamburgerMenuSingleton as HTMLElement)
}, 100)