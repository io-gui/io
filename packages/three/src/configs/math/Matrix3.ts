import { registerEditorConfig, ioMatrix } from "@io-gui/editors"
import { Matrix3 } from "three/webgpu"

registerEditorConfig(Matrix3, [
  ['elements', ioMatrix()],
])  