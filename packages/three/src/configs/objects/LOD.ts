import { registerEditorGroups } from '@io-gui/editors'
import { LOD } from 'three/webgpu'

registerEditorGroups(LOD, {
  Main: ['levels', 'autoUpdate'],
  Hidden: ['_currentLevel'],
})

