import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, MenuOption } from '@io-gui/menus'
import {
  KeyframeTrack,
  InterpolateLinear,
  InterpolateDiscrete,
  InterpolateSmooth,
} from 'three/webgpu'

registerEditorConfig(KeyframeTrack, [
  ['DefaultInterpolation', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: InterpolateLinear, id: 'Linear'},
    {value: InterpolateDiscrete, id: 'Discrete'},
    {value: InterpolateSmooth, id: 'Smooth'},
  ]})})],
])

registerEditorGroups(KeyframeTrack, {
  Main: [
    'name',
    'ValueTypeName',
  ],
  Data: [
    'times',
    'values',
  ],
  Advanced: [
    'DefaultInterpolation',
  ],
  Hidden: [
    'createInterpolant',
    'TimeBufferType',
    'ValueBufferType',
    'InterpolantFactoryMethodDiscrete',
    'InterpolantFactoryMethodLinear',
    'InterpolantFactoryMethodSmooth',
  ],
})

registerEditorConfig(Object, [
  [KeyframeTrack, ioObject()],
])

