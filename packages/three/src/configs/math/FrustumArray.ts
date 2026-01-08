import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { FrustumArray } from 'three/webgpu'

registerEditorConfig(FrustumArray, [
])

registerEditorGroups(FrustumArray, {
  Hidden: [
    'coordinateSystem',
  ],
})

registerEditorConfig(Object, [
  [FrustumArray, ioObject()],
])
