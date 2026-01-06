import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { BufferGeometry } from 'three/webgpu'

registerEditorConfig(BufferGeometry, [
  ['index', ioObject({})],
  ['attributes', ioObject({})],
])

registerEditorGroups(BufferGeometry, {
  Main: ['index', 'attributes', 'boundingBox', 'boundingSphere'],
  Morphing: ['morphAttributes', 'morphTargetsRelative'],
  Advanced: ['groups', 'drawRange', 'indirect', 'indirectOffset'],
})
