import {IoInspector, IoProperties} from "../../io-core.js";
import * as CONST from "./__constants.js";

function makeOptions(list) {
  const options = [];
  for (let i = 0; i < list.length; i++) {
    options.push({value: CONST[list[i]], label: list[i]});
  }
  return ['io-option-menu', {'options': options}];
}

const floatSlider = ['io-number-slider', {min: 0, max: 1, step: 0.001}];

const matrixProp = ['io-properties', {
  properties: ['elements'], labeled: false, config: {
    'elements': ['io-matrix']
  }
}];

const propProp = ['io-properties'];

const propConfig = {
  // Basic types
  'type:boolean': ['io-switch'],
  'constructor:Vector2': ['io-vector'],
  'constructor:Vector3': ['io-vector'],
  'constructor:Vector4': ['io-vector'],
  'constructor:Matrix2': matrixProp,
  'constructor:Matrix3': matrixProp,
  'constructor:Matrix4': matrixProp,
  'constructor:Euler': ['io-vector', {step: Math.PI/12, conversion: 180/Math.PI}], // TODO
  'constructor:Quaternion': ['io-vector'],
  'constructor:Color': ['io-color-vector'],
  'scale': ['io-vector', {linkable: true}],
  // Other types
  'constructor:Sphere': propProp, // Temp
  // Object3D
  'Object3D|drawMode': makeOptions(['TrianglesDrawMode', 'TriangleStripDrawMode', 'TriangleFanDrawMode']),
  // BufferGeometry
  'BufferGeometry|constructor:Object': propProp,
  // 'BufferGeometry|index': ['three-attributes'],
  // 'BufferGeometry|attributes': ['three-attributes'],
  // Material
  // 'Material|shininess': ['io-slider', {'min': 0,'max': 100}],
  // 'Material|reflectivity': ['io-slider', {'min': 0,'max': 1}],
  // 'Material|refractionRatio': ['io-slider', {'min': 0,'max': 1}],
  // 'Material|aoMapIntensity': ['io-slider', {'min': 0,'max': 1}],
  // 'Material|lightMapIntensity': ['io-slider', {'min': 0,'max': 1}],
  'Material|opacity': floatSlider,
  'Material|side': makeOptions(['FrontSide', 'BackSide', 'DoubleSide']),
  'Material|shading': makeOptions(['FlatShading', 'SmoothShading']),
  'Material|vertexColors': makeOptions(['NoColors', 'FaceColors', 'VertexColors']),
  'Material|blending': makeOptions(['NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubtractiveBlending', 'MultiplyBlending', 'CustomBlending']),
  'Material|blendEquation': makeOptions(['AddEquation', 'SubtractEquation', 'ReverseSubtractEquation', 'MinEquation', 'MaxEquation']),
  'Material|blendEquationAlpha': makeOptions(['AddEquation', 'SubtractEquation', 'ReverseSubtractEquation', 'MinEquation', 'MaxEquation']),
  'Material|blendSrc': makeOptions(['ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor']),
  'Material|blendDst': makeOptions(['ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor']),
  'Material|blendSrcAlpha': makeOptions(['ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor']),
  'Material|blendDstAlpha': makeOptions(['ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor']),
  'Material|depthFunc': makeOptions(['NeverDepth', 'AlwaysDepth', 'LessDepth', 'LessEqualDepth', 'EqualDepth', 'GreaterEqualDepth', 'GreaterDepth', 'NotEqualDepth']),
  'Material|combine': makeOptions(['MultiplyOperation', 'MixOperation', 'AddOperation']),
  'Material|shadowSide': makeOptions(['BackSide', 'FrontSide', 'DoubleSide']),
  'Material|stencilFunc': makeOptions(['NeverStencilFunc', 'LessStencilFunc', 'EqualStencilFunc', 'LessEqualStencilFunc', 'GreaterStencilFunc', 'NotEqualStencilFunc', 'GreaterEqualStencilFunc', 'AlwaysStencilFunc']),
  'Material|stencilFail': makeOptions(['ZeroStencilOp', 'KeepStencilOp', 'ReplaceStencilOp', 'IncrementStencilOp', 'DecrementStencilOp', 'IncrementWrapStencilOp', 'DecrementWrapStencilOp', 'InvertStencilOp']),
  'Material|stencilZFail': makeOptions(['ZeroStencilOp', 'KeepStencilOp', 'ReplaceStencilOp', 'IncrementStencilOp', 'DecrementStencilOp', 'IncrementWrapStencilOp', 'DecrementWrapStencilOp', 'InvertStencilOp']),
  'Material|stencilZPass': makeOptions(['ZeroStencilOp', 'KeepStencilOp', 'ReplaceStencilOp', 'IncrementStencilOp', 'DecrementStencilOp', 'IncrementWrapStencilOp', 'DecrementWrapStencilOp', 'InvertStencilOp']),
  'Material|depthPacking': makeOptions(['BasicDepthPacking', 'RGBADepthPacking']),
  'Material|normalMapType': makeOptions(['TangentSpaceNormalMap', 'ObjectSpaceNormalMap']),
  // Texture
  'Texture|mapping': makeOptions(['UVMapping', 'CubeReflectionMapping', 'CubeRefractionMapping', 'EquirectangularReflectionMapping', 'EquirectangularRefractionMapping', 'SphericalReflectionMapping', 'CubeUVReflectionMapping', 'CubeUVRefractionMapping']),
  'Texture|wrapS': makeOptions(['RepeatWrapping', 'ClampToEdgeWrapping', 'MirroredRepeatWrapping']),
  'Texture|wrapT': makeOptions(['RepeatWrapping', 'ClampToEdgeWrapping', 'MirroredRepeatWrapping']),
  'Texture|minFilter': makeOptions(['NearestFilter', 'NearestMipMapNearestFilter', 'NearestMipMapLinearFilter', 'LinearFilter', 'LinearMipMapNearestFilter', 'LinearMipMapLinearFilter']),
  'Texture|magFilter': makeOptions(['NearestFilter', 'NearestMipMapNearestFilter', 'NearestMipMapLinearFilter', 'LinearFilter', 'LinearMipMapNearestFilter', 'LinearMipMapLinearFilter']),
  'Texture|type': makeOptions(['UnsignedByteType', 'ByteType', 'ShortType', 'UnsignedShortType', 'IntType', 'UnsignedIntType', 'FloatType', 'HalfFloatType', 'UnsignedShort4444Type', 'UnsignedShort5551Type', 'UnsignedShort565Type', 'UnsignedInt248Type']),
  'Texture|encoding': makeOptions(['LinearEncoding', 'sRGBEncoding', 'GammaEncoding', 'RGBEEncoding', 'LogLuvEncoding', 'RGBM7Encoding', 'RGBM16Encoding', 'RGBDEncoding']),
  'Texture|format': makeOptions(['AlphaFormat', 'RGBFormat', 'RGBAFormat', 'LuminanceFormat', 'LuminanceAlphaFormat', 'RGBEFormat', 'DepthFormat', 'DepthStencilFormat', 'RedFormat', 'RGB_S3TC_DXT1_Format', 'RGBA_S3TC_DXT1_Format', 'RGBA_S3TC_DXT3_Format', 'RGBA_S3TC_DXT5_Format', 'RGB_PVRTC_4BPPV1_Format', 'RGB_PVRTC_2BPPV1_Format', 'RGBA_PVRTC_4BPPV1_Format', 'RGBA_PVRTC_2BPPV1_Format', 'RGB_ETC1_Format', 'RGBA_ASTC_4x4_Format', 'RGBA_ASTC_5x4_Format', 'RGBA_ASTC_5x5_Format', 'RGBA_ASTC_6x5_Format', 'RGBA_ASTC_6x6_Format', 'RGBA_ASTC_8x5_Format', 'RGBA_ASTC_8x6_Format', 'RGBA_ASTC_8x8_Format', 'RGBA_ASTC_10x5_Format', 'RGBA_ASTC_10x6_Format', 'RGBA_ASTC_10x8_Format', 'RGBA_ASTC_10x10_Format', 'RGBA_ASTC_12x10_Format', 'RGBA_ASTC_12x12_Format']),
  'Texture|unpackAlignment': makeOptions(['1', '2', '4', '8']),
  // TODO // FrontFaceDirectionCW, FrontFaceDirectionCCW, CullFaceNone, CullFaceBack, CullFaceFront, CullFaceFrontBack
  'WebGLRenderer|toneMapping': makeOptions(['NoToneMapping', 'LinearToneMapping', 'ReinhardToneMapping', 'Uncharted2ToneMapping', 'CineonToneMapping', 'ACESFilmicToneMapping']),
  'WebGLShadowMap|type': makeOptions(['BasicShadowMap', 'PCFShadowMap', 'PCFSoftShadowMap', 'VSMShadowMap']),
  // TODO // ZeroCurvatureEnding, ZeroSlopeEnding, WrapAroundEnding
  'AnimationAction|loop': makeOptions(['LoopOnce', 'LoopRepeat', 'LoopPingPong']),
  'KeyframeTrack|loop': makeOptions(['InterpolateDiscrete', 'InterpolateLinear', 'InterpolateSmooth']),

  // Camera
  "Camera|fov": ["io-number-slider", {min: 0.001, max: 180, step: 1}],
  "Camera|zoom": ["io-number-slider", {min: 0.001, max: 100}],
  "Camera|near": ["io-number-slider", {min: 0.001, max: 100000}], // TODO: log
  "Camera|far": ["io-number-slider", {min: 0.001, max: 100000}], // TODO: log
};

