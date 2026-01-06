import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { Camera } from 'three/webgpu'

registerEditorConfig(Camera, [
])

registerEditorGroups(Camera, {
  Projection: [
    'projectionMatrix',
    'projectionMatrixInverse',
  ],
  Advanced: ['coordinateSystem'],
  Hidden: ['reversedDepth',
    'visible',
    'castShadow',
    'receiveShadow',
    'frustumCulled',
    'renderOrder',
    'layers',
    'customDepthMaterial',
    'customDistanceMaterial',
    'coordinateSystem',
    '_reversedDepth',
  ],
})

