import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { RectAreaLight } from 'three/webgpu'

registerEditorConfig(RectAreaLight, [
  ['width', ioNumber({min: 0, step: 0.1})],
  ['height', ioNumber({min: 0, step: 0.1})],
])

registerEditorGroups(RectAreaLight, {
  Main: ['width', 'height', 'power'],
})

