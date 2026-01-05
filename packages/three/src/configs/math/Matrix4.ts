import { registerEditorConfig, ioMatrix, ioPropertyEditor } from "@io-gui/editors"
import { Matrix4 } from "three/webgpu"

registerEditorConfig(Matrix4, [
  ['elements', ioMatrix()],
])

registerEditorConfig(Object, [
  [Matrix4, ioPropertyEditor({labeled: false, properties: ['elements']})],
])