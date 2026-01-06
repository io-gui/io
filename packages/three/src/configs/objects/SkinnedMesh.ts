import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, MenuOption } from '@io-gui/menus'
import { SkinnedMesh, AttachedBindMode, DetachedBindMode } from 'three/webgpu'

registerEditorConfig(SkinnedMesh, [
  ['bindMode', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: AttachedBindMode, id: 'Attached'},
    {value: DetachedBindMode, id: 'Detached'},
  ]})})],
])

registerEditorGroups(SkinnedMesh, {
  Main: ['skeleton', 'bindMode', 'bindMatrix', 'bindMatrixInverse'],
  Rendering: ['boundingBox', 'boundingSphere'],
})

