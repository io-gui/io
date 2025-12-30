import { Register, IoElement, Storage as $, div } from '@io-gui/core'
import { ioLayout, Split } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'
import { ioThreeViewport } from '@io-gui/three'
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
import { WebGPURenderer } from 'three/webgpu'

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
            {tabs: [{id: 'AnimationKeyframes'}]},
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
              {id: 'ComputeTexture', icon: 'io:numeric-1-box', mode: 'none'},
              {id: 'VolumePerlin', icon: 'io:numeric-2-box', mode: 'none'},
              {id: 'Camera', icon: 'io:numeric-3-box', mode: 'none'},
              {id: 'Camera(OrthographicCamera)', icon: 'io:numeric-4-box', mode: 'none'},
              {id: 'Camera(PerspectiveCamera)', icon: 'io:numeric-5-box', mode: 'none'},
              {id: 'MiscAnimationGroups', icon: 'io:numeric-6-box', mode: 'none'},
              {id: 'AnimationKeyframes', icon: 'io:numeric-7-box', mode: 'none'},
              {id: 'CameraArray', icon: 'io:numeric-8-box', mode: 'none'},
              {id: 'CameraLogDepth', icon: 'io:numeric-9-box', mode: 'none'},
              {id: 'Geometries', icon: 'io:shape', mode: 'none'},
              {id: 'GeometryColors', icon: 'io:palette', mode: 'none'},
              {id: 'GeometryConvex', icon: 'io:cube-outline', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
