/* eslint-disable @typescript-eslint/no-unused-vars */

import { ReactiveObject, ReactiveObjectProps, Register, Property } from '@io-gui/core'
import { IoThreeViewport } from '../elements/IoThreeViewport'
import { Vector2, Ray, Raycaster, Vector3 } from 'three/webgpu'
import { ThreeApplet } from './ThreeApplet'
import { Behavior, BehaviorPriority } from '../input/Behavior.js'
import { ViewInputEvent } from '../input/ViewInputEvent.js'

export type ToolBaseProps = ReactiveObjectProps & {
  applet: ThreeApplet
}

export interface Pointer3D {
  event: PointerEvent
  screen: Vector2
  screenStart: Vector2
  screenPrevious: Vector2
  screenMovement: Vector2
  ray: Ray
  rayStart: Ray
  rayPrevious: Ray
  rayMovement: Ray
}

const _raycaster = new Raycaster()

/**
 * Adapts a ToolBase to the InputRouter (ADR-0004): one shared behavior at tool priority that forwards
 * router events to the tool's existing pointer handlers. The router dispatches synchronously from the
 * viewport's own listeners, so `event.currentTarget` is still the viewport.
 */
class ToolBaseBehavior implements Behavior {
  readonly priority: number = BehaviorPriority.tool

  constructor(private readonly tool: ToolBase) {}

  wantsCapture(event: ViewInputEvent) {
    return (event.type === 'pointerdown' || event.type === 'wheel') && this.tool.capturesInput(event.native as PointerEvent | WheelEvent)
  }
  begin(event: ViewInputEvent) {
    if (event.type === 'wheel') this.tool._onWheel(event.native as WheelEvent)
    else this.tool._onPointerDown(event.native as PointerEvent)
  }
  update(event: ViewInputEvent) {
    switch (event.type) {
      case 'pointerdown': this.tool._onPointerDown(event.native as PointerEvent); break
      case 'pointermove': this.tool._onPointerMove(event.native as PointerEvent); break
      case 'pointerup': this.tool._onPointerUp(event.native as PointerEvent); break
      case 'wheel': this.tool._onWheel(event.native as WheelEvent); break
    }
  }
  end(event: ViewInputEvent) {
    if (event.type === 'pointerup') this.tool._onPointerUp(event.native as PointerEvent)
  }
  cancel(event?: ViewInputEvent) {
    if (event?.type === 'pointercancel') this.tool._onPointerCancel(event.native as PointerEvent)
    else if (event) this.tool._resetPointers(event.host as IoThreeViewport)
  }
  hover(event: ViewInputEvent) {
    // Tools track hover passively and never block lower behaviors.
    this.tool._onPointerMove(event.native as PointerEvent)
    return false
  }
  hoverEnd(event?: ViewInputEvent) {
    if (event) this.tool._onPointerLeave(event.native as PointerEvent)
  }
}

@Register
export class ToolBase extends ReactiveObject {

  @Property({type: ThreeApplet})
  declare applet: ThreeApplet

  private readonly _viewports: IoThreeViewport[] = []
  private _activePointers = new WeakMap<IoThreeViewport, Pointer3D[]>()
  private _hoverPointers = new WeakMap<IoThreeViewport, Pointer3D[]>()
  private readonly _behavior: Behavior = new ToolBaseBehavior(this)

  constructor(args?: ToolBaseProps) {
    super(args)
  }

  /** The behavior this tool adds to each registered viewport's InputRouter. */
  get behavior(): Behavior {
    return this._behavior
  }

  registerViewport(viewport: IoThreeViewport) {
    if (this._viewports.includes(viewport)) return
    this._viewports.push(viewport)
    viewport.inputRouter.add(this._behavior)
  }

  unregisterViewport(viewport: IoThreeViewport) {
    if (!this._viewports.includes(viewport)) return
    this._viewports.splice(this._viewports.indexOf(viewport), 1)
    viewport.inputRouter.remove(this._behavior)
    this._resetPointers(viewport)
  }

