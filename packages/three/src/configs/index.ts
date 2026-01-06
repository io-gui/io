import { registerEditorGroups } from '@io-gui/editors'

/**
 * This is a root ui config file for three.js EditorConfig's and EditorGroup's
 * It imports all the configs for all of three.js classes.
 * Each class config registers itself with the io-gui/editors.
 * It assigns default editors for its properties and groups them into categories.
 */

/**
 * The following imports should correspond to all the classes available in three.js.
 * Commented out classes are not yet configured for the io-gui/editors package.
 * If a class is uncommented, it should have a corresponding config file in the same directory.
 */

// Note: Classes must be imported in order of their inheritance!

// import './renderers/WebGLArrayRenderTarget.js';
// import './renderers/WebGL3DRenderTarget.js';
// import './renderers/WebGLCubeRenderTarget.js';
// import './renderers/WebGLRenderTarget.js';
// import './renderers/webxr/WebXRController.js';
import './scenes/FogExp2.js'
import './scenes/Fog.js'
import './core/Object3D.js'
import './scenes/Scene.js'
import './objects/Mesh.js'
import './objects/SkinnedMesh.js'
import './objects/InstancedMesh.js'
import './objects/BatchedMesh.js'
import './objects/Group.js'
import './objects/ClippingGroup.js'
import './objects/Line.js'
import './objects/LineSegments.js'
import './objects/LineLoop.js'
import './objects/Points.js'
import './objects/Sprite.js'
import './objects/Bone.js'
import './objects/Skeleton.js'
import './objects/LOD.js'
import './textures/Source.js'
import './textures/Texture.js'
import './textures/CanvasTexture.js'
import './textures/VideoTexture.js'
import './textures/CubeTexture.js'
import './textures/DataTexture.js'
import './textures/Data3DTexture.js'
import './textures/DataArrayTexture.js'
import './textures/DepthTexture.js'
import './textures/CubeDepthTexture.js'
import './textures/CompressedTexture.js'
import './textures/CompressedArrayTexture.js'
import './textures/CompressedCubeTexture.js'
import './textures/FramebufferTexture.js'
import './textures/ExternalTexture.js'
// import './textures/VideoFrameTexture.js'
import './geometries/BoxGeometry.js'
import './geometries/SphereGeometry.js'
import './geometries/PlaneGeometry.js'
import './geometries/CylinderGeometry.js'
import './geometries/ConeGeometry.js'
import './geometries/TorusGeometry.js'
import './geometries/TorusKnotGeometry.js'
import './geometries/RingGeometry.js'
import './geometries/CircleGeometry.js'
import './geometries/CapsuleGeometry.js'
import './geometries/LatheGeometry.js'
import './geometries/TubeGeometry.js'
import './geometries/ExtrudeGeometry.js'
import './geometries/ShapeGeometry.js'
import './geometries/PolyhedronGeometry.js'
import './geometries/IcosahedronGeometry.js'
import './geometries/OctahedronGeometry.js'
import './geometries/TetrahedronGeometry.js'
import './geometries/DodecahedronGeometry.js'
import './geometries/EdgesGeometry.js'
import './geometries/WireframeGeometry.js'
// import './materials/Materials.js';
// import './loaders/AnimationLoader.js';
// import './loaders/CompressedTextureLoader.js';
// import './loaders/CubeTextureLoader.js';
// import './loaders/DataTextureLoader.js';
// import './loaders/TextureLoader.js';
// import './loaders/ObjectLoader.js';
// import './loaders/MaterialLoader.js';
// import './loaders/BufferGeometryLoader.js';
// import './loaders/LoadingManager.js';
// import './loaders/ImageLoader.js';
// import './loaders/ImageBitmapLoader.js';
// import './loaders/FileLoader.js';
// import './loaders/Loader.js';
// import './loaders/LoaderUtils.js';
// import './loaders/Cache.js';
// import './loaders/AudioLoader.js';
import './lights/Light.js'
import './lights/AmbientLight.js'
import './lights/DirectionalLight.js'
import './lights/HemisphereLight.js'
import './lights/PointLight.js'
import './lights/SpotLight.js'
import './lights/RectAreaLight.js'
import './lights/LightProbe.js'
import './lights/LightShadow.js'
import './lights/DirectionalLightShadow.js'
import './lights/PointLightShadow.js'
import './lights/SpotLightShadow.js'
import './cameras/Camera.js'
import './cameras/StereoCamera.js'
import './cameras/PerspectiveCamera.js'
import './cameras/OrthographicCamera.js'
import './cameras/CubeCamera.js'
import './cameras/ArrayCamera.js'
import './audio/AudioListener.js'
import './audio/Audio.js'
import './audio/PositionalAudio.js'
import './audio/AudioContext.js'
import './audio/AudioAnalyser.js'
import './animation/KeyframeTrack.js'
import './animation/tracks/VectorKeyframeTrack.js'
import './animation/tracks/StringKeyframeTrack.js'
import './animation/tracks/QuaternionKeyframeTrack.js'
import './animation/tracks/NumberKeyframeTrack.js'
import './animation/tracks/ColorKeyframeTrack.js'
import './animation/tracks/BooleanKeyframeTrack.js'
import './animation/PropertyMixer.js'
import './animation/PropertyBinding.js'
import './animation/AnimationUtils.js'
import './animation/AnimationObjectGroup.js'
import './animation/AnimationMixer.js'
import './animation/AnimationClip.js'
import './animation/AnimationAction.js'
import './core/EventDispatcher.js'
import './core/Clock.js'
import './core/Timer.js'
import './core/Layers.js'
import './core/Raycaster.js'
import './core/BufferAttribute.js'
import './core/InstancedBufferAttribute.js'
import './core/GLBufferAttribute.js'
import './core/InterleavedBuffer.js'
import './core/InstancedInterleavedBuffer.js'
import './core/InterleavedBufferAttribute.js'
import './core/BufferGeometry.js'
import './core/InstancedBufferGeometry.js'
import './core/Uniform.js'
import './core/UniformsGroup.js'
import './core/RenderTarget.js'
import './core/RenderTarget3D.js'
import './math/Interpolant.js'
import './math/interpolants/QuaternionLinearInterpolant.js'
import './math/interpolants/LinearInterpolant.js'
import './math/interpolants/DiscreteInterpolant.js'
import './math/interpolants/CubicInterpolant.js'
import './math/Triangle.js'
// import './math/MathUtils.js';
import './math/Spherical.js'
import './math/Cylindrical.js'
import './math/Plane.js'
import './math/Frustum.js'
import './math/FrustumArray.js'
import './math/Sphere.js'
import './math/Ray.js'
import './math/Matrix2.js'
import './math/Matrix3.js'
import './math/Matrix4.js'
import './math/Box2.js'
import './math/Box3.js'
import './math/Line3.js'
import './math/Euler.js'
import './math/Vector4.js'
import './math/Vector3.js'
import './math/Vector2.js'
import './math/Quaternion.js'
import './math/Color.js'
import './math/ColorManagement.js'
import './math/SphericalHarmonics3.js'

