import { Register, IoElement, Storage as $, div } from '@io-gui/core'
import { ioLayout, Split } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'
import { ioThreeViewport } from '@io-gui/three'
import { WebGPURenderer } from 'three/webgpu'
import { ComputeTextureExample } from '../examples/compute_texture.js'
import { VolumePerlinExample } from '../examples/volume_perlin.js'
import { CameraExample } from '../examples/camera.js'
import { MiscAnimationGroupsExample } from '../examples/misc_animation_groups.js'
import { AnimationKeyframesExample } from '../examples/animation_keyframes.js'
import { CameraArrayExample } from '../examples/camera_array.js'
import { CameraLogarithmicDepthBufferExample } from '../examples/camera_logarithmicdepthbuffer.js'
import { GeometriesExample } from '../examples/geometries.js'
import { GeometryColorsExample } from '../examples/geometry_colors.js'
import { GeometryConvexExample } from '../examples/geometry_convex.js'
import { AnimationRetargetingExample } from '../examples/animation_retargeting.js'
import { AnimationRetargetingReadyplayerExample } from '../examples/animation_retargeting_readyplayer.js'
import { AnimationBackdropExample } from '../examples/animation_backdrop.js'

const version = 1

const split = new Split({
  children: [
    {
      orientation: 'vertical',
      children: [
        {
          orientation: 'horizontal',
          children: [
            {tabs: [
              {id: 'ComputeTexture'},
              {id: 'VolumePerlin'},
            ]},
            {tabs: [
              {id: 'CameraArray'},
              {id: 'CameraLogDepth'},
            ]},
          ]
        },
        {
          orientation: 'horizontal',
          children: [
            {tabs: [
              {id: 'Camera'}
            ]},
            {tabs: [
              {id: 'Camera(OrthographicCamera)'},
              {id: 'Camera(PerspectiveCamera)'},
            ]},
          ]
        },
        {
          orientation: 'horizontal',
          children: [
            {tabs: [{id: 'MiscAnimationGroups'}]},
            {tabs: [
              {id: 'AnimationKeyframes'},
              {id: 'AnimationRetargeting'},
              {id: 'AnimationRetargetingReadyplayer'},
              {id: 'AnimationBackdrop'},
            ]},
            {tabs: [{id: 'Geometries'}]},
            {tabs: [{id: 'GeometryColors'}]},
            {tabs: [{id: 'GeometryConvex'}]},
          ]
        },
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
      :host  .row {
        display: flex;
        flex: 1 1 auto;
        flex-direction: row;
      }
    `
  }
  ready() {
    const _cameraExample = new CameraExample()

    const _renderer = new WebGPURenderer({antialias: false, alpha: true, logarithmicDepthBuffer: true})
    _renderer.setPixelRatio(window.devicePixelRatio)
    _renderer.setClearAlpha(0)
    void _renderer.init()

    const _cameraLogarithmicDepthBufferExample = new CameraLogarithmicDepthBufferExample()

    this.render([
      ioLayout({
        elements: [
          ioThreeViewport({id: 'ComputeTexture', state: new ComputeTextureExample(), cameraSelect: 'front'}),
          ioThreeViewport({id: 'VolumePerlin', state: new VolumePerlinExample()}),
          ioThreeViewport({id: 'Camera', state: _cameraExample, playing: true, cameraSelect: 'top', clearColor: 0x443322}),
          ioThreeViewport({id: 'Camera(OrthographicCamera)', state: _cameraExample, playing: true, cameraSelect: 'scene:orthographicCamera'}),
          ioThreeViewport({id: 'Camera(PerspectiveCamera)', state: _cameraExample, playing: true, cameraSelect: 'scene:perspectiveCamera'}),
          ioThreeViewport({id: 'MiscAnimationGroups', state: new MiscAnimationGroupsExample(), playing: true}),
          ioThreeViewport({id: 'AnimationKeyframes', state: new AnimationKeyframesExample(), playing: true}),
          ioThreeViewport({id: 'AnimationRetargeting', state: new AnimationRetargetingExample(), playing: true, cameraSelect: 'scene:camera'}),
          ioThreeViewport({id: 'AnimationRetargetingReadyplayer', state: new AnimationRetargetingReadyplayerExample(), playing: true, cameraSelect: 'scene:camera'}),
          ioThreeViewport({id: 'AnimationBackdrop', state: new AnimationBackdropExample(), playing: true, cameraSelect: 'scene:camera'}),
          ioThreeViewport({id: 'CameraArray', state: new CameraArrayExample(), playing: true, cameraSelect: 'scene:arrayCamera'}),
          div({id: 'CameraLogDepth', class: 'row'}, [
            ioThreeViewport({state: _cameraLogarithmicDepthBufferExample, playing: true, cameraSelect: 'scene:PerspectiveCamera'}),
            ioThreeViewport({state: _cameraLogarithmicDepthBufferExample, playing: true, cameraSelect: 'scene:PerspectiveCamera', renderer: _renderer}),
          ]),
          ioThreeViewport({id: 'Geometries', state: new GeometriesExample(), playing: true}),
          ioThreeViewport({id: 'GeometryColors', state: new GeometryColorsExample(), playing: true}),
          ioThreeViewport({id: 'GeometryConvex', state: new GeometryConvexExample(), playing: true})
        ],
        split: $({key: `viewport-split-v${version}`, storage: 'local', value: split}),
        addMenuOption:  new MenuOption({
          id: 'addMenuOption',
          mode: 'none',
          options: [
            {id: 'Viewports', mode: 'none', options: [
              {id: 'ComputeTexture', mode: 'none'},
              {id: 'VolumePerlin', mode: 'none'},
              {id: 'Camera', mode: 'none'},
              {id: 'Camera(OrthographicCamera)', mode: 'none'},
              {id: 'Camera(PerspectiveCamera)', mode: 'none'},
              {id: 'MiscAnimationGroups', mode: 'none'},
              {id: 'AnimationKeyframes', mode: 'none'},
              {id: 'AnimationRetargeting', mode: 'none'},
              {id: 'AnimationRetargetingReadyplayer', mode: 'none'},
              {id: 'AnimationBackdrop', mode: 'none'},
              {id: 'CameraArray', mode: 'none'},
              {id: 'CameraLogDepth', mode: 'none'},
              {id: 'Geometries', mode: 'none'},
              {id: 'GeometryColors', mode: 'none'},
              {id: 'GeometryConvex', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
