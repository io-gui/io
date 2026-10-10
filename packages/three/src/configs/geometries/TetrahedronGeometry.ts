import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { TetrahedronGeometry } from 'three/webgpu'
import { threeBuildGeometry } from '../../elements/ThreeBuildGeometry.js'

registerEditorWidget(TetrahedronGeometry, threeBuildGeometry())

registerEditorConfig(TetrahedronGeometry, [
  ['parameters', ioPropertyEditor({config: [
    ['radius', ioNumberSlider({min: 0, max: 1000, step: 0.1})],
    ['detail', ioNumberSlider({min: 0, max: 10, step: 1})],
  ]})],
])

registerEditorGroups(TetrahedronGeometry, {
  Hidden: ['parameters'],
})
