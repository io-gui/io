import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { InstancedMesh } from 'three/webgpu'

registerEditorConfig(InstancedMesh, [
  ['count', ioNumber({min: 0, step: 1})],
])

registerEditorGroups(InstancedMesh, {
  Main: ['count', 'instanceMatrix', 'instanceColor', 'morphTexture'],
  Rendering: ['boundingBox', 'boundingSphere'],
  Hidden: ['previousInstanceMatrix'],
})

