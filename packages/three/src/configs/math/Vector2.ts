import { registerEditorConfig } from '@io-gui/editors'
import { ioVector2 } from '@io-gui/three'
import { Vector2 } from 'three/webgpu'

registerEditorConfig(Object, [
  [Vector2, ioVector2({min: -Infinity, max: Infinity, step: 0.1})],
])