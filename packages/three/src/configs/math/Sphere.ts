import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { Sphere } from 'three/webgpu'

registerEditorConfig(Object, [
  [Sphere, ioObject({labelWidth: '64px'})],
])