import { registerEditorConfig, ioPropertyEditor } from "@io-gui/editors"
import { Cylindrical } from "three/webgpu"

registerEditorConfig(Object, [
  [Cylindrical, ioPropertyEditor()],
])