import { Register, Property, VDOMElement, ReactiveElement, ReactiveElementProps, WithBinding, ListenerDefinitions, IoOverlaySingleton as Overlay, ThemeSingleton } from '@io-gui/core'
import { Layout } from '../models/Layout.js'
import { Split } from '../models/Split.js'
import { Panel } from '../models/Panel.js'
import { ioSplit } from './IoSplit.js'
import { ioPanel } from './IoPanel.js'
import { IoMenuOptions, MenuOption } from '@io-gui/menus'
import { Tab } from '../models/Tab.js'

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

  private _targetPanelModel: Panel | null = null

  static override get Listeners(): ListenerDefinitions {
    return {
      'io-add-tab-request': 'onAddTabRequest',
    }
  }

  constructor(args: IoLayoutData) {
    super(args)
    Overlay.appendChild(this.$addMenu as HTMLElement)
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
    }
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
    this.$addMenu.dispose()
    super.dispose()
  }

}

export const ioLayout = function(arg0: IoLayoutData) {
  return IoLayout.vConstructor(arg0)
}
