import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ioObject } from '@io-gui/editors'
import { ioBuildGeometry } from '@io-gui/three'
import { WireframeGeometry } from 'three/webgpu'

registerEditorWidget(WireframeGeometry, ioBuildGeometry())

registerEditorConfig(WireframeGeometry, [
  ['parameters', ioPropertyEditor({config: [
    // geometry is a BufferGeometry - displayed as object
    ['geometry', ioObject({})],
  ]})],
])

registerEditorGroups(WireframeGeometry, {
  Hidden: ['parameters'],
})
