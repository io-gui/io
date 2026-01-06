import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { ioOptionSelect, MenuOption } from '@io-gui/menus'
import {
  AnimationClip,
  AdditiveAnimationBlendMode,
  NormalAnimationBlendMode,
} from 'three/webgpu'

registerEditorConfig(AnimationClip, [
  ['duration', ioNumber({min: 0, max: Infinity, step: 0.01})],
  ['blendMode', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: NormalAnimationBlendMode, id: 'Normal'},
    {value: AdditiveAnimationBlendMode, id: 'Additive'},
  ]})})],
])

registerEditorGroups(AnimationClip, {
  Main: [
    'name',
    'duration',
    'blendMode',
  ],
  Tracks: ['tracks'],
})

registerEditorConfig(Object, [
  [AnimationClip, ioPropertyEditor()],
])

