import { registerEditorConfig, ioMatrix } from "@io-gui/editors"
import { Matrix2 } from "three/webgpu"

registerEditorConfig(Matrix2, [
  ['elements', ioMatrix()],
])