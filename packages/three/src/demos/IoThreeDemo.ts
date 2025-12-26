import { Register, IoElement, Storage as $ } from 'io-core'
import { ioLayout, Split } from 'io-layout'
import { MenuOption } from 'io-menus'
// import { ioThreeViewport } from 'io-three'
// import { ComputeTextureExample } from './examples/ComputeTextureExample.js'
// import { VolumePerlinExample } from './examples/VolumePerlinExample.js'
// import { WebGPUCamera } from './examples/WebGPUCamera.js'

const split = new Split({
  children: [
  //   {
  //     orientation: 'vertical',
  //     children: [
  //       {
  //         orientation: 'horizontal',
  //         children: [
  //           {tabs: [{id: 'ComputeTextureExample', icon: 'io:numeric-1-box'}]},
  //           {tabs: [{id: 'VolumePerlinExample', icon: 'io:numeric-2-box'}]}
  //         ]
  //       },
  //       {
  //         orientation: 'horizontal',
  //         children: [
  //           {tabs: [{id: 'webGPUCamera', icon: 'io:numeric-3-box'}]},
  //           {tabs: [{id: 'webGPUCamera(orthographicCamera)', icon: 'io:numeric-4-box'}]},
  //           {tabs: [{id: 'webGPUCamera(PerspectiveCamera)', icon: 'io:numeric-5-box'}]},
  //         ]
  //       }
  //     ]
  //   }
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
    // const webGPUCamera = new WebGPUCamera()
    this.render([
      ioLayout({
        elements: [
          // ioThreeViewport({id: 'ComputeTextureExample', cameraSelect: 'front'}),
          // ioThreeViewport({id: 'VolumePerlinExample',}),
          // ioThreeViewport({id: 'webGPUCamera', playing: true, cameraSelect: 'top', clearColor: 0x443322}),
          // ioThreeViewport({id: 'webGPUCamera(orthographicCamera)', playing: true, cameraSelect: 'scene:orthographicCamera'}),
          // ioThreeViewport({id: 'webGPUCamera(PerspectiveCamera)', playing: true, cameraSelect: 'scene:perspectiveCamera'}),
        ],
        split: $({key: 'viewport-split', storage: 'local', value: split}),
        addMenuOption:  new MenuOption({
          id: 'addMenuOption',
          mode: 'none',
          options: [
            {id: 'Viewports', mode: 'none', options: [
              {id: 'ComputeTextureExample', icon: 'io:numeric-1-box', mode: 'none'},
              {id: 'VolumePerlinExample', icon: 'io:numeric-2-box', mode: 'none'},
              {id: 'webGPUCamera', icon: 'io:numeric-3-box', mode: 'none'},
              {id: 'webGPUCamera(orthographicCamera)', icon: 'io:numeric-4-box', mode: 'none'},
              {id: 'webGPUCamera(PerspectiveCamera)', icon: 'io:numeric-5-box', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
