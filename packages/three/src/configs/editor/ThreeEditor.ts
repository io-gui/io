import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping } from 'three/webgpu'
import { ThreeDocument } from '../../editor/ThreeDocument.js'
import { ThreeEditor } from '../../editor/ThreeEditor.js'

registerEditorConfig(ThreeDocument, [
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

registerEditorGroups(ThreeDocument, {
  Main: ['scene', 'toneMapping', 'toneMappingExposure'],
  Hidden: ['uuid', 'changeBus'],
})

// Session and runtime state of the editor stay out of property editors that show an editor subclass.
registerEditorGroups(ThreeEditor, {
  Hidden: [new RegExp(/^_/), 'isPlaying', 'changeBus', 'document', 'selection', 'mode', 'activeTools', 'operators', 'tools'],
})
