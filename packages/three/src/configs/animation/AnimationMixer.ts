import { registerEditorConfig } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

import { AnimationMixer } from 'three/webgpu'

registerEditorConfig(AnimationMixer, [
  ['timeScale', ioNumberSlider({min: 0, max: 10, step: 0.01, exponent: 3})],
])