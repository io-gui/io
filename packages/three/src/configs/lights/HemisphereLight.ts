import { registerEditorGroups } from '@io-gui/editors'
import { HemisphereLight } from 'three/webgpu'

registerEditorGroups(HemisphereLight, {
  Main: ['groundColor'],
})

