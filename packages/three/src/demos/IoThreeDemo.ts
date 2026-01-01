import { Register, IoElement, Storage as $, div } from '@io-gui/core'
import { ioLayout, Split } from '@io-gui/layout'
import { MenuOption, ioOptionSelect } from '@io-gui/menus'
import { ioPropertyEditor } from '@io-gui/editors'
import { ioThreeViewport } from '@io-gui/three'
import { WebGPURenderer } from 'three/webgpu'
import { ComputeTextureExample } from '../examples/compute_texture.js'
import { VolumePerlinExample } from '../examples/volume_perlin.js'
import { CameraExample } from '../examples/camera.js'
import { AnimationGroupsExample } from '../examples/animation_groups.js'
import { AnimationKeyframesExample } from '../examples/animation_keyframes.js'
import { CameraArrayExample } from '../examples/camera_array.js'
import { CameraLogarithmicDepthBufferExample } from '../examples/camera_logarithmicdepthbuffer.js'
import { GeometriesExample } from '../examples/geometries.js'
import { GeometryColorsExample } from '../examples/geometry_colors.js'
import { GeometryConvexExample } from '../examples/geometry_convex.js'
import { AnimationRetargetingExample } from '../examples/animation_retargeting.js'
import { AnimationRetargetingReadyplayerExample } from '../examples/animation_retargeting_readyplayer.js'
import { AnimationBackdropExample } from '../examples/animation_backdrop.js'
import { WebGPUBackdropAreaExample } from '../examples/backdrop_area.js'

const version = 3

const split = new Split({
  children: [
    {
      orientation: 'vertical',
      children: [
        {
          orientation: 'horizontal',
          children: [
            {tabs: [
              {id: 'Top'},
            ]},
            {tabs: [
              {id: 'Front'},
              {id: 'ExampleSelector'},
            ]},
          ]
        },
        {
          orientation: 'horizontal',
          children: [
            {tabs: [
              {id: 'Left'},
            ]},
            {tabs: [
              {id: 'Perspective'},
              {id: 'SceneCamera'},
            ]},
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
      :host  .property-editor {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
      }
      :host .property-editor > io-property-editor {
        position: absolute;
        min-width: 240px;
        top: 0;
        right: 0;
      }
    `
  }
  ready() {
    const _renderer = new WebGPURenderer({antialias: false, alpha: true, logarithmicDepthBuffer: true})
    _renderer.setPixelRatio(window.devicePixelRatio)
    _renderer.setClearAlpha(0)
    void _renderer.init()

    const _webGPUBackdropAreaExample = new WebGPUBackdropAreaExample()
    const _cameraExample = new CameraExample()
    const _cameraLogarithmicDepthBufferExample = new CameraLogarithmicDepthBufferExample()
    const _cameraArrayExample = new CameraArrayExample()
    const _geometriesExample = new GeometriesExample()
    const _geometryColorsExample = new GeometryColorsExample()
    const _geometryConvexExample = new GeometryConvexExample()
    const _animationGroupsExample = new AnimationGroupsExample()
    const _animationKeyframesExample = new AnimationKeyframesExample()
    const _animationRetargetingExample = new AnimationRetargetingExample()
    const _animationRetargetingReadyplayerExample = new AnimationRetargetingReadyplayerExample()
    const _animationBackdropExample = new AnimationBackdropExample()
    const _computeTextureExample = new ComputeTextureExample()
    const _volumePerlinExample = new VolumePerlinExample()
    const exampleOptions = new MenuOption({
      options: [
        {id: 'Camera Examples', options: [
          {id: 'Camera', value: _cameraExample},
          {id: 'CameraLogarithmicDepthBuffer', value: _cameraLogarithmicDepthBufferExample},
          {id: 'CameraArray', value: _cameraArrayExample},
        ]},
        {id: 'Geometries', options: [
          {id: 'GeometryPrimitives', value: _geometriesExample},
          {id: 'GeometryColors', value: _geometryColorsExample},
          {id: 'GeometryConvex', value: _geometryConvexExample},
        ]},
        {id: 'Animations', options: [
          {id: 'AnimationGroups', value: _animationGroupsExample},
          {id: 'AnimationKeyframes', value: _animationKeyframesExample},
          {id: 'AnimationRetargeting', value: _animationRetargetingExample},
          {id: 'AnimationRetargetingReadyplayer', value: _animationRetargetingReadyplayerExample},
          {id: 'AnimationBackdrop', value: _animationBackdropExample},
        ]},
        {id: 'WebGPUBackdropArea', value: _webGPUBackdropAreaExample},
        {id: 'ComputeTexture', value: _computeTextureExample},
        {id: 'VolumePerlin', value: _volumePerlinExample},
      ],
      selectedID: $({key: 'example', storage: 'hash', value: 'AnimationKeyframes'})
    })

    this.render([
      ioLayout({
        elements: [
          ioThreeViewport({id: 'Top', applet: exampleOptions.bind('value'), playing: true, cameraSelect: 'top'}),
          ioThreeViewport({id: 'Front', applet: exampleOptions.bind('value'), playing: true, cameraSelect: 'front'}),
          ioThreeViewport({id: 'Left', applet: exampleOptions.bind('value'), playing: true, cameraSelect: 'left'}),
          ioThreeViewport({id: 'Perspective', applet: exampleOptions.bind('value'), playing: true, cameraSelect: 'perspective'}),
          ioThreeViewport({id: 'SceneCamera', applet: exampleOptions.bind('value'), playing: true, cameraSelect: 'scene'}),
          ioOptionSelect({id: 'ExampleSelector', option: exampleOptions, selectBy: 'id'}),
          // ioPropertyEditor({value: _webGPUBackdropAreaExample.options, config: _webGPUBackdropAreaExample.optionsUIConfig})
        ],
        split: $({key: `viewport-split-v${version}`, storage: 'local', value: split}),
        addMenuOption: new MenuOption({
          id: 'addMenuOption',
          mode: 'none',
          options: [
            {id: 'Viewports', mode: 'none', options: [
              {id: 'SceneCamera', mode: 'none'},
              {id: 'Top', mode: 'none'},
              {id: 'Front', mode: 'none'},
              {id: 'Left', mode: 'none'},
              {id: 'Perspective', mode: 'none'},
              {id: 'SceneCamera', mode: 'none'},
              {id: 'ExampleSelector', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
