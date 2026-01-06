/*
 * This file is a reference for all constants available in three.js
 */

// export const MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 }
// export const TOUCH = { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }
// export const CullFaceNone = 0
// export const CullFaceBack = 1
// export const CullFaceFront = 2
// export const CullFaceFrontBack = 3
// export const BasicShadowMap = 0
// export const PCFShadowMap = 1
// export const PCFSoftShadowMap = 2
// export const VSMShadowMap = 3
// export const FrontSide = 0
// export const BackSide = 1
// export const DoubleSide = 2
// export const NoBlending = 0
// export const NormalBlending = 1
// export const AdditiveBlending = 2
// export const SubtractiveBlending = 3
// export const MultiplyBlending = 4
// export const CustomBlending = 5
// export const AddEquation = 100
// export const SubtractEquation = 101
// export const ReverseSubtractEquation = 102
// export const MinEquation = 103
// export const MaxEquation = 104
// export const ZeroFactor = 200
// export const OneFactor = 201
// export const SrcColorFactor = 202
// export const OneMinusSrcColorFactor = 203
// export const SrcAlphaFactor = 204
// export const OneMinusSrcAlphaFactor = 205
// export const DstAlphaFactor = 206
// export const OneMinusDstAlphaFactor = 207
// export const DstColorFactor = 208
// export const OneMinusDstColorFactor = 209
// export const SrcAlphaSaturateFactor = 210
// export const ConstantColorFactor = 211
// export const OneMinusConstantColorFactor = 212
// export const ConstantAlphaFactor = 213
// export const OneMinusConstantAlphaFactor = 214
// export const NeverDepth = 0
// export const AlwaysDepth = 1
// export const LessDepth = 2
// export const LessEqualDepth = 3
// export const EqualDepth = 4
// export const GreaterEqualDepth = 5
// export const GreaterDepth = 6
// export const NotEqualDepth = 7
// export const MultiplyOperation = 0
// export const MixOperation = 1
// export const AddOperation = 2
// export const NoToneMapping = 0
// export const LinearToneMapping = 1
// export const ReinhardToneMapping = 2
// export const CineonToneMapping = 3
// export const ACESFilmicToneMapping = 4
// export const CustomToneMapping = 5
// export const AgXToneMapping = 6
// export const NeutralToneMapping = 7
// export const AttachedBindMode = 'attached'
// export const DetachedBindMode = 'detached'
// export const UVMapping = 300
// export const CubeReflectionMapping = 301
// export const CubeRefractionMapping = 302
// export const EquirectangularReflectionMapping = 303
// export const EquirectangularRefractionMapping = 304
// export const CubeUVReflectionMapping = 306
// export const RepeatWrapping = 1000
// export const ClampToEdgeWrapping = 1001
// export const MirroredRepeatWrapping = 1002
// export const NearestFilter = 1003
// export const NearestMipmapNearestFilter = 1004
// export const NearestMipMapNearestFilter = 1004
// export const NearestMipmapLinearFilter = 1005
// export const NearestMipMapLinearFilter = 1005
// export const LinearFilter = 1006
// export const LinearMipmapNearestFilter = 1007
// export const LinearMipMapNearestFilter = 1007
// export const LinearMipmapLinearFilter = 1008
// export const LinearMipMapLinearFilter = 1008
// export const UnsignedByteType = 1009
// export const ByteType = 1010
// export const ShortType = 1011
// export const UnsignedShortType = 1012
// export const IntType = 1013
// export const UnsignedIntType = 1014
// export const FloatType = 1015
// export const HalfFloatType = 1016
// export const UnsignedShort4444Type = 1017
// export const UnsignedShort5551Type = 1018
// export const UnsignedInt248Type = 1020
// export const UnsignedInt5999Type = 35902
// export const UnsignedInt101111Type = 35899
// export const AlphaFormat = 1021
// export const RGBFormat = 1022
// export const RGBAFormat = 1023
// export const DepthFormat = 1026
// export const DepthStencilFormat = 1027
// export const RedFormat = 1028
// export const RedIntegerFormat = 1029
// export const RGFormat = 1030
// export const RGIntegerFormat = 1031
// export const RGBIntegerFormat = 1032
// export const RGBAIntegerFormat = 1033
// export const RGB_S3TC_DXT1_Format = 33776
// export const RGBA_S3TC_DXT1_Format = 33777
// export const RGBA_S3TC_DXT3_Format = 33778
// export const RGBA_S3TC_DXT5_Format = 33779
// export const RGB_PVRTC_4BPPV1_Format = 35840
// export const RGB_PVRTC_2BPPV1_Format = 35841
// export const RGBA_PVRTC_4BPPV1_Format = 35842
// export const RGBA_PVRTC_2BPPV1_Format = 35843
// export const RGB_ETC1_Format = 36196
// export const RGB_ETC2_Format = 37492
// export const RGBA_ETC2_EAC_Format = 37496
// export const R11_EAC_Format = 37488
// export const SIGNED_R11_EAC_Format = 37489
// export const RG11_EAC_Format = 37490
// export const SIGNED_RG11_EAC_Format = 37491
// export const RGBA_ASTC_4x4_Format = 37808
// export const RGBA_ASTC_5x4_Format = 37809
// export const RGBA_ASTC_5x5_Format = 37810
// export const RGBA_ASTC_6x5_Format = 37811
// export const RGBA_ASTC_6x6_Format = 37812
// export const RGBA_ASTC_8x5_Format = 37813
// export const RGBA_ASTC_8x6_Format = 37814
// export const RGBA_ASTC_8x8_Format = 37815
// export const RGBA_ASTC_10x5_Format = 37816
// export const RGBA_ASTC_10x6_Format = 37817
// export const RGBA_ASTC_10x8_Format = 37818
// export const RGBA_ASTC_10x10_Format = 37819
// export const RGBA_ASTC_12x10_Format = 37820
// export const RGBA_ASTC_12x12_Format = 37821
// export const RGBA_BPTC_Format = 36492
// export const RGB_BPTC_SIGNED_Format = 36494
// export const RGB_BPTC_UNSIGNED_Format = 36495
// export const RED_RGTC1_Format = 36283
// export const SIGNED_RED_RGTC1_Format = 36284
// export const RED_GREEN_RGTC2_Format = 36285
// export const SIGNED_RED_GREEN_RGTC2_Format = 36286
// export const LoopOnce = 2200
// export const LoopRepeat = 2201
// export const LoopPingPong = 2202
// export const InterpolateDiscrete = 2300
// export const InterpolateLinear = 2301
// export const InterpolateSmooth = 2302
// export const ZeroCurvatureEnding = 2400
// export const ZeroSlopeEnding = 2401
// export const WrapAroundEnding = 2402
// export const NormalAnimationBlendMode = 2500
// export const AdditiveAnimationBlendMode = 2501
// export const TrianglesDrawMode = 0
// export const TriangleStripDrawMode = 1
// export const TriangleFanDrawMode = 2
// export const BasicDepthPacking = 3200
// export const RGBADepthPacking = 3201
// export const RGBDepthPacking = 3202
// export const RGDepthPacking = 3203
// export const TangentSpaceNormalMap = 0
// export const ObjectSpaceNormalMap = 1
// export const NoColorSpace = ''
// export const SRGBColorSpace = 'srgb'
// export const LinearSRGBColorSpace = 'srgb-linear'
// export const LinearTransfer = 'linear'
// export const SRGBTransfer = 'srgb'
// export const NoNormalPacking = ''
// export const NormalRGPacking = 'rg'
// export const NormalGAPacking = 'ga'
// export const ZeroStencilOp = 0
// export const KeepStencilOp = 7680
// export const ReplaceStencilOp = 7681
// export const IncrementStencilOp = 7682
// export const DecrementStencilOp = 7683
// export const IncrementWrapStencilOp = 34055
// export const DecrementWrapStencilOp = 34056
// export const InvertStencilOp = 5386
// export const NeverStencilFunc = 512
// export const LessStencilFunc = 513
// export const EqualStencilFunc = 514
// export const LessEqualStencilFunc = 515
// export const GreaterStencilFunc = 516
// export const NotEqualStencilFunc = 517
// export const GreaterEqualStencilFunc = 518
// export const AlwaysStencilFunc = 519
// export const NeverCompare = 512
// export const LessCompare = 513
// export const EqualCompare = 514
// export const LessEqualCompare = 515
// export const GreaterCompare = 516
// export const NotEqualCompare = 517
// export const GreaterEqualCompare = 518
// export const AlwaysCompare = 519
// export const StaticDrawUsage = 35044
// export const DynamicDrawUsage = 35048
// export const StreamDrawUsage = 35040
// export const StaticReadUsage = 35045
// export const DynamicReadUsage = 35049
// export const StreamReadUsage = 35041
// export const StaticCopyUsage = 35046
// export const DynamicCopyUsage = 35050
// export const StreamCopyUsage = 35042
// export const GLSL1 = '100'
// export const GLSL3 = '300 es'
// export const WebGLCoordinateSystem = 2000
// export const WebGPUCoordinateSystem = 2001
// export const TimestampQuery = {
//   COMPUTE: 'compute',
//   RENDER: 'render'
// }
// export const InterpolationSamplingType = {
//   PERSPECTIVE: 'perspective',
//   LINEAR: 'linear',
//   FLAT: 'flat'
// }
// export const InterpolationSamplingMode = {
//   NORMAL: 'normal',
//   CENTROID: 'centroid',
//   SAMPLE: 'sample',
//   FIRST: 'first',
//   EITHER: 'either'
// }
// export const Compatibility = {
//   TEXTURE_COMPARE: 'depthTextureCompare'
// }


