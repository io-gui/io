import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioSwitch } from '@io-gui/inputs'
import { TextureSource } from 'three/webgpu'

registerEditorConfig(TextureSource, [
  ['needsUpdate', ioSwitch({value: false})],
])

registerEditorGroups(TextureSource, {
  Advanced: ['version'],
})
