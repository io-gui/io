import { ioPropertyEditor, registerEditorConfig, registerEditorGroups, registerEditorWidget } from '@io-gui/editors'
import { ExtrudeGeometry } from 'three/webgpu'
import { threeBuildGeometry } from '../../elements/ThreeBuildGeometry.js'

registerEditorWidget(ExtrudeGeometry, threeBuildGeometry())

registerEditorConfig(ExtrudeGeometry, [
  ['parameters', ioPropertyEditor({config: []})],
])

registerEditorGroups(ExtrudeGeometry, {
  Hidden: ['parameters'],
})
