import { ReactiveNode, ReactiveNodeProps, Register } from '@io-gui/core'
import { IoThreeViewport, Pointer3D } from '../elements/IoThreeViewport'

export type ToolBaseProps = ReactiveNodeProps & {

}

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

  private _activePointers: Pointer3D[] = []

  _onPointerDown(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const viewport = event.target as IoThreeViewport
    viewport.setPointerCapture(event.pointerId)
    const pointer3D = viewport.pointerTo3D(event)
    this._activePointers.push(pointer3D)
    this.on3DPointerDown([...this._activePointers])
  }
  _onPointerMove(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const index = this._activePointers.findIndex(p => p.event.pointerId === event.pointerId)
    if (index === -1) return
    const viewport = event.target as IoThreeViewport
    const pointer3D = viewport.pointerTo3D(event)
    this._activePointers[index] = pointer3D
    this.on3DPointerMove([...this._activePointers])
  }
  _onPointerUp(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const index = this._activePointers.findIndex(p => p.event.pointerId === event.pointerId)
    if (index === -1) return
    this._activePointers.splice(index, 1)
    this.on3DPointerUp([...this._activePointers])
  }
  _onPointerCancel(event: PointerEvent) {
    event.stopPropagation()
    event.preventDefault()
    const index = this._activePointers.findIndex(p => p.event.pointerId === event.pointerId)
    if (index === -1) return
    this._activePointers.splice(index, 1)
    this.on3DPointerCancel([...this._activePointers])
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
}