import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { EdgesGeometry } from 'three/webgpu'
import { threeBuildGeometry } from '../../elements/ThreeBuildGeometry.js'

registerEditorWidget(EdgesGeometry, threeBuildGeometry())

registerEditorConfig(EdgesGeometry, [
  ['parameters', ioPropertyEditor({config: [
    // geometry is a BufferGeometry - displayed as object
    ['thresholdAngle', ioNumberSlider({min: 0, max: 180, step: 1})],
  ]})],
])

registerEditorGroups(EdgesGeometry, {
  Hidden: ['parameters'],
})
