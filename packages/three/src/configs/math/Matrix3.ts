import { registerEditorConfig, ioMatrix, ioPropertyEditor } from "@io-gui/editors"
import { Matrix3 } from "three/webgpu"

registerEditorConfig(Matrix3, [
  ['elements', ioMatrix()],
])

registerEditorConfig(Object, [
  [Matrix3, ioPropertyEditor({labeled: false, properties: ['elements']})],
])