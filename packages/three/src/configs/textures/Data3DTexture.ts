import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import {
  Data3DTexture,
  RepeatWrapping,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
} from 'three/webgpu'

registerEditorConfig(Data3DTexture, [
  ['wrapR', ioOptionSelect({model: new Menu({options: [
    {value: ClampToEdgeWrapping, id: 'Clamp'},
    {value: RepeatWrapping, id: 'Repeat'},
    {value: MirroredRepeatWrapping, id: 'Mirrored'},
  ]})})],
])

registerEditorGroups(Data3DTexture, {
  Wrapping: ['wrapR'],
})

