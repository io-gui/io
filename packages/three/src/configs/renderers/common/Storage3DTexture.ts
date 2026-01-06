import { registerEditorGroups } from '@io-gui/editors'
import { Storage3DTexture } from 'three/webgpu'

registerEditorGroups(Storage3DTexture, {
  Wrapping: [
    'wrapR',
  ],
})


