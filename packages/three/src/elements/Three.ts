import { registerEditorConfig, registerEditorGroups, ioVector, ioMatrix, ioPropertyEditor } from '@io-gui/editors'
import { ioOptionSelect } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioNumber } from '@io-gui/inputs'
import { MenuOption } from '@io-gui/menus'
import { ioColorRgba } from '@io-gui/colors'

import {
  AnimationAction,
  AdditiveAnimationBlendMode,
  NormalAnimationBlendMode,
  LoopRepeat,
  LoopPingPong,
  LoopOnce,
  AnimationMixer,
  Euler,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Color,
  Matrix3,
  Matrix4,
  Object3D
} from 'three/webgpu'

registerEditorConfig(Object, [
  [Vector2, ioVector({min: -Infinity, max: Infinity, step: 0.1})],
  [Vector3, ioVector({min: -Infinity, max: Infinity, step: 0.1})],
  [Vector4, ioVector({min: -Infinity, max: Infinity, step: 0.1})],
  [Quaternion, ioVector({min: -Infinity, max: Infinity, step: 0.1})],
  [Euler, ioVector({min: -360, max: 360, step: 1})],
  [Color, ioColorRgba()],
  [Matrix3, ioPropertyEditor({labeled: false, properties: ['elements']})],
  [Matrix4, ioPropertyEditor({labeled: false, properties: ['elements']})],
])
registerEditorConfig(Matrix3, [
  ['elements', ioMatrix()],
])
registerEditorConfig(Matrix4, [
  ['elements', ioMatrix()],
])
///
registerEditorConfig(AnimationAction, [
  ['blendMode', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: AdditiveAnimationBlendMode, id: 'Additive'},
    {value: NormalAnimationBlendMode, id: 'Normal'},
  ]})})],
  ['loop', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: LoopRepeat, id: 'LoopRepeat'},
    {value: LoopPingPong, id: 'LoopPingPong'},
    {value: LoopOnce, id: 'LoopOnce'},
  ]})})],
  //AnimationBlendMode
  ['weight', ioNumberSlider({min: 0, max: 1, step: 0.01})],
['repetitions', ioNumber({min: 0, max: Infinity, step: 1})],
])


registerEditorGroups(Object3D, {
  Hidden: [new RegExp(/^is[A-Z]/)]
})
///
registerEditorGroups(AnimationAction, {
  'Advanced': ['zeroSlopeAtStart', 'zeroSlopeAtEnd', 'clampWhenFinished', 'blendMode', 'loop', 'repetitions', 'timeScale']
})
registerEditorGroups(AnimationMixer, {
  'Advanced': []
})