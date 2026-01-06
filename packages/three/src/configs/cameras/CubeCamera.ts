import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'
import { CubeCamera } from 'three/webgpu'

registerEditorConfig(CubeCamera, [
  ['activeMipmapLevel', ioNumberSlider({min: 0, max: 10, step: 1})],
])

registerEditorGroups(CubeCamera, {
  Main: [
    'renderTarget',
    'activeMipmapLevel',
  ],
  Hidden: ['coordinateSystem'],
})

