import { registerEditorConfig } from '@io-gui/editors'
import { ioVector4 } from '@io-gui/three'
import { Vector4 } from 'three/webgpu'

registerEditorConfig(Object, [
  [Vector4, ioVector4({min: -Infinity, max: Infinity, step: 0.1})],
])