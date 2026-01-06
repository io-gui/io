import { registerEditorGroups } from '@io-gui/editors'
import { Uniform } from 'three/webgpu'

registerEditorGroups(Uniform, {
  Main: ['value'],
})

