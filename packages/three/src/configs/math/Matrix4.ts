import { registerEditorConfig, ioMatrix } from "@io-gui/editors"
import { Matrix4 } from "three/webgpu"

registerEditorConfig(Matrix4, [
  ['elements', ioMatrix()],
])