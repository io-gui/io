import { registerEditorConfig, ioPropertyEditor } from "@io-gui/editors"
import { Triangle } from "three/webgpu"


registerEditorConfig(Object, [
  [Triangle, ioPropertyEditor()],
])