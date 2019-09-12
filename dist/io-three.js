import { IoInspector, IoProperties } from './io-core.js';

const REVISION = '109dev';
const MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 };
const TOUCH = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 };
const CullFaceNone = 0;
const CullFaceBack = 1;
const CullFaceFront = 2;
const CullFaceFrontBack = 3;
const FrontFaceDirectionCW = 0;
const FrontFaceDirectionCCW = 1;
const BasicShadowMap = 0;
const PCFShadowMap = 1;
const PCFSoftShadowMap = 2;
const VSMShadowMap = 3;
const FrontSide = 0;
const BackSide = 1;
const DoubleSide = 2;
const FlatShading = 1;
const SmoothShading = 2;
const NoColors = 0;
const FaceColors = 1;
const VertexColors = 2;
const NoBlending = 0;
const NormalBlending = 1;
const AdditiveBlending = 2;
const SubtractiveBlending = 3;
const MultiplyBlending = 4;
const CustomBlending = 5;
const AddEquation = 100;
const SubtractEquation = 101;
const ReverseSubtractEquation = 102;
const MinEquation = 103;
const MaxEquation = 104;
const ZeroFactor = 200;
const OneFactor = 201;
const SrcColorFactor = 202;
const OneMinusSrcColorFactor = 203;
const SrcAlphaFactor = 204;
const OneMinusSrcAlphaFactor = 205;
const DstAlphaFactor = 206;
const OneMinusDstAlphaFactor = 207;
const DstColorFactor = 208;
const OneMinusDstColorFactor = 209;
const SrcAlphaSaturateFactor = 210;
const NeverDepth = 0;
const AlwaysDepth = 1;
const LessDepth = 2;
const LessEqualDepth = 3;
const EqualDepth = 4;
const GreaterEqualDepth = 5;
const GreaterDepth = 6;
const NotEqualDepth = 7;
const MultiplyOperation = 0;
const MixOperation = 1;
const AddOperation = 2;
const NoToneMapping = 0;
const LinearToneMapping = 1;
const ReinhardToneMapping = 2;
const Uncharted2ToneMapping = 3;
const CineonToneMapping = 4;
const ACESFilmicToneMapping = 5;
const UVMapping = 300;
const CubeReflectionMapping = 301;
const CubeRefractionMapping = 302;
const EquirectangularReflectionMapping = 303;
const EquirectangularRefractionMapping = 304;
const SphericalReflectionMapping = 305;
const CubeUVReflectionMapping = 306;
const CubeUVRefractionMapping = 307;
const RepeatWrapping = 1000;
const ClampToEdgeWrapping = 1001;
const MirroredRepeatWrapping = 1002;
const NearestFilter = 1003;
const NearestMipmapNearestFilter = 1004;
const NearestMipMapNearestFilter = 1004;
const NearestMipmapLinearFilter = 1005;
const NearestMipMapLinearFilter = 1005;
const LinearFilter = 1006;
const LinearMipmapNearestFilter = 1007;
const LinearMipMapNearestFilter = 1007;
const LinearMipmapLinearFilter = 1008;
const LinearMipMapLinearFilter = 1008;
const UnsignedByteType = 1009;
const ByteType = 1010;
const ShortType = 1011;
const UnsignedShortType = 1012;
const IntType = 1013;
const UnsignedIntType = 1014;
const FloatType = 1015;
const HalfFloatType = 1016;
const UnsignedShort4444Type = 1017;
const UnsignedShort5551Type = 1018;
const UnsignedShort565Type = 1019;
const UnsignedInt248Type = 1020;
const AlphaFormat = 1021;
const RGBFormat = 1022;
const RGBAFormat = 1023;
const LuminanceFormat = 1024;
const LuminanceAlphaFormat = 1025;
const RGBEFormat = RGBAFormat;
const DepthFormat = 1026;
const DepthStencilFormat = 1027;
const RedFormat = 1028;
const RGB_S3TC_DXT1_Format = 33776;
const RGBA_S3TC_DXT1_Format = 33777;
const RGBA_S3TC_DXT3_Format = 33778;
const RGBA_S3TC_DXT5_Format = 33779;
const RGB_PVRTC_4BPPV1_Format = 35840;
const RGB_PVRTC_2BPPV1_Format = 35841;
const RGBA_PVRTC_4BPPV1_Format = 35842;
const RGBA_PVRTC_2BPPV1_Format = 35843;
const RGB_ETC1_Format = 36196;
const RGBA_ASTC_4x4_Format = 37808;
const RGBA_ASTC_5x4_Format = 37809;
const RGBA_ASTC_5x5_Format = 37810;
const RGBA_ASTC_6x5_Format = 37811;
const RGBA_ASTC_6x6_Format = 37812;
const RGBA_ASTC_8x5_Format = 37813;
const RGBA_ASTC_8x6_Format = 37814;
const RGBA_ASTC_8x8_Format = 37815;
const RGBA_ASTC_10x5_Format = 37816;
const RGBA_ASTC_10x6_Format = 37817;
const RGBA_ASTC_10x8_Format = 37818;
const RGBA_ASTC_10x10_Format = 37819;
const RGBA_ASTC_12x10_Format = 37820;
const RGBA_ASTC_12x12_Format = 37821;
const LoopOnce = 2200;
const LoopRepeat = 2201;
const LoopPingPong = 2202;
const InterpolateDiscrete = 2300;
const InterpolateLinear = 2301;
const InterpolateSmooth = 2302;
const ZeroCurvatureEnding = 2400;
const ZeroSlopeEnding = 2401;
const WrapAroundEnding = 2402;
const TrianglesDrawMode = 0;
const TriangleStripDrawMode = 1;
const TriangleFanDrawMode = 2;
const LinearEncoding = 3000;
const sRGBEncoding = 3001;
const GammaEncoding = 3007;
const RGBEEncoding = 3002;
const LogLuvEncoding = 3003;
const RGBM7Encoding = 3004;
const RGBM16Encoding = 3005;
const RGBDEncoding = 3006;
const BasicDepthPacking = 3200;
const RGBADepthPacking = 3201;
const TangentSpaceNormalMap = 0;
const ObjectSpaceNormalMap = 1;
const ZeroStencilOp = 0;
const KeepStencilOp = 7680;
const ReplaceStencilOp = 7681;
const IncrementStencilOp = 7682;
const DecrementStencilOp = 7683;
const IncrementWrapStencilOp = 34055;
const DecrementWrapStencilOp = 34056;
const InvertStencilOp = 5386;
const NeverStencilFunc = 512;
const LessStencilFunc = 513;
const EqualStencilFunc = 514;
const LessEqualStencilFunc = 515;
const GreaterStencilFunc = 516;
const NotEqualStencilFunc = 517;
const GreaterEqualStencilFunc = 518;
const AlwaysStencilFunc = 519;

