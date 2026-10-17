import { Register, ReactiveElement } from '@io-gui/core'
import { ioPropertyEditor } from '@io-gui/editors'
import { ioLayout, Layout } from '@io-gui/layout'
import * as THREE from 'three/webgpu'

const renderer = new THREE.WebGPURenderer()
const compressedCubeImages = Array.from({length: 6}, () => new THREE.CompressedTexture([], 16, 16))

export const allClasses = {
  Math: {
    color: new THREE.Color(),
    colorManagement: THREE.ColorManagement,
    vector2: new THREE.Vector2(),
    vector3: new THREE.Vector3(),
    vector4: new THREE.Vector4(),
    quaternion: new THREE.Quaternion(),
    euler: new THREE.Euler(),
    matrix2: new THREE.Matrix2(),
    matrix3: new THREE.Matrix3(),
    matrix4: new THREE.Matrix4(),
    box2: new THREE.Box2(),
    box3: new THREE.Box3(),
    line3: new THREE.Line3(),
    plane: new THREE.Plane(),
    ray: new THREE.Ray(),
    sphere: new THREE.Sphere(),
    spherical: new THREE.Spherical(),
    cylindrical: new THREE.Cylindrical(),
    triangle: new THREE.Triangle(),
    frustum: new THREE.Frustum(),
    frustumArray: new THREE.FrustumArray(),
    sphericalHarmonics3: new THREE.SphericalHarmonics3(),
    bezierInterpolant: new THREE.BezierInterpolant(new Float32Array([0, 1, 2]), new Float32Array([1, 11, 2, 22, 3, 33]), 2, new Float32Array(2)),
    cubicInterpolant: new THREE.CubicInterpolant(new Float32Array([0, 1, 2]), new Float32Array([1, 11, 2, 22, 3, 33]), 2, new Float32Array(2)),
    discreteInterpolant: new THREE.DiscreteInterpolant(new Float32Array([0, 1, 2]), new Float32Array([1, 11, 2, 22, 3, 33]), 2, new Float32Array(2)),
    linearInterpolant: new THREE.LinearInterpolant(new Float32Array([0, 1, 2]), new Float32Array([1, 11, 2, 22, 3, 33]), 2, new Float32Array(2)),
    quaternionLinearInterpolant: new THREE.QuaternionLinearInterpolant(new Float32Array([0, 1, 2]), new Float32Array([1, 11, 2, 22, 3, 33]), 2, new Float32Array(2)),
  },
  Core: {
    eventDispatcher: new THREE.EventDispatcher(),
    object3D: new THREE.Object3D(),
    clock: new THREE.Clock(),
    timer: new THREE.Timer(),
    layers: new THREE.Layers(),
    raycaster: new THREE.Raycaster(),
    bufferAttribute: new THREE.BufferAttribute(new Float32Array(12), 3),
    instancedBufferAttribute: new THREE.InstancedBufferAttribute(new Float32Array(12), 3),
    interleavedBuffer: new THREE.InterleavedBuffer(new Float32Array(12), 3),
    instancedInterleavedBuffer: new THREE.InstancedInterleavedBuffer(new Float32Array(12), 3),
    interleavedBufferAttribute: new THREE.InterleavedBufferAttribute(new THREE.InterleavedBuffer(new Float32Array(12), 3), 3, 0),
    bufferGeometry: new THREE.BufferGeometry(),
    instancedBufferGeometry: new THREE.InstancedBufferGeometry(),
    uniform: new THREE.Uniform(0),
    uniformsGroup: new THREE.UniformsGroup(),
    renderTarget: new THREE.RenderTarget(16, 16),
    renderTarget3D: new THREE.RenderTarget3D(16, 16, 4),
  },
  ScenesAndCameras: {
    scene: new THREE.Scene(),
    fog: new THREE.Fog(0x000000, 10, 100),
    fogExp2: new THREE.FogExp2(0x000000, 0.002),
    camera: new THREE.Camera(),
    perspectiveCamera: new THREE.PerspectiveCamera(),
    orthographicCamera: new THREE.OrthographicCamera(),
    arrayCamera: new THREE.ArrayCamera(),
    stereoCamera: new THREE.StereoCamera(),
  },
  AnimationAndAudio: {
    animationClip: new THREE.AnimationClip('test', 1, []),
    animationMixer: new THREE.AnimationMixer(new THREE.Object3D()),
    animationObjectGroup: new THREE.AnimationObjectGroup(),
    numberKeyframeTrack: new THREE.NumberKeyframeTrack('.position[x]', [0, 1], [0, 1]),
    vectorKeyframeTrack: new THREE.VectorKeyframeTrack('.position', [0, 1], [0, 0, 0, 1, 1, 1]),
    colorKeyframeTrack: new THREE.ColorKeyframeTrack('.material.color', [0, 1], [1, 0, 0, 0, 1, 0]),
    quaternionKeyframeTrack: new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1], [0, 0, 0, 1, 0, 0, 1, 0]),
    booleanKeyframeTrack: new THREE.BooleanKeyframeTrack('.visible', [0, 1], [true, false]),
    stringKeyframeTrack: new THREE.StringKeyframeTrack('.name', [0, 1], ['start', 'end']),
    audioListener: new THREE.AudioListener(),
    audio: new THREE.Audio(new THREE.AudioListener()),
    positionalAudio: new THREE.PositionalAudio(new THREE.AudioListener()),
    audioAnalyser: new THREE.AudioAnalyser(new THREE.Audio(new THREE.AudioListener()), 32),
  },
  Geometries: {
    boxGeometry: new THREE.BoxGeometry(),
    capsuleGeometry: new THREE.CapsuleGeometry(),
    circleGeometry: new THREE.CircleGeometry(),
    coneGeometry: new THREE.ConeGeometry(),
    cylinderGeometry: new THREE.CylinderGeometry(),
    dodecahedronGeometry: new THREE.DodecahedronGeometry(),
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
  },
  ObjectsAndLights: {
    mesh: new THREE.Mesh(),
    skinnedMesh: new THREE.SkinnedMesh(),
    instancedMesh: new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 2),
    batchedMesh: new THREE.BatchedMesh(2, 12, 12),
    group: new THREE.Group(),
    clippingGroup: new THREE.ClippingGroup(),
    line: new THREE.Line(),
    lineSegments: new THREE.LineSegments(),
    lineLoop: new THREE.LineLoop(),
    points: new THREE.Points(),
    sprite: new THREE.Sprite(),
    bone: new THREE.Bone(),
    skeleton: new THREE.Skeleton(),
    lod: new THREE.LOD(),
    ambientLight: new THREE.AmbientLight(),
    directionalLight: new THREE.DirectionalLight(),
    hemisphereLight: new THREE.HemisphereLight(),
    pointLight: new THREE.PointLight(),
    spotLight: new THREE.SpotLight(),
    rectAreaLight: new THREE.RectAreaLight(),
    lightProbe: new THREE.LightProbe(),
    projectorLight: new THREE.ProjectorLight(),
    iesSpotLight: new THREE.IESSpotLight(),
    directionalLightShadow: new THREE.DirectionalLight().shadow,
    pointLightShadow: new THREE.PointLight().shadow,
    spotLightShadow: new THREE.SpotLight().shadow,
  },
  Textures: {
    textureSource: new THREE.TextureSource(null),
    texture: new THREE.Texture(),
    canvasTexture: new THREE.CanvasTexture(document.createElement('canvas')),
    htmlTexture: new THREE.HTMLTexture(document.createElement('div')),
    videoTexture: new THREE.VideoTexture(document.createElement('video')),
    videoFrameTexture: new THREE.VideoFrameTexture(),
    cubeTexture: new THREE.CubeTexture(),
    dataTexture: new THREE.DataTexture(new Uint8Array(16), 2, 2),
    data3DTexture: new THREE.Data3DTexture(new Uint8Array(8), 2, 2, 2),
    dataArrayTexture: new THREE.DataArrayTexture(new Uint8Array(8), 2, 2, 2),
    depthTexture: new THREE.DepthTexture(16, 16),
    compressedTexture: new THREE.CompressedTexture([], 16, 16),
    compressedArrayTexture: new THREE.CompressedArrayTexture([], 16, 16, 2, THREE.RGBA_S3TC_DXT1_Format),
    compressedCubeTexture: new THREE.CompressedCubeTexture(compressedCubeImages),
    cubeDepthTexture: new THREE.CubeDepthTexture(16),
    framebufferTexture: new THREE.FramebufferTexture(16, 16),
    externalTexture: new THREE.ExternalTexture(),
  },
  Renderers: {
    renderer,
    renderPipeline: new THREE.RenderPipeline(renderer),
    bundleGroup: new THREE.BundleGroup(),
    canvasTarget: new THREE.CanvasTarget(document.createElement('canvas')),
    quadMesh: new THREE.QuadMesh(new THREE.MeshBasicNodeMaterial()),
    inspectorBase: new THREE.InspectorBase(),
    storageTexture: new THREE.StorageTexture(16, 16),
    storage3DTexture: new THREE.Storage3DTexture(8, 8, 8),
    storageArrayTexture: new THREE.StorageArrayTexture(8, 8, 2),
    storageBufferAttribute: new THREE.StorageBufferAttribute(4, 4),
    storageInstancedBufferAttribute: new THREE.StorageInstancedBufferAttribute(4, 4),
    indirectStorageBufferAttribute: new THREE.IndirectStorageBufferAttribute(new Uint32Array(4), 4),
  },
}

const editorConfigsLayout = new Layout({
  child: {
    type: 'split',
    children: [
      {
        type: 'panel',
        tabs: [
          {id: 'Math'},
          {id: 'Core'},
          {id: 'ScenesAndCameras'},
          {id: 'AnimationAndAudio'},
        ],
      },
      {
        type: 'panel',
        tabs: [
          {id: 'Geometries'},
          {id: 'ObjectsAndLights'},
          {id: 'Textures'},
          {id: 'Renderers'},
        ],
      },
    ],
  },
})

@Register
export class ThreeEditorConfigs extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 auto;
        min-width: 0;
        min-height: 0;
      }
    `
  }

  override ready() {
    this.render([
      ioLayout({
        model: editorConfigsLayout,
        elements: Object.entries(allClasses).map(([id, value]) => ioPropertyEditor({id, value})),
      }),
    ])
  }
}

export const threeEditorConfigs = () => ThreeEditorConfigs.vConstructor()
