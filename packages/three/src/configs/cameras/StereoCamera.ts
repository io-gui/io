import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioNumber } from '@io-gui/inputs'
import { StereoCamera } from 'three/webgpu'

registerEditorConfig(StereoCamera, [
  ['aspect', ioNumber({min: 0.01, max: Infinity, step: 0.01})],
  ['eyeSep', ioNumberSlider({min: 0, max: 0.2, step: 0.001})],
])

registerEditorGroups(StereoCamera, {
  Main: [
    'aspect',
    'eyeSep',
  ],
  Cameras: [
    'cameraL',
    'cameraR',
  ],
  Hidden: ['_cache'],
})

