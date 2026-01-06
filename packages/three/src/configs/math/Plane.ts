import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { Plane } from 'three/webgpu'

registerEditorConfig(Object, [
  [Plane, ioObject({labelWidth: '64px'})],
])