import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from "@io-gui/editors"
import { BufferGeometry } from "three/webgpu"

registerEditorConfig(BufferGeometry, [
  ['drawRange', ioPropertyEditor()],
])

registerEditorGroups(BufferGeometry, {
  Main: [
    'name',
    'attributes',
    'index',
  ],
  Bounds: [
    'boundingBox',
    'boundingSphere',
  ],
  Morph: [
    'morphAttributes',
    'morphTargetsRelative',
  ],
  Rendering: [
    'groups',
    'drawRange',
  ],
  Advanced: [
    'indirect',
    'indirectOffset',
  ],
})

