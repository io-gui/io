import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, MenuOption } from '@io-gui/menus'
import {
  DataArrayTexture,
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
} from 'three/webgpu'

registerEditorConfig(DataArrayTexture, [
  ['wrapR', ioOptionSelect({selectBy: 'value', option: new MenuOption({options: [
    {value: ClampToEdgeWrapping, id: 'Clamp'},
    {value: RepeatWrapping, id: 'Repeat'},
    {value: MirroredRepeatWrapping, id: 'Mirrored'},
  ]})})],
])

registerEditorGroups(DataArrayTexture, {
  Hidden: ['layerUpdates'],
  Wrapping: ['wrapR'],
})

