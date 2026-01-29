import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { CapsuleGeometry } from 'three/webgpu'
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js'

registerEditorWidget(CapsuleGeometry, ioBuildGeometry())

registerEditorConfig(CapsuleGeometry, [
  ['parameters', ioPropertyEditor({config: [
    ['radius', ioNumberSlider({min: 0, max: 10, step: 0.1})],
    ['height', ioNumberSlider({min: 0, max: 10, step: 0.1})],
    ['capSegments', ioNumberSlider({min: 1, max: 10, step: 1})],
    ['radialSegments', ioNumberSlider({min: 1, max: 10, step: 1})],
    ['heightSegments', ioNumberSlider({min: 1, max: 10, step: 1})],
  ]})],
])

registerEditorGroups(CapsuleGeometry, {
  Hidden: ['parameters'],
})