// WebGPU Constants

// export const GPUPrimitiveTopology = {
// 	PointList: 'point-list',
// 	LineList: 'line-list',
// 	LineStrip: 'line-strip',
// 	TriangleList: 'triangle-list',
// 	TriangleStrip: 'triangle-strip',
// };

// export const GPUShaderStage = ( typeof self !== 'undefined' && self.GPUShaderStage ) ? self.GPUShaderStage : { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };

// export const GPUCompareFunction = {
// 	Never: 'never',
// 	Less: 'less',
// 	Equal: 'equal',
// 	LessEqual: 'less-equal',
// 	Greater: 'greater',
// 	NotEqual: 'not-equal',
// 	GreaterEqual: 'greater-equal',
// 	Always: 'always'
// };

// export const GPUStoreOp = {
// 	Store: 'store',
// 	Discard: 'discard'
// };

// export const GPULoadOp = {
// 	Load: 'load',
// 	Clear: 'clear'
// };

// export const GPUFrontFace = {
// 	CCW: 'ccw',
// 	CW: 'cw'
// };

// export const GPUCullMode = {
// 	None: 'none',
// 	Front: 'front',
// 	Back: 'back'
// };

// export const GPUIndexFormat = {
// 	Uint16: 'uint16',
// 	Uint32: 'uint32'
// };

