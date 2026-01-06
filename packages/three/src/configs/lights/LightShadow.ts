// import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
// import { ioSwitch, ioNumber } from '@io-gui/inputs'
// import { ioNumberSlider } from '@io-gui/sliders'
// import { LightShadow } from 'three/webgpu'

// registerEditorConfig(LightShadow, [
//   ['intensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
//   ['bias', ioNumber({step: 0.0001})],
//   ['normalBias', ioNumber({step: 0.001})],
//   ['radius', ioNumberSlider({min: 0, max: 10, step: 0.1})],
//   ['blurSamples', ioNumber({min: 1, max: 32, step: 1})],
//   ['needsUpdate', ioSwitch({value: false})],
// ])

// registerEditorGroups(LightShadow, {
//   Main: ['camera', 'intensity', 'autoUpdate', 'needsUpdate'],
//   Quality: ['bias', 'normalBias', 'radius', 'blurSamples', 'mapSize', 'mapType'],
//   Data: ['map', 'mapPass', 'matrix'],
// })

