import { Register, Node, ReactiveProperty } from '@io-gui/core'
import { NoToneMapping, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu'

@Register
export class ThreeState extends Node {

  @ReactiveProperty({type: Scene, init: null})
  declare scene: Scene

  @ReactiveProperty({type: Number, value: 1})
  declare toneMappingExposure: number

  @ReactiveProperty({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping
  
  @ReactiveProperty({type: Object, init: null})
  declare config: Record<string, unknown>

  public renderer: WebGPURenderer | null = null

  public width: number = 0
  public height: number = 0

  private _prevTime: number = -1

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
    if (this._prevTime === time) return
    this._prevTime = time
    this.onAnimate(delta)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number) {}
}