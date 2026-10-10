import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { Matrix4 } from 'three/webgpu'
import { threeMatrix4 } from '../../elements/math/ThreeMatrix4.js'

registerEditorConfig(Matrix4, [
  ['elements', threeMatrix4()],
])

registerEditorConfig(Object, [
  [Matrix4, ioObject({labeled: false, properties: ['elements']})],
])