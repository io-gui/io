import {Io} from "./io/io.js"
import {html} from "./io/ioutil.js"
import {IoObject} from "./io/io-object/io-object.js"
import {IoInspector} from "./io/io-inspector/io-inspector.js"
import {IoOption} from "./io/io-option/io-option.js"

import * as THREE from "../lib/three.module.js"

export class ThreeApp extends Io {
  static get is() { return 'three-app'; }
  static get template() {
    return html`
      <style>
      :host {
        font-family: "Lucida Grande", sans-serif;
      }
      div.demo > io-value,
      div.demo > io-object {
        border: 1px solid #eee;
        vertical-align: top;
      }
      </style>
    `;
  }
  connectedCallback() {
    this.render([
      ['div', {className: 'demo'}, [
        ['h3', 'io-inspector'],
        ['io-object', {value: new THREE.Light()}],
        ['io-inspector']
      ]],
      ['div', {className: 'demo'}, [
        ['h3', 'io-object'],
        ['io-object', {value: new THREE.SphereBufferGeometry()}],
        ['io-object', {value: new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshDepthMaterial()) }],
        ['io-object', {value: new THREE.WebGLRenderer()}],
        ['io-object', {value: new THREE.Texture()}]
      ]]
    ], this.shadowRoot);
  }
}

customElements.define(ThreeApp.is, ThreeApp);

function setOptionGroups(namespace, className, key, options) {
  let o = []
  IoObject.CLASSES[className] = namespace[className];
  IoObject.CONFIG['instanceof:' + className] = IoObject.CONFIG['instanceof:' + className] || {}
  IoObject.CONFIG['instanceof:' + className]['key:' + key] = { tag: 'io-option', props: { options: o } };
  for (var i = 0; i < options.length; i++) {
    if (typeof options[i] === 'string') {
      o.push({ value: namespace[options[i]], label: options[i]});
    } else if (options[i] instanceof Array) {
      o.push({ value: options[i][0], label: options[i][1]});
    }
  }
}

setOptionGroups(THREE, 'WebGLRenderer', 'toneMapping', [
  'NoToneMapping', 'LinearToneMapping', 'ReinhardToneMapping',
  'Uncharted2ToneMapping', 'CineonToneMapping'
]);

setOptionGroups(THREE, 'WebGLShadowMap', 'type', [
  'BasicShadowMap', 'PCFShadowMap', 'PCFSoftShadowMap'
]);

setOptionGroups(THREE, 'MeshDepthMaterial', 'depthPacking', [
  'BasicDepthPacking', 'RGBADepthPacking'
]);

setOptionGroups(THREE, 'Texture', 'mapping', [
  'UVMapping', 'CubeReflectionMapping', 'CubeRefractionMapping',
  'EquirectangularReflectionMapping', 'EquirectangularRefractionMapping',
  'SphericalReflectionMapping', 'CubeUVReflectionMapping', 'CubeUVRefractionMapping'
]);

setOptionGroups(THREE, 'Texture', 'minFilter', [
  'NearestFilter', 'NearestMipMapNearestFilter', 'NearestMipMapLinearFilter',
  'LinearFilter', 'LinearMipMapNearestFilter', 'LinearMipMapLinearFilter'
]);

setOptionGroups(THREE, 'Texture', 'magFilter', [
  'NearestFilter', 'NearestMipMapNearestFilter', 'NearestMipMapLinearFilter',
  'LinearFilter', 'LinearMipMapNearestFilter', 'LinearMipMapLinearFilter'
]);

setOptionGroups(THREE, 'Texture', 'wrapS', [
  'RepeatWrapping', 'ClampToEdgeWrapping', 'MirroredRepeatWrapping'
]);

