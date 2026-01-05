import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { ioNumber } from "@io-gui/inputs"
import { InstancedBufferAttribute } from "three/webgpu"

registerEditorConfig(InstancedBufferAttribute, [
  ['meshPerAttribute', ioNumber({min: 1, max: 1000, step: 1})],
])

registerEditorGroups(InstancedBufferAttribute, {
  Instancing: ['meshPerAttribute'],
})

