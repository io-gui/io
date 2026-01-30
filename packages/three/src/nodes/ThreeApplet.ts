import { Register, ReactiveNode, ReactiveProperty, ReactiveNodeProps } from '@io-gui/core'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu'
import { ioOptionSelect, MenuOption } from '@io-gui/menus'

export type ThreeAppletProps = ReactiveNodeProps & {
  scene?: Scene
  toneMappingExposure?: number
  toneMapping?: ToneMapping
}

@Register
export class ThreeApplet extends ReactiveNode {

  @ReactiveProperty({type: Scene, init: null})
  declare scene: Scene

  @ReactiveProperty({type: Number, value: 1})
  declare toneMappingExposure: number

  @ReactiveProperty({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

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

registerEditorConfig(ThreeApplet, [
  ['toneMappingExposure', ioNumberSlider({min: 0, max: 3, step: 0.01, exponent: 2})],
  ['toneMapping', ioOptionSelect({option: new MenuOption({options: [
    {value: NoToneMapping, id: 'NoToneMapping'},
    {value: LinearToneMapping, id: 'LinearToneMapping'},
    {value: ReinhardToneMapping, id: 'ReinhardToneMapping'},
    {value: CineonToneMapping, id: 'CineonToneMapping'},
    {value: ACESFilmicToneMapping, id: 'ACESFilmicToneMapping'},
    // {value: CustomToneMapping, id: 'CustomToneMapping'},
    {value: AgXToneMapping, id: 'AgXToneMapping'},
    {value: NeutralToneMapping, id: 'NeutralToneMapping'},
  ]})})],
  ['scene', ioPropertyEditor({properties: ['children'], label: '_hidden_'})],
])

registerEditorGroups(ThreeApplet, {
  Main: [
    'scene',
  ],
  Hidden: [
    'toneMapping',
    'toneMappingExposure',
    '_renderer',
    '_width',
    '_height',
    '_prevTime',
  ],
})