import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import {
  CompressedArrayTexture,
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
} from 'three/webgpu'

registerEditorConfig(CompressedArrayTexture, [
  ['wrapR', ioOptionSelect({model: new Menu({options: [
    {value: ClampToEdgeWrapping, id: 'Clamp'},
    {value: RepeatWrapping, id: 'Repeat'},
    {value: MirroredRepeatWrapping, id: 'Mirrored'},
  ]})})],
])

registerEditorGroups(CompressedArrayTexture, {
  Source: ['layerUpdates'],
  Wrapping: ['wrapR'],
})

