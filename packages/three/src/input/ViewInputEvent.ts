import { OrthographicCamera, PerspectiveCamera, Ray, Raycaster, Scene, Vector2 } from 'three/webgpu'
import type { ThreeView } from '../view/ThreeView.js'

/** What an InputRouter needs from the element it routes for. Implemented by IoThreeViewport. */
export interface InputHost extends HTMLElement {
  readonly view: ThreeView
  readonly scene: Scene | null
  getViewCamera(): PerspectiveCamera | OrthographicCamera
}

export type ViewInputType = 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'wheel' | 'keydown' | 'keyup'

export type Modifiers = {
  shift: boolean
  ctrl: boolean
  alt: boolean
  meta: boolean
}

const _raycaster = new Raycaster()

/**
 * One input event in view terms: pixel and normalized coordinates inside the viewport,
 * movement since this pointer's previous event, and a ray built on demand.
 */
export class ViewInputEvent {
  readonly type: ViewInputType
  readonly native: PointerEvent | WheelEvent | KeyboardEvent
  readonly host: InputHost
  /** Pixels from the viewport's left / top edge. */
  readonly x: number
  readonly y: number
  /** Viewport size in CSS pixels. */
  readonly width: number
  readonly height: number
  /** Pixels moved since this pointer's previous event. */
  readonly dx: number
  readonly dy: number
  /** Normalized device coordinates, -1..1, y up. */
  readonly screen: Vector2
  readonly button: number
  readonly pointerId: number
  readonly pointerType: string
  readonly modifiers: Modifiers
  /** Wheel delta in pixels (line and page modes converted). */
  readonly deltaY: number
  /** `KeyboardEvent.code` for key events. */
  readonly code: string

  private _ray: Ray | null = null

  constructor(type: ViewInputType, native: PointerEvent | WheelEvent | KeyboardEvent, host: InputHost, rect: DOMRect, previous?: {x: number; y: number}) {
    this.type = type
    this.native = native
    this.host = host
    const mouse = native as PointerEvent
    const hasPosition = typeof mouse.clientX === 'number'
    this.x = hasPosition ? mouse.clientX - rect.left : 0
    this.y = hasPosition ? mouse.clientY - rect.top : 0
    this.width = rect.width
    this.height = rect.height
    this.dx = previous ? this.x - previous.x : 0
    this.dy = previous ? this.y - previous.y : 0
    this.screen = new Vector2(
      rect.width ? (this.x / rect.width) * 2 - 1 : 0,
      rect.height ? -(this.y / rect.height) * 2 + 1 : 0,
    )
    this.button = typeof mouse.button === 'number' ? mouse.button : -1
    this.pointerId = typeof mouse.pointerId === 'number' ? mouse.pointerId : -1
    this.pointerType = mouse.pointerType ?? ''
    this.modifiers = {shift: native.shiftKey, ctrl: native.ctrlKey, alt: native.altKey, meta: native.metaKey}
    const wheel = native as WheelEvent
    this.deltaY = type === 'wheel' ? wheel.deltaY * (wheel.deltaMode === 1 ? 16 : wheel.deltaMode === 2 ? rect.height : 1) : 0
    this.code = (native as KeyboardEvent).code ?? ''
  }

  get view(): ThreeView {
    return this.host.view
  }

  /** World-space ray under the pointer, from the view's draw camera. */
  getRay(): Ray {
    if (!this._ray) {
      _raycaster.setFromCamera(this.screen, this.host.getViewCamera())
      this._ray = _raycaster.ray.clone()
    }
    return this._ray
  }
}
