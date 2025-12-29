import { Register, IoElement, Storage as $ } from '@io-gui/core'
import { ioLayout, Split } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'
import { ioThreeViewport } from '@io-gui/three'
import { WebGPUComputeTextureExample } from '../examples/webgpu_compute_texture.js'
import { WebGPUVolumePerlinExample } from '../examples/webgpu_volume_perlin.js'
import { WebGPUCameraExample } from '../examples/webgpu_camera.js'

const split = new Split({
  children: [
    {
      orientation: 'vertical',
      children: [
        {
          orientation: 'horizontal',
          children: [
            {tabs: [{id: 'WebGPUComputeTexture', icon: 'io:numeric-1-box'}]},
            {tabs: [{id: 'WebGPUVolumePerlin', icon: 'io:numeric-2-box'}]}
          ]
        },
        {
          orientation: 'horizontal',
          children: [
            {tabs: [{id: 'WebGPUCamera', icon: 'io:numeric-3-box'}]},
            {tabs: [{id: 'WebGPUCamera(OrthographicCamera)', icon: 'io:numeric-4-box'}]},
            {tabs: [{id: 'WebGPUCamera(PerspectiveCamera)', icon: 'io:numeric-5-box'}]},
          ]
        }
      ]
    }
  ]
})

export class IoThreeDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        background-color: #f00;
        max-width: 100%;
        max-height: 100%;
      }
    `
  }
  ready() {
    const webGPUCamera = new WebGPUCameraExample()
    this.render([
      ioLayout({
        elements: [
          ioThreeViewport({id: 'WebGPUComputeTexture', state: new WebGPUComputeTextureExample(), cameraSelect: 'front'}),
          ioThreeViewport({id: 'WebGPUVolumePerlin', state: new WebGPUVolumePerlinExample()}),
          ioThreeViewport({id: 'WebGPUCamera', state: webGPUCamera, playing: true, cameraSelect: 'top', clearColor: 0x443322}),
          ioThreeViewport({id: 'WebGPUCamera(OrthographicCamera)', state: webGPUCamera, playing: true, cameraSelect: 'scene:orthographicCamera'}),
          ioThreeViewport({id: 'WebGPUCamera(PerspectiveCamera)', state: webGPUCamera, playing: true, cameraSelect: 'scene:perspectiveCamera'}),
        ],
        split: $({key: 'viewport-split', storage: 'local', value: split}),
        addMenuOption:  new MenuOption({
          id: 'addMenuOption',
          mode: 'none',
          options: [
            {id: 'Viewports', mode: 'none', options: [
              {id: 'ComputeTexture', icon: 'io:numeric-1-box', mode: 'none'},
              {id: 'WebGPUVolumePerlin', icon: 'io:numeric-2-box', mode: 'none'},
              {id: 'WebGPUCamera', icon: 'io:numeric-3-box', mode: 'none'},
              {id: 'WebGPUCamera(OrthographicCamera)', icon: 'io:numeric-4-box', mode: 'none'},
              {id: 'WebGPUCamera(PerspectiveCamera)', icon: 'io:numeric-5-box', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
