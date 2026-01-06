import { registerEditorConfig, registerEditorGroups, ioVector } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { CanvasTarget, Vector4 } from 'three/webgpu'

registerEditorConfig(CanvasTarget, [
  [Number, ioNumber({disabled: true})],
  [Vector4, ioVector({disabled: true})],
  [Boolean, ioVector({disabled: true})],
])

registerEditorGroups(CanvasTarget, {
  Main: [
    'colorTexture',
    'depthTexture',
  ],
  Advanced: [
    'domElement',
    '_width',
    '_height',
    '_pixelRatio',
    '_viewport',
    '_scissor',
    '_scissorTest',
  ],
})


