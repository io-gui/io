import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { Triangle } from 'three/webgpu'

registerEditorConfig(Object, [
  [Triangle, ioObject({labelWidth: '18px'})],
])