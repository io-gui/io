import { Register, IoElement, Storage as $, div, ReactiveProperty } from '@io-gui/core'
import { ioLayout, Split } from '@io-gui/layout'
import { MenuOption, ioOptionSelect } from '@io-gui/menus'
import { ioThreeViewport, ThreeApplet } from '@io-gui/three'
import { ioField } from '@io-gui/inputs'

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
import { ioThreeProperties } from '../elements/IoThreeProperties.js'

const version = 3

const split = new Split({
  children: [
    {
      orientation: 'horizontal',
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
        },
        {
          flex: '1 1 280px',
          tabs: [
            {id: 'ExampleProperties'},
          ],
        }
      ]
    }
  ]
})

const exampleOptions = new MenuOption({
  options: [
    {id: 'Camera Examples', options: [
      {id: 'Camera', value: CameraExample},
      {id: 'CameraLogarithmicDepthBuffer', value: CameraLogarithmicDepthBufferExample},
      {id: 'CameraArray', value: CameraArrayExample},
    ]},
    {id: 'Geometries', options: [
      {id: 'GeometryPrimitives', value: GeometriesExample},
      {id: 'GeometryColors', value: GeometryColorsExample},
      {id: 'GeometryConvex', value: GeometryConvexExample},
    ]},
    {id: 'Animations', options: [
      {id: 'AnimationGroups', value: AnimationGroupsExample},
      {id: 'AnimationKeyframes', value: AnimationKeyframesExample},
      {id: 'AnimationRetargeting', value: AnimationRetargetingExample},
      {id: 'AnimationRetargetingReadyplayer', value: AnimationRetargetingReadyplayerExample},
      {id: 'AnimationBackdrop', value: AnimationBackdropExample},
    ]},
    {id: 'WebGPUBackdropArea', value: WebGPUBackdropAreaExample},
    {id: 'ComputeTexture', value: ComputeTextureExample},
    {id: 'VolumePerlin', value: VolumePerlinExample},
  ],
  selectedID: $({key: 'example', storage: 'hash', value: 'AnimationKeyframes'})
})


const initializzedExamples = new WeakMap<typeof ThreeApplet, ThreeApplet>()

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
      :host  .column {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
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

  @ReactiveProperty({type: ThreeApplet, init: null})
  declare selectedExample: ThreeApplet


  selectedExampleOptionChanged() {
    const selectedConstructor = exampleOptions.value
    const initializedExample = initializzedExamples.get(selectedConstructor)
    if (initializedExample) {
      this.selectedExample = initializedExample
    } else {
      const example = new selectedConstructor()
      initializzedExamples.set(selectedConstructor, example)
      this.selectedExample = example
    }
  }
  
  ready() {
    exampleOptions.addEventListener('value-changed', this.selectedExampleOptionChanged)
    this.selectedExampleOptionChanged()
    // const _renderer = new WebGPURenderer({antialias: false, alpha: true, logarithmicDepthBuffer: true})
    // _renderer.setPixelRatio(window.devicePixelRatio)
    // _renderer.setClearAlpha(0)
    // void _renderer.init()
  }
  changed() {
    console.log('changed')
    this.render([
      ioLayout({
        elements: [
          ioThreeViewport({id: 'Top', applet: this.bind('selectedExample'), playing: true, cameraSelect: 'top'}),
          ioThreeViewport({id: 'Front', applet: this.bind('selectedExample'), playing: true, cameraSelect: 'front'}),
          ioThreeViewport({id: 'Left', applet: this.bind('selectedExample'), playing: true, cameraSelect: 'left'}),
          ioThreeViewport({id: 'Perspective', applet: this.bind('selectedExample'), playing: true, cameraSelect: 'perspective'}),
          ioThreeViewport({id: 'SceneCamera', applet: this.bind('selectedExample'), playing: true, cameraSelect: 'scene'}),

          div({id: 'ExampleProperties'}, [
            div({class: 'column'}, [
              div({class: 'column'}, [
                ioField({label:'Select Example:'}),
                ioOptionSelect({option: exampleOptions, selectBy: 'id'}), 
              ]),
              ioThreeProperties({applet: this.bind('selectedExample')})
            ])
          ])

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
              {id: 'ExampleProperties', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
