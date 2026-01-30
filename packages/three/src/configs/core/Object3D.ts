import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { Object3D } from 'three/webgpu'
import { ioVector3 } from '../../elements/math/IoVector3.js'
import { ioEuler } from '../../elements/math/IoEuler.js'
import { ioQuaternion } from '../../elements/math/IoQuaternion.js'

registerEditorConfig(Object3D, [
  ['renderOrder', ioNumberSlider({min: 0, max: 100, step: 1})],
  ['up', ioVector3({min: -1, max: 1, step: 0.01})],
  ['position', ioVector3({step: 0.001})],
  ['quaternion', ioQuaternion({step: 0.001})],
  ['scale', ioVector3({step: 0.001, linkable: true})],
  ['rotation', ioEuler({min: -2 * Math.PI, max: 2 * Math.PI, step: Math.PI / 180 * 0.1, conversion: 1 / Math.PI * 180})],
])

registerEditorGroups(Object3D, {
  Main: [
    'name', 'visible', 'position', 'rotation', 'scale'
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
  Advanced: [
    'quaternion', 'up',
    'matrix', 'matrixWorld', 'normalMatrix', 'matrixWorldInverse', 'modelViewMatrix',
    'matrixAutoUpdate', 'matrixWorldAutoUpdate', 'matrixWorldNeedsUpdate'
  ],
  Hidden: [
    'static', 'parent', 'children'
  ],
})