  /**
   * Whether this tool captures a press or wheel event. Defaults to everything, so lower-priority behaviors
   * (camera navigation) only get input the tool lets through. Override to share, for example
   * `return event.button === 0` to leave other buttons and the wheel to navigation.
   */
  capturesInput(event: PointerEvent | WheelEvent): boolean {
    return true
  }

  _resetPointers(viewport: IoThreeViewport) {
    this._activePointers.delete(viewport)
    this._hoverPointers.delete(viewport)
  }

  _onContextMenu(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
  }

  _onPointerDown(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.currentTarget as IoThreeViewport
    const activePointers = this._getActivePointers(viewport)
    const hoverPointers = this._getHoverPointers(viewport)
    viewport.setPointerCapture(event.pointerId)
    const pointer3D = this.pointerTo3D(event)
    this._removePointer(hoverPointers, event.pointerId)
    this._setPointer(activePointers, pointer3D)
    this.on3DPointerDown(pointer3D, activePointers, viewport)
  }
  _onPointerMove(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.currentTarget as IoThreeViewport
    const activePointers = this._getActivePointers(viewport)
    const hoverPointers = this._getHoverPointers(viewport)
    const pointer3D = this.pointerTo3D(event)
    if (!this._findPointer(activePointers, event.pointerId)) {
      this._setPointer(hoverPointers, pointer3D)
      this.on3DPointerHover(pointer3D, hoverPointers, viewport)
    } else {
      this._setPointer(activePointers, pointer3D)
      this.on3DPointerMove(pointer3D, activePointers, viewport)
    }
  }
  _onPointerUp(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.currentTarget as IoThreeViewport
    const activePointers = this._getActivePointers(viewport)
    const pointer3D = this.pointerTo3D(event)
    viewport.releasePointerCapture(event.pointerId)
    if (!this._findPointer(activePointers, event.pointerId)) return
    this.on3DPointerUp(pointer3D, activePointers, viewport)
    this._removePointer(activePointers, event.pointerId)
  }
  _onPointerCancel(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.currentTarget as IoThreeViewport
    const activePointers = this._getActivePointers(viewport)
    const hoverPointers = this._getHoverPointers(viewport)
    const pointer3D = this.pointerTo3D(event)
    viewport.releasePointerCapture(event.pointerId)
    this.on3DPointerCancel(pointer3D, activePointers, viewport)
    this._removePointer(hoverPointers, event.pointerId)
    this._removePointer(activePointers, event.pointerId)
  }
  _onPointerLeave(event: PointerEvent) {
    const viewport = event.currentTarget as IoThreeViewport
    if (this._removeHoverPointer(viewport, event.pointerId)) {
      event.stopPropagation()
      event.preventDefault()
    }
  }
  _onPointerOut(event: PointerEvent) {
    const viewport = event.currentTarget as IoThreeViewport
    if (this._removeHoverPointer(viewport, event.pointerId)) {
      event.stopPropagation()
      event.preventDefault()
    }
  }
  _onLostPointerCapture(event: PointerEvent) {
    const viewport = event.currentTarget as IoThreeViewport
    const activePointers = this._getActivePointers(viewport)
    const hoverPointers = this._getHoverPointers(viewport)
    this._removePointer(hoverPointers, event.pointerId)
    this._removePointer(activePointers, event.pointerId)
    event.stopPropagation()
    event.preventDefault()
  }
  _onWheel(event: WheelEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.currentTarget as IoThreeViewport
    const pointer3D = this.pointerTo3D(event as unknown as PointerEvent) // TODO: Fix type
    this.on3DWheel(pointer3D, event, viewport)
  }
  on3DPointerHover(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport) {
    // console.log('on3DPointerHover', pointer, pointers, viewport)
  }
  on3DPointerDown(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport) {
    // console.log('on3DPointerDown', pointer, pointers, viewport)
  }
  on3DPointerMove(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport) {
    // console.log('on3DPointerMove', pointer, pointers, viewport)
  }
  on3DPointerUp(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport) {
    // console.log('on3DPointerUp', pointer, pointers, viewport)
  }
  on3DPointerCancel(pointer: Pointer3D, pointers: Pointer3D[], viewport: IoThreeViewport) {
    // console.log('on3DPointerCancel', pointer, pointers, viewport)
  }
  on3DWheel(pointer: Pointer3D, event: WheelEvent, viewport: IoThreeViewport) {
    // console.log('on3DWheel', pointer, event, viewport)
  }

