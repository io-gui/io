import { registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { ioNumber } from "@io-gui/inputs"
import { ioNumberSlider } from "@io-gui/sliders"
import { ioOptionSelect, MenuOption } from "@io-gui/menus"
import { PositionalAudio } from "three/webgpu"

/**
 * PositionalAudio extends Audio
 * Positional (3D spatialized) audio using Web Audio API PannerNode
 */

registerEditorConfig(PositionalAudio, [
  ['refDistance', ioNumber({min: 0, max: Infinity, step: 0.1})],
  ['rolloffFactor', ioNumberSlider({min: 0, max: 10, step: 0.01})],
  ['maxDistance', ioNumber({min: 0, max: Infinity, step: 1})],
  ['distanceModel', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: 'linear', id: 'Linear'},
    {value: 'inverse', id: 'Inverse'},
    {value: 'exponential', id: 'Exponential'},
  ]})})],
  ['coneInnerAngle', ioNumberSlider({min: 0, max: 360, step: 1})],
  ['coneOuterAngle', ioNumberSlider({min: 0, max: 360, step: 1})],
  ['coneOuterGain', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(PositionalAudio, {
  Spatial: [
    'refDistance',
    'rolloffFactor',
    'maxDistance',
    'distanceModel',
  ],
  DirectionalCone: [
    'coneInnerAngle',
    'coneOuterAngle',
    'coneOuterGain',
  ],
  WebAudio: ['panner'],
})

