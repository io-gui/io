import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioObject } from '@io-gui/editors'
import { WireframeGeometry } from 'three/webgpu'
import { threeBuildGeometry } from '../../elements/ThreeBuildGeometry.js'

registerEditorWidget(WireframeGeometry, threeBuildGeometry())

registerEditorConfig(WireframeGeometry, [
  ['parameters', ioPropertyEditor({config: [
    // geometry is a BufferGeometry - displayed as object
    ['geometry', ioObject({})],
  ]})],
])

registerEditorGroups(WireframeGeometry, {
  Hidden: ['parameters'],
})
