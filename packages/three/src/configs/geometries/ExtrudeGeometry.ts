import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ExtrudeGeometry } from 'three/webgpu'
import { ioBuildGeometry } from '../../elements/IoBuildGeometry.js'

registerEditorWidget(ExtrudeGeometry, ioBuildGeometry())

registerEditorConfig(ExtrudeGeometry, [
  ['parameters', ioPropertyEditor({config: []})],
])

registerEditorGroups(ExtrudeGeometry, {
  Hidden: ['parameters'],
})
