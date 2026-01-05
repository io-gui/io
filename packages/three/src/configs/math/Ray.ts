import { registerEditorConfig, ioPropertyEditor } from "@io-gui/editors"
import { Ray } from "three/webgpu"


registerEditorConfig(Object, [
  [Ray, ioPropertyEditor()],
])