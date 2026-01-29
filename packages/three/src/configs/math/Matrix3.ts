import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { ioMatrix3 } from '@io-gui/three'
import { Matrix3 } from 'three/webgpu'

registerEditorConfig(Matrix3, [
  ['elements', ioMatrix3()],
])

registerEditorConfig(Object, [
  [Matrix3, ioObject({labeled: false, properties: ['elements']})],
])