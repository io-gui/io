import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { ioMatrix4 } from '@io-gui/three'
import { Matrix4 } from 'three/webgpu'

registerEditorConfig(Matrix4, [
  ['elements', ioMatrix4()],
])

registerEditorConfig(Object, [
  [Matrix4, ioObject({labeled: false, properties: ['elements']})],
])