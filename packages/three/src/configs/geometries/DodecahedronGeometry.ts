import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { ioBuildGeometry } from '@io-gui/three'
import { DodecahedronGeometry } from 'three/webgpu'

registerEditorWidget(DodecahedronGeometry, ioBuildGeometry())

registerEditorConfig(DodecahedronGeometry, [
  ['parameters', ioPropertyEditor({config: [
    ['radius', ioNumberSlider({min: 0, max: 10, step: 0.1})],
    ['detail', ioNumberSlider({min: 0, max: 5, step: 1})],
  ]})],
])

registerEditorGroups(DodecahedronGeometry, {
  Hidden: ['parameters'],
})
