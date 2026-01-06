import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { Object3D } from 'three/webgpu'

registerEditorConfig(Object3D, [
  ['renderOrder', ioNumberSlider({min: 0, max: 100, step: 1})],
  // TODO: ['layers', futureUIComponent],
  // TODO: ['customDepthMaterial', futureUIComponent],
  // TODO: ['customDistanceMaterial', futureUIComponent],
])

registerEditorGroups(Object3D, {
  Main: [
    'visible', 'children', 'parent'
  ],
  Transform: ['position', 'rotation', 'scale', 'quaternion', 'up'],
  Matrices: [
    'matrix', 'matrixWorld', 'normalMatrix', 'matrixWorldInverse', 'modelViewMatrix',
    'matrixAutoUpdate', 'matrixWorldAutoUpdate', 'matrixWorldNeedsUpdate'
  ],
  Rendering: [
    'castShadow',
    'receiveShadow',
    'frustumCulled',
    'renderOrder',
    'layers',
    'customDepthMaterial',
    'customDistanceMaterial',
  ],
  Animation: ['animations'],
  Advanced: [],
})