import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { PropertyMixer } from 'three/webgpu'

registerEditorConfig(PropertyMixer, [
  ['valueSize', ioNumber({min: 1, max: 16, step: 1})],
  ['cumulativeWeight', ioNumber({min: 0, max: Infinity, step: 0.01})],
  ['cumulativeWeightAdditive', ioNumber({min: 0, max: Infinity, step: 0.01})],
  ['useCount', ioNumber({min: 0, max: Infinity, step: 1})],
  ['referenceCount', ioNumber({min: 0, max: Infinity, step: 1})],
])

registerEditorGroups(PropertyMixer, {
  Main: [
    'binding',
    'valueSize',
  ],
  Weights: [
    'cumulativeWeight',
    'cumulativeWeightAdditive',
  ],
  Counts: [
    'useCount',
    'referenceCount',
  ],
  Hidden: ['buffer', 'originalValue', '_mixBufferRegion', '_mixBufferRegionAdditive', '_setIdentity', '_select', '_slerp', '_slerpAdditive', '_lerp', '_lerpAdditive'],
})

