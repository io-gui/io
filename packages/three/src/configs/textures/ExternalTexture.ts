import { registerEditorGroups } from '@io-gui/editors'
import { ExternalTexture } from 'three/webgpu'

registerEditorGroups(ExternalTexture, {
  Source: ['sourceTexture'],
})

