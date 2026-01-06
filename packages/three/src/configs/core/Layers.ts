import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { Layers } from 'three/webgpu'

registerEditorConfig(Layers, [
  ['mask', ioNumber({min: 0, max: 0xFFFFFFFF, step: 1})],
])

registerEditorGroups(Layers, {
  Main: ['mask'],
})

registerEditorConfig(Object, [
  [Layers, ioPropertyEditor()],
])
