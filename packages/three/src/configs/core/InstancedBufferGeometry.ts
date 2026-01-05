import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { ioNumber } from "@io-gui/inputs"
import { InstancedBufferGeometry } from "three/webgpu"

registerEditorConfig(InstancedBufferGeometry, [
  ['instanceCount', ioNumber({min: 0, max: Infinity, step: 1})],
])

registerEditorGroups(InstancedBufferGeometry, {
  Instancing: ['instanceCount'],
})