// export const GPUVertexFormat = {
// 	Uint8x2: 'uint8x2',
// 	Uint8x4: 'uint8x4',
// 	Sint8x2: 'sint8x2',
// 	Sint8x4: 'sint8x4',
// 	Unorm8x2: 'unorm8x2',
// 	Unorm8x4: 'unorm8x4',
// 	Snorm8x2: 'snorm8x2',
// 	Snorm8x4: 'snorm8x4',
// 	Uint16x2: 'uint16x2',
// 	Uint16x4: 'uint16x4',
// 	Sint16x2: 'sint16x2',
// 	Sint16x4: 'sint16x4',
// 	Unorm16x2: 'unorm16x2',
// 	Unorm16x4: 'unorm16x4',
// 	Snorm16x2: 'snorm16x2',
// 	Snorm16x4: 'snorm16x4',
// 	Float16x2: 'float16x2',
// 	Float16x4: 'float16x4',
// 	Float32: 'float32',
// 	Float32x2: 'float32x2',
// 	Float32x3: 'float32x3',
// 	Float32x4: 'float32x4',
// 	Uint32: 'uint32',
// 	Uint32x2: 'uint32x2',
// 	Uint32x3: 'uint32x3',
// 	Uint32x4: 'uint32x4',
// 	Sint32: 'sint32',
// 	Sint32x2: 'sint32x2',
// 	Sint32x3: 'sint32x3',
// 	Sint32x4: 'sint32x4'
// };

