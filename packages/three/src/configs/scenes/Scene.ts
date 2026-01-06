import { ioVector, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { Scene } from 'three/webgpu'

registerEditorConfig(Scene, [
  ['backgroundBlurriness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['backgroundIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['backgroundRotation', ioVector({min: -360, max: 360, step: 1})],
  ['environmentIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['environmentRotation', ioVector({min: -360, max: 360, step: 1})],
  // TODO: ['background', futureUiComponent],
  // TODO: ['environment', futureUiComponent],
  // TODO: ['fog', futureUiComponent],
  // TODO: ['overrideMaterial', futureIoMaterialSelector],
])

registerEditorGroups(Scene, {
  Rendering: [
    'background',
    'environment',
    'fog',
    'backgroundBlurriness',
    'backgroundIntensity',
    'backgroundRotation',
    'environmentIntensity',
    'environmentRotation',
    'overrideMaterial',
  ],
  Advanced: [''],
})

