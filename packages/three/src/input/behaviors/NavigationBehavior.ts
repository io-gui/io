import { Behavior, BehaviorPriority } from '../Behavior.js'
import { Keymap, KeymapEntry, navigationKeymaps } from '../Keymap.js'
import { InputHost, ViewInputEvent } from '../ViewInputEvent.js'
import type { AxisView } from '../../view/ViewNavigation.js'

type DragAction = 'view.orbit' | 'view.pan' | 'view.dolly'

const DRAG_ACTIONS: readonly string[] = ['view.orbit', 'view.pan', 'view.dolly']
const WHEEL_ZOOM_BASE = 0.95
const DRAG_DOLLY_SPEED = 0.005

/**
 * Camera navigation as a router behavior (ADR-0004, ADR-0005). Bindings come from a keymap; every
 * gesture edits `view.navigation` and tags only this view. Touch: one finger runs the bound drag action,
 * two fingers pan and pinch-dolly. Disabled while the view looks through a scene camera.
 */
export class NavigationBehavior implements Behavior {

  readonly priority: number = BehaviorPriority.navigation
  keymap: Keymap
  /** Axis views do not orbit; an orbit gesture pans instead (Maya and Houdini behave the same). */
  lockAxisViews = true

  private readonly _host: InputHost
  private _pending: KeymapEntry | null = null
  private _action: DragAction | null = null
  private readonly _pointers = new Map<number, {x: number; y: number}>()
  private _pinch: {distance: number; x: number; y: number} | null = null

  constructor(host: InputHost, keymap: Keymap = navigationKeymaps.default) {
    this._host = host
    this.keymap = keymap
  }

  private _isEnabled() {
    const view = this._host.view
    return !!view && !view.getSourceCamera(this._host.scene)
  }

  wantsCapture(event: ViewInputEvent): boolean {
    if (!this._isEnabled()) return false
    const entry = this.keymap.match(event, action => event.type === 'wheel' ? action === 'view.zoom' : DRAG_ACTIONS.includes(action))
    this._pending = entry
    return !!entry
  }

  begin(event: ViewInputEvent) {
    if (event.type === 'wheel') {
      this._zoom(event)
      return
    }
    let action = this._pending!.action as DragAction
    const view = event.view
    if (action === 'view.orbit' && (view.kind === 'uv' || (this.lockAxisViews && view.navigation.axisView !== 'free'))) action = 'view.pan'
    this._action = action
    this._pointers.set(event.pointerId, {x: event.x, y: event.y})
  }

  update(event: ViewInputEvent) {
    switch (event.type) {
      case 'wheel':
        this._zoom(event)
        return
      case 'pointerdown':
        this._pointers.set(event.pointerId, {x: event.x, y: event.y})
        if (this._pointers.size === 2) this._pinch = this._measurePinch()
        return
      case 'pointerup':
        this._pointers.delete(event.pointerId)
        if (this._pointers.size < 2) this._pinch = null
        return
      case 'pointermove':
        this._pointers.set(event.pointerId, {x: event.x, y: event.y})
        if (this._pinch) this._updatePinch(event)
        else this._drag(event)
        return
    }
  }

  end() {
    this._reset()
  }

  cancel() {
    this._reset()
  }

  key(event: ViewInputEvent): boolean {
    if (event.type !== 'keydown' || !this._isEnabled()) return false
    const entry = this.keymap.match(event, action => action === 'view.frameAll' || action === 'view.frameSelected' || action === 'view.axis')
    if (!entry) return false
    const view = event.view
    // 2D views have no axis views; framing there shows the UV square (`ThreeView.frame`).
    if (view.kind === 'uv' && entry.action === 'view.axis') return false
    if (entry.action === 'view.frameSelected') {
      const selected = this._host.selection?.getObjects() ?? []
      if (selected.length) view.frame(selected)
      else if (this._host.scene) view.frame(this._host.scene)
    } else if (entry.action === 'view.frameAll') {
      const scene = this._host.scene
      if (scene) view.frame(scene)
    } else {
      view.setAxisView((entry.props?.axis as AxisView | undefined) ?? 'free')
    }
    return true
  }

  private _reset() {
    this._action = null
    this._pending = null
    this._pinch = null
    this._pointers.clear()
  }

  private _drag(event: ViewInputEvent) {
    if (!this._action || (event.dx === 0 && event.dy === 0)) return
    const view = event.view
    const nav = view.navigation
    const height = event.height || 1
    switch (this._action) {
      case 'view.orbit':
        nav.orbit(-2 * Math.PI * event.dx / height, -2 * Math.PI * event.dy / height)
        break
      case 'view.pan':
        nav.pan(event.dx, event.dy, view.getWorldPerPixel(event.width, event.height, this._host.scene))
        break
      case 'view.dolly':
        nav.dolly(Math.exp(event.dy * DRAG_DOLLY_SPEED))
        break
    }
    view.markNavigationChanged()
  }

  private _zoom(event: ViewInputEvent) {
    if (event.deltaY === 0) return
    event.view.navigation.dolly(Math.pow(WHEEL_ZOOM_BASE, -event.deltaY * 0.01))
    event.view.markNavigationChanged()
  }

  private _measurePinch() {
    const [a, b] = [...this._pointers.values()]
    return {distance: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
  }

  private _updatePinch(event: ViewInputEvent) {
    const next = this._measurePinch()
    const previous = this._pinch!
    const view = event.view
    const nav = view.navigation
    nav.pan(next.x - previous.x, next.y - previous.y, view.getWorldPerPixel(event.width, event.height, this._host.scene))
    if (next.distance > 0 && previous.distance > 0) nav.dolly(previous.distance / next.distance)
    this._pinch = next
    view.markNavigationChanged()
  }
}
