import { Register, Node, ReactiveProperty, NodeProps } from '@io-gui/core'
import { PropertyConfig, registerEditorGroups } from '@io-gui/editors'
import { NoToneMapping, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu'

export type ThreeAppletProps = NodeProps & {
  scene?: Scene
  toneMappingExposure?: number
  toneMapping?: ToneMapping
  uiConfig?: PropertyConfig[]
}

@Register
export class ThreeApplet extends Node {

  @ReactiveProperty({type: Scene, init: null})
  declare scene: Scene

  @ReactiveProperty({type: Number, value: 1})
  declare toneMappingExposure: number

  @ReactiveProperty({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

  // TODO: dispose uiConfig when applet is disposed
  @ReactiveProperty({type: Array, init: null})
  declare uiConfig: PropertyConfig[]

  private _renderer: WebGPURenderer | null = null
  private _width: number = 0
  private _height: number = 0
  private _prevTime: number = -1

  constructor(args?: ThreeAppletProps) {
    super(args)
  }

  updateViewportSize(width: number, height: number) {
    if (this._width !== width || this._height !== height) {
      if (!!width && !!height) {
        this._width = width
        this._height = height
        this.onResized(width, height)
      }
    }

  }
  isRendererInitialized() {
    return !!this._renderer && this._renderer.initialized === true
  }
  onRendererInitialized(renderer: WebGPURenderer) {
    this._renderer = renderer
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

registerEditorGroups(ThreeApplet, {
  Scene: [
    'scene',
  ],
  Rendering: [
    'toneMappingExposure',
    'toneMapping',
  ],
  Hidden: [
    'uiConfig',
  ]
})