import { Register, Property, VDOMElement, ReactiveElement, ReactiveElementProps, WithBinding, ListenerDefinitions, IoOverlaySingleton as Overlay, ThemeSingleton } from '@io-gui/core'
import { Layout } from '../models/Layout.js'
import { SplitDirection } from '../types/SplitDirection.js'
import { Split } from '../models/Split.js'
import { Panel } from '../models/Panel.js'
import { ioSplit } from './IoSplit.js'
import { ioPanel, IoPanel } from './IoPanel.js'
import { IoMenuOptions, MenuOption } from '@io-gui/menus'
import { Tab } from '../models/Tab.js'
import { IoTab, TabDragPhase } from './IoTab.js'
import { IoTabDragGhost } from './IoTabDragGhost.js'
import { DropTarget } from './IoTabDragGhost.js'
import { resolveDropIndex, resolveSplitEdge } from '../utils/dropZone.js'

export type IoLayoutData = ReactiveElementProps & {
  model: WithBinding<Layout>
  elements: VDOMElement[]
}

@Register
export class IoLayout extends ReactiveElement {

  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        overflow: hidden;
      }
    `
  }

  @Property({type: Object})
  declare model: Layout

  @Property(Array)
  declare elements: VDOMElement[]

  // TODO: Improve once MenuOption models have better (de)serialization
  @Property({type: IoMenuOptions, init: null})
  declare $addMenu: IoMenuOptions

  @Property({type: IoTabDragGhost, init: null})
  declare $tabDragGhost: IoTabDragGhost

  private _targetPanelModel: Panel | null = null
  private _dropTarget: DropTarget | null = null

  static override get Listeners(): ListenerDefinitions {
    return {
      'io-add-tab-request': 'onAddTabRequest',
      'io-tab-drag': 'onTabDrag',
    }
  }

  constructor(args: IoLayoutData) {
    super(args)
    Overlay.appendChild(this.$addMenu as HTMLElement)
    Overlay.appendChild(this.$tabDragGhost as HTMLElement)
  }

  onAddTabRequest(event: CustomEvent) {
    event.stopPropagation()
    this._targetPanelModel = event.detail.model as Panel
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    this.$addMenu.style.right = `${window.innerWidth - rect.right}px`
    this.$addMenu.style.top = `${rect.top + ThemeSingleton.fieldHeight}px`
    this.$addMenu.expanded = true
    this.$addMenu.focusFirstOption()
  }

  addTab(element: VDOMElement) {
    if (this._targetPanelModel) {
      this._targetPanelModel.addTab(new Tab({
        id: element.props?.id,
        label: element.props?.label || '',
        icon: element.props?.icon || '',
      }))
      this._targetPanelModel = null
    }
  }

  onTabDrag(event: CustomEvent) {
    event.stopPropagation()
    const tabModel: Tab = event.detail.model
    const phase = event.detail.phase as TabDragPhase
    if (phase === 'start') {
      this.$tabDragGhost.model = tabModel
      this.$tabDragGhost.style.left = `${event.detail.x}px`
      this.$tabDragGhost.style.top = `${event.detail.y}px`
      this.$tabDragGhost.expanded = true
    } else if (phase === 'move') {
      this._dropTarget = this.getDropTarget(event.detail.x, event.detail.y)
      this.$tabDragGhost.setDropTarget(this._dropTarget)
      this.$tabDragGhost.style.left = `${event.detail.x}px`
      this.$tabDragGhost.style.top = `${event.detail.y}px`
    } else if (phase === 'end') {
      if (this._dropTarget) {
        this.model.moveTab(tabModel, this._dropTarget.panel.model, this._dropTarget.splitDirection, this._dropTarget.dropIndex)
      }
      this._dropTarget = null
      this.$tabDragGhost.expanded = false
      this.$tabDragGhost.style.left = '0px'
      this.$tabDragGhost.style.top = '0px'
      this.$tabDragGhost.setDropTarget(null)
    }
  }

  getDropTarget(x: number, y: number): DropTarget | null {

    const panels = [...this.querySelectorAll('io-panel')] as IoPanel[]

    for (const panel of panels) {

      const panelRect = panel.getBoundingClientRect()

      if (x > panelRect.left && x < panelRect.right && y > panelRect.top && y < panelRect.bottom) {
        const tabs = [...panel.querySelectorAll('io-tab')] as IoTab[]
        const tabRects = tabs.map(tab => tab.getBoundingClientRect())
        let dropIndex = tabs.length

        let splitDirection: SplitDirection = resolveSplitEdge(x, y, panelRect, tabRects)

        const dropSelfSingle = (panel.model.tabs.length === 1) && (panel.model.tabs[0].id === this.$tabDragGhost.model.id)

        if (dropSelfSingle) {

          splitDirection = 'center'
          dropIndex = 0

        } else if (tabRects.length > 0) {

          const duplicateTabIndex = tabs.findIndex(tab => tab.model.id === this.$tabDragGhost.model.id)

          if (duplicateTabIndex !== -1) {
            dropIndex = duplicateTabIndex
            splitDirection = 'center'
          }

          const pickedTabIndex = resolveDropIndex(x, y, tabRects)

          if (pickedTabIndex !== -1) {
            dropIndex = pickedTabIndex
            splitDirection = 'center'
          }
        }

        return {
          panel: panel as IoPanel,
          panelRect: panelRect,
          tabs: tabs,
          tabRects: tabRects,
          dropIndex: dropIndex,
          splitDirection: splitDirection,
        }
      }
    }
    return null
  }

  modelMutated() {
    this.mutated()
  }

  elementsChanged() {
    this.elementsMutated()
  }

  elementsMutated() {
    // TODO: Improve once MenuOption models have better (de)serialization
    this.$addMenu.option = new MenuOption({
      id: 'root',
      options: this.elements.map(element => ({
        id: element.props?.id,
        label: element.props?.label || element.props?.id,
        icon: element.props?.icon || '',
        action: this.addTab.bind(this, element),
      })),
    })
  }

  override mutated() {
    const child = this.model.child
    if (child instanceof Split) {
      this.render([
        ioSplit({
          model: child,
          elements: this.elements,
        }),
      ])
    } else if (child instanceof Panel) {
      this.render([
        ioPanel({
          model: child,
          elements: this.elements,
        }),
      ])
    }
  }

  override dispose() {
    Overlay.removeChild(this.$addMenu as HTMLElement)
    Overlay.removeChild(this.$tabDragGhost as HTMLElement)
    this.$addMenu.dispose()
    this.$tabDragGhost.dispose()
    super.dispose()
  }

}

export const ioLayout = function(arg0: IoLayoutData) {
  return IoLayout.vConstructor(arg0)
}
