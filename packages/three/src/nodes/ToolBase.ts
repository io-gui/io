import { ReactiveNode, ReactiveNodeProps, Register } from '@io-gui/core'
import { IoThreeViewport } from '../elements/IoThreeViewport'
import { Vector2, Ray, Raycaster } from 'three/webgpu'

export type ToolBaseProps = ReactiveNodeProps & {

}

export interface Pointer3D {
  event: PointerEvent
  screen: Vector2
  screenStart: Vector2
  screenMovement: Vector2
  ray: Ray
  rayStart: Ray
  rayMovement: Ray
}

const _raycaster = new Raycaster()

@Register
export class ToolBase extends ReactiveNode {

  private readonly viewports: IoThreeViewport[] = []

  constructor(args: ToolBaseProps) {
    super(args)
  }

  registerViewport(viewport: IoThreeViewport) {
    this.viewports.push(viewport)
    viewport.addEventListener('pointerdown', this._onPointerDown)
    viewport.addEventListener('pointermove', this._onPointerMove)
    viewport.addEventListener('pointerup', this._onPointerUp)
    viewport.addEventListener('pointercancel', this._onPointerCancel)
  }

  unregisterViewport(viewport: IoThreeViewport) {
    this.viewports.splice(this.viewports.indexOf(viewport), 1)
    viewport.removeEventListener('pointerdown', this._onPointerDown)
    viewport.removeEventListener('pointermove', this._onPointerMove)
    viewport.removeEventListener('pointerup', this._onPointerUp)
    viewport.removeEventListener('pointercancel', this._onPointerCancel)
  }

  private _activePointers: Record<number, Pointer3D> = {}

  _onPointerDown(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.target as IoThreeViewport
    viewport.setPointerCapture(event.pointerId)
    const pointer3D = this.pointerTo3D(event)
    this._activePointers[event.pointerId] = pointer3D
    this.on3DPointerDown(Object.values(this._activePointers))
  }
  _onPointerMove(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    if (!this._activePointers[event.pointerId]) return
    const pointer3D = this.pointerTo3D(event)
    this._activePointers[event.pointerId] = pointer3D
    this.on3DPointerMove(Object.values(this._activePointers))
  }
  _onPointerUp(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.target as IoThreeViewport
    viewport.releasePointerCapture(event.pointerId)
    if (!this._activePointers[event.pointerId]) return
    delete this._activePointers[event.pointerId]
    this.on3DPointerUp(Object.values(this._activePointers))
  }
  _onPointerCancel(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.target as IoThreeViewport
    viewport.releasePointerCapture(event.pointerId)
    if (!this._activePointers[event.pointerId]) return
    delete this._activePointers[event.pointerId]
    this.on3DPointerCancel(Object.values(this._activePointers))
  }

  on3DPointerDown(pointers: Pointer3D[]) {
    console.log('on3DPointerDown', pointers)
  }
  on3DPointerMove(pointers: Pointer3D[]) {
    console.log('on3DPointerMove', pointers)
  }
  on3DPointerUp(pointers: Pointer3D[]) {
    console.log('on3DPointerUp', pointers)
  }
  on3DPointerCancel(pointers: Pointer3D[]) {
    console.log('on3DPointerCancel', pointers)
  }

  pointerTo3D(event: PointerEvent): Pointer3D {

    const _viewport = event.target as IoThreeViewport
    const _rect = _viewport.getBoundingClientRect()
    const screen = new Vector2(
      ((event.clientX - _rect.left) / _rect.width) * 2 - 1,
      -((event.clientY - _rect.top) / _rect.height) * 2 + 1,
    )

    _viewport.viewCameras.setOverscan(_viewport.width, _viewport.height, _viewport.overscan)
    const camera = _viewport.viewCameras.camera
    _raycaster.setFromCamera(screen, camera)
    _viewport.viewCameras.resetOverscan()
    const { origin, direction } = _raycaster.ray

    const previousPointer3D = this._activePointers[event.pointerId]

    if (previousPointer3D) {

      return {
        event,
        screen,
        screenStart: previousPointer3D.screenStart.clone(),
        screenMovement: screen.clone().sub(previousPointer3D.screen),
        ray: new Ray(
          origin.clone(),
          direction.clone(),
        ),
        rayStart: new Ray(
          previousPointer3D.rayStart.origin.clone(),
          previousPointer3D.rayStart.direction.clone(),
        ),
        rayMovement: new Ray(
          origin.clone().sub(previousPointer3D.ray.origin),
          direction.clone().sub(previousPointer3D.ray.direction),
        ),
      }

    } else {

      return {
        event,
        screen,
        screenStart: screen.clone(),
        screenMovement: new Vector2(0, 0),
        ray: new Ray(
          origin.clone(),
          direction.clone(),
        ),
        rayStart: new Ray(
          origin.clone(),
          direction.clone(),
        ),
        rayMovement: new Ray(
          origin.clone(),
          direction.clone(),
        ),
      }

    }

  }
}