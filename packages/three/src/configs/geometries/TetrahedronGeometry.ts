import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { TetrahedronGeometry } from 'three/webgpu'
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js'

registerEditorWidget(TetrahedronGeometry, ioBuildGeometry())

registerEditorConfig(TetrahedronGeometry, [
  ['parameters', ioPropertyEditor({config: [
    ['radius', ioNumberSlider({min: 0, max: 10, step: 0.1})],
    ['detail', ioNumberSlider({min: 0, max: 5, step: 1})],
  ]})],
])

registerEditorGroups(TetrahedronGeometry, {
  Hidden: ['parameters'],
})