var CONST = /*#__PURE__*/Object.freeze({
  REVISION: REVISION,
  MOUSE: MOUSE,
  TOUCH: TOUCH,
  CullFaceNone: CullFaceNone,
  CullFaceBack: CullFaceBack,
  CullFaceFront: CullFaceFront,
  CullFaceFrontBack: CullFaceFrontBack,
  FrontFaceDirectionCW: FrontFaceDirectionCW,
  FrontFaceDirectionCCW: FrontFaceDirectionCCW,
  BasicShadowMap: BasicShadowMap,
  PCFShadowMap: PCFShadowMap,
  PCFSoftShadowMap: PCFSoftShadowMap,
  VSMShadowMap: VSMShadowMap,
  FrontSide: FrontSide,
  BackSide: BackSide,
  DoubleSide: DoubleSide,
  FlatShading: FlatShading,
  SmoothShading: SmoothShading,
  NoColors: NoColors,
  FaceColors: FaceColors,
  VertexColors: VertexColors,
  NoBlending: NoBlending,
  NormalBlending: NormalBlending,
  AdditiveBlending: AdditiveBlending,
  SubtractiveBlending: SubtractiveBlending,
  MultiplyBlending: MultiplyBlending,
  CustomBlending: CustomBlending,
  AddEquation: AddEquation,
  SubtractEquation: SubtractEquation,
  ReverseSubtractEquation: ReverseSubtractEquation,
  MinEquation: MinEquation,
  MaxEquation: MaxEquation,
  ZeroFactor: ZeroFactor,
  OneFactor: OneFactor,
  SrcColorFactor: SrcColorFactor,
  OneMinusSrcColorFactor: OneMinusSrcColorFactor,
  SrcAlphaFactor: SrcAlphaFactor,
  OneMinusSrcAlphaFactor: OneMinusSrcAlphaFactor,
  DstAlphaFactor: DstAlphaFactor,
  OneMinusDstAlphaFactor: OneMinusDstAlphaFactor,
  DstColorFactor: DstColorFactor,
  OneMinusDstColorFactor: OneMinusDstColorFactor,
  SrcAlphaSaturateFactor: SrcAlphaSaturateFactor,
  NeverDepth: NeverDepth,
  AlwaysDepth: AlwaysDepth,
  LessDepth: LessDepth,
  LessEqualDepth: LessEqualDepth,
  EqualDepth: EqualDepth,
  GreaterEqualDepth: GreaterEqualDepth,
  GreaterDepth: GreaterDepth,
  NotEqualDepth: NotEqualDepth,
  MultiplyOperation: MultiplyOperation,
  MixOperation: MixOperation,
  AddOperation: AddOperation,
  NoToneMapping: NoToneMapping,
  LinearToneMapping: LinearToneMapping,
  ReinhardToneMapping: ReinhardToneMapping,
  Uncharted2ToneMapping: Uncharted2ToneMapping,
  CineonToneMapping: CineonToneMapping,
  ACESFilmicToneMapping: ACESFilmicToneMapping,
  UVMapping: UVMapping,
  CubeReflectionMapping: CubeReflectionMapping,
  CubeRefractionMapping: CubeRefractionMapping,
  EquirectangularReflectionMapping: EquirectangularReflectionMapping,
  EquirectangularRefractionMapping: EquirectangularRefractionMapping,
  SphericalReflectionMapping: SphericalReflectionMapping,
  CubeUVReflectionMapping: CubeUVReflectionMapping,
  CubeUVRefractionMapping: CubeUVRefractionMapping,
  RepeatWrapping: RepeatWrapping,
  ClampToEdgeWrapping: ClampToEdgeWrapping,
  MirroredRepeatWrapping: MirroredRepeatWrapping,
  NearestFilter: NearestFilter,
  NearestMipmapNearestFilter: NearestMipmapNearestFilter,
  NearestMipMapNearestFilter: NearestMipMapNearestFilter,
  NearestMipmapLinearFilter: NearestMipmapLinearFilter,
  NearestMipMapLinearFilter: NearestMipMapLinearFilter,
  LinearFilter: LinearFilter,
  LinearMipmapNearestFilter: LinearMipmapNearestFilter,
  LinearMipMapNearestFilter: LinearMipMapNearestFilter,
  LinearMipmapLinearFilter: LinearMipmapLinearFilter,
  LinearMipMapLinearFilter: LinearMipMapLinearFilter,
  UnsignedByteType: UnsignedByteType,
  ByteType: ByteType,
  ShortType: ShortType,
  UnsignedShortType: UnsignedShortType,
  IntType: IntType,
  UnsignedIntType: UnsignedIntType,
  FloatType: FloatType,
  HalfFloatType: HalfFloatType,
  UnsignedShort4444Type: UnsignedShort4444Type,
  UnsignedShort5551Type: UnsignedShort5551Type,
  UnsignedShort565Type: UnsignedShort565Type,
  UnsignedInt248Type: UnsignedInt248Type,
  AlphaFormat: AlphaFormat,
  RGBFormat: RGBFormat,
  RGBAFormat: RGBAFormat,
  LuminanceFormat: LuminanceFormat,
  LuminanceAlphaFormat: LuminanceAlphaFormat,
  RGBEFormat: RGBEFormat,
  DepthFormat: DepthFormat,
  DepthStencilFormat: DepthStencilFormat,
  RedFormat: RedFormat,
  RGB_S3TC_DXT1_Format: RGB_S3TC_DXT1_Format,
  RGBA_S3TC_DXT1_Format: RGBA_S3TC_DXT1_Format,
  RGBA_S3TC_DXT3_Format: RGBA_S3TC_DXT3_Format,
  RGBA_S3TC_DXT5_Format: RGBA_S3TC_DXT5_Format,
  RGB_PVRTC_4BPPV1_Format: RGB_PVRTC_4BPPV1_Format,
  RGB_PVRTC_2BPPV1_Format: RGB_PVRTC_2BPPV1_Format,
  RGBA_PVRTC_4BPPV1_Format: RGBA_PVRTC_4BPPV1_Format,
  RGBA_PVRTC_2BPPV1_Format: RGBA_PVRTC_2BPPV1_Format,
  RGB_ETC1_Format: RGB_ETC1_Format,
  RGBA_ASTC_4x4_Format: RGBA_ASTC_4x4_Format,
  RGBA_ASTC_5x4_Format: RGBA_ASTC_5x4_Format,
  RGBA_ASTC_5x5_Format: RGBA_ASTC_5x5_Format,
  RGBA_ASTC_6x5_Format: RGBA_ASTC_6x5_Format,
  RGBA_ASTC_6x6_Format: RGBA_ASTC_6x6_Format,
  RGBA_ASTC_8x5_Format: RGBA_ASTC_8x5_Format,
  RGBA_ASTC_8x6_Format: RGBA_ASTC_8x6_Format,
  RGBA_ASTC_8x8_Format: RGBA_ASTC_8x8_Format,
  RGBA_ASTC_10x5_Format: RGBA_ASTC_10x5_Format,
  RGBA_ASTC_10x6_Format: RGBA_ASTC_10x6_Format,
  RGBA_ASTC_10x8_Format: RGBA_ASTC_10x8_Format,
  RGBA_ASTC_10x10_Format: RGBA_ASTC_10x10_Format,
  RGBA_ASTC_12x10_Format: RGBA_ASTC_12x10_Format,
  RGBA_ASTC_12x12_Format: RGBA_ASTC_12x12_Format,
  LoopOnce: LoopOnce,
  LoopRepeat: LoopRepeat,
  LoopPingPong: LoopPingPong,
  InterpolateDiscrete: InterpolateDiscrete,
  InterpolateLinear: InterpolateLinear,
  InterpolateSmooth: InterpolateSmooth,
  ZeroCurvatureEnding: ZeroCurvatureEnding,
  ZeroSlopeEnding: ZeroSlopeEnding,
  WrapAroundEnding: WrapAroundEnding,
  TrianglesDrawMode: TrianglesDrawMode,
  TriangleStripDrawMode: TriangleStripDrawMode,
  TriangleFanDrawMode: TriangleFanDrawMode,
  LinearEncoding: LinearEncoding,
  sRGBEncoding: sRGBEncoding,
  GammaEncoding: GammaEncoding,
  RGBEEncoding: RGBEEncoding,
  LogLuvEncoding: LogLuvEncoding,
  RGBM7Encoding: RGBM7Encoding,
  RGBM16Encoding: RGBM16Encoding,
  RGBDEncoding: RGBDEncoding,
  BasicDepthPacking: BasicDepthPacking,
  RGBADepthPacking: RGBADepthPacking,
  TangentSpaceNormalMap: TangentSpaceNormalMap,
  ObjectSpaceNormalMap: ObjectSpaceNormalMap,
  ZeroStencilOp: ZeroStencilOp,
  KeepStencilOp: KeepStencilOp,
  ReplaceStencilOp: ReplaceStencilOp,
  IncrementStencilOp: IncrementStencilOp,
  DecrementStencilOp: DecrementStencilOp,
  IncrementWrapStencilOp: IncrementWrapStencilOp,
  DecrementWrapStencilOp: DecrementWrapStencilOp,
  InvertStencilOp: InvertStencilOp,
  NeverStencilFunc: NeverStencilFunc,
  LessStencilFunc: LessStencilFunc,
  EqualStencilFunc: EqualStencilFunc,
  LessEqualStencilFunc: LessEqualStencilFunc,
  GreaterStencilFunc: GreaterStencilFunc,
  NotEqualStencilFunc: NotEqualStencilFunc,
  GreaterEqualStencilFunc: GreaterEqualStencilFunc,
  AlwaysStencilFunc: AlwaysStencilFunc
});

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

class IoThreeInspector extends IoInspector {
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

export { IoThreeInspector };
