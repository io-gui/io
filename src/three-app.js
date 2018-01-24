import {IoObject} from "./io-object.js"
import {IoInspector} from "./io-inspector.js"
import {IoOption} from "./io-option.js"
import {html, render, bind} from '../node_modules/lit-html-brackets/lit-html-brackets.js';

import * as THREE from "../lib/three.module.js"

export class ThreeApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    render(this.render(), this.shadowRoot);
  }
  connectedCallback() {
    let ioObjectIstances = this.shadowRoot.querySelectorAll('io-object');
    ioObjectIstances[0].value = new THREE.SphereBufferGeometry();
    ioObjectIstances[1].value = new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshDepthMaterial());
    ioObjectIstances[2].value = new THREE.WebGLRenderer();
    ioObjectIstances[3].value = ioObjectIstances[0];
  }

  render() {
    return html`
      <style>
        div.demo {
          font-family: "Lucida Grande", sans-serif;
        }
        div.row {
          display: flex;
          flex-direction: row;
        }
        div.header, span.rowlabel {
          color: rgba(128, 122, 255, 0.75);
        }
        span.rowlabel {
          text-align: right;
          padding-right: 0.2em;;
        }
        div.row * {
          margin: 1px;
          flex: 1;
        }
        div.demo > io-value,
        div.demo > io-object {
          border: 1px solid #eee;
          vertical-align: top;
        }
        div.area {
          height: 2em;
          background: rgba(128,128,128,0.2);
        }
        .narrow {
          width: 22em;
        }
      </style>
      <div class="vertical-section-container centered">
        <div class="demo">
          <h3>io-inspector</h3>
          <!--<io-inspector></io-inspector>-->
        </div>
        <div class="demo">
          <h3>io-object</h3>
          <io-object></io-object>
          <io-object></io-object>
          <io-object></io-object>
          <io-object></io-object>
        </div>
      </div>
    `;
  }
}

customElements.define('three-app', ThreeApp);