export class IoThreeInspector extends IoInspector {
  static get Properties() {
    return {
      autoExpand: ['properties', 'transform', 'rendering'],
    };
  }
  static get Config() {
    return propConfig;
  }
  static get Groups() {
    return {
      'Object|properties': ['name', 'visible', 'userData'],
      
      'Object3D|properties': ['name', 'parent', 'children', 'material', 'geometry'],
      'Object3D|transform': ['position', 'rotation', 'scale', 'quaternion', 'up', /update/i],
      'Object3D|rendering': ['layers', /shadow/i, 'renderOrder', 'frustumCulled', 'background', 'fog', 'overrideMaterial', 'drawMode'],
      'Object3D|matrices': [/matrix/i],
      
      'BufferGeometry|properties': ['boundingBox', 'boundingSphere', 'groups'],
      'BufferGeometry|attributes': ['index', 'attributes', 'morphAttributes', 'drawRange'], 
      
      'Material|properties': ['transparent', 'opacity', 'color'], 
      'Material|rendering': [
        'side', 'fog', 'lights', 'flatShading', 'vertexTangents', /blend/i, /stencil/i, /depth/i,
        'dithering', 'vertexColors', 'toneMapped', 'premultipliedAlpha', 'alphaTest', 'colorWrite',
        'clipIntersection', 'clippingPlanes',
      ], 
      'Material|shadows': [/shadow/i],
      'Material|wireframe': [/line/i],      
      'Material|advanced': [/polygon/i, 'precision', 'program'],      

      'Object|advanced': ['needsUpdate'],
      'Object|hidden': [/^is/, 'type', 'id', 'uuid'],
      // TODO
    };
  }
  selectedMutated() {
    this.dispatchEvent('change');
  }
}

IoProperties.RegisterConfig(propConfig);

IoThreeInspector.Register();

IoThreeInspector.RegisterGroups({
  'Array|values': [/^[0-9]+$/],
  'Object|other': [/^/],
});

