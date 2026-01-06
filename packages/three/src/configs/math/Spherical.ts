import { registerEditorConfig, ioPropertyEditor } from '@io-gui/editors'
import { Spherical } from 'three/webgpu'


registerEditorConfig(Object, [
  [Spherical, ioPropertyEditor()],
])