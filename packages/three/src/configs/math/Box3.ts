import { registerEditorConfig, ioObject } from '@io-gui/editors'
import { Box3 } from 'three/webgpu'

registerEditorConfig(Object, [
  [Box3, ioObject({labelWidth: '42px'})],
])