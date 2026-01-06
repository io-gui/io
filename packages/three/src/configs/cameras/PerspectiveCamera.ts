import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioNumber } from '@io-gui/inputs'
import { PerspectiveCamera } from 'three/webgpu'

registerEditorConfig(PerspectiveCamera, [
  ['fov', ioNumberSlider({min: 1, max: 180, step: 1})],
  ['zoom', ioNumberSlider({min: 0.01, max: 10, step: 0.01, exponent: 3})],
  ['near', ioNumber({min: 0.001, max: Infinity, step: 0.01})],
  ['far', ioNumber({min: 0.1, max: Infinity, step: 1})],
  ['aspect', ioNumber({min: 0.01, max: Infinity, step: 0.01})],
  ['focus', ioNumber({min: 0, max: Infinity, step: 0.1})],
  ['filmGauge', ioNumber({min: 1, max: 100, step: 1})],
  ['filmOffset', ioNumber({min: -100, max: 100, step: 0.1})],
])

registerEditorGroups(PerspectiveCamera, {
  Main: [
    'fov',
    'aspect',
    'near',
    'far',
    'zoom',
  ],
  Film: [
    'focus',
    'filmGauge',
    'filmOffset',
  ],
  Advanced: ['view'],
})

