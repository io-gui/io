import { Register, Property } from '@io-gui/core'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene, ToneMapping } from 'three/webgpu'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ThreeEditor, ThreeEditorProps } from '../editor/ThreeEditor.js'
import { ThreeDocument } from '../editor/ThreeDocument.js'

export type ThreeAppletProps = ThreeEditorProps & {
  scene?: Scene
  toneMappingExposure?: number
  toneMapping?: ToneMapping
}

/**
 * Compatibility shim (ADR-0002): a ThreeEditor with one document whose `scene`, `toneMapping` and
 * `toneMappingExposure` are two-way bound to the applet's own properties. New apps use ThreeEditor
 * and ThreeDocument directly. After replacing `applet.document`, the applet properties no longer follow it.
 */
@Register
export class ThreeApplet extends ThreeEditor {

  @Property({type: Scene, init: null})
  declare scene: Scene

  @Property({type: Number, value: 1})
  declare toneMappingExposure: number

  @Property({type: Number, value: NoToneMapping})
  declare toneMapping: ToneMapping

  constructor(args?: ThreeAppletProps) {
    super({...args, document: args?.document ?? new ThreeDocument()})
    this.document.scene = this.bind('scene') as unknown as Scene
    this.document.toneMapping = this.bind('toneMapping') as unknown as ToneMapping
    this.document.toneMappingExposure = this.bind('toneMappingExposure') as unknown as number
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
    'document',
    'mode',
    'activeTools',
    'operators',
    'tools',
  ],
})