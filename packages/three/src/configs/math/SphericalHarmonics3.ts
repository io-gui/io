import { registerEditorConfig, ioPropertyEditor, ioObject, ioVector } from '@io-gui/editors'
import { SphericalHarmonics3, Vector3 } from 'three/webgpu'

registerEditorConfig(SphericalHarmonics3, [
  ['coefficients', ioPropertyEditor({labelWidth: '18px', config: [
    [Vector3, ioVector({step: 0.001})],
  ]})],
])

registerEditorConfig(Object, [
  [SphericalHarmonics3, ioObject({labeled: false})],
])