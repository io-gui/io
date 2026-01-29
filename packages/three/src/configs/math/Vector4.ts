import { registerEditorConfig } from '@io-gui/editors'
import { Vector4 } from 'three/webgpu'
import { ioVector4 } from '../../elements/math/IoVector4.js'

registerEditorConfig(Object, [
  [Vector4, ioVector4({min: -Infinity, max: Infinity, step: 0.1})],
])