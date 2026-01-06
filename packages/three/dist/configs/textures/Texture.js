import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber, ioSwitch } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
import { Texture, 
// Mapping
UVMapping, CubeReflectionMapping, CubeRefractionMapping, EquirectangularReflectionMapping, EquirectangularRefractionMapping, CubeUVReflectionMapping, 
// Wrapping
RepeatWrapping, ClampToEdgeWrapping, MirroredRepeatWrapping, 
// Filters
NearestFilter, NearestMipmapNearestFilter, NearestMipmapLinearFilter, LinearFilter, LinearMipmapNearestFilter, LinearMipmapLinearFilter, 
// Format
AlphaFormat, RGBFormat, RGBAFormat, DepthFormat, DepthStencilFormat, RedFormat, RGFormat, 
// Type
UnsignedByteType, ByteType, ShortType, UnsignedShortType, IntType, UnsignedIntType, FloatType, HalfFloatType, 
// ColorSpace
NoColorSpace, SRGBColorSpace, LinearSRGBColorSpace, } from 'three/webgpu';
registerEditorConfig(Texture, [
    ['mapping', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: UVMapping, id: 'UV' },
                    { value: CubeReflectionMapping, id: 'Cube Reflection' },
                    { value: CubeRefractionMapping, id: 'Cube Refraction' },
                    { value: EquirectangularReflectionMapping, id: 'Equirect Reflection' },
                    { value: EquirectangularRefractionMapping, id: 'Equirect Refraction' },
                    { value: CubeUVReflectionMapping, id: 'CubeUV Reflection' },
                ] }) })],
    ['channel', ioNumber({ min: 0, max: 3, step: 1 })],
    ['wrapS', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: ClampToEdgeWrapping, id: 'Clamp' },
                    { value: RepeatWrapping, id: 'Repeat' },
                    { value: MirroredRepeatWrapping, id: 'Mirrored' },
                ] }) })],
    ['wrapT', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: ClampToEdgeWrapping, id: 'Clamp' },
                    { value: RepeatWrapping, id: 'Repeat' },
                    { value: MirroredRepeatWrapping, id: 'Mirrored' },
                ] }) })],
    ['magFilter', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: NearestFilter, id: 'Nearest' },
                    { value: LinearFilter, id: 'Linear' },
                ] }) })],
    ['minFilter', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: NearestFilter, id: 'Nearest' },
                    { value: NearestMipmapNearestFilter, id: 'Nearest Mipmap Nearest' },
                    { value: NearestMipmapLinearFilter, id: 'Nearest Mipmap Linear' },
                    { value: LinearFilter, id: 'Linear' },
                    { value: LinearMipmapNearestFilter, id: 'Linear Mipmap Nearest' },
                    { value: LinearMipmapLinearFilter, id: 'Linear Mipmap Linear' },
                ] }) })],
    ['anisotropy', ioNumberSlider({ min: 1, max: 16, step: 1 })],
    ['format', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: AlphaFormat, id: 'Alpha' },
                    { value: RGBFormat, id: 'RGB' },
                    { value: RGBAFormat, id: 'RGBA' },
                    { value: DepthFormat, id: 'Depth' },
                    { value: DepthStencilFormat, id: 'Depth Stencil' },
                    { value: RedFormat, id: 'Red' },
                    { value: RGFormat, id: 'RG' },
                ] }) })],
    ['type', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: UnsignedByteType, id: 'Unsigned Byte' },
                    { value: ByteType, id: 'Byte' },
                    { value: ShortType, id: 'Short' },
                    { value: UnsignedShortType, id: 'Unsigned Short' },
                    { value: IntType, id: 'Int' },
                    { value: UnsignedIntType, id: 'Unsigned Int' },
                    { value: FloatType, id: 'Float' },
                    { value: HalfFloatType, id: 'Half Float' },
                ] }) })],
    ['colorSpace', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: NoColorSpace, id: 'None' },
                    { value: SRGBColorSpace, id: 'sRGB' },
                    { value: LinearSRGBColorSpace, id: 'Linear sRGB' },
                ] }) })],
    ['rotation', ioNumberSlider({ min: -Math.PI, max: Math.PI, step: 0.01 })],
    ['unpackAlignment', ioOptionSelect({ selectBy: 'value', option: new MenuOption({ options: [
                    { value: 1, id: '1 (byte)' },
                    { value: 2, id: '2 (even)' },
                    { value: 4, id: '4 (word)' },
                    { value: 8, id: '8 (double-word)' },
                ] }) })],
    ['needsUpdate', ioSwitch({ value: false })],
    ['needsPMREMUpdate', ioSwitch({ value: false })],
]);
registerEditorGroups(Texture, {
    Source: [
        'source',
        'image',
        'renderTarget',
        'width',
        'height',
        'depth',
    ],
    Mapping: [
        'mapping',
        'channel',
        'offset',
        'repeat',
        'center',
        'rotation',
        'matrixAutoUpdate',
        'matrix',
        'flipY',
    ],
    Filtering: [
        'magFilter',
        'minFilter',
        'anisotropy',
        'mipmaps',
        'generateMipmaps',
    ],
    Wrapping: [
        'wrapS',
        'wrapT',
    ],
    Format: [
        'format',
        'internalFormat',
        'unpackAlignment',
        'colorSpace',
        'premultiplyAlpha',
    ],
    Advanced: [
        'version',
        'pmremVersion',
        'updateRanges',
    ],
    Hidden: [
        'onUpdate',
    ],
});
//# sourceMappingURL=Texture.js.map