// export const GPUTextureFormat = {

// 	// 8-bit formats

// 	R8Unorm: 'r8unorm',
// 	R8Snorm: 'r8snorm',
// 	R8Uint: 'r8uint',
// 	R8Sint: 'r8sint',

// 	// 16-bit formats

// 	R16Uint: 'r16uint',
// 	R16Sint: 'r16sint',
// 	R16Float: 'r16float',
// 	RG8Unorm: 'rg8unorm',
// 	RG8Snorm: 'rg8snorm',
// 	RG8Uint: 'rg8uint',
// 	RG8Sint: 'rg8sint',

// 	// 32-bit formats

// 	R32Uint: 'r32uint',
// 	R32Sint: 'r32sint',
// 	R32Float: 'r32float',
// 	RG16Uint: 'rg16uint',
// 	RG16Sint: 'rg16sint',
// 	RG16Float: 'rg16float',
// 	RGBA8Unorm: 'rgba8unorm',
// 	RGBA8UnormSRGB: 'rgba8unorm-srgb',
// 	RGBA8Snorm: 'rgba8snorm',
// 	RGBA8Uint: 'rgba8uint',
// 	RGBA8Sint: 'rgba8sint',
// 	BGRA8Unorm: 'bgra8unorm',
// 	BGRA8UnormSRGB: 'bgra8unorm-srgb',
// 	// Packed 32-bit formats
// 	RGB9E5UFloat: 'rgb9e5ufloat',
// 	RGB10A2Unorm: 'rgb10a2unorm',
// 	RG11B10UFloat: 'rg11b10ufloat',

// 	// 64-bit formats

// 	RG32Uint: 'rg32uint',
// 	RG32Sint: 'rg32sint',
// 	RG32Float: 'rg32float',
// 	RGBA16Uint: 'rgba16uint',
// 	RGBA16Sint: 'rgba16sint',
// 	RGBA16Float: 'rgba16float',

// 	// 128-bit formats

// 	RGBA32Uint: 'rgba32uint',
// 	RGBA32Sint: 'rgba32sint',
// 	RGBA32Float: 'rgba32float',

// 	// Depth and stencil formats

// 	Stencil8: 'stencil8',
// 	Depth16Unorm: 'depth16unorm',
// 	Depth24Plus: 'depth24plus',
// 	Depth24PlusStencil8: 'depth24plus-stencil8',
// 	Depth32Float: 'depth32float',

// 	// 'depth32float-stencil8' extension

// 	Depth32FloatStencil8: 'depth32float-stencil8',

// 	// BC compressed formats usable if 'texture-compression-bc' is both
// 	// supported by the device/user agent and enabled in requestDevice.

// 	BC1RGBAUnorm: 'bc1-rgba-unorm',
// 	BC1RGBAUnormSRGB: 'bc1-rgba-unorm-srgb',
// 	BC2RGBAUnorm: 'bc2-rgba-unorm',
// 	BC2RGBAUnormSRGB: 'bc2-rgba-unorm-srgb',
// 	BC3RGBAUnorm: 'bc3-rgba-unorm',
// 	BC3RGBAUnormSRGB: 'bc3-rgba-unorm-srgb',
// 	BC4RUnorm: 'bc4-r-unorm',
// 	BC4RSnorm: 'bc4-r-snorm',
// 	BC5RGUnorm: 'bc5-rg-unorm',
// 	BC5RGSnorm: 'bc5-rg-snorm',
// 	BC6HRGBUFloat: 'bc6h-rgb-ufloat',
// 	BC6HRGBFloat: 'bc6h-rgb-float',
// 	BC7RGBAUnorm: 'bc7-rgba-unorm',
// 	BC7RGBAUnormSRGB: 'bc7-rgba-unorm-srgb',

