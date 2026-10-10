import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { PlaneGeometry } from 'three/webgpu'
import { threeBuildGeometry } from '../../elements/ThreeBuildGeometry.js'

registerEditorWidget(PlaneGeometry, threeBuildGeometry())

registerEditorConfig(PlaneGeometry, [
  ['parameters', ioPropertyEditor({config: [
    ['width', ioNumberSlider({min: 0, max: 1000, step: 0.1})],
    ['height', ioNumberSlider({min: 0, max: 1000, step: 0.1})],
    ['widthSegments', ioNumberSlider({min: 1, max: 64, step: 1})],
    ['heightSegments', ioNumberSlider({min: 1, max: 64, step: 1})],
  ]})],
])

registerEditorGroups(PlaneGeometry, {
  Hidden: ['parameters'],
})
