import { registerEditorConfig, ioPropertyEditor } from "@io-gui/editors"
import { Box3 } from "three/webgpu"


registerEditorConfig(Object, [
  [Box3, ioPropertyEditor()],
])