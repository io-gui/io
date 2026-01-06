import { registerEditorConfig, ioVector } from '@io-gui/editors'
import { Quaternion } from 'three/webgpu'

registerEditorConfig(Object, [
  [Quaternion, ioVector({min: -Infinity, max: Infinity, step: 0.1})],
])