// import './helpers/SpotLightHelper.js';
// import './helpers/SkeletonHelper.js';
// import './helpers/PointLightHelper.js';
// import './helpers/HemisphereLightHelper.js';
// import './helpers/GridHelper.js';
// import './helpers/PolarGridHelper.js';
// import './helpers/DirectionalLightHelper.js';
// import './helpers/CameraHelper.js';
// import './helpers/BoxHelper.js';
// import './helpers/Box3Helper.js';
// import './helpers/PlaneHelper.js';
// import './helpers/ArrowHelper.js';
// import './helpers/AxesHelper.js';
// import './extras/curves/Curves.js';
// import './extras/core/Shape.js';
// import './extras/core/Path.js';
// import './extras/core/ShapePath.js';
// import './extras/core/CurvePath.js';
// import './extras/core/Curve.js';
// import './extras/Controls.js';
// import './extras/DataUtils.js';
// import './extras/ImageUtils.js';
// import './extras/ShapeUtils.js';
// import './extras/TextureUtils.js';
// import './utils.js';

// import './materials/nodes/NodeMaterials.js';
import './renderers/WebGPURenderer.js'
// import './renderers/webgpu/WebGPURenderer.Nodes.js';
import './renderers/common/Lighting.js'
import './renderers/common/BundleGroup.js'
import './renderers/common/CanvasTarget.js'
import './renderers/common/QuadMesh.js'
// import './renderers/common/extras/PMREMGenerator.js';
import './renderers/common/PostProcessing.js'
import './renderers/common/InspectorBase.js'
// import './renderers/common/RendererUtils.js';
import './renderers/common/StorageTexture.js'
import './renderers/common/Storage3DTexture.js'
import './renderers/common/StorageArrayTexture.js'
import './renderers/common/StorageBufferAttribute.js'
import './renderers/common/StorageInstancedBufferAttribute.js'
import './renderers/common/IndirectStorageBufferAttribute.js'
import './lights/webgpu/IESSpotLight.js'
import './lights/webgpu/ProjectorLight.js'
// import './loaders/nodes/NodeLoader.js';
// import './loaders/nodes/NodeObjectLoader.js';
// import './loaders/nodes/NodeMaterialLoader.js';
// import './objects/ClippingGroup.js';
// import './nodes/Nodes.js';
// import './nodes/TSL.js';

/**
 * By default, we hide all properties that start with 'is' followed by an uppercase letter.
 * This is to avoid cluttering the inspector with "isObject3D", "isMesh", "isMaterial", etc.
 */

registerEditorGroups(Object, {
  Advanced: ['id', 'uuid', 'type', 'userData'],
  Hidden: [new RegExp(/^is[A-Z0-9]/), '_listeners']
})