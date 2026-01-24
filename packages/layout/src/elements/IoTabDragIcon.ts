import { Register, ReactiveProperty, span, ThemeSingleton } from '@io-gui/core'
import { IoField, IoFieldProps } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import { ioTabDropRectSingleton } from './IoTabDropRect.js'
import { Tab } from '../nodes/Tab.js'
import { SplitDirection } from './IoSplit.js'
import { IoPanel } from './IoPanel.js'
import { IoLayout } from './IoLayout.js'
import { IoTabs } from './IoTabs.js'

const DRAG_THRESHOLD = 10

@Register
class IoTabDragIcon extends IoField {
  static get Style() {
    return /* css */`
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        z-index: 100000;
        pointer-events: none;
        border-color: var(--io_borderColorLight);
        background-color: var(--io_bgColorLight) !important;
        opacity: 0.75;
      }
      :host[dragging] {
        display: flex;
      }
      :host > * {
        display: inline-block;
        white-space: nowrap;
        padding: 0 var(--io_spacing);
      }
    `
  }

  @ReactiveProperty({type: Boolean, reflect: true})
  declare dragging: boolean

  @ReactiveProperty()
  declare tab: Tab | null

  @ReactiveProperty()
  declare dropSource: IoPanel | null

  @ReactiveProperty()
  declare dropTarget: IoPanel | null

  @ReactiveProperty({type: String, value: 'none', reflect: true})
  declare splitDirection: SplitDirection

  @ReactiveProperty({type: Number, value: -1})
  declare dropIndex: number

  private _startX: number = 0
  private _startY: number = 0

  constructor(args: IoFieldProps = {}) { super(args) }

  setStartPosition(x: number, y: number) {
    this._startX = x
    this._startY = y
  }

  updateDrag(tab: Tab, sourcePanel: IoPanel, x: number, y: number, root: IoLayout | null) {
    if (!this.dragging) {
      const dx = Math.abs(this._startX - x)
      const dy = Math.abs(this._startY - y)
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        this.setProperties({
          tab: tab,
          dragging: true,
          dropSource: sourcePanel,
          dropTarget: null,
          dropIndex: -1,
        })
        this.style.top = y + 'px'
        this.style.left = x + 'px'
      }
      return
    }

    this.style.top = y + 'px'
    this.style.left = x + 'px'

    if (!root) {
      console.error('IoTabDragIcon: No io-layout found!')
      return
    }

    this.detectDropTargets(x, y, root)
  }

  private detectDropTargets(x: number, y: number, root: IoLayout) {
    const m = ThemeSingleton.spacing

    // Check tab bars first (higher priority)
    const tabsContainers = root.querySelectorAll('io-tabs')
    for (let i = 0; i < tabsContainers.length; i++) {
      const tabsContainer = tabsContainers[i] as IoTabs
      const targetPanel = tabsContainer.parentElement as IoPanel
      const tcr = tabsContainer.getBoundingClientRect()

      if (y >= tcr.top && y <= tcr.bottom && x >= tcr.left && x <= tcr.right) {
        const tabs = tabsContainer.querySelectorAll('io-tab')
        if (tabs.length === 0) {
          this.setProperties({
            dropTarget: targetPanel,
            splitDirection: 'none',
            dropIndex: 0,
          })
          return
        }

        for (let j = 0; j < tabs.length; j++) {
          const tab = tabs[j]
          const tr = tab.getBoundingClientRect()
          const isLast = j === tabs.length - 1

          if (y >= tr.top - m && y <= tr.bottom + m && x >= tr.left - m && (x <= tr.right + m || isLast && x <= tcr.right)) {
            const side = x < tr.left + tr.width / 2 ? 'left' : 'right'
            const dropIndex = side === 'left' ? j : j + 1
            this.setProperties({
              dropTarget: targetPanel,
              splitDirection: 'none',
              dropIndex: dropIndex,
            })
            return
          }
        }
      }
    }

    const panels = root.querySelectorAll('io-panel')
    for (let i = 0; i < panels.length; i++) {
      const targetPanel = panels[i] as IoPanel
      const pr = targetPanel.getBoundingClientRect()

      if (y >= pr.top && y <= pr.bottom && x >= pr.left && x <= pr.right) {
        const direction = this.calculateSplitDirection(x, y, pr)
        this.setProperties({
          dropTarget: targetPanel,
          splitDirection: direction,
          dropIndex: -1,
        })
        return
      }
    }
  }

  private calculateSplitDirection(x: number, y: number, rect: DOMRect): SplitDirection {
    const rx = (x - rect.left - rect.width / 2) / rect.width * 2
    const ry = (y - rect.top - rect.height / 2) / rect.height * 2

    if (Math.abs(rx) < 0.5 && Math.abs(ry) < 0.5) return 'center'
    if (Math.abs(ry) > Math.abs(rx)) return ry > 0 ? 'bottom' : 'top'
    return rx > 0 ? 'right' : 'left'
  }

  endDrag() {
    const source = this.dropSource
    const target = this.dropTarget
    const index = this.dropIndex
    const direction = this.splitDirection
    const tab = this.tab

    if (tab && target && index !== -1) {
      if (source && source !== target) {
        source.removeTab(tab)
      }
      target.addTab(tab, index)
    } else if (tab && source && target && direction !== 'none') {
      target.moveTabToSplit(source, tab, direction)
    }

    this.cancelDrag()
  }

  cancelDrag() {
    this.setProperties({
      dragging: false,
      tab: null,
      dropSource: null,
      dropTarget: null,
      splitDirection: 'none',
      dropIndex: -1,
    })
  }

  changed() {
    ioTabDropRectSingleton.setProperties({
      dropTarget: this.dropTarget,
      splitDirection: this.splitDirection,
      dropIndex: this.dropIndex,
    })
    this.render([
      ioIcon({value: this.tab?.icon || ' '}),
      span({class: 'label'}, this.tab?.label || ''),
    ])
  }
}

export const tabDragIconSingleton = new IoTabDragIcon()
document.body.appendChild(tabDragIconSingleton as HTMLElement)
