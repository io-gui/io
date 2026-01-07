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

import * as THREE from 'three/webgpu'

const version = 5

const split = new Split({
  type: 'split',
  orientation: 'horizontal',
  children: [
    {
      type: 'panel',
      flex: '1 0 380px',
      tabs: [
        {id: 'AllClasses'},
      ],
    },
    {
      type: 'split',
      orientation: 'vertical',
      children: [
        {
          type: 'split',
          orientation: 'horizontal',
          children: [
            {type: 'panel', tabs: [
              {id: 'Top'},
            ]},
            {type: 'panel', tabs: [
              {id: 'Front'},
            ]},
          ]
        },
        {
          type: 'split',
          orientation: 'horizontal',
          children: [
            {type: 'panel', tabs: [
              {id: 'Left'},
            ]},
            {type: 'panel', tabs: [
              {id: 'Perspective'},
              {id: 'SceneCamera'},
            ]},
          ]
        },
      ]
    },
    {
      type: 'panel',
      flex: '1 0 380px',
      tabs: [
        {id: 'ExampleSelector'},
      ],
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
  // Core
  bufferAttribute: new THREE.BufferAttribute(new Float32Array(100), 1),
  BufferGeometry: new THREE.BufferGeometry(),
  clock: new THREE.Clock(),
  instancedBufferAttribute: new THREE.InstancedBufferAttribute(new Float32Array(100), 1),
  instancedBufferGeometry: new THREE.InstancedBufferGeometry(),
  instancedInterleavedBuffer: new THREE.InstancedInterleavedBuffer(new Float32Array(100), 1),
  interleavedBuffer: new THREE.InterleavedBuffer(new Float32Array(100), 1),
  interleavedBufferAttribute: new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(new Float32Array(100), 1), 3, 0, false),
  layers: new THREE.Layers(),
  object3d: new THREE.Object3D(),
  Raycaster: new THREE.Raycaster(),
  renderTarget: new THREE.RenderTarget(100, 100),
  renderTarget3D: new THREE.RenderTarget3D(100, 100, 100),
  timer: new THREE.Timer(),

  // Scenes
  scene: new THREE.Scene(),
  fog: new THREE.Fog(0x000000, 10, 100),
  fogExp2: new THREE.FogExp2(0x000000, 0.002),

  // Cameras
  Camera: new THREE.Camera(),
  PerspectiveCamera: new THREE.PerspectiveCamera(),
  OrthographicCamera: new THREE.OrthographicCamera(),
  ArrayCamera: new THREE.ArrayCamera(),
  StereoCamera: new THREE.StereoCamera(),

  // Audio
  audioListener: new THREE.AudioListener(),
  audio: new THREE.Audio(new THREE.AudioListener()),
  positionalAudio: new THREE.PositionalAudio(new THREE.AudioListener()),
  audioAnalyser: new THREE.AudioAnalyser(new THREE.Audio(new THREE.AudioListener()), 32),

  // Animation
  animationClip: new THREE.AnimationClip('test', 1, []),
  animationObjectGroup: new THREE.AnimationObjectGroup(),
  numberKeyframeTrack: new THREE.NumberKeyframeTrack('.position[x]', [0, 1, 2], [0, 5, 0]),
  vectorKeyframeTrack: new THREE.VectorKeyframeTrack('.position', [0, 1, 2], [0, 0, 0, 5, 5, 5, 0, 0, 0]),
  colorKeyframeTrack: new THREE.ColorKeyframeTrack('.material.color', [0, 1, 2], [1, 0, 0, 0, 1, 0, 0, 0, 1]),
  quaternionKeyframeTrack: new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1], [0, 0, 0, 1, 0, 0, 0.707, 0.707]),
  booleanKeyframeTrack: new THREE.BooleanKeyframeTrack('.visible', [0, 1], [true, false]),
  stringKeyframeTrack: new THREE.StringKeyframeTrack('.name', [0, 1], ['start', 'end']),

  // Math
  cubicInterpolant: new THREE.CubicInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  discreteInterpolant: new THREE.DiscreteInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  linearInterpolant: new THREE.LinearInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  quaternionLinearInterpolant: new THREE.QuaternionLinearInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] ),
  triangle: new THREE.Triangle(),
  spherical: new THREE.Spherical(),
  cylindrical: new THREE.Cylindrical(),
  plane: new THREE.Plane(),
  frustum: new THREE.Frustum(),
  frustumArray: new THREE.FrustumArray(),
  sphere: new THREE.Sphere(),
  ray: new THREE.Ray(),
  matrix2: new THREE.Matrix2(),
  matrix3: new THREE.Matrix3(),
  matrix4: new THREE.Matrix4(),
  box2: new THREE.Box2(),
  box3: new THREE.Box3(),
  line3: new THREE.Line3(),
  euler: new THREE.Euler(),
  vector4: new THREE.Vector4(),
  vector3: new THREE.Vector3(),
  vector2: new THREE.Vector2(),
  quaternion: new THREE.Quaternion(),
  color: new THREE.Color(),
  colorManagement: THREE.ColorManagement,
  sph3: new THREE.SphericalHarmonics3(),

  // Geometries
  boxGeometry: new THREE.BoxGeometry( 1, 1, 1 ),
  capsuleGeometry: new THREE.CapsuleGeometry( 1, 1, 10 ),
  circleGeometry: new THREE.CircleGeometry( 1, 10 ),
  coneGeometry: new THREE.ConeGeometry( 1, 1, 10 ),
  cylinderGeometry: new THREE.CylinderGeometry( 1, 1, 10 ),
  dodecahedronGeometry: new THREE.DodecahedronGeometry( 1 ),
  edgesGeometry: new THREE.EdgesGeometry(),
  extrudeGeometry: new THREE.ExtrudeGeometry(),
  icosahedronGeometry: new THREE.IcosahedronGeometry(),
  latheGeometry: new THREE.LatheGeometry(),
  octahedronGeometry: new THREE.OctahedronGeometry(),
  planeGeometry: new THREE.PlaneGeometry(),
  polyhedronGeometry: new THREE.PolyhedronGeometry(),
  ringGeometry: new THREE.RingGeometry(),
  shapeGeometry: new THREE.ShapeGeometry(),
  sphereGeometry: new THREE.SphereGeometry(),
  tetrahedronGeometry: new THREE.TetrahedronGeometry(),
  torusGeometry: new THREE.TorusGeometry(),
  torusKnotGeometry: new THREE.TorusKnotGeometry(),
  tubeGeometry: new THREE.TubeGeometry(),
  wireframeGeometry: new THREE.WireframeGeometry(),

  // Lights
  ambientLight: new THREE.AmbientLight(),
  directionalLight: new THREE.DirectionalLight(),
  hemisphereLight: new THREE.HemisphereLight(),
  iesSpotLight: new THREE.IESSpotLight(),
  lightProbe: new THREE.LightProbe(),
  pointLight: new THREE.PointLight(),
  projectorLight: new THREE.ProjectorLight(),
  rectAreaLight: new THREE.RectAreaLight(),
  spotLight: new THREE.SpotLight(),

  // Objects
  batchedMesh: new THREE.BatchedMesh(10, 1000, 2000),
  bone: new THREE.Bone(),
  clippingGroup: new THREE.ClippingGroup(),
  group: new THREE.Group(),
  instancedMesh: new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 10),
  line: new THREE.Line(),
  lineLoop: new THREE.LineLoop(),
  lineSegments: new THREE.LineSegments(),
  lod: new THREE.LOD(),
  mesh: new THREE.Mesh(),
  points: new THREE.Points(),
  skeleton: new THREE.Skeleton(),
  skinnedMesh: new THREE.SkinnedMesh(),
  sprite: new THREE.Sprite(),

  // Textures
  canvasTexture: new THREE.CanvasTexture(document.createElement('canvas')),
  compressedArrayTexture: new THREE.CompressedArrayTexture([], 16, 16, 4, THREE.RGBA_S3TC_DXT1_Format),
  compressedCubeTexture: new THREE.CompressedCubeTexture([
    new THREE.CanvasTexture(document.createElement('canvas')),
    new THREE.CanvasTexture(document.createElement('canvas')),
    new THREE.CanvasTexture(document.createElement('canvas')),
    new THREE.CanvasTexture(document.createElement('canvas')),
    new THREE.CanvasTexture(document.createElement('canvas')),
    new THREE.CanvasTexture(document.createElement('canvas')),
  ], THREE.RGBA_S3TC_DXT1_Format),
  compressedTexture: new THREE.CompressedTexture([], 16, 16),
  cubeTexture: new THREE.CubeTexture(),
  data3DTexture: new THREE.Data3DTexture(new Float64Array(16 * 16 * 16), 16, 16, 16),
  dataArrayTexture: new THREE.DataArrayTexture(new Float64Array(16 * 16), 16, 16, 1),
  dataTexture: new THREE.DataTexture(new Uint8Array(16 * 16 * 4), 16, 16),
  depthTexture: new THREE.DepthTexture(256, 256),
  externalTexture: new THREE.ExternalTexture(),
  framebufferTexture: new THREE.FramebufferTexture(256, 256),
  source: new THREE.Source(null),
  texture: new THREE.Texture(),
  videoTexture: new THREE.VideoTexture(document.createElement('video')),

  // Renderers
  bundleGroup: new THREE.BundleGroup(),
  canvasTarget: new THREE.CanvasTarget(document.createElement('canvas')),
  indirectStorageBufferAttribute: new THREE.IndirectStorageBufferAttribute(new Uint32Array(16), 4),
  inspectorBase: new THREE.InspectorBase(),
  postProcessing: new THREE.PostProcessing( new THREE.WebGPURenderer() ),
  quadMesh: new THREE.QuadMesh(),
  storageTexture: new THREE.StorageTexture(256, 256),
  storage3DTexture: new THREE.Storage3DTexture(64, 64, 64),
  storageArrayTexture: new THREE.StorageArrayTexture(128, 128, 8),
  storageBufferAttribute: new THREE.StorageBufferAttribute(100, 4),
  storageInstancedBufferAttribute: new THREE.StorageInstancedBufferAttribute(100, 4),
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

          div({id: 'ExampleSelector'}, [
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
              {id: 'ExampleSelector', mode: 'none'},
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
