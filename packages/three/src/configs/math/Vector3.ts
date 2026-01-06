import { registerEditorConfig, ioVector } from '@io-gui/editors'
import { Vector3 } from 'three/webgpu'

registerEditorConfig(Object, [
  [Vector3, ioVector({min: -Infinity, max: Infinity, step: 0.1})],
])