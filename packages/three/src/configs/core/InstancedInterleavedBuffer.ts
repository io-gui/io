import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { InstancedInterleavedBuffer } from 'three/webgpu'

registerEditorConfig(InstancedInterleavedBuffer, [
  ['meshPerAttribute', ioNumber({min: 1, max: 1000, step: 1})],
])

registerEditorGroups(InstancedInterleavedBuffer, {
  Instancing: ['meshPerAttribute'],
})