// 	// ETC2 compressed formats usable if 'texture-compression-etc2' is both
// 	// supported by the device/user agent and enabled in requestDevice.

// 	ETC2RGB8Unorm: 'etc2-rgb8unorm',
// 	ETC2RGB8UnormSRGB: 'etc2-rgb8unorm-srgb',
// 	ETC2RGB8A1Unorm: 'etc2-rgb8a1unorm',
// 	ETC2RGB8A1UnormSRGB: 'etc2-rgb8a1unorm-srgb',
// 	ETC2RGBA8Unorm: 'etc2-rgba8unorm',
// 	ETC2RGBA8UnormSRGB: 'etc2-rgba8unorm-srgb',
// 	EACR11Unorm: 'eac-r11unorm',
// 	EACR11Snorm: 'eac-r11snorm',
// 	EACRG11Unorm: 'eac-rg11unorm',
// 	EACRG11Snorm: 'eac-rg11snorm',

// 	// ASTC compressed formats usable if 'texture-compression-astc' is both
// 	// supported by the device/user agent and enabled in requestDevice.

// 	ASTC4x4Unorm: 'astc-4x4-unorm',
// 	ASTC4x4UnormSRGB: 'astc-4x4-unorm-srgb',
// 	ASTC5x4Unorm: 'astc-5x4-unorm',
// 	ASTC5x4UnormSRGB: 'astc-5x4-unorm-srgb',
// 	ASTC5x5Unorm: 'astc-5x5-unorm',
// 	ASTC5x5UnormSRGB: 'astc-5x5-unorm-srgb',
// 	ASTC6x5Unorm: 'astc-6x5-unorm',
// 	ASTC6x5UnormSRGB: 'astc-6x5-unorm-srgb',
// 	ASTC6x6Unorm: 'astc-6x6-unorm',
// 	ASTC6x6UnormSRGB: 'astc-6x6-unorm-srgb',
// 	ASTC8x5Unorm: 'astc-8x5-unorm',
// 	ASTC8x5UnormSRGB: 'astc-8x5-unorm-srgb',
// 	ASTC8x6Unorm: 'astc-8x6-unorm',
// 	ASTC8x6UnormSRGB: 'astc-8x6-unorm-srgb',
// 	ASTC8x8Unorm: 'astc-8x8-unorm',
// 	ASTC8x8UnormSRGB: 'astc-8x8-unorm-srgb',
// 	ASTC10x5Unorm: 'astc-10x5-unorm',
// 	ASTC10x5UnormSRGB: 'astc-10x5-unorm-srgb',
// 	ASTC10x6Unorm: 'astc-10x6-unorm',
// 	ASTC10x6UnormSRGB: 'astc-10x6-unorm-srgb',
// 	ASTC10x8Unorm: 'astc-10x8-unorm',
// 	ASTC10x8UnormSRGB: 'astc-10x8-unorm-srgb',
// 	ASTC10x10Unorm: 'astc-10x10-unorm',
// 	ASTC10x10UnormSRGB: 'astc-10x10-unorm-srgb',
// 	ASTC12x10Unorm: 'astc-12x10-unorm',
// 	ASTC12x10UnormSRGB: 'astc-12x10-unorm-srgb',
// 	ASTC12x12Unorm: 'astc-12x12-unorm',
// 	ASTC12x12UnormSRGB: 'astc-12x12-unorm-srgb',

// };

// export const GPUAddressMode = {
// 	ClampToEdge: 'clamp-to-edge',
// 	Repeat: 'repeat',
// 	MirrorRepeat: 'mirror-repeat'
// };

// export const GPUFilterMode = {
// 	Linear: 'linear',
// 	Nearest: 'nearest'
// };

// export const GPUBlendFactor = {
// 	Zero: 'zero',
// 	One: 'one',
// 	Src: 'src',
// 	OneMinusSrc: 'one-minus-src',
// 	SrcAlpha: 'src-alpha',
// 	OneMinusSrcAlpha: 'one-minus-src-alpha',
// 	Dst: 'dst',
// 	OneMinusDst: 'one-minus-dst',
// 	DstAlpha: 'dst-alpha',
// 	OneMinusDstAlpha: 'one-minus-dst-alpha',
// 	SrcAlphaSaturated: 'src-alpha-saturated',
// 	Constant: 'constant',
// 	OneMinusConstant: 'one-minus-constant'
// };

