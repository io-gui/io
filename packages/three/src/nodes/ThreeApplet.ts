import { Register, ReactiveObject, Property, ReactiveObjectProps } from '@io-gui/core'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene, ToneMapping, WebGPURenderer } from 'three/webgpu'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ChangeBus, DocumentChange } from '../editor/ChangeBus.js'
import { renderScheduler, FrameInfo, ScheduledTicker } from '../render/RenderScheduler.js'
import type { IoThreeViewport } from '../elements/IoThreeViewport.js'

export type ThreeAppletProps = ReactiveObjectProps & {
  scene?: Scene
  toneMappingExposure?: number
  toneMapping?: ToneMapping
  isPlaying?: boolean
}

@Register
export class ThreeApplet extends ReactiveObject implements ScheduledTicker {

  @Property({type: Scene, init: null})
  declare scene: Scene

  @Property({type: Number, value: 1})
  declare toneMappingExposure: number

  @Property({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

  @Property({type: Boolean, value: false})
  declare isPlaying: boolean

  public _renderer: WebGPURenderer | null = null

  /** Changes drained by the RenderScheduler each frame; views showing this applet redraw. */
  readonly changeBus = new ChangeBus()

  constructor(args?: ThreeAppletProps) {
    super(args)
    this.isPlayingChanged()
  }

  isPlayingChanged() {
    if (this.isPlaying) {
      renderScheduler.addTicker(this)
    } else {
      renderScheduler.removeTicker(this)
    }
  }

  tick(frame: FrameInfo) {
    if (!this.isPlaying) return
    this.onAnimate(frame.delta, frame.time)
    this.notify({kind: 'time', source: this})
  }

  notify(change: DocumentChange) {
    this.changeBus.notify(change)
  }

  /** Redraws every view showing this applet on the next frame. */
  requestRender() {
    this.notify({kind: 'other', source: this})
  }

  isRendererInitialized() {
    return !!this._renderer && this._renderer.initialized === true
  }

  onRendererInitialized(renderer: WebGPURenderer) {
    this._renderer = renderer
  }

  /**
   * @deprecated Size belongs to each view (ADR-0002). Called when a viewport showing this applet resizes;
   * with several viewports, the last one resized wins.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResized(width: number, height: number, viewport?: IoThreeViewport) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(delta: number, time: number) {}

  override dispose() {
    this.isPlaying = false
    renderScheduler.removeTicker(this)
    super.dispose()
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
    'changeBus',
  ],
})