import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { PolyhedronGeometry } from 'three/webgpu'
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js'

registerEditorWidget(PolyhedronGeometry, ioBuildGeometry())

registerEditorConfig(PolyhedronGeometry, [
  ['parameters', ioPropertyEditor({config: [
    // vertices and indices are arrays - not easily editable
    ['radius', ioNumberSlider({min: 0, max: 10, step: 0.1})],
    ['detail', ioNumberSlider({min: 0, max: 5, step: 1})],
  ]})],
])

registerEditorGroups(PolyhedronGeometry, {
  Hidden: ['parameters'],
})