setOptionGroups(THREE, 'Texture', 'wrapT', [
  'RepeatWrapping', 'ClampToEdgeWrapping', 'MirroredRepeatWrapping'
]);
setOptionGroups(THREE, 'Texture', 'encoding', [
  'LinearEncoding', 'sRGBEncoding', 'GammaEncoding', 'RGBEEncoding',
  'LogLuvEncoding', 'RGBM7Encoding', 'RGBM16Encoding', 'RGBDEncoding'
]);
setOptionGroups(THREE, 'Texture', 'type', [
  'UnsignedByteType', 'ByteType', 'ShortType', 'UnsignedShortType', 'IntType',
  'UnsignedIntType', 'FloatType', 'HalfFloatType', 'UnsignedShort4444Type',
  'UnsignedShort5551Type', 'UnsignedShort565Type', 'UnsignedInt248Type'
]);
setOptionGroups(THREE, 'Texture', 'format', [
  'AlphaFormat', 'RGBFormat', 'RGBAFormat', 'LuminanceFormat', 'LuminanceAlphaFormat',
  'RGBEFormat', 'DepthFormat', 'DepthStencilFormat', 'RGB_S3TC_DXT1_Format',
  'RGBA_S3TC_DXT1_Format', 'RGBA_S3TC_DXT3_Format', 'RGBA_S3TC_DXT5_Format',
  'RGB_PVRTC_4BPPV1_Format', 'RGB_PVRTC_2BPPV1_Format', 'RGBA_PVRTC_4BPPV1_Format',
  'RGBA_PVRTC_2BPPV1_Format', 'RGB_ETC1_Format', 'RGBA_ASTC_4x4_Format',
  'RGBA_ASTC_5x4_Format', 'RGBA_ASTC_5x5_Format', 'RGBA_ASTC_6x5_Format',
  'RGBA_ASTC_6x6_Format', 'RGBA_ASTC_8x5_Format', 'RGBA_ASTC_8x6_Format',
  'RGBA_ASTC_8x8_Format', 'RGBA_ASTC_10x5_Format', 'RGBA_ASTC_10x6_Format',
  'RGBA_ASTC_10x8_Format', 'RGBA_ASTC_10x10_Format', 'RGBA_ASTC_12x10_Format',
  'RGBA_ASTC_12x12_Format'
]);
setOptionGroups(THREE, 'Texture', 'unpackAlignment', [
  [1, '1'], [2, '2'], [4, '4'], [8, '8']
]);
setOptionGroups(THREE, 'Object3D', 'drawMode', [
  'TrianglesDrawMode', 'TriangleStripDrawMode', 'TriangleFanDrawMode'
]);

setOptionGroups(THREE, 'Material', 'blending', [
  'NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubtractiveBlending',
  'MultiplyBlending', 'CustomBlending'
]);

setOptionGroups(THREE, 'Material', 'side', [
  'FrontSide', 'BackSide', 'DoubleSide'
]);

setOptionGroups(THREE, 'Material', 'vertexColors', [
  'NoColors', 'FaceColors', 'VertexColors'
]);

setOptionGroups(THREE, 'Material', 'depthFunc', [
 'NeverDepth', 'AlwaysDepth', 'LessDepth', 'LessEqualDepth', 'EqualDepth',
 'GreaterEqualDepth', 'GreaterDepth', 'NotEqualDepth'
]);

setOptionGroups(THREE, 'Material', 'combine', [
  'MultiplyOperation', 'MixOperation', 'AddOperation'
]);

setOptionGroups(THREE, 'Material', 'blendEquation', [
  'AddEquation', 'SubtractEquation', 'ReverseSubtractEquation', 'MinEquation', 'MaxEquation'
]);

setOptionGroups(THREE, 'Material', 'blendEquationAlpha', [
  'AddEquation', 'SubtractEquation', 'ReverseSubtractEquation', 'MinEquation', 'MaxEquation'
]);

setOptionGroups(THREE, 'Material', 'blendSrc', [
  'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor',
  'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor',
  'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor'
]);

setOptionGroups(THREE, 'Material', 'blendDst', [
  'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor',
  'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor',
  'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor'
]);

setOptionGroups(THREE, 'Material', 'blendSrcAlpha', [
  'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor',
  'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor',
  'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor'
]);

setOptionGroups(THREE, 'Material', 'blendDstAlpha', [
  'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor',
  'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor',
  'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor'
]);

setOptionGroups(THREE, 'Material', 'shadowSide', [
  [0, ,'BackSide'], [1, ,'FrontSide'], [2, ,'DoubleSide'] //reverse from side
]);

setOptionGroups(THREE, 'Material', 'shading', [
  [1, ,'FlatShading'], [2, ,'SmoothShading']
]);

setOptionGroups(THREE, 'Euler', '_order', [
  ['XYZ', 'XYZ'], ['XZY', 'XZY'], ['YXZ', 'YXZ'], ['YZX', 'YZX'], ['ZXY', 'ZXY'], ['ZYX', 'ZYX']
]);

// TODO: check THREE. Only used in functions
// export var CullFaceNone = 0;
// export var CullFaceBack = 1;
// export var CullFaceFront = 2;
// export var CullFaceFrontBack = 3;
// export var FrontFaceDirectionCW = 0;
// export var FrontFaceDirectionCCW = 1;
// export var LoopOnce = 2200;
// export var LoopRepeat = 2201;
// export var LoopPingPong = 2202;
// keyframes
// export var InterpolateDiscrete = 2300;
// export var InterpolateLinear = 2301;
// export var InterpolateSmooth = 2302;
// export var ZeroCurvatureEnding = 2400;
// export var ZeroSlopeEnding = 2401;
// export var WrapAroundEnding = 2402;
