import { Property, ReactiveElement, ReactiveElementProps, Register, ThemeSingleton, div } from '@io-gui/core'
import { IoTab, ioTab } from './IoTab'
import { Tab } from '../models/Tab'
import { IoPanel } from './IoPanel'
import { SplitDirection } from '../models/Layout'

export type DropTarget = {
  panel: IoPanel
  panelRect: DOMRect
  tabs: IoTab[]
  tabRects: DOMRect[]
  dropIndex: number
  splitDirection: SplitDirection
}

export type IoTabDragGhostData = ReactiveElementProps & {}

const SPLIT_MARKER_SIZE = 120 // pixels

@Register
export class IoTabDragGhost extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        display: none;
        background-color: transparent;
        box-shadow: none;
      }
      :host[expanded] {
        display: block;
      }
      :host > io-tab {
        transform: translate(-50%, -50%);
        box-shadow: var(--io_shadow);
      }
      :host > #drop-marker {
        position: fixed;
        display: flex;
        flex-direction: column;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
      }
      :host > #drop-marker > #drop-marker-tabs {
        flex: 0 1 auto;
        overflow: hidden;
      }
      :host:not([splitDirection="center"]) > #drop-marker > #drop-marker-tabs {
        display: none;
      }
      :host > #drop-marker > #drop-marker-tabs > #drop-marker-tab {
        width: 200px;
        height: calc(var(--io_fieldHeight) * 1.25);
        margin-top: var(--io_spacing);
        margin-bottom: calc(var(--io_spacing) * -1);
        background-color: var(--io_bgColorStrong);
        border-radius: var(--io_borderRadius) var(--io_borderRadius) 0 0;
      }
      :host > #drop-marker > #drop-marker-content {
        flex: 1 1 0;
        background-color: var(--io_bgColorStrong);
      }
    `
  }

  @Property({type: Tab, init: {id: 'dummy'}})
  declare model: Tab

  @Property({type: String, value: 'none', reflect: true})
  declare splitDirection: SplitDirection

  @Property({type: Number, value: -1, reflect: true})
  declare dropIndex: number

  @Property({type: Boolean, reflect: true})
  declare expanded: boolean

  constructor(args: IoTabDragGhostData) {
    super(args)
    this.modelChanged()
  }

  setDropTarget(target: DropTarget | null) {
    if (target) {

      this.splitDirection = target.splitDirection

      if (target.splitDirection !== 'center') {
        const splitMarkerHeight = Math.min(target.panelRect.height * 0.5, SPLIT_MARKER_SIZE)
        const splitMarkerWidth = Math.min(target.panelRect.width * 0.5, SPLIT_MARKER_SIZE)
        if (target.splitDirection === 'top') {
          this.$['drop-marker'].style.left = `${target.panelRect.left}px`
          this.$['drop-marker'].style.top = `${target.panelRect.top}px`
          this.$['drop-marker'].style.width = `${target.panelRect.width}px`
          this.$['drop-marker'].style.height = `${splitMarkerHeight}px`
          return
        } else if (target.splitDirection === 'bottom') {
          this.$['drop-marker'].style.left = `${target.panelRect.left}px`
          this.$['drop-marker'].style.top = `${target.panelRect.top + target.panelRect.height - splitMarkerHeight}px`
          this.$['drop-marker'].style.width = `${target.panelRect.width}px`
          this.$['drop-marker'].style.height = `${splitMarkerHeight}px`
          return
        } else if (target.splitDirection === 'left') {
          this.$['drop-marker'].style.left = `${target.panelRect.left}px`
          this.$['drop-marker'].style.top = `${target.panelRect.top}px`
          this.$['drop-marker'].style.width = `${splitMarkerWidth}px`
          this.$['drop-marker'].style.height = `${target.panelRect.height}px`
          return
        } else if (target.splitDirection === 'right') {
          this.$['drop-marker'].style.left = `${target.panelRect.left + target.panelRect.width - splitMarkerWidth}px`
          this.$['drop-marker'].style.top = `${target.panelRect.top}px`
          this.$['drop-marker'].style.width = `${splitMarkerWidth}px`
          this.$['drop-marker'].style.height = `${target.panelRect.height}px`
          return
        }
      }

      const tabInsertMarkerRect = this.$['tab-ghost'].getBoundingClientRect()

      let tabInsertMarkerWidth = tabInsertMarkerRect.width
      let tabInsertMarkerOffset = 0

      if (target.dropIndex > -1 && target.dropIndex < target.tabRects.length) {
        const tabRect = target.tabRects[target.dropIndex]
        tabInsertMarkerWidth = tabRect.width
        tabInsertMarkerOffset = tabRect.left - target.panelRect.left
      } else if (target.dropIndex === target.tabRects.length) {
        const lastTabRect = target.tabRects[target.tabRects.length - 1]
        const lastRectOffset = lastTabRect.right - target.panelRect.left
        tabInsertMarkerOffset = lastRectOffset + ThemeSingleton.spacing
      }

      this.$['drop-marker'].style.display = 'flex'
      this.$['drop-marker'].style.left = `${target.panelRect.left}px`
      this.$['drop-marker'].style.top = `${target.panelRect.top}px`
      this.$['drop-marker'].style.width = `${target.panelRect.width}px`
      this.$['drop-marker'].style.height = `${target.panelRect.height}px`
      this.$['drop-marker-tab'].style.width = `${tabInsertMarkerWidth}px`
      this.$['drop-marker-tab'].style.marginLeft = `${tabInsertMarkerOffset}px`

    } else {

      this.splitDirection = 'center'
      this.$['drop-marker'].style.display = 'none'
      this.$['drop-marker'].style.left = '0px'
      this.$['drop-marker'].style.top = '0px'
      this.$['drop-marker'].style.width = '100%'
      this.$['drop-marker'].style.height = '100%'
      this.$['drop-marker-tab'].style.width = '0px'
      this.$['drop-marker-tab'].style.marginLeft = `${ThemeSingleton.spacing}px`
    }
  }

  modelChanged() {
    this.render([
      ioTab({id: 'tab-ghost', model: this.model}),
      div({id: 'drop-marker'}, [
        div({id: 'drop-marker-tabs'}, [
          div({id: 'drop-marker-tab'}),
        ]),
        div({id: 'drop-marker-content'})
      ])
    ])
  }
 }