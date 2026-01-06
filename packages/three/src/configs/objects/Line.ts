import { registerEditorGroups } from '@io-gui/editors'
import { Line } from 'three/webgpu'

registerEditorGroups(Line, {
  Morphing: ['morphTargetInfluences', 'morphTargetDictionary'],
})

