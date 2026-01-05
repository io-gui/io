import { ioColorRgba } from "@io-gui/colors"
import { registerEditorConfig } from "@io-gui/editors"
import { Color } from "three/webgpu"

registerEditorConfig(Object, [
  [Color, ioColorRgba()],
])