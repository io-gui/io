import { ioPropertyEditor, registerEditorConfig, registerEditorWidget, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { IcosahedronGeometry } from 'three/webgpu'
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js'

registerEditorWidget(IcosahedronGeometry, ioBuildGeometry())

registerEditorConfig(IcosahedronGeometry, [
  ['parameters', ioPropertyEditor({config: [
    ['radius', ioNumberSlider({min: 0, max: 1000, step: 0.1})],
    ['detail', ioNumberSlider({min: 0, max: 10, step: 1})],
  ]})],
])

registerEditorGroups(IcosahedronGeometry, {
  Hidden: ['parameters'],
})