{

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

  IoObject.CONFIG['constructor:WebGLRenderer'] = {
    'key:toneMapping': { tag: 'io-option', props: {options: [
      {value: THREE.NoToneMapping, label: 'NoToneMapping'},
      {value: THREE.LinearToneMapping, label: 'LinearToneMapping'},
      {value: THREE.ReinhardToneMapping, label: 'ReinhardToneMapping'},
      {value: THREE.Uncharted2ToneMapping, label: 'Uncharted2ToneMapping'},
      {value: THREE.CineonToneMapping, label: 'CineonToneMapping'}
    ] }}
  };

  IoObject.CONFIG['constructor:WebGLShadowMap'] = {
    'key:type': { tag: 'io-option', props: {options: [
      {value: THREE.BasicShadowMap, label: 'BasicShadowMap'},
      {value: THREE.PCFShadowMap, label: 'PCFShadowMap'},
      {value: THREE.PCFSoftShadowMap, label: 'PCFSoftShadowMap'}
    ] }}
  };

  IoObject.CONFIG['constructor:MeshDepthMaterial'] = {
    'key:depthPacking': { tag: 'io-option', props: {options: [
      {value: THREE.BasicDepthPacking, label: 'BasicDepthPacking'},
      {value: THREE.RGBADepthPacking, label: 'RGBADepthPacking'}
    ] }}
  };

  IoObject.CONFIG['constructor:Texture'] = {
    'key:mapping': { tag: 'io-option', props: {options: [
      {value: THREE.UVMapping, label: 'UVMapping'},
      {value: THREE.CubeReflectionMapping, label: 'CubeReflectionMapping'},
      {value: THREE.CubeRefractionMapping, label: 'CubeRefractionMapping'},
      {value: THREE.EquirectangularReflectionMapping, label: 'EquirectangularReflectionMapping'},
      {value: THREE.EquirectangularRefractionMapping, label: 'EquirectangularRefractionMapping'},
      {value: THREE.SphericalReflectionMapping, label: 'SphericalReflectionMapping'},
      {value: THREE.CubeUVReflectionMapping, label: 'CubeUVReflectionMapping'},
      {value: THREE.CubeUVRefractionMapping, label: 'CubeUVRefractionMapping'}
    ] }},
    'key:minFilter': { tag: 'io-option', props: {options: [
      {value: THREE.NearestFilter, label: 'NearestFilter'},
      {value: THREE.NearestMipMapNearestFilter, label: 'NearestMipMapNearestFilter'},
      {value: THREE.NearestMipMapLinearFilter, label: 'NearestMipMapLinearFilter'},
      {value: THREE.LinearFilter, label: 'LinearFilter'},
      {value: THREE.LinearMipMapNearestFilter, label: 'LinearMipMapNearestFilter'},
      {value: THREE.LinearMipMapLinearFilter, label: 'LinearMipMapLinearFilter'}
    ] }},
    'key:magFilter': { tag: 'io-option', props: {options: [
      {value: THREE.NearestFilter, label: 'NearestFilter'},
      {value: THREE.NearestMipMapNearestFilter, label: 'NearestMipMapNearestFilter'},
      {value: THREE.NearestMipMapLinearFilter, label: 'NearestMipMapLinearFilter'},
      {value: THREE.LinearFilter, label: 'LinearFilter'},
      {value: THREE.LinearMipMapNearestFilter, label: 'LinearMipMapNearestFilter'},
      {value: THREE.LinearMipMapLinearFilter, label: 'LinearMipMapLinearFilter'}
    ] }},
    'key:wrapS': { tag: 'io-option', props: {options: [
      {value: THREE.RepeatWrapping, label: 'RepeatWrapping'},
      {value: THREE.ClampToEdgeWrapping, label: 'ClampToEdgeWrapping'},
      {value: THREE.MirroredRepeatWrapping, label: 'MirroredRepeatWrapping'}
    ] }},
    'key:wrapT': { tag: 'io-option', props: {options: [
      {value: THREE.RepeatWrapping, label: 'RepeatWrapping'},
      {value: THREE.ClampToEdgeWrapping, label: 'ClampToEdgeWrapping'},
      {value: THREE.MirroredRepeatWrapping, label: 'MirroredRepeatWrapping'}
    ] }},
    'key:encoding': { tag: 'io-option', props: {options: [
      {value: THREE.LinearEncoding, label: 'LinearEncoding'},
      {value: THREE.sRGBEncoding, label: 'sRGBEncoding'},
      {value: THREE.GammaEncoding, label: 'GammaEncoding'},
      {value: THREE.RGBEEncoding, label: 'RGBEEncoding'},
      {value: THREE.LogLuvEncoding, label: 'LogLuvEncoding'},
      {value: THREE.RGBM7Encoding, label: 'RGBM7Encoding'},
      {value: THREE.RGBM16Encoding, label: 'RGBM16Encoding'},
      {value: THREE.RGBDEncoding, label: 'RGBDEncoding'}
    ] }},
    'key:type': { tag: 'io-option', props: {options: [
      {value: THREE.UnsignedByteType, label: 'UnsignedByteType'},
      {value: THREE.ByteType, label: 'ByteType'},
      {value: THREE.ShortType, label: 'ShortType'},
      {value: THREE.UnsignedShortType, label: 'UnsignedShortType'},
      {value: THREE.IntType, label: 'IntType'},
      {value: THREE.UnsignedIntType, label: 'UnsignedIntType'},
      {value: THREE.FloatType, label: 'FloatType'},
      {value: THREE.HalfFloatType, label: 'HalfFloatType'},
      {value: THREE.UnsignedShort4444Type, label: 'UnsignedShort4444Type'},
      {value: THREE.UnsignedShort5551Type, label: 'UnsignedShort5551Type'},
      {value: THREE.UnsignedShort565Type, label: 'UnsignedShort565Type'},
      {value: THREE.UnsignedInt248Type, label: 'UnsignedInt248Type'}
    ] }},
    'key:format': { tag: 'io-option', props: {options: [
      {value: THREE.AlphaFormat, label: 'AlphaFormat'},
      {value: THREE.RGBFormat, label: 'RGBFormat'},
      {value: THREE.RGBAFormat, label: 'RGBAFormat'},
      {value: THREE.LuminanceFormat, label: 'LuminanceFormat'},
      {value: THREE.LuminanceAlphaFormat, label: 'LuminanceAlphaFormat'},
      {value: THREE.RGBEFormat, label: 'RGBEFormat'},
      {value: THREE.DepthFormat, label: 'DepthFormat'},
      {value: THREE.DepthStencilFormat, label: 'DepthStencilFormat'},
      {value: THREE.RGB_S3TC_DXT1_Format, label: 'RGB_S3TC_DXT1_Format'},
      {value: THREE.RGBA_S3TC_DXT1_Format, label: 'RGBA_S3TC_DXT1_Format'},
      {value: THREE.RGBA_S3TC_DXT3_Format, label: 'RGBA_S3TC_DXT3_Format'},
      {value: THREE.RGBA_S3TC_DXT5_Format, label: 'RGBA_S3TC_DXT5_Format'},
      {value: THREE.RGB_PVRTC_4BPPV1_Format, label: 'RGB_PVRTC_4BPPV1_Format'},
      {value: THREE.RGB_PVRTC_2BPPV1_Format, label: 'RGB_PVRTC_2BPPV1_Format'},
      {value: THREE.RGBA_PVRTC_4BPPV1_Format, label: 'RGBA_PVRTC_4BPPV1_Format'},
      {value: THREE.RGBA_PVRTC_2BPPV1_Format, label: 'RGBA_PVRTC_2BPPV1_Format'},
      {value: THREE.RGB_ETC1_Format, label: 'RGB_ETC1_Format'},
      {value: THREE.RGBA_ASTC_4x4_Format, label: 'RGBA_ASTC_4x4_Format'},
      {value: THREE.RGBA_ASTC_5x4_Format, label: 'RGBA_ASTC_5x4_Format'},
      {value: THREE.RGBA_ASTC_5x5_Format, label: 'RGBA_ASTC_5x5_Format'},
      {value: THREE.RGBA_ASTC_6x5_Format, label: 'RGBA_ASTC_6x5_Format'},
      {value: THREE.RGBA_ASTC_6x6_Format, label: 'RGBA_ASTC_6x6_Format'},
      {value: THREE.RGBA_ASTC_8x5_Format, label: 'RGBA_ASTC_8x5_Format'},
      {value: THREE.RGBA_ASTC_8x6_Format, label: 'RGBA_ASTC_8x6_Format'},
      {value: THREE.RGBA_ASTC_8x8_Format, label: 'RGBA_ASTC_8x8_Format'},
      {value: THREE.RGBA_ASTC_10x5_Format, label: 'RGBA_ASTC_10x5_Format'},
      {value: THREE.RGBA_ASTC_10x6_Format, label: 'RGBA_ASTC_10x6_Format'},
      {value: THREE.RGBA_ASTC_10x8_Format, label: 'RGBA_ASTC_10x8_Format'},
      {value: THREE.RGBA_ASTC_10x10_Format, label: 'RGBA_ASTC_10x10_Format'},
      {value: THREE.RGBA_ASTC_12x10_Format, label: 'RGBA_ASTC_12x10_Format'},
      {value: THREE.RGBA_ASTC_12x12_Format, label: 'RGBA_ASTC_12x12_Format'}
    ] }},
    'key:unpackAlignment': { tag: 'io-option', props: {options: [
      {value: 1, label: '1'},
      {value: 2, label: '2'},
      {value: 4, label: '4'},
      {value: 8, label: '8'}
    ] }},
  };

  IoObject.CONFIG['constructor:Object3D'] = {
    'key:drawMode': { tag: 'io-option', props: {options: [
      {value: THREE.TrianglesDrawMode, label: 'TrianglesDrawMode'},
      {value: THREE.TriangleStripDrawMode, label: 'TriangleStripDrawMode'},
      {value: THREE.TriangleFanDrawMode, label: 'TriangleFanDrawMode'}
    ] }}
  };

  const _blendFactors = { tag: 'io-option', props: {options: [
    {value: THREE.ZeroFactor, label: 'ZeroFactor'},
    {value: THREE.OneFactor, label: 'OneFactor'},
    {value: THREE.SrcColorFactor, label: 'SrcColorFactor'},
    {value: THREE.OneMinusSrcColorFactor, label: 'OneMinusSrcColorFactor'},
    {value: THREE.SrcAlphaFactor, label: 'SrcAlphaFactor'},
    {value: THREE.OneMinusSrcAlphaFactor, label: 'OneMinusSrcAlphaFactor'},
    {value: THREE.DstAlphaFactor, label: 'DstAlphaFactor'},
    {value: THREE.OneMinusDstAlphaFactor, label: 'OneMinusDstAlphaFactor'},
    {value: THREE.DstColorFactor, label: 'DstColorFactor'},
    {value: THREE.OneMinusDstColorFactor, label: 'OneMinusDstColorFactor'},
    {value: THREE.SrcAlphaSaturateFactor, label: 'SrcAlphaSaturateFactor'}
  ] }};

  const _blendEquations = { tag: 'io-option', props: {options: [
    {value: THREE.AddEquation, label: 'AddEquation'},
    {value: THREE.SubtractEquation, label: 'SubtractEquation'},
    {value: THREE.ReverseSubtractEquation, label: 'ReverseSubtractEquation'},
    {value: THREE.MinEquation, label: 'MinEquation'},
    {value: THREE.MaxEquation, label: 'MaxEquation'}
  ] }};

  IoObject.CONFIG['constructor:Material'] = {
    'key:blending': { tag: 'io-option', props: {options: [
      {value: THREE.NoBlending, label: 'NoBlending'},
      {value: THREE.NormalBlending, label: 'NormalBlending'},
      {value: THREE.AdditiveBlending, label: 'AdditiveBlending'},
      {value: THREE.SubtractiveBlending, label: 'SubtractiveBlending'},
      {value: THREE.MultiplyBlending, label: 'MultiplyBlending'},
      {value: THREE.CustomBlending, label: 'CustomBlending'}
    ] }},
    'key:side': { tag: 'io-option', props: {options: [
      {value: THREE.FrontSide, label: 'FrontSide'},
      {value: THREE.BackSide, label: 'BackSide'},
      {value: THREE.DoubleSide, label: 'DoubleSide'}
    ] }},
    'key:vertexColors': { tag: 'io-option', props: {options: [
      {value: THREE.NoColors, label: 'NoColors'},
      {value: THREE.FaceColors, label: 'FaceColors'},
      {value: THREE.VertexColors, label: 'VertexColors'}
    ] }},
    'key:depthFunc': { tag: 'io-option', props: {options: [
      {value: THREE.NeverDepth, label: 'NeverDepth'},
      {value: THREE.AlwaysDepth, label: 'AlwaysDepth'},
      {value: THREE.LessDepth, label: 'LessDepth'},
      {value: THREE.LessEqualDepth, label: 'LessEqualDepth'},
      {value: THREE.EqualDepth, label: 'EqualDepth'},
      {value: THREE.GreaterEqualDepth, label: 'GreaterEqualDepth'},
      {value: THREE.GreaterDepth, label: 'GreaterDepth'},
      {value: THREE.NotEqualDepth, label: 'NotEqualDepth'}
    ] }},
    'key:combine': { tag: 'io-option', props: {options: [
      {value: THREE.MultiplyOperation, label: 'MultiplyOperation'},
      {value: THREE.MixOperation, label: 'MixOperation'},
      {value: THREE.AddOperation, label: 'AddOperation'}
    ] }},
    'key:shadowSide': { tag: 'io-option', props: {options: [
      {value: 0, label: 'BackSide'}, //reverse from side
      {value: 1, label: 'FrontSide'},
      {value: 2, label: 'DoubleSide'}
    ] }},
    'key:shading': { tag: 'io-option', props: {options: [
      {value: 1, label: 'FlatShading'},
      {value: 2, label: 'SmoothShading'}
    ] }},
    'key:blendEquation': _blendEquations,
    'key:blendEquationAlpha': _blendEquations,
    'key:blendSrc': _blendFactors,
    'key:blendDst': _blendFactors,
    'key:blendSrcAlpha': _blendFactors,
    'key:blendDstAlpha': _blendFactors
  };

  IoObject.CONFIG['constructor:Euler'] = {
    'key:_order': { tag: 'io-option', props: {options: [
      {value: 'XYZ', label: 'XYZ'},
      {value: 'XZY', label: 'XZY'},
      {value: 'YXZ', label: 'YXZ'},
      {value: 'YZX', label: 'YZX'},
      {value: 'ZXY', label: 'ZXY'},
      {value: 'ZYX', label: 'ZYX'}
    ] }}
  };

}
