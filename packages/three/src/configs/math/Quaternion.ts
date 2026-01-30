import { registerEditorConfig } from '@io-gui/editors'
import { ioQuaternion } from '../../elements/math/IoQuaternion.js'
import { Quaternion } from 'three/webgpu'

registerEditorConfig(Object, [
  [Quaternion, ioQuaternion({min: -Infinity, max: Infinity, step: 0.1})],
])