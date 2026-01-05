import { Register, IoElement, Storage as $, div, ReactiveProperty } from '@io-gui/core'
import { ioLayout, Split } from '@io-gui/layout'
import { MenuOption, ioOptionSelect } from '@io-gui/menus'
import { ioThreeViewport, ThreeApplet } from '@io-gui/three'
import { ioField } from '@io-gui/inputs'
import { ioPropertyEditor } from '@io-gui/editors'

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
import { AnimationSkinningBlendingExample } from '../examples/animation_skinning_blending.js'
import { WebGPUBackdropAreaExample } from '../examples/backdrop_area.js'
import { ioThreeProperties } from '../elements/IoThreeProperties.js'

import {
  ArrayCamera,
  Box2,
  Box3,
  Camera,
  Color,
  ColorManagement,
  Cylindrical,
  Plane,
  Euler,
  Frustum,
  FrustumArray,
  Line3,
  Matrix2,
  Matrix3,
  Matrix4,
  Object3D,
  Ray,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  Sphere,
  StereoCamera,
  Quaternion,
  Vector2,
  Vector3,
  Vector4,
  Spherical,
  SphericalHarmonics3,
  Triangle,
  Interpolant,
  QuaternionLinearInterpolant,
  LinearInterpolant,
  DiscreteInterpolant,
  CubicInterpolant,
} from 'three/webgpu'

const version = 3

const split = new Split({
  children: [
    {
      orientation: 'horizontal',
      children: [
        {
          flex: '1 0 380px',
          tabs: [
            {id: 'ExampleProperties'},
          ],
        },
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
          flex: '1 0 380px',
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
      {id: 'AnimationSkinningBlending', value: AnimationSkinningBlendingExample},
    ]},
    {id: 'WebGPUBackdropArea', value: WebGPUBackdropAreaExample},
    {id: 'ComputeTexture', value: ComputeTextureExample},
    {id: 'VolumePerlin', value: VolumePerlinExample},
  ],
  selectedID: $({key: 'example', storage: 'hash', value: 'AnimationKeyframes'})
})

const initializzedExamples = new WeakMap<typeof ThreeApplet, ThreeApplet>()

const allClasses = {
  //
  // scene: new Scene(),
  // object3d: new Object3D(),
  // Cameras
  Camera: new Camera(),
  PerspectiveCamera: new PerspectiveCamera(),
  OrthographicCamera: new OrthographicCamera(),
  ArrayCamera: new ArrayCamera(),
  StereoCamera: new StereoCamera(),
  // Math
  cubicInterpolant: new CubicInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  discreteInterpolant: new DiscreteInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  linearInterpolant: new LinearInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  quaternionLinearInterpolant: new QuaternionLinearInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  triangle: new Triangle(),
  spherical: new Spherical(),
  cylindrical: new Cylindrical(),
  plane: new Plane(),
  frustum: new Frustum(),
  frustumArray: new FrustumArray(),
  sphere: new Sphere(),
  ray: new Ray(),
  matrix2: new Matrix2(),
  matrix3: new Matrix3(),
  matrix4: new Matrix4(),
  box2: new Box2(),
  box3: new Box3(),
  line3: new Line3(),
  euler: new Euler(),
  vector4: new Vector4(),
  vector3: new Vector3(),
  vector2: new Vector2(),
  quaternion: new Quaternion(),
  color: new Color(),
  colorManagement: ColorManagement,
  sphericalHarmonics3: new SphericalHarmonics3(),
}


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
    const selectedOption = exampleOptions.findItemById(exampleOptions.selectedID)

    if (!selectedOption) {
      console.warn('Selected option not found', exampleOptions.selectedID)
      return
    }

    const selectedConstructor = selectedOption.value
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
    exampleOptions.addEventListener('option-selected', this.selectedExampleOptionChanged)
    this.selectedExampleOptionChanged()

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
          ]),

          ioPropertyEditor({id: 'AllClasses', value: allClasses})

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
              {id: 'AllClasses', mode: 'none'},
            ]},
          ],
        }),
      })
    ])
  }
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor
