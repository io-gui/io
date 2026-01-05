import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { ioNumber } from "@io-gui/inputs"
import { InterleavedBufferAttribute } from "three/webgpu"

registerEditorConfig(InterleavedBufferAttribute, [
  ['itemSize', ioNumber({min: 1, max: 16, step: 1})],
  ['offset', ioNumber({min: 0, max: 64, step: 1})],
])

registerEditorGroups(InterleavedBufferAttribute, {
  Main: [
    'name',
    'itemSize',
    'offset',
    'normalized',
    'count',
  ],
  Data: [
    'data',
    'array',
  ],
})

