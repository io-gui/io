import { Register, Node, ReactiveProperty } from '@io-gui/core'
import { Scene, WebGPURenderer } from 'three/webgpu'

@Register
export class ThreeState extends Node {

  @ReactiveProperty({type: Scene, init: null})
  declare scene: Scene

  public renderer: WebGPURenderer | null = null

  public width: number = 0
  public height: number = 0

  private _lastAnimatedFrame: number = -1

  setViewportSize(width: number, height: number) {
    if (this.width !== width || this.height !== height) {
      if (!!width && !!height) {
        this.width = width
        this.height = height
        this.onResized(width, height)
      }
    }

  }
  isRendererInitialized() {
    return !!this.renderer && this.renderer.initialized === true
  }
  onRendererInitialized(renderer: WebGPURenderer) {
    this.renderer = renderer
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResized(width: number, height: number) {}

  animate(time: number, delta: number) {
    if (this._lastAnimatedFrame === time) return
    this._lastAnimatedFrame = time
    this.onAnimate(delta)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number) {}
}