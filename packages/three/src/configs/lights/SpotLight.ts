import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { ioNumberSlider } from '@io-gui/sliders'
import { SpotLight } from 'three/webgpu'

registerEditorConfig(SpotLight, [
  ['distance', ioNumber({min: 0, step: 0.1})],
  ['angle', ioNumberSlider({min: 0, max: Math.PI / 2, step: 0.01})],
  ['penumbra', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['decay', ioNumberSlider({min: 0, max: 5, step: 0.01})],
])

registerEditorGroups(SpotLight, {
  Main: ['target', 'distance', 'angle', 'penumbra', 'decay', 'power', 'map', 'shadow'],
})

