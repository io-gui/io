import { Register, ReactiveObject, Property, ReactiveObjectProps } from '@io-gui/core'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, Timer, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu'
import { ioOptionSelect, Menu } from '@io-gui/menus'

export type ThreeAppletProps = ReactiveObjectProps & {
  scene?: Scene
  toneMappingExposure?: number
  toneMapping?: ToneMapping
  isPlaying?: boolean
}

const _playingApplets: ThreeApplet[] = []
function rAFLoop() {
  for (const applet of _playingApplets) {
    applet.onRAF()
  }
  requestAnimationFrame(rAFLoop)
}
rAFLoop()

@Register
export class ThreeApplet extends ReactiveObject {

  @Property({type: Scene, init: null})
  declare scene: Scene

  @Property({type: Number, value: 1})
  declare toneMappingExposure: number

  @Property({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

  @Property({type: Boolean, value: false})
  declare isPlaying: boolean

  public _renderer: WebGPURenderer | null = null
  public _width: number = 0
  public _height: number = 0

  readonly _timer: Timer = new Timer()

  constructor(args?: ThreeAppletProps) {
    super(args)
    this._timer.connect(document)
    this.isPlayingChanged()
  }

  isPlayingChanged() {
    if (this.isPlaying === true && _playingApplets.includes(this) === false) {
      _playingApplets.push(this)
    } else if (this.isPlaying === false && _playingApplets.includes(this)) {
      _playingApplets.splice(_playingApplets.indexOf(this), 1)
    }
  }

  onRAF() {
    if (!this.isPlaying) return
    this._timer.update()
    const delta = this._timer.getDelta()
    const time = this._timer.getElapsed()
    this.onAnimate(delta, time)
    this.dispatch('three-applet-needs-render', undefined, true)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number, time: number) {}

  override dispose() {
    this.isPlaying = false
    super.dispose()
    // this._timer.disconnect();
  }
}

registerEditorConfig(ThreeApplet, [
  ['toneMappingExposure', ioNumberSlider({min: 0, max: 3, step: 0.01, exponent: 2})],
  ['toneMapping', ioOptionSelect({model: new Menu({options: [
    {value: NoToneMapping, id: 'NoToneMapping'},
    {value: LinearToneMapping, id: 'LinearToneMapping'},
    {value: ReinhardToneMapping, id: 'ReinhardToneMapping'},
    {value: CineonToneMapping, id: 'CineonToneMapping'},
    {value: ACESFilmicToneMapping, id: 'ACESFilmicToneMapping'},
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
    'isPlaying',
    'toneMapping',
    'toneMappingExposure',
    '_renderer',
    '_width',
    '_height',
    '_timer',
  ],
})