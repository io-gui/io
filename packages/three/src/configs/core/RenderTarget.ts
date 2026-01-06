import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { RenderTarget } from 'three/webgpu'

registerEditorConfig(RenderTarget, [
  ['width', ioNumber({min: 1, max: 8192, step: 1})],
  ['height', ioNumber({min: 1, max: 8192, step: 1})],
  ['depth', ioNumber({min: 1, max: 2048, step: 1})],
  ['samples', ioNumber({min: 0, max: 16, step: 1})],
])

registerEditorGroups(RenderTarget, {
  Main: [
    'width',
    'height',
    'depth',
    'viewport',
    'scissor',
    'scissorTest',
  ],
  Textures: [
    'texture',
    'textures',
    'depthTexture',
  ],
  Buffers: [
    'depthBuffer',
    'stencilBuffer',
    'resolveDepthBuffer',
    'resolveStencilBuffer',
  ],
  Advanced: [
    'samples',
    'multiview',
  ],
  Hidden: [
    '_depthTexture',
  ]
})