// export const GPUBlendOperation = {
// 	Add: 'add',
// 	Subtract: 'subtract',
// 	ReverseSubtract: 'reverse-subtract',
// 	Min: 'min',
// 	Max: 'max'
// };

// export const GPUColorWriteFlags = {
// 	None: 0,
// 	Red: 0x1,
// 	Green: 0x2,
// 	Blue: 0x4,
// 	Alpha: 0x8,
// 	All: 0xF
// };

// export const GPUStencilOperation = {
// 	Keep: 'keep',
// 	Zero: 'zero',
// 	Replace: 'replace',
// 	Invert: 'invert',
// 	IncrementClamp: 'increment-clamp',
// 	DecrementClamp: 'decrement-clamp',
// 	IncrementWrap: 'increment-wrap',
// 	DecrementWrap: 'decrement-wrap'
// };

// export const GPUBufferBindingType = {
// 	Uniform: 'uniform',
// 	Storage: 'storage',
// 	ReadOnlyStorage: 'read-only-storage'
// };

// export const GPUStorageTextureAccess = {
// 	WriteOnly: 'write-only',
// 	ReadOnly: 'read-only',
// 	ReadWrite: 'read-write',
// };

// export const GPUSamplerBindingType = {
// 	Filtering: 'filtering',
// 	NonFiltering: 'non-filtering',
// 	Comparison: 'comparison'
// };

// export const GPUTextureSampleType = {
// 	Float: 'float',
// 	UnfilterableFloat: 'unfilterable-float',
// 	Depth: 'depth',
// 	SInt: 'sint',
// 	UInt: 'uint'
// };

// export const GPUTextureDimension = {
// 	OneD: '1d',
// 	TwoD: '2d',
// 	ThreeD: '3d'
// };

// export const GPUTextureViewDimension = {
// 	OneD: '1d',
// 	TwoD: '2d',
// 	TwoDArray: '2d-array',
// 	Cube: 'cube',
// 	CubeArray: 'cube-array',
// 	ThreeD: '3d'
// };

// export const GPUTextureAspect = {
// 	All: 'all',
// 	StencilOnly: 'stencil-only',
// 	DepthOnly: 'depth-only'
// };

// export const GPUInputStepMode = {
// 	Vertex: 'vertex',
// 	Instance: 'instance'
// };

// export const GPUFeatureName = {
// 	CoreFeaturesAndLimits: 'core-features-and-limits',
// 	DepthClipControl: 'depth-clip-control',
// 	Depth32FloatStencil8: 'depth32float-stencil8',
// 	TextureCompressionBC: 'texture-compression-bc',
// 	TextureCompressionBCSliced3D: 'texture-compression-bc-sliced-3d',
// 	TextureCompressionETC2: 'texture-compression-etc2',
// 	TextureCompressionASTC: 'texture-compression-astc',
// 	TextureCompressionASTCSliced3D: 'texture-compression-astc-sliced-3d',
// 	TimestampQuery: 'timestamp-query',
// 	IndirectFirstInstance: 'indirect-first-instance',
// 	ShaderF16: 'shader-f16',
// 	RG11B10UFloat: 'rg11b10ufloat-renderable',
// 	BGRA8UNormStorage: 'bgra8unorm-storage',
// 	Float32Filterable: 'float32-filterable',
// 	Float32Blendable: 'float32-blendable',
// 	ClipDistances: 'clip-distances',
// 	DualSourceBlending: 'dual-source-blending',
// 	Subgroups: 'subgroups',
// 	TextureFormatsTier1: 'texture-formats-tier1',
// 	TextureFormatsTier2: 'texture-formats-tier2'
// };

// export const GPUFeatureMap = {
// 	'texture-compression-s3tc': 'texture-compression-bc',
// 	'texture-compression-etc1': 'texture-compression-etc2'
// };
