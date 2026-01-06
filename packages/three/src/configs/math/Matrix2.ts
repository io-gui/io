import { registerEditorConfig, ioMatrix, ioPropertyEditor } from '@io-gui/editors'
import { Matrix2 } from 'three/webgpu'

registerEditorConfig(Matrix2, [
  ['elements', ioMatrix()],
])

registerEditorConfig(Object, [
  [Matrix2, ioPropertyEditor({labeled: false, properties: ['elements']})],
])