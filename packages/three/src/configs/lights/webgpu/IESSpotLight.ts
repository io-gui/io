import { registerEditorGroups } from '@io-gui/editors'
import { IESSpotLight } from 'three/webgpu'

registerEditorGroups(IESSpotLight, {
  Main: ['iesMap'],
})

