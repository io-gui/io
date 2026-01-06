import { registerEditorGroups } from '@io-gui/editors'
import { Points } from 'three/webgpu'

registerEditorGroups(Points, {
  Morphing: ['morphTargetInfluences', 'morphTargetDictionary'],
})

