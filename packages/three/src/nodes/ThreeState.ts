import { Register, Node, ReactiveProperty, NodeProps } from 'io-core'
import { Scene, WebGPURenderer } from 'three/build/three.webgpu.js'
import { IoThreeViewport } from '../elements/IoThreeViewport.js'

@Register
export class ThreeState extends Node {

  @ReactiveProperty({type: Scene, init: null})
  declare scene: Scene

  public renderer: WebGPURenderer | null = null

  public width: number = 0
  public height: number = 0

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
  onResized(width: number, height: number) {}
  onAnimate() {}
}