  private _getActivePointers(viewport: IoThreeViewport) {
    let activePointers = this._activePointers.get(viewport)
    if (!activePointers) {
      activePointers = []
      this._activePointers.set(viewport, activePointers)
    }
    return activePointers
  }
  private _getHoverPointers(viewport: IoThreeViewport) {
    let hoverPointers = this._hoverPointers.get(viewport)
    if (!hoverPointers) {
      hoverPointers = []
      this._hoverPointers.set(viewport, hoverPointers)
    }
    return hoverPointers
  }
  private _findPointer(pointers: Pointer3D[], pointerId: number) {
    return pointers.find(pointer => pointer.event.pointerId === pointerId)
  }
  private _setPointer(pointers: Pointer3D[], pointer3D: Pointer3D) {
    const index = pointers.findIndex(pointer => pointer.event.pointerId === pointer3D.event.pointerId)
    if (index === -1) {
      pointers.push(pointer3D)
    } else {
      pointers[index] = pointer3D
    }
  }
  private _removePointer(pointers: Pointer3D[], pointerId: number) {
    const index = pointers.findIndex(pointer => pointer.event.pointerId === pointerId)
    if (index === -1) return false
    pointers.splice(index, 1)
    return true
  }
  private _removeHoverPointer(viewport: IoThreeViewport, pointerId: number) {
    return this._removePointer(this._getHoverPointers(viewport), pointerId)
  }

  pointerTo3D(event: PointerEvent): Pointer3D {

    const viewport = event.currentTarget as IoThreeViewport
    const activePointers = this._getActivePointers(viewport)
    const hoverPointers = this._getHoverPointers(viewport)
    const _rect = viewport.getBoundingClientRect()
    const screen = new Vector2(
      ((event.clientX - _rect.left) / _rect.width) * 2 - 1,
      -((event.clientY - _rect.top) / _rect.height) * 2 + 1,
    )

    _raycaster.setFromCamera(screen, viewport.getViewCamera())
    const { origin, direction } = _raycaster.ray

    const previousPointer3D = this._findPointer(activePointers, event.pointerId) || this._findPointer(hoverPointers, event.pointerId)

    if (previousPointer3D) {

      return {
        event,
        screen,
        screenStart: previousPointer3D.screenStart.clone(),
        screenPrevious: previousPointer3D.screen.clone(),
        screenMovement: screen.clone().sub(previousPointer3D.screen),
        ray: new Ray(origin.clone(), direction.clone()),
        rayStart: new Ray(previousPointer3D.rayStart.origin.clone(), previousPointer3D.rayStart.direction.clone()),
        rayPrevious: previousPointer3D.ray.clone(),
        rayMovement: new Ray(origin.clone().sub(previousPointer3D.ray.origin), direction.clone().sub(previousPointer3D.ray.direction)),
      }

    } else {

      return {
        event,
        screen,
        screenStart: screen.clone(),
        screenPrevious: screen.clone(),
        screenMovement: new Vector2(0, 0),
        ray: new Ray(origin.clone(), direction.clone()),
        rayStart: new Ray(origin.clone(), direction.clone()),
        rayPrevious: new Ray(origin.clone(), direction.clone()),
        rayMovement: new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0)),
      }

    }

  }
}
