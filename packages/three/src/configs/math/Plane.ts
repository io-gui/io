import { registerEditorConfig, ioPropertyEditor } from '@io-gui/editors'
import { Plane } from 'three/webgpu'

registerEditorConfig(Object, [
  [Plane, ioPropertyEditor()],
])