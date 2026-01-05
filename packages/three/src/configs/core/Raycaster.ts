import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { ioNumber } from "@io-gui/inputs"
import { Raycaster } from "three/webgpu"

registerEditorConfig(Raycaster, [
  ['near', ioNumber({min: 0, max: Infinity, step: 0.01})],
  ['far', ioNumber({min: 0, max: Infinity, step: 1})],
])

registerEditorGroups(Raycaster, {
  Main: [
    'ray',
    'near',
    'far',
  ],
  References: [
    'camera',
    'layers',
  ],
  Advanced: ['params'],
})

